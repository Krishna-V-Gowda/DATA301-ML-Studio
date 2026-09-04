export type Label = 'A' | 'B';
export type LabelledPoint = { x: number; y: number; label: Label };

export type Neighbour = LabelledPoint & { distance: number };

export function euclideanDistance(
  a: Pick<LabelledPoint, 'x' | 'y'>,
  b: Pick<LabelledPoint, 'x' | 'y'>,
): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function classifyKnn(
  points: LabelledPoint[],
  query: { x: number; y: number },
  k: number,
): { label: Label; neighbours: Neighbour[]; confidence: number } {
  const safeK = Math.max(1, Math.min(Math.floor(k), points.length));
  const neighbours = points
    .map((point) => ({ ...point, distance: euclideanDistance(point, query) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, safeK);

  const votes = neighbours.reduce(
    (counts, point) => ({ ...counts, [point.label]: counts[point.label] + 1 }),
    { A: 0, B: 0 },
  );
  const label: Label = votes.A >= votes.B ? 'A' : 'B';

  return {
    label,
    neighbours,
    confidence: neighbours.length === 0 ? 0 : votes[label] / neighbours.length,
  };
}
