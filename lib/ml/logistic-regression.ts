type ConfusionCounts = { tp: number; tn: number; fp: number; fn: number };

function classificationMetrics(counts: ConfusionCounts) {
  const divide = (numerator: number, denominator: number) => denominator === 0 ? 0 : numerator / denominator;
  const total = counts.tp + counts.tn + counts.fp + counts.fn;
  const accuracy = divide(counts.tp + counts.tn, total);
  const precision = divide(counts.tp, counts.tp + counts.fp);
  const recall = divide(counts.tp, counts.tp + counts.fn);
  const specificity = divide(counts.tn, counts.tn + counts.fp);
  const f1 = divide(2 * precision * recall, precision + recall);
  return { accuracy, precision, recall, specificity, f1 };
}

export type LogisticObservation = {
  x: number;
  label: 0 | 1;
};

export type LogisticEvaluation = {
  probabilities: number[];
  predictions: Array<0 | 1>;
  counts: ConfusionCounts;
  metrics: ReturnType<typeof classificationMetrics>;
  decisionBoundary: number | null;
};

export function sigmoid(value: number): number {
  if (value >= 0) {
    const exp = Math.exp(-Math.min(value, 709));
    return 1 / (1 + exp);
  }
  const exp = Math.exp(Math.max(value, -709));
  return exp / (1 + exp);
}

export function logit(probability: number): number {
  const bounded = Math.min(1 - Number.EPSILON, Math.max(Number.EPSILON, probability));
  return Math.log(bounded / (1 - bounded));
}

export function logisticProbability(x: number, weight: number, bias: number): number {
  return sigmoid(weight * x + bias);
}

export function evaluateLogisticDataset(
  observations: readonly LogisticObservation[],
  weight: number,
  bias: number,
  threshold: number,
): LogisticEvaluation {
  const boundedThreshold = Math.min(0.999, Math.max(0.001, threshold));
  const probabilities = observations.map(({ x }) => logisticProbability(x, weight, bias));
  const predictions = probabilities.map((probability) => (probability >= boundedThreshold ? 1 : 0) as 0 | 1);
  const counts: ConfusionCounts = { tp: 0, tn: 0, fp: 0, fn: 0 };

  observations.forEach((observation, index) => {
    const prediction = predictions[index];
    if (prediction === 1 && observation.label === 1) counts.tp += 1;
    else if (prediction === 1 && observation.label === 0) counts.fp += 1;
    else if (prediction === 0 && observation.label === 0) counts.tn += 1;
    else counts.fn += 1;
  });

  const decisionBoundary = Math.abs(weight) < 1e-12
    ? null
    : (logit(boundedThreshold) - bias) / weight;

  return {
    probabilities,
    predictions,
    counts,
    metrics: classificationMetrics(counts),
    decisionBoundary,
  };
}
