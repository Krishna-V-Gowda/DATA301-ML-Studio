'use client';

import { useMemo, useState } from 'react';
import { predictLinearSvm, svmAccuracy, svmScore, trainLinearSvm, type SvmPoint } from '@/lib/ml/linear-svm';

const WIDTH = 680;
const HEIGHT = 430;
const PAD_X = 48;
const PAD_TOP = 28;
const PAD_BOTTOM = 52;
const MIN = -3.5;
const MAX = 3.5;
const toX = (x: number) => PAD_X + ((x - MIN) / (MAX - MIN)) * (WIDTH - PAD_X * 2);
const toY = (y: number) => HEIGHT - PAD_BOTTOM - ((y - MIN) / (MAX - MIN)) * (HEIGHT - PAD_TOP - PAD_BOTTOM);

const clean: SvmPoint[] = [
  { x: -2.8, y: -2.0, label: -1 }, { x: -2.4, y: -1.1, label: -1 }, { x: -1.9, y: -2.5, label: -1 },
  { x: -1.6, y: -0.7, label: -1 }, { x: -0.9, y: -1.5, label: -1 }, { x: -0.4, y: -2.2, label: -1 },
  { x: 0.5, y: 1.4, label: 1 }, { x: 1.1, y: 0.8, label: 1 }, { x: 1.5, y: 2.1, label: 1 },
  { x: 2.0, y: 0.5, label: 1 }, { x: 2.4, y: 1.5, label: 1 }, { x: 2.8, y: 2.4, label: 1 },
];

const presets: Record<string, { label: string; copy: string; points: SvmPoint[] }> = {
  clean: { label: 'Clean margin', copy: 'The classes are separable, so a wide margin can classify every point correctly.', points: clean },
  outlier: { label: 'Outlier pressure', copy: 'A single contradictory point forces a trade-off between a wider margin and fewer violations.', points: [...clean, { x: 1.6, y: 1.4, label: -1 }] },
  overlap: { label: 'Overlapping classes', copy: 'No straight line can be perfect, so C controls how strongly violations are penalized.', points: [...clean, { x: -0.3, y: 0.8, label: -1 }, { x: 0.2, y: -0.8, label: 1 }, { x: 0.8, y: 0.1, label: -1 }] },
};

function lineSegment(wx: number, wy: number, bias: number, level: number) {
  const candidates: Array<{ x: number; y: number }> = [];
  if (Math.abs(wy) > 1e-10) {
    for (const x of [MIN, MAX]) {
      const y = (level - bias - wx * x) / wy;
      if (y >= MIN - 1e-8 && y <= MAX + 1e-8) candidates.push({ x, y });
    }
  }
  if (Math.abs(wx) > 1e-10) {
    for (const y of [MIN, MAX]) {
      const x = (level - bias - wy * y) / wx;
      if (x >= MIN - 1e-8 && x <= MAX + 1e-8) candidates.push({ x, y });
    }
  }
  const unique = candidates.filter((point, index) => candidates.findIndex((other) => Math.hypot(point.x - other.x, point.y - other.y) < 1e-7) === index);
  return unique.length >= 2 ? [unique[0], unique[1]] as const : null;
}

