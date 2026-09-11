export type ClusterPoint = { x: number; y: number };
export type Centroid = ClusterPoint & { id: number };

export type KMeansStep = {
  centroids: Centroid[];
  assignments: number[];
  inertia: number;
};

function squaredDistance(a: ClusterPoint, b: ClusterPoint): number {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

export function assignClusters(points: ClusterPoint[], centroids: Centroid[]): number[] {
  return points.map((point) => {
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    centroids.forEach((centroid, index) => {
      const distance = squaredDistance(point, centroid);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });
    return bestIndex;
  });
}

export function updateCentroids(
  points: ClusterPoint[],
  assignments: number[],
  previous: Centroid[],
): Centroid[] {
  return previous.map((centroid, clusterIndex) => {
    const clusterPoints = points.filter((_, pointIndex) => assignments[pointIndex] === clusterIndex);
    if (clusterPoints.length === 0) return centroid;
    return {
      id: centroid.id,
      x: clusterPoints.reduce((sum, point) => sum + point.x, 0) / clusterPoints.length,
      y: clusterPoints.reduce((sum, point) => sum + point.y, 0) / clusterPoints.length,
    };
  });
}

export function stepKMeans(points: ClusterPoint[], centroids: Centroid[]): KMeansStep {
  const assignments = assignClusters(points, centroids);
  const nextCentroids = updateCentroids(points, assignments, centroids);
  const inertia = points.reduce(
    (sum, point, index) => sum + squaredDistance(point, nextCentroids[assignments[index]]),
    0,
  );
  return { centroids: nextCentroids, assignments, inertia };
}
