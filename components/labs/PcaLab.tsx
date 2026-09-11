'use client';

import { useEffect, useMemo, useState } from 'react';
import { computePca2D, projectOntoDirection, variance, type Point2D } from '@/lib/ml/pca';

const WIDTH = 680;
const HEIGHT = 430;
const PAD = 48;

const presets: Record<string, { label: string; description: string; points: Point2D[] }> = {
  correlated: {
    label: 'Correlated cloud',
    description: 'A strong diagonal relationship gives PCA a clear first direction.',
    points: [
      { x: -3.2, y: -2.5 }, { x: -2.8, y: -2.1 }, { x: -2.2, y: -1.2 }, { x: -1.8, y: -1.6 },
      { x: -1.1, y: -0.4 }, { x: -0.5, y: -0.6 }, { x: 0.1, y: 0.4 }, { x: 0.8, y: 0.5 },
      { x: 1.3, y: 1.4 }, { x: 1.9, y: 1.3 }, { x: 2.5, y: 2.4 }, { x: 3.1, y: 2.2 },
    ],
  },
  scale: {
    label: 'Scale-sensitive',
    description: 'One feature has a much larger numerical scale, showing why standardization can matter.',
    points: [
      { x: -2.7, y: -18 }, { x: -2.2, y: 6 }, { x: -1.6, y: -11 }, { x: -1.1, y: 21 },
      { x: -0.5, y: -3 }, { x: 0.1, y: 15 }, { x: 0.6, y: -19 }, { x: 1.2, y: 10 },
      { x: 1.7, y: -6 }, { x: 2.1, y: 23 }, { x: 2.6, y: -14 }, { x: 3.0, y: 4 },
    ],
  },
  diffuse: {
    label: 'Diffuse cloud',
    description: 'When the cloud is almost circular, no single direction dominates.',
    points: [
      { x: -2.8, y: 0.2 }, { x: -2.0, y: 1.9 }, { x: -1.8, y: -1.7 }, { x: -0.7, y: 2.6 },
      { x: -0.4, y: -2.4 }, { x: 0.4, y: 0.2 }, { x: 0.8, y: 2.4 }, { x: 1.2, y: -2.0 },
      { x: 2.0, y: 1.6 }, { x: 2.6, y: -0.5 }, { x: 0.1, y: -0.8 }, { x: -1.0, y: 0.7 },
    ],
  },
};

function directionFromAngle(angle: number): Point2D {
  const radians = angle * Math.PI / 180;
  return { x: Math.cos(radians), y: Math.sin(radians) };
}

function angleFromDirection(direction: Point2D): number {
  const angle = Math.atan2(direction.y, direction.x) * 180 / Math.PI;
  return Math.round((angle + 180) % 180);
}

