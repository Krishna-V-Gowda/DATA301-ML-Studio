'use client';

import { useMemo, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import {
  fitLinearRegression,
  meanSquaredError,
  predictLinear,
  type Point,
} from '@/lib/ml/linear-regression';

const INITIAL_POINTS: Point[] = [
  { x: 0.8, y: 1.8 },
  { x: 1.8, y: 2.2 },
  { x: 2.8, y: 3.7 },
  { x: 3.9, y: 3.6 },
  { x: 4.9, y: 5.4 },
  { x: 6.1, y: 5.7 },
  { x: 7.1, y: 7.4 },
  { x: 8.3, y: 7.6 },
  { x: 9.1, y: 9.1 },
];

const WIDTH = 640;
const HEIGHT = 420;
const PAD = 46;
const graphWidth = WIDTH - PAD * 2;
const graphHeight = HEIGHT - PAD * 2;
const toX = (x: number) => PAD + (x / 10) * graphWidth;
const toY = (y: number) => HEIGHT - PAD - (y / 10) * graphHeight;
const fromX = (x: number) => Math.min(10, Math.max(0, ((x - PAD) / graphWidth) * 10));
const fromY = (y: number) => Math.min(10, Math.max(0, ((HEIGHT - PAD - y) / graphHeight) * 10));

export function LinearRegressionLab() {
  const [points, setPoints] = useState<Point[]>(INITIAL_POINTS);
  const [mode, setMode] = useState<'fit' | 'manual'>('fit');
  const [manualSlope, setManualSlope] = useState(0.8);
  const [manualIntercept, setManualIntercept] = useState(0.8);
  const [showResiduals, setShowResiduals] = useState(true);
  const [dragging, setDragging] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const best = useMemo(() => fitLinearRegression(points), [points]);
  const slope = mode === 'fit' ? best.slope : manualSlope;
  const intercept = mode === 'fit' ? best.intercept : manualIntercept;
  const mse = useMemo(
    () => meanSquaredError(points, slope, intercept),
    [points, slope, intercept],
  );

  function localPoint(clientX: number, clientY: number) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: ((clientX - rect.left) / rect.width) * WIDTH,
      y: ((clientY - rect.top) / rect.height) * HEIGHT,
    };
  }

  function updateDragged(clientX: number, clientY: number) {
    if (dragging === null) return;
    const local = localPoint(clientX, clientY);
    if (!local) return;
    setPoints((current) =>
      current.map((point, index) =>
        index === dragging ? { x: fromX(local.x), y: fromY(local.y) } : point,
      ),
    );
  }

  function nudgePoint(index: number, deltaX: number, deltaY: number) {
    setPoints((current) => current.map((point, pointIndex) => pointIndex === index
      ? { x: Math.min(10, Math.max(0, point.x + deltaX)), y: Math.min(10, Math.max(0, point.y + deltaY)) }
      : point));
  }

  function addPoint(event: React.PointerEvent<SVGSVGElement>) {
    if (event.target !== event.currentTarget) return;
    const local = localPoint(event.clientX, event.clientY);
    if (!local || local.x < PAD || local.x > WIDTH - PAD || local.y < PAD || local.y > HEIGHT - PAD) return;
    setPoints((current) => [...current, { x: fromX(local.x), y: fromY(local.y) }]);
  }

  const lineStart = { x: 0, y: predictLinear(0, slope, intercept) };
  const lineEnd = { x: 10, y: predictLinear(10, slope, intercept) };

  return (
    <div className="lab-shell">
      <div className="lab-toolbar">
        <div className="segmented" aria-label="Regression line mode">
          <button className={mode === 'fit' ? 'is-active' : ''} onClick={() => setMode('fit')} type="button">
            Best fit
          </button>
          <button className={mode === 'manual' ? 'is-active' : ''} onClick={() => setMode('manual')} type="button">
            Tune parameters
          </button>
        </div>
        <label className="check-control">
          <input type="checkbox" checked={showResiduals} onChange={(event) => setShowResiduals(event.target.checked)} />
          <span>Show residuals</span>
        </label>
        <button className="button button--quiet" type="button" onClick={() => setPoints(INITIAL_POINTS)}>
          Reset data
        </button>
      </div>

      <div className="lab-grid lab-grid--chart">
        <div className="lab-chart-card">
          <div className="chart-instruction"><Icon name="spark" size={17} /> Drag points. Click empty space to add one.</div>
          <svg
            ref={svgRef}
            className="interactive-chart"
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-label="Interactive scatter plot with regression line and residuals"
            onPointerDown={addPoint}
            onPointerMove={(event) => updateDragged(event.clientX, event.clientY)}
            onPointerUp={() => setDragging(null)}
            onPointerLeave={() => setDragging(null)}
          >
            <rect x={PAD} y={PAD} width={graphWidth} height={graphHeight} rx="12" className="chart-bg" />
            {Array.from({ length: 11 }, (_, index) => (
              <g key={`grid-${index}`}>
                <line x1={toX(index)} x2={toX(index)} y1={PAD} y2={HEIGHT - PAD} className="chart-grid" />
                <line x1={PAD} x2={WIDTH - PAD} y1={toY(index)} y2={toY(index)} className="chart-grid" />
                {index % 2 === 0 ? <text x={toX(index)} y={HEIGHT - 18} textAnchor="middle" className="chart-tick">{index}</text> : null}
                {index % 2 === 0 ? <text x={24} y={toY(index) + 4} textAnchor="middle" className="chart-tick">{index}</text> : null}
              </g>
            ))}

            {showResiduals
              ? points.map((point, index) => {
                  const predicted = predictLinear(point.x, slope, intercept);
                  return (
                    <line
                      key={`residual-${index}`}
                      x1={toX(point.x)}
                      x2={toX(point.x)}
                      y1={toY(point.y)}
                      y2={toY(predicted)}
                      className="residual-line"
                    />
                  );
                })
              : null}

            <line
              x1={toX(lineStart.x)}
              y1={toY(lineStart.y)}
              x2={toX(lineEnd.x)}
              y2={toY(lineEnd.y)}
              className="regression-line regression-line--glow"
            />
            <line
              x1={toX(lineStart.x)}
              y1={toY(lineStart.y)}
              x2={toX(lineEnd.x)}
              y2={toY(lineEnd.y)}
              className="regression-line"
            />

            {points.map((point, index) => (
              <g
                key={`point-${index}`}
                className="draggable-point"
                role="button"
                tabIndex={0}
                aria-label={`Data point ${index + 1}: x ${point.x.toFixed(1)}, y ${point.y.toFixed(1)}`}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  event.currentTarget.setPointerCapture(event.pointerId);
                  setDragging(index);
                }}
                onKeyDown={(event) => {
                  const step = event.shiftKey ? 0.5 : 0.1;
                  const deltas: Record<string, [number, number]> = {
                    ArrowUp: [0, step], ArrowDown: [0, -step], ArrowLeft: [-step, 0], ArrowRight: [step, 0],
                  };
                  const delta = deltas[event.key];
                  if (!delta) return;
                  event.preventDefault();
                  nudgePoint(index, delta[0], delta[1]);
                }}
                onDoubleClick={() => setPoints((current) => current.filter((_, pointIndex) => pointIndex !== index))}
              >
                <circle cx={toX(point.x)} cy={toY(point.y)} r="12" className="point-hit" />
                <circle cx={toX(point.x)} cy={toY(point.y)} r="6" className="point-core" />
              </g>
            ))}
            <text x={WIDTH / 2} y={HEIGHT - 2} textAnchor="middle" className="chart-axis-label">feature x</text>
            <text x="11" y={HEIGHT / 2} textAnchor="middle" className="chart-axis-label" transform={`rotate(-90 11 ${HEIGHT / 2})`}>target y</text>
          </svg>
        </div>

        <aside className="lab-panel">
          <div className="lab-panel__header">
            <span className="eyebrow">Live model</span>
            <h2>ŷ = {slope.toFixed(2)}x {intercept >= 0 ? '+' : '−'} {Math.abs(intercept).toFixed(2)}</h2>
          </div>

          {mode === 'manual' ? (
            <div className="control-stack">
              <label>
                <span>Slope w₁ <strong>{manualSlope.toFixed(2)}</strong></span>
                <input type="range" min="-1" max="2" step="0.05" value={manualSlope} onChange={(event) => setManualSlope(Number(event.target.value))} />
              </label>
              <label>
                <span>Intercept w₀ <strong>{manualIntercept.toFixed(2)}</strong></span>
                <input type="range" min="-3" max="7" step="0.1" value={manualIntercept} onChange={(event) => setManualIntercept(Number(event.target.value))} />
              </label>
            </div>
          ) : (
            <p className="panel-copy">The line is recalculated from all points using ordinary least squares.</p>
          )}

          <div className="metric-grid">
            <div><span>Mean squared error</span><strong>{mse.toFixed(3)}</strong></div>
            <div><span>R²</span><strong>{mode === 'fit' ? best.r2.toFixed(3) : '—'}</strong></div>
            <div><span>Samples</span><strong>{points.length}</strong></div>
            <div><span>Largest residual</span><strong>{Math.max(...points.map((point) => Math.abs(point.y - predictLinear(point.x, slope, intercept)))).toFixed(2)}</strong></div>
          </div>

          <div className="insight-card">
            <span className="insight-card__icon">i</span>
            <p><strong>Try this:</strong> move one point far from the others. Watch how squared error makes that outlier pull the line.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
