export type GradientPoint = {
  iteration: number;
  parameter: number;
  loss: number;
};

export type ConvergenceMode = 'converging' | 'oscillating' | 'diverging' | 'stationary';

export function quadraticLoss(parameter: number, target = 0): number {
  return (parameter - target) ** 2;
}

export function quadraticGradient(parameter: number, target = 0): number {
  return 2 * (parameter - target);
}

export function gradientDescentQuadratic({
  start,
  learningRate,
  steps,
  target = 0,
}: {
  start: number;
  learningRate: number;
  steps: number;
  target?: number;
}): GradientPoint[] {
  const safeSteps = Math.max(0, Math.min(100, Math.floor(steps)));
  let parameter = Number.isFinite(start) ? start : 0;
  const rate = Number.isFinite(learningRate) ? learningRate : 0;
  const result: GradientPoint[] = [];

  for (let iteration = 0; iteration <= safeSteps; iteration += 1) {
    const loss = quadraticLoss(parameter, target);
    result.push({ iteration, parameter, loss });
    if (!Number.isFinite(parameter) || Math.abs(parameter) > 1e9) break;
    parameter -= rate * quadraticGradient(parameter, target);
  }

  return result;
}

export function classifyQuadraticLearningRate(learningRate: number): ConvergenceMode {
  if (learningRate === 0) return 'stationary';
  if (learningRate > 0 && learningRate < 1) return 'converging';
  if (learningRate === 1) return 'oscillating';
  return 'diverging';
}
