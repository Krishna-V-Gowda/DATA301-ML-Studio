'use client';

import { useMemo, useState } from 'react';
import { classificationMetrics } from '@/lib/ml/metrics';

const defaults = { tp: 42, fp: 8, fn: 12, tn: 58 };
const controls = [
  { key: 'tp', label: 'True positives', description: 'Correctly predicted positive' },
  { key: 'fp', label: 'False positives', description: 'Incorrectly predicted positive' },
  { key: 'fn', label: 'False negatives', description: 'Missed positive cases' },
  { key: 'tn', label: 'True negatives', description: 'Correctly predicted negative' },
] as const;

export function ConfusionMatrixLab() {
  const [counts, setCounts] = useState(defaults);
  const metrics = useMemo(() => classificationMetrics(counts), [counts]);
  const format = (value: number) => `${(value * 100).toFixed(1)}%`;

  return (
    <div className="lab-shell">
      <div className="lab-toolbar">
        <div className="segmented" aria-label="Scenario presets">
          <button type="button" onClick={() => setCounts({ tp: 70, fp: 24, fn: 6, tn: 100 })}>Screening</button>
          <button type="button" onClick={() => setCounts(defaults)}>Balanced</button>
          <button type="button" onClick={() => setCounts({ tp: 36, fp: 3, fn: 20, tn: 81 })}>Low false alarms</button>
        </div>
        <button className="button button--quiet" type="button" onClick={() => setCounts(defaults)}>Reset</button>
      </div>
      <div className="metrics-layout">
        <div className="matrix-card">
          <div className="matrix-label matrix-label--top">Predicted</div>
          <div className="matrix-label matrix-label--side">Actual</div>
          <div className="confusion-matrix">
            <div className="matrix-corner" />
            <div className="matrix-head">Positive</div>
            <div className="matrix-head">Negative</div>
            <div className="matrix-head matrix-row-head">Positive</div>
            <div className="matrix-cell matrix-cell--good"><span>TP</span><strong>{counts.tp}</strong><small>found positives</small></div>
            <div className="matrix-cell matrix-cell--bad"><span>FN</span><strong>{counts.fn}</strong><small>missed positives</small></div>
            <div className="matrix-head matrix-row-head">Negative</div>
            <div className="matrix-cell matrix-cell--warn"><span>FP</span><strong>{counts.fp}</strong><small>false alarms</small></div>
            <div className="matrix-cell matrix-cell--good"><span>TN</span><strong>{counts.tn}</strong><small>correct rejections</small></div>
          </div>
        </div>

        <div className="metrics-side">
          <div className="metric-score-grid">
            <div><span>Accuracy</span><strong>{format(metrics.accuracy)}</strong><small>overall correctness</small></div>
            <div><span>Precision</span><strong>{format(metrics.precision)}</strong><small>positive prediction quality</small></div>
            <div><span>Recall</span><strong>{format(metrics.recall)}</strong><small>positive coverage</small></div>
            <div><span>F1 score</span><strong>{format(metrics.f1)}</strong><small>precision–recall balance</small></div>
          </div>
          <div className="control-stack matrix-controls">
            {controls.map((control) => (
              <label key={control.key}>
                <span>{control.label} <strong>{counts[control.key]}</strong></span>
                <small>{control.description}</small>
                <input type="range" min="0" max="100" value={counts[control.key]} onChange={(event) => setCounts((current) => ({ ...current, [control.key]: Number(event.target.value) }))} />
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="metric-explanations">
        <article><span>Precision</span><code>TP / (TP + FP)</code><p>Use it when false alarms are especially costly.</p></article>
        <article><span>Recall</span><code>TP / (TP + FN)</code><p>Use it when missing a positive case is especially costly.</p></article>
        <article><span>F1</span><code>2PR / (P + R)</code><p>Use it when both precision and recall need attention.</p></article>
      </div>
    </div>
  );
}
