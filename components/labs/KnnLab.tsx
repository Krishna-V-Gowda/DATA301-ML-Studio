'use client';

import { useMemo, useRef, useState } from 'react';
import { classifyKnn, type Label, type LabelledPoint } from '@/lib/ml/knn';

const WIDTH = 640;
const HEIGHT = 420;
const PAD = 42;
const initialPoints: LabelledPoint[] = [
  { x: 1.2, y: 2.1, label: 'A' }, { x: 1.8, y: 3.2, label: 'A' }, { x: 2.6, y: 2.5, label: 'A' },
  { x: 3.1, y: 4.1, label: 'A' }, { x: 2.2, y: 5.0, label: 'A' }, { x: 4.0, y: 3.0, label: 'A' },
  { x: 6.2, y: 6.1, label: 'B' }, { x: 7.1, y: 7.3, label: 'B' }, { x: 8.0, y: 6.0, label: 'B' },
  { x: 6.9, y: 8.4, label: 'B' }, { x: 8.6, y: 8.0, label: 'B' }, { x: 5.7, y: 7.5, label: 'B' },
];
const toX = (x: number) => PAD + (x / 10) * (WIDTH - PAD * 2);
const toY = (y: number) => HEIGHT - PAD - (y / 10) * (HEIGHT - PAD * 2);
const fromX = (x: number) => Math.max(0, Math.min(10, ((x - PAD) / (WIDTH - PAD * 2)) * 10));
const fromY = (y: number) => Math.max(0, Math.min(10, ((HEIGHT - PAD - y) / (HEIGHT - PAD * 2)) * 10));

