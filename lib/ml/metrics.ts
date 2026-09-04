export type ConfusionCounts = {
  tp: number;
  tn: number;
  fp: number;
  fn: number;
};

function safeDivide(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : numerator / denominator;
}

export function classificationMetrics(counts: ConfusionCounts) {
  const total = counts.tp + counts.tn + counts.fp + counts.fn;
  const accuracy = safeDivide(counts.tp + counts.tn, total);
  const precision = safeDivide(counts.tp, counts.tp + counts.fp);
  const recall = safeDivide(counts.tp, counts.tp + counts.fn);
  const specificity = safeDivide(counts.tn, counts.tn + counts.fp);
  const f1 = safeDivide(2 * precision * recall, precision + recall);
  return { accuracy, precision, recall, specificity, f1 };
}
