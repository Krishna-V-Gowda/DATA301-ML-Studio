import test from 'node:test';
import assert from 'node:assert/strict';

import {
  fitLinearRegression,
  meanSquaredError,
  predictLinear,
} from '../lib/ml/linear-regression.ts';
import { classifyKnn, euclideanDistance } from '../lib/ml/knn.ts';
import { assignClusters, stepKMeans, updateCentroids } from '../lib/ml/kmeans.ts';
import { classificationMetrics } from '../lib/ml/metrics.ts';
import { evaluateLogisticDataset, sigmoid } from '../lib/ml/logistic-regression.ts';
import { classifyQuadraticLearningRate, gradientDescentQuadratic } from '../lib/ml/gradient-descent.ts';
import { computePca2D, projectOntoDirection } from '../lib/ml/pca.ts';
import { fitPolynomialRegression, predictPolynomial, regressionMse } from '../lib/ml/polynomial-regression.ts';

test('linear regression recovers an exact line and zero error', () => {
  const points = [
    { x: 0, y: 1 },
    { x: 1, y: 3 },
    { x: 2, y: 5 },
  ];
  const fit = fitLinearRegression(points);

  assert.equal(fit.slope, 2);
  assert.equal(fit.intercept, 1);
  assert.equal(fit.mse, 0);
  assert.equal(fit.r2, 1);
  assert.equal(predictLinear(4, fit.slope, fit.intercept), 9);
  assert.equal(meanSquaredError(points, fit.slope, fit.intercept), 0);
});

test('linear regression handles a vertical-x dataset deterministically', () => {
  const fit = fitLinearRegression([
    { x: 2, y: 1 },
    { x: 2, y: 3 },
    { x: 2, y: 5 },
  ]);

  assert.equal(fit.slope, 0);
  assert.equal(fit.intercept, 3);
  assert.equal(fit.mse, 8 / 3);
});

test('KNN selects the closest neighbours and reports vote confidence', () => {
  const points = [
    { x: 0, y: 0, label: 'A' },
    { x: 1, y: 0, label: 'A' },
    { x: 5, y: 5, label: 'B' },
    { x: 6, y: 5, label: 'B' },
  ];
  const result = classifyKnn(points, { x: 0.5, y: 0.2 }, 3);

  assert.equal(result.label, 'A');
  assert.equal(result.neighbours.length, 3);
  assert.equal(result.confidence, 2 / 3);
  assert.ok(result.neighbours[0].distance <= result.neighbours[1].distance);
  assert.equal(euclideanDistance({ x: 0, y: 0 }, { x: 3, y: 4 }), 5);
});

test('KNN clamps K and resolves an exact vote tie consistently', () => {
  const result = classifyKnn(
    [
      { x: 0, y: 0, label: 'A' },
      { x: 2, y: 0, label: 'B' },
    ],
    { x: 1, y: 0 },
    99,
  );

  assert.equal(result.neighbours.length, 2);
  assert.equal(result.label, 'A');
  assert.equal(result.confidence, 0.5);
});

test('K-means assigns points, updates centroids, and computes within-cluster inertia', () => {
  const points = [
    { x: 0, y: 0 },
    { x: 0, y: 2 },
    { x: 10, y: 10 },
    { x: 10, y: 12 },
  ];
  const centroids = [
    { id: 0, x: 0, y: 1 },
    { id: 1, x: 10, y: 11 },
  ];

  assert.deepEqual(assignClusters(points, centroids), [0, 0, 1, 1]);
  assert.deepEqual(updateCentroids(points, [0, 0, 1, 1], centroids), centroids);

  const result = stepKMeans(points, centroids);
  assert.deepEqual(result.assignments, [0, 0, 1, 1]);
  assert.deepEqual(result.centroids, centroids);
  assert.equal(result.inertia, 4);
});

test('K-means preserves an empty cluster centroid', () => {
  const points = [{ x: 0, y: 0 }];
  const centroids = [
    { id: 0, x: 0, y: 0 },
    { id: 1, x: 10, y: 10 },
  ];

  const updated = updateCentroids(points, [0], centroids);
  assert.deepEqual(updated[1], centroids[1]);
});

