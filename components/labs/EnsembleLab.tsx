'use client';

import { useMemo, useState } from 'react';
import { forestAccuracy, forestVote, trainBaggedForest } from '@/lib/ml/ensemble';
import { decisionTreeAccuracy, predictDecisionTree, type LabeledPoint2D } from '@/lib/ml/decision-tree';

const CHART = 310;
const PAD = 30;
const MIN = -3.2;
const MAX = 3.2;
const toX = (x: number) => PAD + ((x - MIN) / (MAX - MIN)) * (CHART - PAD * 2);
const toY = (y: number) => CHART - PAD - ((y - MIN) / (MAX - MIN)) * (CHART - PAD * 2);

function makeDataset(noisy: boolean): LabeledPoint2D[] {
  const points: LabeledPoint2D[] = [];
  for (let index = 0; index < 36; index += 1) {
    const inner = index % 2 === 0;
    const angle = (index / 36) * Math.PI * 2 + (index % 5) * .035;
    const radius = inner ? 1.05 + (index % 4) * .12 : 2.25 + (index % 3) * .18;
    let label: 0 | 1 = inner ? 1 : 0;
    if (noisy && [7, 18, 29].includes(index)) label = (1 - label) as 0 | 1;
    points.push({ x: radius * Math.cos(angle), y: radius * Math.sin(angle), label });
  }
  return points;
}

const presets = {
  clean: { label: 'Curved boundary', copy: 'Many shallow axis-aligned trees combine to approximate a circular decision boundary.', points: makeDataset(false) },
  noisy: { label: 'Noisy samples', copy: 'Bootstrap diversity makes individual trees disagree, while majority voting stabilizes the final region.', points: makeDataset(true) },
};

function DecisionChart({
  title,
  points,
  predict,
  query,
  queryLabel,
}: {
  title: string;
  points: LabeledPoint2D[];
  predict: (point: { x: number; y: number }) => { label: 0 | 1; confidence: number };
  query: { x: number; y: number };
  queryLabel: string;
}) {
  const columns = 22; const rows = 22;
  const cells = Array.from({ length: columns * rows }, (_, index) => {
    const column = index % columns; const row = Math.floor(index / columns);
    const x = MIN + ((column + .5) / columns) * (MAX - MIN);
    const y = MIN + ((row + .5) / rows) * (MAX - MIN);
    return { column, row, ...predict({ x, y }) };
  });
  return (
    <div className="ensemble-chart"><strong>{title}</strong><svg viewBox={`0 0 ${CHART} ${CHART}`} role="img" aria-label={`${title}. Query point predicted ${queryLabel}.`}>
      <rect x={PAD} y={PAD} width={CHART - PAD * 2} height={CHART - PAD * 2} rx="12" className="chart-bg" />
      {cells.map((cell) => { const width = (CHART - PAD * 2) / columns; const height = (CHART - PAD * 2) / rows; return <rect key={`${cell.column}-${cell.row}`} x={PAD + cell.column * width} y={PAD + (rows - cell.row - 1) * height} width={width + .4} height={height + .4} className={`ensemble-region ensemble-region--${cell.label}`} opacity={.18 + cell.confidence * .42} />; })}
      {points.map((point, index) => <circle key={`${point.x}-${point.y}-${index}`} cx={toX(point.x)} cy={toY(point.y)} r="5.5" className={`ensemble-point ensemble-point--${point.label}`} />)}
      <g className="query-marker"><circle cx={toX(query.x)} cy={toY(query.y)} r="11" /><line x1={toX(query.x) - 6} y1={toY(query.y)} x2={toX(query.x) + 6} y2={toY(query.y)} /><line x1={toX(query.x)} y1={toY(query.y) - 6} x2={toX(query.x)} y2={toY(query.y) + 6} /></g>
      <text x={CHART / 2} y={CHART - 4} textAnchor="middle" className="chart-axis-label">x₁</text><text x="11" y={CHART / 2} textAnchor="middle" className="chart-axis-label" transform={`rotate(-90 11 ${CHART / 2})`}>x₂</text>
    </svg></div>
  );
}

