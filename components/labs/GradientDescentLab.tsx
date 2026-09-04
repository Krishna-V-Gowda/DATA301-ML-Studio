'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  classifyQuadraticLearningRate,
  gradientDescentQuadratic,
  quadraticLoss,
} from '@/lib/ml/gradient-descent';

const WIDTH = 680;
const HEIGHT = 430;
const PAD_X = 52;
const PAD_TOP = 28;
const PAD_BOTTOM = 54;
const X_LIMIT = 5.5;
const LOSS_LIMIT = 30;

const toX = (parameter: number) => PAD_X + ((Math.max(-X_LIMIT, Math.min(X_LIMIT, parameter)) + X_LIMIT) / (2 * X_LIMIT)) * (WIDTH - PAD_X * 2);
const toY = (loss: number) => HEIGHT - PAD_BOTTOM - (Math.min(LOSS_LIMIT, Math.max(0, loss)) / LOSS_LIMIT) * (HEIGHT - PAD_TOP - PAD_BOTTOM);

const modeCopy = {
  converging: 'The update shrinks the distance to the minimum. Smaller rates move safely but need more steps.',
  oscillating: 'At this boundary the parameter flips from one side of the minimum to the other without getting closer.',
  diverging: 'The update is too aggressive: every step moves farther from the minimum and the loss grows.',
  stationary: 'With a zero learning rate, the parameter never moves.',
} as const;

