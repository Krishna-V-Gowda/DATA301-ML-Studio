'use client';

import { useMemo, useRef, useState } from 'react';
import { assignClusters, stepKMeans, type Centroid, type ClusterPoint } from '@/lib/ml/kmeans';

const WIDTH = 640;
const HEIGHT = 420;
const PAD = 42;
const basePoints: ClusterPoint[] = [
  { x: 1.0, y: 1.6 }, { x: 1.5, y: 2.4 }, { x: 2.2, y: 1.7 }, { x: 2.8, y: 2.8 }, { x: 1.9, y: 3.4 },
  { x: 6.1, y: 1.4 }, { x: 6.8, y: 2.3 }, { x: 7.7, y: 1.7 }, { x: 8.3, y: 2.9 }, { x: 7.2, y: 3.6 },
  { x: 4.1, y: 6.4 }, { x: 4.8, y: 7.2 }, { x: 5.6, y: 6.6 }, { x: 4.5, y: 8.1 }, { x: 5.7, y: 8.4 },
];
const centroidPresets: Record<number, Centroid[]> = {
  2: [{ id: 0, x: 2, y: 2 }, { id: 1, x: 7, y: 7 }],
  3: [{ id: 0, x: 1.5, y: 8.4 }, { id: 1, x: 8.2, y: 7.8 }, { id: 2, x: 5, y: 1 }],
  4: [{ id: 0, x: 1.4, y: 8.5 }, { id: 1, x: 8.5, y: 8.2 }, { id: 2, x: 1.5, y: 1.2 }, { id: 3, x: 8.4, y: 1.3 }],
};
const toX = (x: number) => PAD + (x / 10) * (WIDTH - PAD * 2);
const toY = (y: number) => HEIGHT - PAD - (y / 10) * (HEIGHT - PAD * 2);
const fromX = (x: number) => Math.max(0, Math.min(10, ((x - PAD) / (WIDTH - PAD * 2)) * 10));
const fromY = (y: number) => Math.max(0, Math.min(10, ((HEIGHT - PAD - y) / (HEIGHT - PAD * 2)) * 10));

export function KMeansLab() {
  const [points, setPoints] = useState(basePoints);
  const [k, setK] = useState(3);
  const [centroids, setCentroids] = useState<Centroid[]>(centroidPresets[3]);
  const [iteration, setIteration] = useState(0);
  const [inertia, setInertia] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const assignments = useMemo(() => assignClusters(points, centroids), [points, centroids]);

  function reset(nextK = k) {
    setPoints(basePoints);
    setCentroids(centroidPresets[nextK].map((item) => ({ ...item })));
    setIteration(0);
    setInertia(null);
  }

  function step() {
    const next = stepKMeans(points, centroids);
    setCentroids(next.centroids);
    setInertia(next.inertia);
    setIteration((value) => value + 1);
  }

  function runToConvergence() {
    let current = centroids;
    let latestInertia = 0;
    for (let i = 0; i < 12; i += 1) {
      const next = stepKMeans(points, current);
      current = next.centroids;
      latestInertia = next.inertia;
    }
    setCentroids(current);
    setInertia(latestInertia);
    setIteration((value) => value + 12);
  }

  return (
    <div className="lab-shell">
      <div className="lab-toolbar">
        <div className="segmented" aria-label="Number of clusters">
          {[2, 3, 4].map((value) => <button key={value} type="button" className={k === value ? 'is-active' : ''} onClick={() => { setK(value); reset(value); }}>K = {value}</button>)}
        </div>
        <button type="button" className="button button--primary" onClick={step}>Run one iteration</button>
        <button type="button" className="button button--quiet" onClick={runToConvergence}>Converge</button>
        <button type="button" className="button button--quiet" onClick={() => setPoints((current) => [...current, { x: 5, y: 5 }])}>Add observation</button>
        <button type="button" className="button button--quiet" onClick={() => reset()}>Reset</button>
      </div>

      <div className="lab-grid lab-grid--chart">
        <div className="lab-chart-card">
          <div className="chart-instruction">Click the plot to add observations, then advance the algorithm.</div>
          <svg
            ref={svgRef}
            className="interactive-chart"
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-label={`K-means clustering with ${k} clusters after ${iteration} iterations`}
            onPointerDown={(event) => {
              if (event.target !== event.currentTarget) return;
              const rect = svgRef.current?.getBoundingClientRect();
              if (!rect) return;
              const local = { x: ((event.clientX - rect.left) / rect.width) * WIDTH, y: ((event.clientY - rect.top) / rect.height) * HEIGHT };
              if (local.x < PAD || local.x > WIDTH - PAD || local.y < PAD || local.y > HEIGHT - PAD) return;
              setPoints((current) => [...current, { x: fromX(local.x), y: fromY(local.y) }]);
            }}
          >
            <rect x={PAD} y={PAD} width={WIDTH - PAD * 2} height={HEIGHT - PAD * 2} rx="12" className="chart-bg" />
            {Array.from({ length: 11 }, (_, index) => (
              <g key={index}>
                <line x1={toX(index)} x2={toX(index)} y1={PAD} y2={HEIGHT - PAD} className="chart-grid" />
                <line x1={PAD} x2={WIDTH - PAD} y1={toY(index)} y2={toY(index)} className="chart-grid" />
              </g>
            ))}
            {points.map((point, index) => {
              const cluster = assignments[index] ?? 0;
              const centroid = centroids[cluster];
              return (
                <g key={`${point.x}-${point.y}-${index}`}>
                  {centroid ? <line x1={toX(point.x)} y1={toY(point.y)} x2={toX(centroid.x)} y2={toY(centroid.y)} className={`cluster-link cluster-${cluster}`} /> : null}
                  <circle cx={toX(point.x)} cy={toY(point.y)} r="6" className={`cluster-point cluster-${cluster}`} />
                </g>
              );
            })}
            {centroids.map((centroid, index) => (
              <g key={centroid.id} className={`centroid cluster-${index}`}>
                <circle cx={toX(centroid.x)} cy={toY(centroid.y)} r="14" />
                <path d={`M${toX(centroid.x)-6} ${toY(centroid.y)}h12M${toX(centroid.x)} ${toY(centroid.y)-6}v12`} />
              </g>
            ))}
          </svg>
        </div>

        <aside className="lab-panel">
          <div className="metric-grid">
            <div><span>Clusters</span><strong>{k}</strong></div>
            <div><span>Iteration</span><strong>{iteration}</strong></div>
            <div><span>Samples</span><strong>{points.length}</strong></div>
            <div><span>Inertia</span><strong>{inertia === null ? '—' : inertia.toFixed(2)}</strong></div>
          </div>
          <div className="algorithm-steps">
            <div className={iteration === 0 ? 'is-current' : ''}><span>1</span><p><strong>Initialize</strong>Choose K starting centroids.</p></div>
            <div className={iteration > 0 ? 'is-current' : ''}><span>2</span><p><strong>Assign</strong>Attach each point to its nearest centroid.</p></div>
            <div className={iteration > 0 ? 'is-current' : ''}><span>3</span><p><strong>Update</strong>Move every centroid to the mean of its cluster.</p></div>
            <div><span>4</span><p><strong>Repeat</strong>Stop when movement becomes negligible.</p></div>
          </div>
          <div className="insight-card"><span className="insight-card__icon">i</span><p><strong>Try this:</strong> add a far-away outlier. The mean is sensitive to extreme points, so a centroid may be pulled away from its dense cluster.</p></div>
        </aside>
      </div>
    </div>
  );
}