export function KnnLab() {
  const [points, setPoints] = useState(initialPoints);
  const [query, setQuery] = useState({ x: 5.1, y: 5.2 });
  const [k, setK] = useState(5);
  const [addLabel, setAddLabel] = useState<Label>('A');
  const [draggingQuery, setDraggingQuery] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const result = useMemo(() => classifyKnn(points, query, k), [points, query, k]);
  const neighbourSet = useMemo(() => new Set(result.neighbours.map((item) => `${item.x}-${item.y}-${item.label}`)), [result]);
  const radius = result.neighbours.at(-1)?.distance ?? 0;

  function local(clientX: number, clientY: number) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return { x: ((clientX - rect.left) / rect.width) * WIDTH, y: ((clientY - rect.top) / rect.height) * HEIGHT };
  }

  function nudgeQuery(deltaX: number, deltaY: number) {
    setQuery((current) => ({
      x: Math.max(0, Math.min(10, current.x + deltaX)),
      y: Math.max(0, Math.min(10, current.y + deltaY)),
    }));
  }

  return (
    <div className="lab-shell">
      <div className="lab-toolbar">
        <div className="segmented" aria-label="Class to add">
          <button type="button" className={addLabel === 'A' ? 'is-active class-a' : ''} onClick={() => setAddLabel('A')}>Add class A</button>
          <button type="button" className={addLabel === 'B' ? 'is-active class-b' : ''} onClick={() => setAddLabel('B')}>Add class B</button>
        </div>
        <button className="button button--quiet" type="button" onClick={() => { setPoints(initialPoints); setQuery({ x: 5.1, y: 5.2 }); setK(5); }}>Reset</button>
      </div>

      <div className="lab-grid lab-grid--chart">
        <div className="lab-chart-card">
          <div className="chart-instruction">Click to add training points. Drag the ringed query point.</div>
          <svg
            ref={svgRef}
            className="interactive-chart"
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-label={`K-nearest neighbours chart. Current prediction: class ${result.label}`}
            onPointerDown={(event) => {
              if (event.target !== event.currentTarget) return;
              const p = local(event.clientX, event.clientY);
              if (!p || p.x < PAD || p.x > WIDTH - PAD || p.y < PAD || p.y > HEIGHT - PAD) return;
              setPoints((current) => [...current, { x: fromX(p.x), y: fromY(p.y), label: addLabel }]);
            }}
            onPointerMove={(event) => {
              if (!draggingQuery) return;
              const p = local(event.clientX, event.clientY);
              if (p) setQuery({ x: fromX(p.x), y: fromY(p.y) });
            }}
            onPointerUp={() => setDraggingQuery(false)}
            onPointerLeave={() => setDraggingQuery(false)}
          >
            <rect x={PAD} y={PAD} width={WIDTH - PAD * 2} height={HEIGHT - PAD * 2} rx="12" className="chart-bg" />
            {Array.from({ length: 11 }, (_, index) => (
              <g key={index}>
                <line x1={toX(index)} x2={toX(index)} y1={PAD} y2={HEIGHT - PAD} className="chart-grid" />
                <line x1={PAD} x2={WIDTH - PAD} y1={toY(index)} y2={toY(index)} className="chart-grid" />
              </g>
            ))}
            <circle cx={toX(query.x)} cy={toY(query.y)} r={(radius / 10) * (WIDTH - PAD * 2)} className="knn-radius" />
            {result.neighbours.map((point, index) => (
              <line key={`line-${index}`} x1={toX(query.x)} y1={toY(query.y)} x2={toX(point.x)} y2={toY(point.y)} className="neighbour-link" />
            ))}
            {points.map((point, index) => {
              const selected = neighbourSet.has(`${point.x}-${point.y}-${point.label}`);
              return (
                <g key={`${point.x}-${point.y}-${index}`} onDoubleClick={() => setPoints((current) => current.filter((_, i) => i !== index))}>
                  {selected ? <circle cx={toX(point.x)} cy={toY(point.y)} r="12" className={`neighbor-halo class-${point.label.toLowerCase()}`} /> : null}
                  <circle cx={toX(point.x)} cy={toY(point.y)} r="6" className={`knn-point class-${point.label.toLowerCase()}`} />
                </g>
              );
            })}
            <g
              className={`query-point prediction-${result.label.toLowerCase()}`}
              role="slider"
              tabIndex={0}
              aria-label={`Query point. Current x ${query.x.toFixed(1)}, y ${query.y.toFixed(1)}. Predicted class ${result.label}.`}
              aria-valuetext={`x ${query.x.toFixed(1)}, y ${query.y.toFixed(1)}, class ${result.label}`}
              onPointerDown={(event) => { event.stopPropagation(); setDraggingQuery(true); event.currentTarget.setPointerCapture(event.pointerId); }}
              onKeyDown={(event) => {
                const step = event.shiftKey ? 0.5 : 0.1;
                const deltas: Record<string, [number, number]> = {
                  ArrowUp: [0, step], ArrowDown: [0, -step], ArrowLeft: [-step, 0], ArrowRight: [step, 0],
                };
                const delta = deltas[event.key];
                if (!delta) return;
                event.preventDefault();
                nudgeQuery(delta[0], delta[1]);
              }}
            >
              <circle cx={toX(query.x)} cy={toY(query.y)} r="15" className="query-ring" />
              <circle cx={toX(query.x)} cy={toY(query.y)} r="5" className="query-core" />
            </g>
          </svg>
        </div>

        <aside className="lab-panel">
          <div className="prediction-card">
            <span>Predicted class</span>
            <strong className={`prediction-label class-${result.label.toLowerCase()}`}>{result.label}</strong>
            <small>{Math.round(result.confidence * 100)}% of the {result.neighbours.length} nearest neighbours agree</small>
          </div>
          <div className="control-stack">
            <label>
              <span>K neighbours <strong>{k}</strong></span>
              <input type="range" min="1" max={Math.min(11, points.length)} step="2" value={k} onChange={(event) => setK(Number(event.target.value))} />
            </label>
          </div>
          <div className="vote-list">
            {result.neighbours.map((item, index) => (
              <div key={`${item.x}-${item.y}-${index}`}><span>{index + 1}</span><b className={`class-${item.label.toLowerCase()}`}>Class {item.label}</b><small>d = {item.distance.toFixed(2)}</small></div>
            ))}
          </div>
          <div className="insight-card"><span className="insight-card__icon">i</span><p><strong>Try this:</strong> increase K and move the query near the boundary. Notice how a smoother neighbourhood can override a very close minority point.</p></div>
        </aside>
      </div>
    </div>
  );
}