export function EnsembleLab() {
  const [preset, setPreset] = useState<keyof typeof presets>('noisy');
  const [treeCount, setTreeCount] = useState(11);
  const [depth, setDepth] = useState(3);
  const [query, setQuery] = useState({ x: 1.2, y: .4 });
  const points = presets[preset].points;
  const forest = useMemo(() => trainBaggedForest(points, 21, depth, preset === 'clean' ? 301 : 917), [depth, points, preset]);
  const individual = forest.trees[0];
  const individualAccuracy = decisionTreeAccuracy(individual, points);
  const ensembleAccuracy = forestAccuracy(forest, points, treeCount);
  const averageAccuracy = forest.individualAccuracy.slice(0, treeCount).reduce((sum, value) => sum + value, 0) / treeCount;
  const queryVote = forestVote(forest, query, treeCount);
  const individualQuery = predictDecisionTree(individual, query);

  function reset() { setPreset('noisy'); setTreeCount(11); setDepth(3); setQuery({ x: 1.2, y: .4 }); }

  return (
    <div className="lab-shell">
      <div className="lab-toolbar">
        <div className="segmented" aria-label="Ensemble dataset preset">{(Object.keys(presets) as Array<keyof typeof presets>).map((key) => <button type="button" className={preset === key ? 'is-active' : ''} onClick={() => setPreset(key)} key={key}>{presets[key].label}</button>)}</div>
        <button className="button button--quiet" type="button" onClick={reset}>Reset</button>
        <span className="lab-state-pill">{treeCount} tree votes</span>
      </div>
      <div className="lab-grid lab-grid--chart">
        <div className="lab-chart-card">
          <div className="chart-instruction">Compare one bootstrap-trained tree with the majority vote. Darker ensemble regions mean stronger agreement.</div>
          <div className="dual-ensemble-charts">
            <DecisionChart title={`Individual tree · ${(individualAccuracy * 100).toFixed(0)}%`} points={points} predict={(point) => ({ label: predictDecisionTree(individual, point), confidence: 1 })} query={query} queryLabel={`class ${individualQuery}`} />
            <DecisionChart title={`Bagged ensemble · ${(ensembleAccuracy * 100).toFixed(0)}%`} points={points} predict={(point) => { const vote = forestVote(forest, point, treeCount); return { label: vote.prediction, confidence: vote.confidence }; }} query={query} queryLabel={`class ${queryVote.prediction}`} />
          </div>
        </div>
        <aside className="lab-panel">
          <div className="lab-panel__header"><span className="eyebrow">Bagging and voting</span><h2>Aggregate unstable learners into a steadier model.</h2></div>
          <p className="panel-copy">{presets[preset].copy}</p>
          <div className="control-stack">
            <label><span>Ensemble size <strong>{treeCount}</strong></span><small>Each tree sees a different bootstrap sample.</small><input type="range" min="1" max="21" step="2" value={treeCount} onChange={(event) => setTreeCount(Number(event.target.value))} /></label>
            <label><span>Tree depth <strong>{depth}</strong></span><small>Shallow trees stay weak enough for aggregation to matter.</small><input type="range" min="1" max="4" step="1" value={depth} onChange={(event) => setDepth(Number(event.target.value))} /></label>
            <label><span>Query x₁ <strong>{query.x.toFixed(1)}</strong></span><input type="range" min={MIN} max={MAX} step=".1" value={query.x} onChange={(event) => setQuery((current) => ({ ...current, x: Number(event.target.value) }))} /></label>
            <label><span>Query x₂ <strong>{query.y.toFixed(1)}</strong></span><input type="range" min={MIN} max={MAX} step=".1" value={query.y} onChange={(event) => setQuery((current) => ({ ...current, y: Number(event.target.value) }))} /></label>
          </div>
          <div className="metric-grid"><div><span>Individual accuracy</span><strong>{(individualAccuracy * 100).toFixed(1)}%</strong></div><div><span>Ensemble accuracy</span><strong>{(ensembleAccuracy * 100).toFixed(1)}%</strong></div><div><span>Average tree</span><strong>{(averageAccuracy * 100).toFixed(1)}%</strong></div><div><span>Vote confidence</span><strong>{(queryVote.confidence * 100).toFixed(1)}%</strong></div></div>
          <div className="vote-card"><span>Query vote</span><strong>{queryVote.positiveVotes} class-1 · {queryVote.negativeVotes} class-0</strong><small>Final prediction: class {queryVote.prediction}. Individual tree: class {individualQuery}.</small></div>
          <div className="insight-card"><span className="insight-card__icon">i</span><p>Bagging mainly reduces variance: bootstrap-trained trees make different errors, and majority voting cancels many of them.</p></div>
        </aside>
      </div>
    </div>
  );
}
