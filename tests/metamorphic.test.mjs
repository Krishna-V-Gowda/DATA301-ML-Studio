import test from 'node:test';
import assert from 'node:assert/strict';

import { fitLinearRegression } from '../lib/ml/linear-regression.ts';
import { classifyKnn } from '../lib/ml/knn.ts';
import { classificationMetrics } from '../lib/ml/metrics.ts';
import { computePca2D } from '../lib/ml/pca.ts';
import { evaluateLogisticDataset } from '../lib/ml/logistic-regression.ts';
import { trainDecisionTree, predictDecisionTree } from '../lib/ml/decision-tree.ts';
import { buildRocPrCurves } from '../lib/ml/roc-pr.ts';

const close = (a, b, tolerance = 1e-10) => assert.ok(Math.abs(a - b) <= tolerance, `${a} != ${b}`);

test('linear-regression slope is invariant to translating every response', () => {
  const points = [{ x: -2, y: -3 }, { x: 0, y: 1 }, { x: 3, y: 7 }];
  const shifted = points.map(({ x, y }) => ({ x, y: y + 11 }));
  const a = fitLinearRegression(points);
  const b = fitLinearRegression(shifted);
  close(a.slope, b.slope);
  close(b.intercept - a.intercept, 11);
});

test('KNN result is invariant to input permutation when distances and vote are unique', () => {
  const points = [
    { x: 0, y: 0, label: 'A' }, { x: 0.2, y: 0.1, label: 'A' },
    { x: 4, y: 4, label: 'B' }, { x: 5, y: 5, label: 'B' },
  ];
  const original = classifyKnn(points, { x: 0.1, y: 0.1 }, 3);
  const reversed = classifyKnn([...points].reverse(), { x: 0.1, y: 0.1 }, 3);
  assert.equal(original.label, reversed.label);
  close(original.confidence, reversed.confidence);
});

test('classification ratios are invariant to integer replication of counts', () => {
  const base = classificationMetrics({ tp: 7, tn: 9, fp: 2, fn: 3 });
  const scaled = classificationMetrics({ tp: 35, tn: 45, fp: 10, fn: 15 });
  assert.deepEqual(base, scaled);
});

test('PCA directions and eigenvalues are translation invariant', () => {
  const points = [{ x: -2, y: -1 }, { x: 0, y: 0.2 }, { x: 1, y: 0.8 }, { x: 3, y: 2.1 }];
  const shifted = points.map(({ x, y }) => ({ x: x + 100, y: y - 50 }));
  const a = computePca2D(points);
  const b = computePca2D(shifted);
  close(a.pc1.x, b.pc1.x); close(a.pc1.y, b.pc1.y);
  close(a.eigenvalues[0], b.eigenvalues[0]); close(a.eigenvalues[1], b.eigenvalues[1]);
});

test('raising a logistic threshold cannot increase positive predictions', () => {
  const observations = [-3, -1, 0, 1, 3].map((x, i) => ({ x, label: (i >= 2 ? 1 : 0) }));
  const low = evaluateLogisticDataset(observations, 1.2, -0.1, 0.25);
  const high = evaluateLogisticDataset(observations, 1.2, -0.1, 0.75);
  const positives = (evaluation) => evaluation.predictions.filter((value) => value === 1).length;
  assert.ok(positives(high) <= positives(low));
});

test('decision-tree predictions are invariant to training-row order for a unique best split', () => {
  const points = [
    { x: -3, y: 0, label: 0 }, { x: -2, y: 1, label: 0 },
    { x: 2, y: 0, label: 1 }, { x: 3, y: 1, label: 1 },
  ];
  const a = trainDecisionTree(points, { maxDepth: 2, minLeaf: 1 });
  const b = trainDecisionTree([...points].reverse(), { maxDepth: 2, minLeaf: 1 });
  for (const point of points) assert.equal(predictDecisionTree(a, point), predictDecisionTree(b, point));
});

test('strictly increasing score transforms preserve ROC AUC', () => {
  const observations = [
    { score: 0.1, label: 0 }, { score: 0.2, label: 1 },
    { score: 0.8, label: 0 }, { score: 0.9, label: 1 },
  ];
  const transformed = observations.map(({ score, label }) => ({ score: Math.exp(score), label }));
  close(buildRocPrCurves(observations).rocAuc, buildRocPrCurves(transformed).rocAuc);
});