test('classification metrics match expected values', () => {
  const result = classificationMetrics({ tp: 8, tn: 7, fp: 2, fn: 3 });

  assert.equal(result.accuracy, 0.75);
  assert.equal(result.precision, 0.8);
  assert.equal(result.recall, 8 / 11);
  assert.equal(result.specificity, 7 / 9);
  assert.ok(Math.abs(result.f1 - 16 / 21) < Number.EPSILON * 4);
});

test('classification metrics return zero instead of NaN for empty denominators', () => {
  assert.deepEqual(classificationMetrics({ tp: 0, tn: 0, fp: 0, fn: 0 }), {
    accuracy: 0,
    precision: 0,
    recall: 0,
    specificity: 0,
    f1: 0,
  });
});


test('sigmoid remains finite and logistic evaluation produces a valid confusion matrix', () => {
  assert.equal(sigmoid(0), 0.5);
  assert.ok(sigmoid(1000) <= 1 && sigmoid(1000) > 0.999);
  assert.ok(sigmoid(-1000) >= 0 && sigmoid(-1000) < 0.001);

  const result = evaluateLogisticDataset(
    [
      { x: -2, label: 0 },
      { x: -1, label: 0 },
      { x: 1, label: 1 },
      { x: 2, label: 1 },
    ],
    2,
    0,
    0.5,
  );

  assert.deepEqual(result.counts, { tp: 2, tn: 2, fp: 0, fn: 0 });
  assert.equal(result.metrics.accuracy, 1);
  assert.equal(result.decisionBoundary, 0);
});

test('quadratic gradient descent converges, oscillates, and diverges at the expected learning rates', () => {
  const converging = gradientDescentQuadratic({ start: 4, learningRate: 0.2, steps: 12 });
  assert.ok(converging.at(-1).loss < converging[0].loss);
  assert.equal(classifyQuadraticLearningRate(0.2), 'converging');
  assert.equal(classifyQuadraticLearningRate(1), 'oscillating');
  assert.equal(classifyQuadraticLearningRate(1.1), 'diverging');
});

test('PCA recovers the dominant direction and explained variance totals one', () => {
  const result = computePca2D([
    { x: -2, y: -4 },
    { x: -1, y: -2 },
    { x: 1, y: 2 },
    { x: 2, y: 4 },
  ]);
  assert.ok(Math.abs(Math.abs(result.pc1.y / result.pc1.x) - 2) < 1e-8);
  assert.ok(result.explainedVariance[0] > 0.999999);
  assert.ok(Math.abs(result.explainedVariance[0] + result.explainedVariance[1] - 1) < 1e-12);
  assert.ok(projectOntoDirection({ x: 1, y: 2 }, result.pc1) > 0);
});

test('polynomial regression fits a known quadratic and exposes a generalization gap at high complexity', () => {
  const quadratic = [
    { x: -1, y: 2 },
    { x: 0, y: 1 },
    { x: 1, y: 4 },
    { x: 2, y: 11 },
  ];
  const coefficients = fitPolynomialRegression(quadratic, 2, 1e-12);
  assert.ok(Math.abs(predictPolynomial(3, coefficients) - 22) < 1e-7);
  assert.ok(regressionMse(quadratic, coefficients) < 1e-14);

  const truth = (x) => 0.58 * Math.sin(1.7 * Math.PI * x) + 0.22 * x;
  const noise = [0.02, -0.18, 0.13, -0.09, 0.17, -0.12, 0.08, -0.04, 0.15, -0.16, 0.11, -0.07, 0.04, -0.13, 0.09, -0.03];
  const train = Array.from({ length: 16 }, (_, index) => {
    const x = -1 + index * 2 / 15;
    return { x, y: truth(x) + noise[index] };
  });
  const validation = Array.from({ length: 120 }, (_, index) => {
    const x = -1 + index * 2 / 119;
    return { x, y: truth(x) };
  });
  const balanced = fitPolynomialRegression(train, 7, 1e-8);
  const overfit = fitPolynomialRegression(train, 15, 1e-8);
  assert.ok(regressionMse(train, overfit) < regressionMse(train, balanced));
  assert.ok(regressionMse(validation, overfit) > regressionMse(validation, balanced) * 20);
});

