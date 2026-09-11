'use client';

import { useMemo, useState } from 'react';
import { evaluateLogisticDataset, logisticProbability, type LogisticObservation } from '@/lib/ml/logistic-regression';

const WIDTH = 680;
const HEIGHT = 430;
const PAD_X = 52;
const PAD_TOP = 32;
const PAD_BOTTOM = 54;
const X_MIN = -4;
const X_MAX = 4;

const observations: LogisticObservation[] = [
  { x: -3.4, label: 0 }, { x: -2.9, label: 0 }, { x: -2.3, label: 0 }, { x: -1.8, label: 0 },
  { x: -1.2, label: 0 }, { x: -0.7, label: 1 }, { x: -0.2, label: 0 }, { x: 0.25, label: 1 },
  { x: 0.7, label: 0 }, { x: 1.1, label: 1 }, { x: 1.6, label: 1 }, { x: 2.1, label: 1 },
  { x: 2.7, label: 1 }, { x: 3.3, label: 1 },
];

const toX = (x: number) => PAD_X + ((x - X_MIN) / (X_MAX - X_MIN)) * (WIDTH - PAD_X * 2);
const toY = (probability: number) => HEIGHT - PAD_BOTTOM - probability * (HEIGHT - PAD_TOP - PAD_BOTTOM);
const percentage = (value: number) => `${(value * 100).toFixed(1)}%`;