export function SvmLab() {
  const [preset, setPreset] = useState<keyof typeof presets>('outlier');
  const [c, setC] = useState(1);
  const points = presets[preset].points;
  const model = useMemo(() => trainLinearSvm(points, c), [c, points]);
  const accuracy = svmAccuracy(model, points);
  const norm = Math.hypot(model.wx, model.wy);
  const boundary = lineSegment(model.wx, model.wy, model.bias, 0);
  const marginPositive = lineSegment(model.wx, model.wy, model.bias, 1);
  const marginNegative = lineSegment(model.wx, model.wy, model.bias, -1);
  const supportSet = new Set(model.supportIndices);
  const grid = useMemo(() => {
    const columns = 30; const rows = 22;
    return Array.from({ length: columns * rows }, (_, index) => {
      const column = index % columns; const row = Math.floor(index / columns);
      const x = MIN + ((column + 0.5) / columns) * (MAX - MIN);
      const y = MIN + ((row + 0.5) / rows) * (MAX - MIN);
      return { column, row, prediction: predictLinearSvm(model, { x, y }), columns, rows };
    });
  }, [model]);

  function reset() { setPreset('outlier'); setC(1); }

  const cInterpretation = c < 0.5
    ? 'Low C accepts more margin violations to preserve a wider, more regularized separator.'
    : c > 4
      ? 'High C penalizes violations strongly, so the boundary bends its position as far as a linear model can—but it may narrow the margin.'
      : 'Moderate C balances margin width against classification violations.';

  return (
    <div className="lab-shell">
      <div className="lab-toolbar">
        <div className="segmented" aria-label="SVM dataset preset">{(Object.keys(presets) as Array<keyof typeof presets>).map((key) => <button type="button" className={preset === key ? 'is-active' : ''} onClick={() => setPreset(key)} key={key}>{presets[key].label}</button>)}</div>
        <button className="button button--quiet" type="button" onClick={reset}>Reset</button>
        <span className="lab-state-pill">{model.supportIndices.length} support vectors</span>
      </div>
      <div className="lab-grid lab-grid--chart">
        <div className="lab-chart-card">
          <div className="chart-instruction">The solid line is the decision boundary. Dashed lines mark the unit margins; ringed observations influence the optimum.</div>
          <svg className="interactive-chart" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`Linear support vector machine with C ${c.toFixed(1)}, ${(accuracy * 100).toFixed(1)} percent training accuracy, and ${model.supportIndices.length} support vectors.`}>
            <rect x={PAD_X} y={PAD_TOP} width={WIDTH - PAD_X * 2} height={HEIGHT - PAD_TOP - PAD_BOTTOM} rx="15" className="chart-bg" />
            {grid.map((cell) => { const w = (WIDTH - PAD_X * 2) / cell.columns; const h = (HEIGHT - PAD_TOP - PAD_BOTTOM) / cell.rows; return <rect key={`${cell.column}-${cell.row}`} x={PAD_X + cell.column * w} y={PAD_TOP + (cell.rows - cell.row - 1) * h} width={w + .4} height={h + .4} className={`svm-region svm-region--${cell.prediction === 1 ? 'positive' : 'negative'}`} />; })}
            {[-3, -2, -1, 0, 1, 2, 3].map((value) => <g key={value}><line x1={toX(value)} y1={PAD_TOP} x2={toX(value)} y2={HEIGHT - PAD_BOTTOM} className="chart-grid chart-grid--soft" /><line x1={PAD_X} y1={toY(value)} x2={WIDTH - PAD_X} y2={toY(value)} className="chart-grid chart-grid--soft" /></g>)}
            {marginNegative ? <line x1={toX(marginNegative[0].x)} y1={toY(marginNegative[0].y)} x2={toX(marginNegative[1].x)} y2={toY(marginNegative[1].y)} className="svm-margin-line" /> : null}
            {marginPositive ? <line x1={toX(marginPositive[0].x)} y1={toY(marginPositive[0].y)} x2={toX(marginPositive[1].x)} y2={toY(marginPositive[1].y)} className="svm-margin-line" /> : null}
            {boundary ? <line x1={toX(boundary[0].x)} y1={toY(boundary[0].y)} x2={toX(boundary[1].x)} y2={toY(boundary[1].y)} className="svm-boundary-line" /> : null}
            {points.map((point, index) => { const correct = predictLinearSvm(model, point) === point.label; return <g key={`${point.x}-${point.y}-${index}`}>{supportSet.has(index) ? <circle cx={toX(point.x)} cy={toY(point.y)} r="12" className="support-ring" /> : null}<circle cx={toX(point.x)} cy={toY(point.y)} r="7.5" className={`svm-point svm-point--${point.label === 1 ? 'positive' : 'negative'} ${correct ? '' : 'svm-point--error'}`} /></g>; })}
            <text x={WIDTH / 2} y={HEIGHT - 6} textAnchor="middle" className="chart-axis-label">feature x₁</text><text x="14" y={HEIGHT / 2} textAnchor="middle" className="chart-axis-label" transform={`rotate(-90 14 ${HEIGHT / 2})`}>feature x₂</text>
          </svg>
        </div>
        <aside className="lab-panel">
          <div className="lab-panel__header"><span className="eyebrow">Maximum-margin classification</span><h2>Choose a separator with room to generalize.</h2></div>
          <p className="panel-copy">{presets[preset].copy}</p>
          <div className="control-stack"><label><span>Penalty C <strong>{c.toFixed(1)}</strong></span><small>Higher C makes margin violations more expensive.</small><input type="range" min="0.1" max="10" step="0.1" value={c} onChange={(event) => setC(Number(event.target.value))} /></label></div>
          <div className="metric-grid">
            <div><span>Training accuracy</span><strong>{(accuracy * 100).toFixed(1)}%</strong></div>
            <div><span>Margin width</span><strong>{model.marginWidth.toFixed(2)}</strong></div>
            <div><span>Hinge loss</span><strong>{model.hingeLoss.toFixed(3)}</strong></div>
            <div><span>Support vectors</span><strong>{model.supportIndices.length}</strong></div>
          </div>
          <div className="formula-card"><span>Decision</span><strong>sign({model.wx.toFixed(2)}x₁ {model.wy >= 0 ? '+' : '−'} {Math.abs(model.wy).toFixed(2)}x₂ {model.bias >= 0 ? '+' : '−'} {Math.abs(model.bias).toFixed(2)})</strong><small>Distance to the boundary is the score divided by ‖w‖ = {norm.toFixed(2)}.</small></div>
          <div className="insight-card"><span className="insight-card__icon">i</span><p>{cInterpretation}</p></div>
        </aside>
      </div>
    </div>
  );
}
