'use client';

import { useMemo, useState } from 'react';
import { fitPolynomialRegression, predictPolynomial, regressionMse, type RegressionPoint } from '@/lib/ml/polynomial-regression';

const WIDTH = 680;
const HEIGHT = 430;
const PAD_X = 52;
const PAD_TOP = 28;
const PAD_BOTTOM = 54;
const Y_MIN = -1.35;
const Y_MAX = 1.35;
const deterministicNoise = [0.08, -0.72, 0.52, -0.36, 0.68, -0.48, 0.32, -0.16, 0.60, -0.64, 0.44, -0.28, 0.16, -0.52, 0.36, -0.12, 0.24, -0.40, 0.56, -0.20];

const truth = (x: number) => 0.58 * Math.sin(1.7 * Math.PI * x) + 0.22 * x;
const toX = (x: number) => PAD_X + ((x + 1) / 2) * (WIDTH - PAD_X * 2);
const toY = (y: number) => HEIGHT - PAD_BOTTOM - ((Math.max(Y_MIN, Math.min(Y_MAX, y)) - Y_MIN) / (Y_MAX - Y_MIN)) * (HEIGHT - PAD_TOP - PAD_BOTTOM);

function createTrainingData(sampleCount: number, noise: number): RegressionPoint[] {
  return Array.from({ length: sampleCount }, (_, index) => {
    const x = -1 + (index / Math.max(1, sampleCount - 1)) * 2;
    return { x, y: truth(x) + deterministicNoise[index % deterministicNoise.length] * noise };
  });
}