export function GradientDescentLab() {
  const [start, setStart] = useState(4);
  const [learningRate, setLearningRate] = useState(0.15);
  const [steps, setSteps] = useState(12);
  const [revealed, setRevealed] = useState(12);
  const [playing, setPlaying] = useState(false);

  const trajectory = useMemo(
    () => gradientDescentQuadratic({ start, learningRate, steps }),
    [learningRate, start, steps],
  );
  const visible = trajectory.slice(0, Math.min(revealed + 1, trajectory.length));
  const current = visible[visible.length - 1] ?? trajectory[0] ?? { iteration: 0, parameter: start, loss: quadraticLoss(start) };
  const mode = classifyQuadraticLearningRate(learningRate);
  const clipped = visible.some((point) => Math.abs(point.parameter) > X_LIMIT || point.loss > LOSS_LIMIT);

  useEffect(() => {
    if (!playing) return;
    if (revealed >= steps) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setRevealed((value) => Math.min(steps, value + 1)), 380);
    return () => window.clearTimeout(timer);
  }, [playing, revealed, steps]);

  function reset() {
    setPlaying(false);
    setStart(4);
    setLearningRate(0.15);
    setSteps(12);
    setRevealed(12);
  }

  function restartAndPlay() {
    setRevealed(0);
    setPlaying(true);
  }

  const lossCurve = Array.from({ length: 121 }, (_, index) => {
    const parameter = -X_LIMIT + (index / 120) * X_LIMIT * 2;
    return { parameter, loss: quadraticLoss(parameter) };
  });
  const historyMax = Math.max(1, ...visible.map((point) => Math.min(point.loss, LOSS_LIMIT)));

  return (
    <div className="lab-shell">
      <div className="lab-toolbar">
        <button className="button button--primary" type="button" onClick={() => setRevealed((value) => Math.min(steps, value + 1))} disabled={revealed >= steps}>Step once</button>
        <button className="button button--quiet" type="button" onClick={() => playing ? setPlaying(false) : restartAndPlay()}>{playing ? 'Pause' : 'Play from start'}</button>
        <button className="button button--quiet" type="button" onClick={reset}>Reset</button>
        <span className={`lab-state-pill lab-state-pill--${mode}`}>{mode}</span>
      </div>

      <div className="lab-grid lab-grid--chart">
        <div className="lab-chart-card">
          <div className="chart-instruction">Follow each parameter update down the quadratic loss surface. The minimum is at θ = 0.</div>
          <svg className="interactive-chart" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`Gradient descent after ${visible.length - 1} steps with learning rate ${learningRate.toFixed(2)}. Current parameter ${current.parameter.toFixed(3)} and loss ${current.loss.toFixed(3)}.`}>
            <rect x={PAD_X} y={PAD_TOP} width={WIDTH - PAD_X * 2} height={HEIGHT - PAD_TOP - PAD_BOTTOM} rx="15" className="chart-bg" />
            {[0, 6, 12, 18, 24, 30].map((loss) => <g key={loss}><line x1={PAD_X} y1={toY(loss)} x2={WIDTH - PAD_X} y2={toY(loss)} className="chart-grid" /><text x={PAD_X - 10} y={toY(loss) + 3} textAnchor="end" className="chart-tick">{loss}</text></g>)}
            {[-4, -2, 0, 2, 4].map((parameter) => <g key={parameter}><line x1={toX(parameter)} y1={PAD_TOP} x2={toX(parameter)} y2={HEIGHT - PAD_BOTTOM} className="chart-grid" /><text x={toX(parameter)} y={HEIGHT - 28} textAnchor="middle" className="chart-tick">{parameter}</text></g>)}
            {lossCurve.slice(1).map((point, index) => {
              const previous = lossCurve[index];
              return <line key={point.parameter} x1={toX(previous.parameter)} y1={toY(previous.loss)} x2={toX(point.parameter)} y2={toY(point.loss)} className="regression-line" />;
            })}
            {visible.slice(1).map((point, index) => {
              const previous = visible[index];
              return <line key={`path-${point.iteration}`} x1={toX(previous.parameter)} y1={toY(previous.loss)} x2={toX(point.parameter)} y2={toY(point.loss)} className="optimization-path" />;
            })}
            {visible.map((point, index) => <g key={point.iteration}><circle cx={toX(point.parameter)} cy={toY(point.loss)} r={index === visible.length - 1 ? 8 : 5} className={index === visible.length - 1 ? 'optimization-point optimization-point--current' : 'optimization-point'} /><text x={toX(point.parameter)} y={toY(point.loss) - 11} textAnchor="middle" className="chart-tick">{point.iteration}</text></g>)}
            <text x={WIDTH / 2} y={HEIGHT - 5} textAnchor="middle" className="chart-axis-label">parameter θ</text>
            <text x="14" y={HEIGHT / 2} textAnchor="middle" className="chart-axis-label" transform={`rotate(-90 14 ${HEIGHT / 2})`}>loss L(θ) = θ²</text>
          </svg>
          {clipped ? <p className="chart-warning" role="status">The trajectory has moved beyond the visible chart—this is divergence, not a rendering error.</p> : null}
        </div>

        <aside className="lab-panel">
          <div className="lab-panel__header"><span className="eyebrow">Optimization</span><h2>θ ← θ − α · 2θ</h2></div>
          <div className="control-stack">
            <label><span>Learning rate α <strong>{learningRate.toFixed(2)}</strong></span><small>Converges for this loss when 0 &lt; α &lt; 1.</small><input type="range" min="0" max="1.2" step="0.02" value={learningRate} onChange={(event) => { setPlaying(false); setLearningRate(Number(event.target.value)); setRevealed(steps); }} /></label>
            <label><span>Starting parameter <strong>{start.toFixed(1)}</strong></span><input type="range" min="-5" max="5" step="0.2" value={start} onChange={(event) => { setPlaying(false); setStart(Number(event.target.value)); setRevealed(steps); }} /></label>
            <label><span>Maximum iterations <strong>{steps}</strong></span><input type="range" min="1" max="30" step="1" value={steps} onChange={(event) => { const next = Number(event.target.value); setPlaying(false); setSteps(next); setRevealed(next); }} /></label>
          </div>
          <div className="metric-grid">
            <div><span>Visible step</span><strong>{current.iteration}</strong></div>
            <div><span>Current θ</span><strong>{Number.isFinite(current.parameter) ? current.parameter.toFixed(3) : '∞'}</strong></div>
            <div><span>Current loss</span><strong>{Number.isFinite(current.loss) ? current.loss.toFixed(3) : '∞'}</strong></div>
            <div><span>Distance to minimum</span><strong>{Number.isFinite(current.parameter) ? Math.abs(current.parameter).toFixed(3) : '∞'}</strong></div>
          </div>
          <div className="mini-chart-card">
            <span>Loss by iteration</span>
            <svg viewBox="0 0 280 88" role="img" aria-label="Loss by iteration">
              <line x1="8" y1="76" x2="272" y2="76" className="mini-chart-axis" />
              {visible.slice(1).map((point, index) => {
                const previous = visible[index];
                const x1 = 8 + (previous.iteration / Math.max(1, steps)) * 264;
                const x2 = 8 + (point.iteration / Math.max(1, steps)) * 264;
                const y1 = 76 - (Math.min(previous.loss, historyMax) / historyMax) * 64;
                const y2 = 76 - (Math.min(point.loss, historyMax) / historyMax) * 64;
                return <line key={point.iteration} x1={x1} y1={y1} x2={x2} y2={y2} className="mini-chart-line" />;
              })}
            </svg>
          </div>
          <div className="insight-card"><span className="insight-card__icon">i</span><p>{modeCopy[mode]}</p></div>
        </aside>
      </div>
    </div>
  );
}