import {
  decisionTreeAccuracy,
  decisionTreeStats,
  predictDecisionTree,
  trainDecisionTree,
} from '../lib/ml/decision-tree.ts';
import { predictLinearSvm, svmAccuracy, trainLinearSvm } from '../lib/ml/linear-svm.ts';
import { buildRocPrCurves, evaluateThreshold } from '../lib/ml/roc-pr.ts';
import { forestAccuracy, forestVote, trainBaggedForest } from '../lib/ml/ensemble.ts';

test('decision tree learns a two-stage rule and reports deterministic structure', () => {
  const points = [
    { x: -2, y: -2, label: 0 }, { x: -2, y: 2, label: 0 },
    { x: 2, y: -2, label: 0 }, { x: 2, y: 2, label: 1 },
    { x: 1, y: -1, label: 0 }, { x: 1, y: 1, label: 1 },
  ];
  const shallow = trainDecisionTree(points, { maxDepth: 1, minLeaf: 1 });
  const deep = trainDecisionTree(points, { maxDepth: 2, minLeaf: 1 });
  assert.ok(decisionTreeAccuracy(shallow, points) < 1);
  assert.equal(decisionTreeAccuracy(deep, points), 1);
  assert.equal(predictDecisionTree(deep, { x: 2, y: 2 }), 1);
  assert.ok(decisionTreeStats(deep).leaves >= 3);
});

test('linear SVM separates clean data and identifies margin-supporting observations', () => {
  const points = [
    { x: -2, y: -1, label: -1 }, { x: -1, y: -2, label: -1 }, { x: -1, y: -1, label: -1 },
    { x: 1, y: 1, label: 1 }, { x: 1, y: 2, label: 1 }, { x: 2, y: 1, label: 1 },
  ];
  const model = trainLinearSvm(points, 1, 2200);
  assert.equal(svmAccuracy(model, points), 1);
  assert.ok(model.marginWidth > 0);
  assert.ok(model.supportIndices.length > 0);
  assert.equal(predictLinearSvm(model, { x: 2, y: 2 }), 1);
  assert.equal(predictLinearSvm(model, { x: -2, y: -2 }), -1);
});

test('ROC and precision-recall calculations are exact for a perfect ranking', () => {
  const observations = [
    { score: 0.9, label: 1 }, { score: 0.8, label: 1 },
    { score: 0.2, label: 0 }, { score: 0.1, label: 0 },
  ];
  const metrics = evaluateThreshold(observations, 0.5);
  assert.deepEqual({ tp: metrics.tp, tn: metrics.tn, fp: metrics.fp, fn: metrics.fn }, { tp: 2, tn: 2, fp: 0, fn: 0 });
  const curves = buildRocPrCurves(observations);
  assert.equal(curves.rocAuc, 1);
  assert.equal(curves.prAuc, 1);
});

test('bagging is deterministic and improves the curved-boundary training fit', () => {
  const points = Array.from({ length: 24 }, (_, index) => {
    const inner = index % 2 === 0;
    const angle = index / 24 * Math.PI * 2;
    const radius = inner ? 1 : 2.4;
    return { x: radius * Math.cos(angle), y: radius * Math.sin(angle), label: inner ? 1 : 0 };
  });
  const first = trainBaggedForest(points, 15, 3, 301);
  const second = trainBaggedForest(points, 15, 3, 301);
  assert.deepEqual(first, second);
  assert.ok(forestAccuracy(first, points, 15) >= first.individualAccuracy[0]);
  assert.equal(forestVote(first, { x: 0, y: 0 }, 15).prediction, 1);
});
