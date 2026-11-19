// Metamorphic properties for the numerical cores behind the interactive labs.
//
// Example-based tests check a handful of known answers. These tests instead apply a
// transformation whose effect is known from the mathematics (translate, rotate, rescale,
// reorder, re-score monotonically) and check that each algorithm responds exactly as theory
// predicts, over many seeded random datasets. A violation means the implementation depends on
// something it should not, such as input order, coordinate origin, or the scale of a score.

import test from 'node:test';
import assert from 'node:assert/strict';

import { fitLinearRegression } from '../lib/ml/linear-regression.ts';
import { classifyKnn } from '../lib/ml/knn.ts';
import { stepKMeans } from '../lib/ml/kmeans.ts';
import { computePca2D } from '../lib/ml/pca.ts';
import { buildRocPrCurves } from '../lib/ml/roc-pr.ts';

const SEEDS = [1, 7, 42, 301, 2026];
const TOLERANCE = 1e-9;

// Deterministic Mulberry32 generator so every run checks the same datasets.
function generator(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function randomPoints(random, count, spread = 10) {
  return Array.from({ length: count }, () => ({
    x: (random() - 0.5) * spread,
    y: (random() - 0.5) * spread,
  }));
}

function shuffled(random, values) {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function rotate(point, angle, shift = { x: 0, y: 0 }) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: cos * point.x - sin * point.y + shift.x, y: sin * point.x + cos * point.y + shift.y };
}

function close(actual, expected, message, tolerance = TOLERANCE) {
  const scale = Math.max(1, Math.abs(expected));
  assert.ok(Math.abs(actual - expected) <= tolerance * scale, `${message}: expected ${expected}, received ${actual}`);
}

test('linear regression is equivariant under an affine change of the response', () => {
  for (const seed of SEEDS) {
    const random = generator(seed);
    const points = randomPoints(random, 25).map((point) => ({ x: point.x, y: 2.5 * point.x + point.y }));
    const a = 1 + random() * 4;
    const b = (random() - 0.5) * 50;
    const base = fitLinearRegression(points);
    const mapped = fitLinearRegression(points.map((point) => ({ x: point.x, y: a * point.y + b })));
    close(mapped.slope, a * base.slope, `seed ${seed} slope`);
    close(mapped.intercept, a * base.intercept + b, `seed ${seed} intercept`);
    close(mapped.mse, a * a * base.mse, `seed ${seed} mse`);
    close(mapped.r2, base.r2, `seed ${seed} r2`);
  }
});

test('linear regression does not depend on the order of observations', () => {
  for (const seed of SEEDS) {
    const random = generator(seed);
    const points = randomPoints(random, 40).map((point) => ({ x: point.x, y: -1.2 * point.x + point.y }));
    const base = fitLinearRegression(points);
    const permuted = fitLinearRegression(shuffled(random, points));
    for (const key of ['slope', 'intercept', 'mse', 'r2']) close(permuted[key], base[key], `seed ${seed} ${key}`);
  }
});

test('KNN predictions are invariant under rotating and translating the whole feature space', () => {
  for (const seed of SEEDS) {
    const random = generator(seed);
    const training = randomPoints(random, 30).map((point) => ({ ...point, label: point.x + point.y > 0 ? 'A' : 'B' }));
    const angle = random() * Math.PI * 2;
    const shift = { x: (random() - 0.5) * 100, y: (random() - 0.5) * 100 };
    const moved = training.map((point) => ({ ...rotate(point, angle, shift), label: point.label }));
    for (const query of randomPoints(random, 10)) {
      for (const k of [1, 3, 5, 7]) {
        const base = classifyKnn(training, query, k);
        const result = classifyKnn(moved, rotate(query, angle, shift), k);
        assert.equal(result.label, base.label, `seed ${seed} k=${k} label`);
        assert.equal(result.confidence, base.confidence, `seed ${seed} k=${k} confidence`);
        base.neighbours.forEach((neighbour, index) => {
          close(result.neighbours[index].distance, neighbour.distance, `seed ${seed} k=${k} neighbour distance`);
        });
      }
    }
  }
});

