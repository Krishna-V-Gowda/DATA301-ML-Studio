export type BinaryLabel = 0 | 1;
export type LabeledPoint2D = { x: number; y: number; label: BinaryLabel };
export type TreeFeature = 'x' | 'y';

export type DecisionTreeNode = {
  depth: number;
  samples: number;
  counts: [number, number];
  gini: number;
  prediction: BinaryLabel;
  split?: {
    feature: TreeFeature;
    threshold: number;
    gain: number;
    left: DecisionTreeNode;
    right: DecisionTreeNode;
  };
};

export type TreeBounds = { xMin: number; xMax: number; yMin: number; yMax: number };
export type SplitSegment = {
  feature: TreeFeature;
  threshold: number;
  depth: number;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
};

function classCounts(points: readonly LabeledPoint2D[]): [number, number] {
  let zeros = 0;
  let ones = 0;
  for (const point of points) point.label === 1 ? ones += 1 : zeros += 1;
  return [zeros, ones];
}

export function giniFromCounts([zeros, ones]: readonly [number, number]): number {
  const total = zeros + ones;
  if (!total) return 0;
  const p0 = zeros / total;
  const p1 = ones / total;
  return 1 - p0 ** 2 - p1 ** 2;
}

function majorityLabel(counts: readonly [number, number]): BinaryLabel {
  return counts[1] > counts[0] ? 1 : 0;
}

function candidateThresholds(points: readonly LabeledPoint2D[], feature: TreeFeature): number[] {
  const values = [...new Set(points.map((point) => point[feature]))].sort((a, b) => a - b);
  return values.slice(1).map((value, index) => (values[index] + value) / 2);
}

export function trainDecisionTree(
  points: readonly LabeledPoint2D[],
  {
    maxDepth = 3,
    minLeaf = 2,
    features = ['x', 'y'],
  }: { maxDepth?: number; minLeaf?: number; features?: readonly TreeFeature[] } = {},
): DecisionTreeNode {
  const safeDepth = Math.max(0, Math.min(8, Math.floor(maxDepth)));
  const safeMinLeaf = Math.max(1, Math.floor(minLeaf));

  function build(items: readonly LabeledPoint2D[], depth: number): DecisionTreeNode {
    const counts = classCounts(items);
    const parentGini = giniFromCounts(counts);
    const node: DecisionTreeNode = {
      depth,
      samples: items.length,
      counts,
      gini: parentGini,
      prediction: majorityLabel(counts),
    };

    if (
      depth >= safeDepth
      || parentGini <= 1e-12
      || items.length < safeMinLeaf * 2
    ) return node;

    let best: {
      feature: TreeFeature;
      threshold: number;
      gain: number;
      left: LabeledPoint2D[];
      right: LabeledPoint2D[];
    } | null = null;

    for (const feature of features) {
      for (const threshold of candidateThresholds(items, feature)) {
        const left = items.filter((point) => point[feature] <= threshold);
        const right = items.filter((point) => point[feature] > threshold);
        if (left.length < safeMinLeaf || right.length < safeMinLeaf) continue;
        const weighted = (left.length / items.length) * giniFromCounts(classCounts(left))
          + (right.length / items.length) * giniFromCounts(classCounts(right));
        const gain = parentGini - weighted;
        if (
          !best
          || gain > best.gain + 1e-12
          || (Math.abs(gain - best.gain) <= 1e-12 && feature < best.feature)
          || (Math.abs(gain - best.gain) <= 1e-12 && feature === best.feature && threshold < best.threshold)
        ) best = { feature, threshold, gain, left, right };
      }
    }

    if (!best || best.gain <= 1e-12) return node;
    node.split = {
      feature: best.feature,
      threshold: best.threshold,
      gain: best.gain,
      left: build(best.left, depth + 1),
      right: build(best.right, depth + 1),
    };
    return node;
  }

  return build(points, 0);
}

export function predictDecisionTree(node: DecisionTreeNode, point: Pick<LabeledPoint2D, 'x' | 'y'>): BinaryLabel {
  let current = node;
  while (current.split) {
    current = point[current.split.feature] <= current.split.threshold
      ? current.split.left
      : current.split.right;
  }
  return current.prediction;
}

export function decisionTreeAccuracy(node: DecisionTreeNode, points: readonly LabeledPoint2D[]): number {
  if (!points.length) return 0;
  return points.filter((point) => predictDecisionTree(node, point) === point.label).length / points.length;
}

export function decisionTreeStats(node: DecisionTreeNode): { depth: number; leaves: number; nodes: number } {
  if (!node.split) return { depth: node.depth, leaves: 1, nodes: 1 };
  const left = decisionTreeStats(node.split.left);
  const right = decisionTreeStats(node.split.right);
  return {
    depth: Math.max(left.depth, right.depth),
    leaves: left.leaves + right.leaves,
    nodes: 1 + left.nodes + right.nodes,
  };
}

export function collectSplitSegments(node: DecisionTreeNode, bounds: TreeBounds): SplitSegment[] {
  if (!node.split) return [];
  const { feature, threshold, left, right } = node.split;
  const segment: SplitSegment = feature === 'x'
    ? { feature, threshold, depth: node.depth, x1: threshold, x2: threshold, y1: bounds.yMin, y2: bounds.yMax }
    : { feature, threshold, depth: node.depth, x1: bounds.xMin, x2: bounds.xMax, y1: threshold, y2: threshold };

  const leftBounds: TreeBounds = feature === 'x'
    ? { ...bounds, xMax: threshold }
    : { ...bounds, yMax: threshold };
  const rightBounds: TreeBounds = feature === 'x'
    ? { ...bounds, xMin: threshold }
    : { ...bounds, yMin: threshold };

  return [
    segment,
    ...collectSplitSegments(left, leftBounds),
    ...collectSplitSegments(right, rightBounds),
  ];
}
