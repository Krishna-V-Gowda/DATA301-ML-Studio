'use client';

import { useMemo, useState } from 'react';
import {
  collectSplitSegments,
  decisionTreeAccuracy,
  decisionTreeStats,
  predictDecisionTree,
  trainDecisionTree,
  type LabeledPoint2D,
} from '@/lib/ml/decision-tree';

const WIDTH = 680;
const HEIGHT = 430;
const PAD_X = 48;
const PAD_TOP = 28;
const PAD_BOTTOM = 52;
const MIN = -3.5;
const MAX = 3.5;
const toX = (x: number) => PAD_X + ((x - MIN) / (MAX - MIN)) * (WIDTH - PAD_X * 2);
const toY = (y: number) => HEIGHT - PAD_BOTTOM - ((y - MIN) / (MAX - MIN)) * (HEIGHT - PAD_TOP - PAD_BOTTOM);

const clean: LabeledPoint2D[] = [
  { x: -2.8, y: -2.1, label: 0 }, { x: -2.4, y: -1.2, label: 0 }, { x: -1.8, y: -2.7, label: 0 },
  { x: -1.3, y: -1.4, label: 0 }, { x: 1.0, y: 1.2, label: 1 }, { x: 1.6, y: 2.4, label: 1 },
  { x: 2.2, y: 1.0, label: 1 }, { x: 2.8, y: 2.6, label: 1 },
  { x: -2.7, y: 2.4, label: 0 }, { x: -2.1, y: 1.1, label: 0 }, { x: -1.2, y: 2.8, label: 0 },
  { x: -0.7, y: 1.5, label: 0 }, { x: 0.8, y: -1.2, label: 0 }, { x: 1.5, y: -2.6, label: 0 },
  { x: 2.2, y: -1.0, label: 0 }, { x: 2.9, y: -2.4, label: 0 },
];

const presets: Record<string, { label: string; copy: string; points: LabeledPoint2D[] }> = {
  staged: { label: 'Two-stage rule', copy: 'A single split is not enough: the positive class requires x₁ to be high and x₂ to be above the second threshold.', points: clean },
  noisy: {
    label: 'Noisy labels',
    copy: 'Two deliberately flipped labels show how extra depth can memorize exceptions.',
    points: clean.map((point, index) => ({ ...point, label: index === 2 || index === 13 ? (1 - point.label) as 0 | 1 : point.label })),
  },
  simple: {
    label: 'One clear split',
    copy: 'A shallow tree is enough when one feature cleanly separates the classes.',
    points: clean.map((point) => ({ ...point, label: point.x > 0 ? 1 : 0 })),
  },
};

function TreeSummary({ node, prefix = 'Root', limit = 7 }: { node: ReturnType<typeof trainDecisionTree>; prefix?: string; limit?: number }) {
  const rows: Array<{ key: string; text: string }> = [];
  function visit(current: ReturnType<typeof trainDecisionTree>, path: string) {
    if (rows.length >= limit) return;
    if (current.split) {
      rows.push({ key: path, text: `${path}: ${current.split.feature} ≤ ${current.split.threshold.toFixed(2)} · gain ${current.split.gain.toFixed(3)}` });
      visit(current.split.left, `${path}L`);
      visit(current.split.right, `${path}R`);
    } else {
      rows.push({ key: path, text: `${path}: predict class ${current.prediction} · n=${current.samples}` });
    }
  }
  visit(node, prefix);
  return <div className="tree-summary" aria-label="Learned tree structure">{rows.map((row) => <div key={row.key}>{row.text}</div>)}</div>;
}

