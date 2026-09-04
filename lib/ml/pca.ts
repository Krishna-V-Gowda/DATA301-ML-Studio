export type Point2D = { x: number; y: number };

export type Pca2DResult = {
  transformed: Point2D[];
  center: Point2D;
  scale: Point2D;
  covariance: [[number, number], [number, number]];
  eigenvalues: [number, number];
  pc1: Point2D;
  pc2: Point2D;
  explainedVariance: [number, number];
};

function average(values: number[]): number {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function normalize(vector: Point2D): Point2D {
  const length = Math.hypot(vector.x, vector.y) || 1;
  return { x: vector.x / length, y: vector.y / length };
}

function canonicalDirection(vector: Point2D): Point2D {
  const normalized = normalize(vector);
  if (normalized.x < 0 || (Math.abs(normalized.x) < 1e-12 && normalized.y < 0)) {
    return { x: -normalized.x, y: -normalized.y };
  }
  return normalized;
}

export function projectOntoDirection(point: Point2D, direction: Point2D): number {
  const unit = normalize(direction);
  return point.x * unit.x + point.y * unit.y;
}

export function variance(values: number[]): number {
  if (!values.length) return 0;
  const mean = average(values);
  return values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
}

export function computePca2D(points: readonly Point2D[], standardize = false): Pca2DResult {
  if (points.length < 2) {
    return {
      transformed: points.map((point) => ({ ...point })),
      center: { x: points[0]?.x ?? 0, y: points[0]?.y ?? 0 },
      scale: { x: 1, y: 1 },
      covariance: [[0, 0], [0, 0]],
      eigenvalues: [0, 0],
      pc1: { x: 1, y: 0 },
      pc2: { x: 0, y: 1 },
      explainedVariance: [0, 0],
    };
  }

  const center = {
    x: average(points.map((point) => point.x)),
    y: average(points.map((point) => point.y)),
  };
  const centered = points.map((point) => ({ x: point.x - center.x, y: point.y - center.y }));
  const scale = standardize
    ? {
        x: Math.sqrt(variance(centered.map((point) => point.x))) || 1,
        y: Math.sqrt(variance(centered.map((point) => point.y))) || 1,
      }
    : { x: 1, y: 1 };
  const transformed = centered.map((point) => ({ x: point.x / scale.x, y: point.y / scale.y }));

  const denominator = Math.max(1, transformed.length - 1);
  const xx = transformed.reduce((sum, point) => sum + point.x * point.x, 0) / denominator;
  const yy = transformed.reduce((sum, point) => sum + point.y * point.y, 0) / denominator;
  const xy = transformed.reduce((sum, point) => sum + point.x * point.y, 0) / denominator;

  const trace = xx + yy;
  const discriminant = Math.sqrt(Math.max(0, (xx - yy) ** 2 + 4 * xy ** 2));
  const lambda1 = Math.max(0, (trace + discriminant) / 2);
  const lambda2 = Math.max(0, (trace - discriminant) / 2);

  let pc1: Point2D;
  if (Math.abs(xy) > 1e-12) pc1 = { x: lambda1 - yy, y: xy };
  else pc1 = xx >= yy ? { x: 1, y: 0 } : { x: 0, y: 1 };
  pc1 = canonicalDirection(pc1);
  const pc2 = canonicalDirection({ x: -pc1.y, y: pc1.x });

  const total = lambda1 + lambda2;
  const explainedVariance: [number, number] = total > 0
    ? [lambda1 / total, lambda2 / total]
    : [0, 0];

  return {
    transformed,
    center,
    scale,
    covariance: [[xx, xy], [xy, yy]],
    eigenvalues: [lambda1, lambda2],
    pc1,
    pc2,
    explainedVariance,
  };
}
