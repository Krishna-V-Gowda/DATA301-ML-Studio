export type Point = { x: number; y: number };

export type LinearFit = {
  slope: number;
  intercept: number;
  mse: number;
  r2: number;
};

export function predictLinear(pointX: number, slope: number, intercept: number): number {
  return slope * pointX + intercept;
}

export function fitLinearRegression(points: Point[]): LinearFit {
  if (points.length < 2) {
    return { slope: 0, intercept: points[0]?.y ?? 0, mse: 0, r2: 0 };
  }

  const n = points.length;
  const meanX = points.reduce((sum, point) => sum + point.x, 0) / n;
  const meanY = points.reduce((sum, point) => sum + point.y, 0) / n;

  const numerator = points.reduce(
    (sum, point) => sum + (point.x - meanX) * (point.y - meanY),
    0,
  );
  const denominator = points.reduce((sum, point) => sum + (point.x - meanX) ** 2, 0);

  const slope = denominator === 0 ? 0 : numerator / denominator;
  const intercept = meanY - slope * meanX;
  const residualSum = points.reduce(
    (sum, point) => sum + (point.y - predictLinear(point.x, slope, intercept)) ** 2,
    0,
  );
  const totalSum = points.reduce((sum, point) => sum + (point.y - meanY) ** 2, 0);

  return {
    slope,
    intercept,
    mse: residualSum / n,
    r2: totalSum === 0 ? 1 : 1 - residualSum / totalSum,
  };
}

export function meanSquaredError(points: Point[], slope: number, intercept: number): number {
  if (points.length === 0) return 0;
  return (
    points.reduce(
      (sum, point) => sum + (point.y - predictLinear(point.x, slope, intercept)) ** 2,
      0,
    ) / points.length
  );
}