export function DecisionTreeLab() {
  const [preset, setPreset] = useState<keyof typeof presets>('staged');
  const [maxDepth, setMaxDepth] = useState(2);
  const [minLeaf, setMinLeaf] = useState(1);
  const points = presets[preset].points;
  const tree = useMemo(() => trainDecisionTree(points, { maxDepth, minLeaf }), [maxDepth, minLeaf, points]);
  const stats = decisionTreeStats(tree);
  const accuracy = decisionTreeAccuracy(tree, points);
  const segments = collectSplitSegments(tree, { xMin: MIN, xMax: MAX, yMin: MIN, yMax: MAX });
  const grid = useMemo(() => {
    const columns = 30;
    const rows = 22;
    return Array.from({ length: columns * rows }, (_, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const x = MIN + ((column + 0.5) / columns) * (MAX - MIN);
      const y = MIN + ((row + 0.5) / rows) * (MAX - MIN);
      return { column, row, x, y, prediction: predictDecisionTree(tree, { x, y }), columns, rows };
    });
  }, [tree]);

  const interpretation = maxDepth === 1 && accuracy < 0.9
    ? 'The tree is underfitting: one question is not flexible enough for this geometry.'
    : preset === 'noisy' && maxDepth >= 4 && accuracy > 0.95
      ? 'The deep tree is fitting exceptional labels. High training accuracy does not guarantee better performance on new data.'
      : 'The tree is using only the splits that reduce impurity enough to justify another branch.';

  function reset() {
    setPreset('staged');
    setMaxDepth(2);
    setMinLeaf(1);
  }

  return (
    <div className="lab-shell">
      <div className="lab-toolbar">
        <div className="segmented" aria-label="Decision-tree dataset preset">
          {(Object.keys(presets) as Array<keyof typeof presets>).map((key) => <button type="button" className={preset === key ? 'is-active' : ''} onClick={() => setPreset(key)} key={key}>{presets[key].label}</button>)}
        </div>
        <button className="button button--quiet" type="button" onClick={reset}>Reset</button>
        <span className="lab-state-pill">{Math.round(accuracy * 100)}% training accuracy</span>
      </div>

      <div className="lab-grid lab-grid--chart">
        <div className="lab-chart-card">
          <div className="chart-instruction">Each background region is a leaf prediction. Split lines show the recursive questions learned from the data.</div>
          <svg className="interactive-chart" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`Decision tree with maximum depth ${maxDepth}, ${stats.leaves} leaves, and ${(accuracy * 100).toFixed(1)} percent training accuracy.`}>
            <rect x={PAD_X} y={PAD_TOP} width={WIDTH - PAD_X * 2} height={HEIGHT - PAD_TOP - PAD_BOTTOM} rx="15" className="chart-bg" />
            {grid.map((cell) => {
              const cellWidth = (WIDTH - PAD_X * 2) / cell.columns;
              const cellHeight = (HEIGHT - PAD_TOP - PAD_BOTTOM) / cell.rows;
              return <rect key={`${cell.column}-${cell.row}`} x={PAD_X + cell.column * cellWidth} y={PAD_TOP + (cell.rows - cell.row - 1) * cellHeight} width={cellWidth + 0.4} height={cellHeight + 0.4} className={`decision-region decision-region--${cell.prediction}`} />;
            })}
            {[-3, -2, -1, 0, 1, 2, 3].map((value) => <g key={value}><line x1={toX(value)} y1={PAD_TOP} x2={toX(value)} y2={HEIGHT - PAD_BOTTOM} className="chart-grid chart-grid--soft" /><line x1={PAD_X} y1={toY(value)} x2={WIDTH - PAD_X} y2={toY(value)} className="chart-grid chart-grid--soft" /></g>)}
            {segments.map((segment, index) => <line key={`${segment.feature}-${segment.threshold}-${index}`} x1={toX(segment.x1)} x2={toX(segment.x2)} y1={toY(segment.y1)} y2={toY(segment.y2)} className={`tree-split tree-split--depth-${Math.min(3, segment.depth)}`} />)}
            {points.map((point, index) => <g key={`${point.x}-${point.y}-${index}`}><circle cx={toX(point.x)} cy={toY(point.y)} r="8" className={`tree-point tree-point--${point.label}`} /><text x={toX(point.x)} y={toY(point.y) + 3} textAnchor="middle" className="tree-point-label">{point.label}</text></g>)}
            <text x={WIDTH / 2} y={HEIGHT - 6} textAnchor="middle" className="chart-axis-label">feature x₁</text>
            <text x="14" y={HEIGHT / 2} textAnchor="middle" className="chart-axis-label" transform={`rotate(-90 14 ${HEIGHT / 2})`}>feature x₂</text>
          </svg>
        </div>

        <aside className="lab-panel">
          <div className="lab-panel__header"><span className="eyebrow">Recursive partitioning</span><h2>Choose the split that reduces Gini impurity.</h2></div>
          <p className="panel-copy">{presets[preset].copy}</p>
          <div className="control-stack">
            <label><span>Maximum depth <strong>{maxDepth}</strong></span><small>Limits how many questions can be asked along a path.</small><input type="range" min="1" max="5" step="1" value={maxDepth} onChange={(event) => setMaxDepth(Number(event.target.value))} /></label>
            <label><span>Minimum samples per leaf <strong>{minLeaf}</strong></span><small>Larger leaves regularize the tree.</small><input type="range" min="1" max="4" step="1" value={minLeaf} onChange={(event) => setMinLeaf(Number(event.target.value))} /></label>
          </div>
          <div className="metric-grid">
            <div><span>Training accuracy</span><strong>{(accuracy * 100).toFixed(1)}%</strong></div>
            <div><span>Actual depth</span><strong>{stats.depth}</strong></div>
            <div><span>Leaves</span><strong>{stats.leaves}</strong></div>
            <div><span>Tree nodes</span><strong>{stats.nodes}</strong></div>
          </div>
          <TreeSummary node={tree} />
          <div className="insight-card"><span className="insight-card__icon">i</span><p>{interpretation}</p></div>
        </aside>
      </div>
    </div>
  );
}
