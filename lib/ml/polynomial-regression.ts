export type RegressionPoint = { x: number; y: number };

function solveLinearSystem(matrix: number[][], vector: number[]): number[] {
  const size = vector.length;
  const augmented = matrix.map((row, index) => [...row, vector[index]]);

  for (let column = 0; column < size; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < size; row += 1) {
      if (Math.abs(augmented[row][column]) > Math.abs(augmented[pivot][column])) pivot = row;
    }
    [augmented[column], augmented[pivot]] = [augmented[pivot], augmented[column]];

    const pivotValue = augmented[column][column];
    if (Math.abs(pivotValue) < 1e-14) continue;

    for (let cell = column; cell <= size; cell += 1) augmented[column][cell] /= pivotValue;
    for (let row = 0; row < size; row += 1) {
      if (row === column) continue;
      const factor = augmented[row][column];
      for (let cell = column; cell <= size; cell += 1) {
        augmented[row][cell] -= factor * augmented[column][cell];
      }
    }
  }

  return augmented.map((row, index) => Number.isFinite(row[size]) ? row[size] : (index === 0 ? 0 : 0));
}

export function polynomialFeatures(x: number, degree: number): number[] {
  const result = [1];
  for (let power = 1; power <= degree; power += 1) result.push(result[power - 1] * x);
  return result;
}

export function fitPolynomialRegression(
  points: readonly RegressionPoint[],
  degree: number,
  ridge = 1e-8,
): number[] {
  const safeDegree = Math.max(0, Math.min(15, Math.floor(degree)));
  const size = safeDegree + 1;
  const gram = Array.from({ length: size }, () => Array(size).fill(0));
  const target = Array(size).fill(0);

  for (const point of points) {
    const features = polynomialFeatures(point.x, safeDegree);
    for (let row = 0; row < size; row += 1) {
      target[row] += features[row] * point.y;
      for (let column = 0; column < size; column += 1) {
        gram[row][column] += features[row] * features[column];
      }
    }
  }

  for (let index = 1; index < size; index += 1) gram[index][index] += ridge;
  return solveLinearSystem(gram, target);
}

export function predictPolynomial(x: number, coefficients: readonly number[]): number {
  let value = 0;
  for (let index = coefficients.length - 1; index >= 0; index -= 1) value = value * x + coefficients[index];
  return value;
}

export function regressionMse(points: readonly RegressionPoint[], coefficients: readonly number[]): number {
  if (!points.length) return 0;
  return points.reduce((sum, point) => {
    const residual = point.y - predictPolynomial(point.x, coefficients);
    return sum + residual * residual;
  }, 0) / points.length;
}