export function LogisticRegressionLab() {
  const [weight, setWeight] = useState(1.4);
  const [bias, setBias] = useState(0);
  const [threshold, setThreshold] = useState(0.5);
  const evaluation = useMemo(
    () => evaluateLogisticDataset(observations, weight, bias, threshold),
    [bias, threshold, weight],
  );

  function reset() {
    setWeight(1.4);
    setBias(0);
    setThreshold(0.5);
  }

  const curve = Array.from({ length: 161 }, (_, index) => {
    const x = X_MIN + (index / 160) * (X_MAX - X_MIN);
    return { x, probability: logisticProbability(x, weight, bias) };
  });
  const boundaryVisible = evaluation.decisionBoundary !== null
    && evaluation.decisionBoundary >= X_MIN
    && evaluation.decisionBoundary <= X_MAX;

  return (
    <div className="lab-shell">
      <div className="lab-toolbar">
        <div className="segmented" aria-label="Threshold presets">
          <button type="button" className={threshold === 0.35 ? 'is-active' : ''} onClick={() => setThreshold(0.35)}>Recall-first</button>
          <button type="button" className={threshold === 0.5 ? 'is-active' : ''} onClick={() => setThreshold(0.5)}>Balanced</button>
          <button type="button" className={threshold === 0.7 ? 'is-active' : ''} onClick={() => setThreshold(0.7)}>Precision-first</button>
        </div>
        <button className="button button--quiet" type="button" onClick={reset}>Reset</button>
      </div>

      <div className="lab-grid lab-grid--chart">
        <div className="lab-chart-card">
          <div className="chart-instruction">The curve is a probability. The horizontal threshold converts that probability into a final class.</div>
          <svg className="interactive-chart" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`Logistic probability curve with threshold ${threshold.toFixed(2)}. Accuracy ${percentage(evaluation.metrics.accuracy)}.`}>
            <rect x={PAD_X} y={PAD_TOP} width={WIDTH - PAD_X * 2} height={HEIGHT - PAD_TOP - PAD_BOTTOM} rx="15" className="chart-bg" />
            {[0, 0.25, 0.5, 0.75, 1].map((probability) => <g key={probability}><line x1={PAD_X} y1={toY(probability)} x2={WIDTH - PAD_X} y2={toY(probability)} className="chart-grid" /><text x={PAD_X - 10} y={toY(probability) + 3} textAnchor="end" className="chart-tick">{probability.toFixed(2)}</text></g>)}
            {[-4, -2, 0, 2, 4].map((x) => <g key={x}><line x1={toX(x)} y1={PAD_TOP} x2={toX(x)} y2={HEIGHT - PAD_BOTTOM} className="chart-grid" /><text x={toX(x)} y={HEIGHT - 28} textAnchor="middle" className="chart-tick">{x}</text></g>)}
            <line x1={PAD_X} y1={toY(threshold)} x2={WIDTH - PAD_X} y2={toY(threshold)} className="threshold-line" />
            <text x={WIDTH - PAD_X - 6} y={toY(threshold) - 7} textAnchor="end" className="chart-tick">threshold {threshold.toFixed(2)}</text>
            {boundaryVisible ? <><line x1={toX(evaluation.decisionBoundary!)} y1={PAD_TOP} x2={toX(evaluation.decisionBoundary!)} y2={HEIGHT - PAD_BOTTOM} className="decision-boundary-line" /><text x={toX(evaluation.decisionBoundary!)} y={PAD_TOP + 14} textAnchor="middle" className="chart-tick">class boundary</text></> : null}
            {curve.slice(1).map((point, index) => {
              const previous = curve[index];
              return <line key={point.x} x1={toX(previous.x)} y1={toY(previous.probability)} x2={toX(point.x)} y2={toY(point.probability)} className="regression-line" />;
            })}
            {observations.map((observation, index) => {
              const prediction = evaluation.predictions[index];
              const correct = prediction === observation.label;
              const probability = evaluation.probabilities[index];
              return <g key={`${observation.x}-${observation.label}`}><line x1={toX(observation.x)} y1={toY(observation.label ? 0.96 : 0.04)} x2={toX(observation.x)} y2={toY(probability)} className="probability-link" /><circle cx={toX(observation.x)} cy={toY(observation.label ? 0.96 : 0.04)} r="7" className={observation.label ? 'logistic-point logistic-point--positive' : 'logistic-point logistic-point--negative'} /><circle cx={toX(observation.x)} cy={toY(probability)} r="4" className={correct ? 'probability-marker probability-marker--correct' : 'probability-marker probability-marker--incorrect'} /></g>;
            })}
            <text x={WIDTH / 2} y={HEIGHT - 5} textAnchor="middle" className="chart-axis-label">feature x</text>
            <text x="14" y={HEIGHT / 2} textAnchor="middle" className="chart-axis-label" transform={`rotate(-90 14 ${HEIGHT / 2})`}>predicted probability p(y = 1 | x)</text>
          </svg>
        </div>

        <aside className="lab-panel">
          <div className="lab-panel__header"><span className="eyebrow">Live classifier</span><h2>p(y=1|x) = σ({weight.toFixed(1)}x {bias >= 0 ? '+' : '−'} {Math.abs(bias).toFixed(1)})</h2></div>
          <div className="control-stack">
            <label><span>Weight <strong>{weight.toFixed(1)}</strong></span><small>Controls the direction and steepness of the sigmoid.</small><input type="range" min="-3" max="3" step="0.1" value={weight} onChange={(event) => setWeight(Number(event.target.value))} /></label>
            <label><span>Bias <strong>{bias.toFixed(1)}</strong></span><small>Moves the probability curve left or right.</small><input type="range" min="-3" max="3" step="0.1" value={bias} onChange={(event) => setBias(Number(event.target.value))} /></label>
            <label><span>Classification threshold <strong>{threshold.toFixed(2)}</strong></span><small>Probability at or above this value becomes class 1.</small><input type="range" min="0.1" max="0.9" step="0.05" value={threshold} onChange={(event) => setThreshold(Number(event.target.value))} /></label>
          </div>
          <div className="metric-grid">
            <div><span>Accuracy</span><strong>{percentage(evaluation.metrics.accuracy)}</strong></div>
            <div><span>Precision</span><strong>{percentage(evaluation.metrics.precision)}</strong></div>
            <div><span>Recall</span><strong>{percentage(evaluation.metrics.recall)}</strong></div>
            <div><span>F1 score</span><strong>{percentage(evaluation.metrics.f1)}</strong></div>
          </div>
          <div className="compact-matrix" aria-label="Live confusion matrix">
            <div><span>TP</span><strong>{evaluation.counts.tp}</strong></div><div><span>FN</span><strong>{evaluation.counts.fn}</strong></div>
            <div><span>FP</span><strong>{evaluation.counts.fp}</strong></div><div><span>TN</span><strong>{evaluation.counts.tn}</strong></div>
          </div>
          <div className="insight-card"><span className="insight-card__icon">i</span><p>Lowering the threshold usually increases recall because more cases become positive; raising it usually increases precision but can miss positives.</p></div>
        </aside>
      </div>
    </div>
  );
}