export function PcaLab() {
  const [preset, setPreset] = useState<keyof typeof presets>('correlated');
  const [standardize, setStandardize] = useState(false);
  const pca = useMemo(() => computePca2D(presets[preset].points, standardize), [preset, standardize]);
  const pc1Angle = angleFromDirection(pca.pc1);
  const [candidateAngle, setCandidateAngle] = useState(pc1Angle);

  useEffect(() => setCandidateAngle(pc1Angle), [pc1Angle]);

  const candidate = directionFromAngle(candidateAngle);
  const candidateProjection = pca.transformed.map((point) => projectOntoDirection(point, candidate));
  const totalVariance = variance(pca.transformed.map((point) => point.x)) + variance(pca.transformed.map((point) => point.y));
  const candidateRatio = totalVariance > 0 ? variance(candidateProjection) / totalVariance : 0;
  const maxAbs = Math.max(1.4, ...pca.transformed.flatMap((point) => [Math.abs(point.x), Math.abs(point.y)]));
  const scale = (Math.min(WIDTH, HEIGHT) - PAD * 2) / (maxAbs * 2.15);
  const toX = (x: number) => WIDTH / 2 + x * scale;
  const toY = (y: number) => HEIGHT / 2 - y * scale;
  const lineLength = maxAbs * 1.35;

  function reset() {
    setPreset('correlated');
    setStandardize(false);
  }

  const difference = Math.min(Math.abs(candidateAngle - pc1Angle), 180 - Math.abs(candidateAngle - pc1Angle));

  return (
    <div className="lab-shell">
      <div className="lab-toolbar">
        <div className="segmented" aria-label="Dataset preset">
          {(Object.keys(presets) as Array<keyof typeof presets>).map((key) => <button type="button" className={preset === key ? 'is-active' : ''} onClick={() => setPreset(key)} key={key}>{presets[key].label}</button>)}
        </div>
        <label className="check-control"><input type="checkbox" checked={standardize} onChange={(event) => setStandardize(event.target.checked)} /> Standardize features</label>
        <button className="button button--quiet" type="button" onClick={() => setCandidateAngle(pc1Angle)}>Snap candidate to PC1</button>
        <button className="button button--quiet" type="button" onClick={reset}>Reset</button>
      </div>

      <div className="lab-grid lab-grid--chart">
        <div className="lab-chart-card">
          <div className="chart-instruction">PCA computes PC1 automatically. Rotate the amber candidate axis and compare how much variance it preserves.</div>
          <svg className="interactive-chart" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`PCA projection. PC1 explains ${(pca.explainedVariance[0] * 100).toFixed(1)} percent of variance and PC2 explains ${(pca.explainedVariance[1] * 100).toFixed(1)} percent.`}>
            <rect x={PAD} y={PAD / 2} width={WIDTH - PAD * 2} height={HEIGHT - PAD} rx="15" className="chart-bg" />
            <line x1={PAD} y1={HEIGHT / 2} x2={WIDTH - PAD} y2={HEIGHT / 2} className="chart-grid" />
            <line x1={WIDTH / 2} y1={PAD / 2} x2={WIDTH / 2} y2={HEIGHT - PAD / 2} className="chart-grid" />
            <line x1={toX(-pca.pc2.x * lineLength)} y1={toY(-pca.pc2.y * lineLength)} x2={toX(pca.pc2.x * lineLength)} y2={toY(pca.pc2.y * lineLength)} className="pc2-line" />
            <line x1={toX(-pca.pc1.x * lineLength)} y1={toY(-pca.pc1.y * lineLength)} x2={toX(pca.pc1.x * lineLength)} y2={toY(pca.pc1.y * lineLength)} className="pc1-line" />
            {difference > 1 ? <line x1={toX(-candidate.x * lineLength)} y1={toY(-candidate.y * lineLength)} x2={toX(candidate.x * lineLength)} y2={toY(candidate.y * lineLength)} className="candidate-axis-line" /> : null}
            {pca.transformed.map((point, index) => {
              const distance = projectOntoDirection(point, candidate);
              const projection = { x: candidate.x * distance, y: candidate.y * distance };
              return <g key={`${point.x}-${point.y}-${index}`}><line x1={toX(point.x)} y1={toY(point.y)} x2={toX(projection.x)} y2={toY(projection.y)} className="residual-line" /><circle cx={toX(point.x)} cy={toY(point.y)} r="7" className="point-core" /><circle cx={toX(projection.x)} cy={toY(projection.y)} r="3.5" className="projection-marker" /></g>;
            })}
            <text x={toX(pca.pc1.x * lineLength * 0.93)} y={toY(pca.pc1.y * lineLength * 0.93) - 8} className="chart-tick">PC1</text>
            <text x={toX(pca.pc2.x * lineLength * 0.88)} y={toY(pca.pc2.y * lineLength * 0.88) - 8} className="chart-tick">PC2</text>
            <text x={WIDTH / 2} y={HEIGHT - 7} textAnchor="middle" className="chart-axis-label">transformed feature 1</text>
            <text x="14" y={HEIGHT / 2} textAnchor="middle" className="chart-axis-label" transform={`rotate(-90 14 ${HEIGHT / 2})`}>transformed feature 2</text>
          </svg>
        </div>

        <aside className="lab-panel">
          <div className="lab-panel__header"><span className="eyebrow">Dimensionality reduction</span><h2>Preserve variance, not labels.</h2></div>
          <p className="panel-copy">{presets[preset].description}</p>
          <div className="control-stack">
            <label><span>Candidate direction <strong>{candidateAngle}°</strong></span><small>Move away from PC1 and projected variance falls.</small><input type="range" min="0" max="179" step="1" value={candidateAngle} onChange={(event) => setCandidateAngle(Number(event.target.value))} /></label>
          </div>
          <div className="variance-bars" aria-label="Explained variance comparison">
            <div><span>PC1</span><i><b style={{ width: `${pca.explainedVariance[0] * 100}%` }} /></i><strong>{(pca.explainedVariance[0] * 100).toFixed(1)}%</strong></div>
            <div><span>PC2</span><i><b style={{ width: `${pca.explainedVariance[1] * 100}%` }} /></i><strong>{(pca.explainedVariance[1] * 100).toFixed(1)}%</strong></div>
            <div><span>Candidate</span><i><b className="is-candidate" style={{ width: `${Math.min(100, candidateRatio * 100)}%` }} /></i><strong>{(candidateRatio * 100).toFixed(1)}%</strong></div>
          </div>
          <div className="metric-grid">
            <div><span>PC1 angle</span><strong>{pc1Angle}°</strong></div>
            <div><span>Candidate gap</span><strong>{difference}°</strong></div>
            <div><span>λ₁</span><strong>{pca.eigenvalues[0].toFixed(2)}</strong></div>
            <div><span>λ₂</span><strong>{pca.eigenvalues[1].toFixed(2)}</strong></div>
          </div>
          <div className="insight-card"><span className="insight-card__icon">i</span><p>{standardize ? 'Standardization gives each feature unit variance before PCA, so a large measurement scale cannot dominate by itself.' : 'Without standardization, features measured on larger numerical scales can dominate the covariance matrix.'}</p></div>
        </aside>
      </div>
    </div>
  );
}
