export type ScoredObservation = { score: number; label: 0 | 1 };
export type ThresholdMetrics = {
  threshold: number;
  tp: number;
  tn: number;
  fp: number;
  fn: number;
  tpr: number;
  fpr: number;
  precision: number;
  recall: number;
  specificity: number;
  f1: number;
};

const divide = (numerator: number, denominator: number) => denominator === 0 ? 0 : numerator / denominator;

export function evaluateThreshold(observations: readonly ScoredObservation[], threshold: number): ThresholdMetrics {
  let tp = 0; let tn = 0; let fp = 0; let fn = 0;
  for (const observation of observations) {
    const prediction = observation.score >= threshold ? 1 : 0;
    if (prediction === 1 && observation.label === 1) tp += 1;
    else if (prediction === 1) fp += 1;
    else if (observation.label === 0) tn += 1;
    else fn += 1;
  }
  const tpr = divide(tp, tp + fn);
  const fpr = divide(fp, fp + tn);
  const precision = divide(tp, tp + fp);
  const specificity = divide(tn, tn + fp);
  const f1 = divide(2 * precision * tpr, precision + tpr);
  return { threshold, tp, tn, fp, fn, tpr, fpr, precision, recall: tpr, specificity, f1 };
}

export function buildRocPrCurves(observations: readonly ScoredObservation[]) {
  const thresholds = [
    Number.POSITIVE_INFINITY,
    ...[...new Set(observations.map((observation) => observation.score))].sort((a, b) => b - a),
    Number.NEGATIVE_INFINITY,
  ];
  const evaluated = thresholds.map((threshold) => evaluateThreshold(observations, threshold));
  const roc = evaluated.map((item) => ({ x: item.fpr, y: item.tpr, threshold: item.threshold }));
  const pr = evaluated.map((item, index) => ({
    x: item.recall,
    y: index === 0 ? 1 : item.precision,
    threshold: item.threshold,
  }));
  return { roc, pr, rocAuc: trapezoidArea(roc), prAuc: trapezoidArea(pr) };
}

export function trapezoidArea(points: readonly { x: number; y: number }[]): number {
  let area = 0;
  for (let index = 1; index < points.length; index += 1) {
    const width = Math.max(0, points[index].x - points[index - 1].x);
    area += width * (points[index].y + points[index - 1].y) / 2;
  }
  return Math.max(0, Math.min(1, area));
}
