'use client';

import { useMemo, useState } from 'react';
import { buildRocPrCurves, evaluateThreshold, type ScoredObservation } from '@/lib/ml/roc-pr';

const balanced: ScoredObservation[] = [
  { score: .96, label: 1 }, { score: .91, label: 1 }, { score: .84, label: 0 }, { score: .81, label: 1 },
  { score: .76, label: 1 }, { score: .70, label: 0 }, { score: .64, label: 1 }, { score: .58, label: 0 },
  { score: .53, label: 1 }, { score: .47, label: 0 }, { score: .41, label: 1 }, { score: .34, label: 0 },
  { score: .28, label: 0 }, { score: .20, label: 0 }, { score: .13, label: 0 }, { score: .07, label: 0 },
];

const imbalanced: ScoredObservation[] = [
  { score: .95, label: 1 }, { score: .86, label: 0 }, { score: .80, label: 1 }, { score: .74, label: 0 },
  { score: .69, label: 0 }, { score: .63, label: 0 }, { score: .58, label: 1 }, { score: .54, label: 0 },
  { score: .49, label: 0 }, { score: .45, label: 0 }, { score: .41, label: 0 }, { score: .37, label: 1 },
  { score: .34, label: 0 }, { score: .31, label: 0 }, { score: .27, label: 0 }, { score: .23, label: 0 },
  { score: .19, label: 0 }, { score: .15, label: 0 }, { score: .11, label: 0 }, { score: .07, label: 0 },
];

const presets = {
  balanced: { label: 'Balanced classes', copy: 'Positive and negative examples are similarly represented.', observations: balanced },
  imbalanced: { label: 'Imbalanced classes', copy: 'Only four of twenty observations are positive, making false alarms much more visible in precision.', observations: imbalanced },
};

const CHART = 280;
const PAD = 38;
const mapX = (value: number) => PAD + value * (CHART - PAD * 1.45);
const mapY = (value: number) => CHART - PAD - value * (CHART - PAD * 1.45);
const percent = (value: number) => `${(value * 100).toFixed(1)}%`;

function CurveChart({
  title,
  xLabel,
  yLabel,
  points,
  selected,
  baseline,
  diagonal = false,
}: {
  title: string;
  xLabel: string;
  yLabel: string;
  points: Array<{ x: number; y: number }>;
  selected: { x: number; y: number };
  baseline?: number;
  diagonal?: boolean;
}) {
  return (
    <div className="curve-chart">
      <strong>{title}</strong>
      <svg viewBox={`0 0 ${CHART} ${CHART}`} role="img" aria-label={`${title}. Selected point ${xLabel} ${selected.x.toFixed(2)}, ${yLabel} ${selected.y.toFixed(2)}.`}>
        <rect x={PAD} y={PAD / 2} width={CHART - PAD * 1.45} height={CHART - PAD * 1.5} rx="12" className="chart-bg" />
        {[0, .25, .5, .75, 1].map((value) => <g key={value}><line x1={mapX(value)} y1={PAD / 2} x2={mapX(value)} y2={CHART - PAD} className="chart-grid chart-grid--soft" /><line x1={PAD} y1={mapY(value)} x2={CHART - PAD * .45} y2={mapY(value)} className="chart-grid chart-grid--soft" /><text x={mapX(value)} y={CHART - 17} textAnchor="middle" className="chart-tick">{value.toFixed(2)}</text>{value > 0 ? <text x={PAD - 7} y={mapY(value) + 3} textAnchor="end" className="chart-tick">{value.toFixed(2)}</text> : null}</g>)}
        {diagonal ? <line x1={mapX(0)} y1={mapY(0)} x2={mapX(1)} y2={mapY(1)} className="chance-line" /> : null}
        {baseline !== undefined ? <line x1={mapX(0)} y1={mapY(baseline)} x2={mapX(1)} y2={mapY(baseline)} className="chance-line" /> : null}
        {points.slice(1).map((point, index) => <line key={`${point.x}-${point.y}-${index}`} x1={mapX(points[index].x)} y1={mapY(points[index].y)} x2={mapX(point.x)} y2={mapY(point.y)} className="curve-line" />)}
        <circle cx={mapX(selected.x)} cy={mapY(selected.y)} r="7" className="curve-selected" />
        <text x={CHART / 2} y={CHART - 2} textAnchor="middle" className="chart-axis-label">{xLabel}</text>
        <text x="12" y={CHART / 2} textAnchor="middle" className="chart-axis-label" transform={`rotate(-90 12 ${CHART / 2})`}>{yLabel}</text>
      </svg>
    </div>
  );
}