export function OverfittingLab() {
  const [degree, setDegree] = useState(7);
  const [noise, setNoise] = useState(0.24);
  const [sampleCount, setSampleCount] = useState(16);

  const training = useMemo(() => createTrainingData(sampleCount, noise), [noise, sampleCount]);
  const validation = useMemo(() => Array.from({ length: 140 }, (_, index) => {
    const x = -1 + (index / 139) * 2;
    return { x, y: truth(x) };
  }), []);
  const coefficients = useMemo(
    () => fitPolynomialRegression(training, Math.min(degree, 15), 1e-8),
    [degree, training],
  );
  const trainError = regressionMse(training, coefficients);
  const validationError = regressionMse(validation, coefficients);
  const gap = validationError - trainError;
  const curve = validation.map(({ x }) => ({ x, y: predictPolynomial(x, coefficients) }));
  const clipped = curve.some((point) => point.y < Y_MIN || point.y > Y_MAX);

  const diagnosis = degree <= 2
    ? { label: 'Underfitting', copy: 'The model is too rigid. Both training and validation error remain high because it cannot represent the underlying curve.' }
    : gap > Math.max(0.035, trainError * 2.5)
      ? { label: 'Overfitting', copy: 'Training error is low, but validation error is much larger. The curve is fitting sample noise instead of only the underlying pattern.' }
      : { label: 'Balanced fit', copy: 'The model captures the main pattern while keeping the validation gap controlled.' };

  function reset() {
    setDegree(7);
    setNoise(0.24);
    setSampleCount(16);
  }

  return (
    <div className="lab-shell">
      <div className="lab-toolbar">
        <div className="segmented" aria-label="Model complexity presets">
          <button type="button" className={degree === 1 ? 'is-active' : ''} onClick={() => setDegree(1)}>Underfit</button>
          <button type="button" className={degree === 7 ? 'is-active' : ''} onClick={() => setDegree(7)}>Balanced</button>
          <button type="button" className={degree === 15 ? 'is-active' : ''} onClick={() => setDegree(15)}>Overfit</button>
        </div>
        <button className="button button--quiet" type="button" onClick={reset}>Reset</button>
        <span className={`lab-state-pill lab-state-pill--${diagnosis.label.toLowerCase().replace(' ', '-')}`}>{diagnosis.label}</span>
      </div>

      <div className="lab-grid lab-grid--chart">
        <div className="lab-chart-card">
          <div className="chart-instruction">Blue points are training observations. The dashed line is the unseen underlying pattern; the solid line is the fitted polynomial.</div>
          <svg className="interactive-chart" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`${diagnosis.label} demonstration using a degree ${degree} polynomial. Training error ${trainError.toFixed(4)} and validation error ${validationError.toFixed(4)}.`}>
            <rect x={PAD_X} y={PAD_TOP} width={WIDTH - PAD_X * 2} height={HEIGHT - PAD_TOP - PAD_BOTTOM} rx="15" className="chart-bg" />
            {[-1, -0.5, 0, 0.5, 1].map((x) => <g key={x}><line x1={toX(x)} y1={PAD_TOP} x2={toX(x)} y2={HEIGHT - PAD_BOTTOM} className="chart-grid" /><text x={toX(x)} y={HEIGHT - 28} textAnchor="middle" className="chart-tick">{x.toFixed(1)}</text></g>)}
            {[-1, -0.5, 0, 0.5, 1].map((y) => <g key={y}><line x1={PAD_X} y1={toY(y)} x2={WIDTH - PAD_X} y2={toY(y)} className="chart-grid" /><text x={PAD_X - 10} y={toY(y) + 3} textAnchor="end" className="chart-tick">{y.toFixed(1)}</text></g>)}
            {validation.slice(1).map((point, index) => { const previous = validation[index]; return <line key={`truth-${index}`} x1={toX(previous.x)} y1={toY(previous.y)} x2={toX(point.x)} y2={toY(point.y)} className="truth-line" />; })}
            {curve.slice(1).map((point, index) => { const previous = curve[index]; return <line key={`fit-${index}`} x1={toX(previous.x)} y1={toY(previous.y)} x2={toX(point.x)} y2={toY(point.y)} className="regression-line" />; })}
            {training.map((point, index) => <circle key={`${point.x}-${index}`} cx={toX(point.x)} cy={toY(point.y)} r="6.5" className="point-core" />)}
            <text x={WIDTH / 2} y={HEIGHT - 5} textAnchor="middle" className="chart-axis-label">input x</text>
            <text x="14" y={HEIGHT / 2} textAnchor="middle" className="chart-axis-label" transform={`rotate(-90 14 ${HEIGHT / 2})`}>target y</text>
          </svg>
          {clipped ? <p className="chart-warning" role="status">The fitted curve leaves the visible range near the boundary—a classic high-degree overfitting signal.</p> : null}
        </div>

        <aside className="lab-panel">
          <div className="lab-panel__header"><span className="eyebrow">Generalization</span><h2>Complexity must earn its place.</h2></div>
          <div className="control-stack">
            <label><span>Polynomial degree <strong>{degree}</strong></span><small>Higher degree increases flexibility and the ability to fit noise.</small><input type="range" min="1" max="15" step="1" value={degree} onChange={(event) => setDegree(Number(event.target.value))} /></label>
            <label><span>Noise amplitude <strong>{noise.toFixed(2)}</strong></span><input type="range" min="0" max="0.35" step="0.01" value={noise} onChange={(event) => setNoise(Number(event.target.value))} /></label>
            <label><span>Training samples <strong>{sampleCount}</strong></span><input type="range" min="10" max="20" step="1" value={sampleCount} onChange={(event) => setSampleCount(Number(event.target.value))} /></label>
          </div>
          <div className="metric-grid">
            <div><span>Training MSE</span><strong>{trainError.toFixed(4)}</strong></div>
            <div><span>Validation MSE</span><strong>{validationError.toFixed(4)}</strong></div>
            <div><span>Generalization gap</span><strong>{gap.toFixed(4)}</strong></div>
            <div><span>Parameters</span><strong>{degree + 1}</strong></div>
          </div>
          <div className="error-comparison" aria-label="Training and validation error comparison">
            <div><span>Training</span><i><b style={{ width: `${Math.min(100, trainError / Math.max(trainError, validationError, 0.001) * 100)}%` }} /></i></div>
            <div><span>Validation</span><i><b className="is-validation" style={{ width: `${Math.min(100, validationError / Math.max(trainError, validationError, 0.001) * 100)}%` }} /></i></div>
          </div>
          <div className="insight-card"><span className="insight-card__icon">i</span><p><strong>{diagnosis.label}:</strong> {diagnosis.copy}</p></div>
        </aside>
      </div>
    </div>
  );
}
