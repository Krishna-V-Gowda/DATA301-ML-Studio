export type SvmLabel = -1 | 1;
export type SvmPoint = { x: number; y: number; label: SvmLabel };
export type LinearSvmModel = {
  wx: number;
  wy: number;
  bias: number;
  objective: number;
  hingeLoss: number;
  marginWidth: number;
  supportIndices: number[];
};

export function svmScore(model: Pick<LinearSvmModel, 'wx' | 'wy' | 'bias'>, point: Pick<SvmPoint, 'x' | 'y'>): number {
  return model.wx * point.x + model.wy * point.y + model.bias;
}

export function trainLinearSvm(
  points: readonly SvmPoint[],
  c = 1,
  iterations = 1800,
): LinearSvmModel {
  if (!points.length) return { wx: 0, wy: 0, bias: 0, objective: 0, hingeLoss: 0, marginWidth: 0, supportIndices: [] };
  const safeC = Math.max(0.01, Math.min(20, c));
  let wx = 0;
  let wy = 0;
  let bias = 0;

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    let gradX = wx;
    let gradY = wy;
    let gradBias = 0;
    const factor = safeC / points.length;

    for (const point of points) {
      const margin = point.label * (wx * point.x + wy * point.y + bias);
      if (margin < 1) {
        gradX -= factor * point.label * point.x;
        gradY -= factor * point.label * point.y;
        gradBias -= factor * point.label;
      }
    }

    const rate = 0.08 / (1 + iteration * 0.004);
    wx -= rate * gradX;
    wy -= rate * gradY;
    bias -= rate * gradBias;
  }

  const margins = points.map((point) => point.label * (wx * point.x + wy * point.y + bias));
  const hingeLoss = margins.reduce((sum, margin) => sum + Math.max(0, 1 - margin), 0) / points.length;
  const norm = Math.hypot(wx, wy);
  const objective = 0.5 * norm ** 2 + safeC * hingeLoss;
  const tolerance = 0.08;
  const supportIndices = margins
    .map((margin, index) => ({ margin, index }))
    .filter(({ margin }) => margin <= 1 + tolerance)
    .map(({ index }) => index);

  return {
    wx,
    wy,
    bias,
    objective,
    hingeLoss,
    marginWidth: norm > 1e-12 ? 2 / norm : 0,
    supportIndices,
  };
}

export function predictLinearSvm(model: LinearSvmModel, point: Pick<SvmPoint, 'x' | 'y'>): SvmLabel {
  return svmScore(model, point) >= 0 ? 1 : -1;
}

export function svmAccuracy(model: LinearSvmModel, points: readonly SvmPoint[]): number {
  if (!points.length) return 0;
  return points.filter((point) => predictLinearSvm(model, point) === point.label).length / points.length;
}