test('a K-means step is equivariant under translation of points and centroids', () => {
  for (const seed of SEEDS) {
    const random = generator(seed);
    const points = randomPoints(random, 60);
    const centroids = randomPoints(random, 3).map((point, id) => ({ ...point, id }));
    const shift = { x: (random() - 0.5) * 1000, y: (random() - 0.5) * 1000 };
    const base = stepKMeans(points, centroids);
    const moved = stepKMeans(
      points.map((point) => ({ x: point.x + shift.x, y: point.y + shift.y })),
      centroids.map((centroid) => ({ ...centroid, x: centroid.x + shift.x, y: centroid.y + shift.y })),
    );
    assert.deepEqual(moved.assignments, base.assignments, `seed ${seed} assignments`);
    base.centroids.forEach((centroid, index) => {
      close(moved.centroids[index].x, centroid.x + shift.x, `seed ${seed} centroid x`, 1e-7);
      close(moved.centroids[index].y, centroid.y + shift.y, `seed ${seed} centroid y`, 1e-7);
    });
    close(moved.inertia, base.inertia, `seed ${seed} inertia`, 1e-7);
  }
});

test('a K-means step keeps its assignments under uniform rescaling, and inertia scales quadratically', () => {
  for (const seed of SEEDS) {
    const random = generator(seed);
    const points = randomPoints(random, 60);
    const centroids = randomPoints(random, 4).map((point, id) => ({ ...point, id }));
    const factor = 0.1 + random() * 20;
    const base = stepKMeans(points, centroids);
    const scaled = stepKMeans(
      points.map((point) => ({ x: point.x * factor, y: point.y * factor })),
      centroids.map((centroid) => ({ ...centroid, x: centroid.x * factor, y: centroid.y * factor })),
    );
    assert.deepEqual(scaled.assignments, base.assignments, `seed ${seed} assignments`);
    close(scaled.inertia, factor * factor * base.inertia, `seed ${seed} inertia`);
  }
});

test('PCA variance structure is invariant under rotation and translation, and PC1 rotates with the data', () => {
  for (const seed of SEEDS) {
    const random = generator(seed);
    // Elongated cloud so the leading direction is well defined.
    const points = randomPoints(random, 80).map((point) => ({ x: 4 * point.x, y: 0.6 * point.y + 0.3 * point.x }));
    const angle = random() * Math.PI * 2;
    const shift = { x: (random() - 0.5) * 200, y: (random() - 0.5) * 200 };
    const base = computePca2D(points);
    const moved = computePca2D(points.map((point) => rotate(point, angle, shift)));
    close(moved.eigenvalues[0], base.eigenvalues[0], `seed ${seed} first eigenvalue`, 1e-8);
    close(moved.eigenvalues[1], base.eigenvalues[1], `seed ${seed} second eigenvalue`, 1e-8);
    close(moved.explainedVariance[0], base.explainedVariance[0], `seed ${seed} explained variance`, 1e-8);
    const expected = rotate(base.pc1, angle);
    // Principal directions are defined up to sign.
    const alignment = Math.abs(moved.pc1.x * expected.x + moved.pc1.y * expected.y);
    close(alignment, 1, `seed ${seed} PC1 direction`, 1e-8);
  }
});

test('ROC and PR curves depend only on score order, and reversing the scores mirrors the ROC area', () => {
  for (const seed of SEEDS) {
    const random = generator(seed);
    const observations = Array.from({ length: 50 }, () => {
      const label = random() < 0.4 ? 1 : 0;
      return { label, score: Math.round((label ? 0.6 : 0.4) * 100 + (random() - 0.5) * 70) / 100 };
    });
    const base = buildRocPrCurves(observations);

    // A strictly increasing transform plus a reshuffle must leave every curve point unchanged.
    const transformed = buildRocPrCurves(
      shuffled(random, observations).map((observation) => ({ ...observation, score: Math.exp(3 * observation.score) + 5 })),
    );
    assert.equal(transformed.roc.length, base.roc.length, `seed ${seed} ROC length`);
    base.roc.forEach((point, index) => {
      close(transformed.roc[index].x, point.x, `seed ${seed} ROC point ${index} x`);
      close(transformed.roc[index].y, point.y, `seed ${seed} ROC point ${index} y`);
    });
    base.pr.forEach((point, index) => {
      close(transformed.pr[index].x, point.x, `seed ${seed} PR point ${index} x`);
      close(transformed.pr[index].y, point.y, `seed ${seed} PR point ${index} y`);
    });
    close(transformed.rocAuc, base.rocAuc, `seed ${seed} ROC AUC`);
    close(transformed.prAuc, base.prAuc, `seed ${seed} PR AUC`);

    // Negating every score reverses the ranking, so the ROC area becomes its complement.
    const reversed = buildRocPrCurves(observations.map((observation) => ({ ...observation, score: -observation.score })));
    close(reversed.rocAuc, 1 - base.rocAuc, `seed ${seed} reversed ROC AUC`);
  }
});