export function RocPrLab() {
  const [preset, setPreset] = useState<keyof typeof presets>('imbalanced');
  const [threshold, setThreshold] = useState(.55);
  const observations = presets[preset].observations;
  const metrics = useMemo(() => evaluateThreshold(observations, threshold), [observations, threshold]);
  const curves = useMemo(() => buildRocPrCurves(observations), [observations]);
  const prevalence = observations.filter((item) => item.label === 1).length / observations.length;

  function reset() { setPreset('imbalanced'); setThreshold(.55); }

  const interpretation = preset === 'imbalanced'
    ? `At this threshold, recall is ${percent(metrics.recall)} while precision is ${percent(metrics.precision)}. The PR view emphasizes how many predicted positives are actually useful.`
    : `The ROC and PR views are both informative here because neither class dominates the dataset.`;

  return (
    <div className="lab-shell">
      <div className="lab-toolbar">
        <div className="segmented" aria-label="Class-balance preset">{(Object.keys(presets) as Array<keyof typeof presets>).map((key) => <button type="button" className={preset === key ? 'is-active' : ''} onClick={() => setPreset(key)} key={key}>{presets[key].label}</button>)}</div>
        <button className="button button--quiet" type="button" onClick={reset}>Reset</button>
        <span className="lab-state-pill">Threshold {threshold.toFixed(2)}</span>
      </div>
      <div className="lab-grid lab-grid--chart">
        <div className="lab-chart-card">
          <div className="chart-instruction">Move one threshold and track the same operating point across both curves.</div>
          <div className="dual-curve-charts">
            <CurveChart title={`ROC · AUC ${curves.rocAuc.toFixed(3)}`} xLabel="False-positive rate" yLabel="True-positive rate" points={curves.roc} selected={{ x: metrics.fpr, y: metrics.tpr }} diagonal />
            <CurveChart title={`Precision–Recall · AUC ${curves.prAuc.toFixed(3)}`} xLabel="Recall" yLabel="Precision" points={curves.pr} selected={{ x: metrics.recall, y: metrics.precision }} baseline={prevalence} />
          </div>
          <div className="score-strip" role="img" aria-label={`Prediction scores with classification threshold ${threshold.toFixed(2)}. Positive labels are circles; negative labels are squares.`}>
            <span className="score-strip__threshold" style={{ left: `${threshold * 100}%` }}><i />threshold</span>
            {observations.map((item, index) => <span key={`${item.score}-${index}`} className={`score-dot score-dot--${item.label ? 'positive' : 'negative'}`} style={{ left: `${item.score * 100}%`, top: `${18 + (index % 4) * 13}px` }} />)}
          </div>
        </div>
        <aside className="lab-panel">
          <div className="lab-panel__header"><span className="eyebrow">Threshold evaluation</span><h2>One ranking, many operating points.</h2></div>
          <p className="panel-copy">{presets[preset].copy}</p>
          <div className="control-stack"><label><span>Classification threshold <strong>{threshold.toFixed(2)}</strong></span><small>Scores at or above this value become positive.</small><input type="range" min="0.05" max="0.95" step="0.01" value={threshold} onChange={(event) => setThreshold(Number(event.target.value))} /></label></div>
          <div className="metric-grid">
            <div><span>TPR / Recall</span><strong>{percent(metrics.tpr)}</strong></div><div><span>FPR</span><strong>{percent(metrics.fpr)}</strong></div>
            <div><span>Precision</span><strong>{percent(metrics.precision)}</strong></div><div><span>F1 score</span><strong>{percent(metrics.f1)}</strong></div>
          </div>
          <div className="compact-matrix" aria-label="Confusion matrix at selected threshold"><div><span>TP</span><strong>{metrics.tp}</strong></div><div><span>FN</span><strong>{metrics.fn}</strong></div><div><span>FP</span><strong>{metrics.fp}</strong></div><div><span>TN</span><strong>{metrics.tn}</strong></div></div>
          <div className="formula-card"><span>Class prevalence</span><strong>{percent(prevalence)}</strong><small>The dashed PR baseline equals the positive-class prevalence.</small></div>
          <div className="insight-card"><span className="insight-card__icon">i</span><p>{interpretation}</p></div>
        </aside>
      </div>
    </div>
  );
}
