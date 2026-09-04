import {
  decisionTreeAccuracy,
  predictDecisionTree,
  trainDecisionTree,
  type BinaryLabel,
  type DecisionTreeNode,
  type LabeledPoint2D,
} from './decision-tree.ts';

export type ForestModel = { trees: DecisionTreeNode[]; individualAccuracy: number[] };

function mulberry32(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let result = value;
    result = Math.imul(result ^ result >>> 15, result | 1);
    result ^= result + Math.imul(result ^ result >>> 7, result | 61);
    return ((result ^ result >>> 14) >>> 0) / 4294967296;
  };
}

function bootstrap(points: readonly LabeledPoint2D[], random: () => number): LabeledPoint2D[] {
  return Array.from({ length: points.length }, () => points[Math.floor(random() * points.length)]);
}

export function trainBaggedForest(
  points: readonly LabeledPoint2D[],
  count = 15,
  maxDepth = 3,
  seed = 301,
): ForestModel {
  const safeCount = Math.max(1, Math.min(51, Math.floor(count)));
  const random = mulberry32(seed);
  const trees = Array.from({ length: safeCount }, () => trainDecisionTree(bootstrap(points, random), {
    maxDepth,
    minLeaf: 2,
  }));
  return { trees, individualAccuracy: trees.map((tree) => decisionTreeAccuracy(tree, points)) };
}

export function forestVote(model: ForestModel, point: Pick<LabeledPoint2D, 'x' | 'y'>, treeCount = model.trees.length) {
  const selected = model.trees.slice(0, Math.max(1, Math.min(model.trees.length, Math.floor(treeCount))));
  const positiveVotes = selected.filter((tree) => predictDecisionTree(tree, point) === 1).length;
  const negativeVotes = selected.length - positiveVotes;
  const prediction: BinaryLabel = positiveVotes > negativeVotes ? 1 : 0;
  return {
    prediction,
    positiveVotes,
    negativeVotes,
    confidence: Math.max(positiveVotes, negativeVotes) / selected.length,
  };
}

export function forestAccuracy(model: ForestModel, points: readonly LabeledPoint2D[], treeCount = model.trees.length): number {
  if (!points.length) return 0;
  return points.filter((point) => forestVote(model, point, treeCount).prediction === point.label).length / points.length;
}
