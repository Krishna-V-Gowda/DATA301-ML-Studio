export function HeroDecisionField() {
  const points = [
    [76, 260, 'a'], [116, 225, 'a'], [149, 245, 'a'], [170, 196, 'a'], [213, 218, 'a'],
    [244, 174, 'a'], [281, 194, 'a'], [315, 149, 'a'], [352, 165, 'a'], [388, 120, 'a'],
    [113, 116, 'b'], [145, 93, 'b'], [188, 126, 'b'], [229, 84, 'b'], [270, 111, 'b'],
    [307, 72, 'b'], [348, 96, 'b'], [393, 58, 'b'], [428, 82, 'b'], [455, 44, 'b'],
  ] as const;

  return (
    <div className="decision-field" aria-label="Animated illustration of a machine-learning decision boundary">
      <div className="decision-field__label">
        <span className="status-dot" />
        Interactive thinking
      </div>
      <svg viewBox="0 0 520 340" role="img" aria-labelledby="decision-title decision-desc">
        <title id="decision-title">Decision boundary visualization</title>
        <desc id="decision-desc">Two groups of data points separated by a learned curved boundary.</desc>
        <defs>
          <pattern id="minorGrid" width="26" height="26" patternUnits="userSpaceOnUse">
            <path d="M 26 0 L 0 0 0 26" fill="none" className="field-grid-minor" />
          </pattern>
          <pattern id="majorGrid" width="104" height="104" patternUnits="userSpaceOnUse">
            <rect width="104" height="104" fill="url(#minorGrid)" />
            <path d="M 104 0 L 0 0 0 104" fill="none" className="field-grid-major" />
          </pattern>
          <linearGradient id="fieldGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" className="field-glow-start" />
            <stop offset="1" className="field-glow-end" />
          </linearGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect x="0" y="0" width="520" height="340" rx="22" className="field-bg" />
        <rect x="0" y="0" width="520" height="340" rx="22" fill="url(#majorGrid)" />
        <path
          d="M 18 295 C 94 270, 118 199, 192 181 C 261 164, 306 144, 353 115 C 411 79, 455 67, 502 22"
          fill="none"
          className="field-boundary-glow"
          strokeWidth="13"
          opacity=".18"
        />
        <path
          d="M 18 295 C 94 270, 118 199, 192 181 C 261 164, 306 144, 353 115 C 411 79, 455 67, 502 22"
          fill="none"
          className="field-boundary"
          strokeWidth="3"
          strokeDasharray="8 8"
        />
        <path
          d="M 22 307 C 95 284, 133 220, 202 198 C 266 177, 316 153, 363 125 C 421 90, 466 76, 510 36 L510 330 L22 330 Z"
          fill="url(#fieldGlow)"
          opacity=".18"
        />
        {points.map(([x, y, group], index) => (
          <g key={`${x}-${y}`} className={`field-point field-point--${group}`} style={{ animationDelay: `${index * 55}ms` }}>
            <circle cx={x} cy={y} r="8" opacity=".14" filter="url(#softGlow)" />
            <circle cx={x} cy={y} r="4.4" />
          </g>
        ))}
        <g className="field-query">
          <circle cx="265" cy="150" r="15" fill="none" strokeWidth="1.5" strokeDasharray="3 4" />
          <circle cx="265" cy="150" r="5" />
          <path d="M281 143h42" />
          <rect x="323" y="128" width="102" height="31" rx="8" className="field-tooltip" />
          <text x="337" y="148">P(class B) .87</text>
        </g>
        <text x="20" y="28" className="field-axis-label">feature₂</text>
        <text x="432" y="321" className="field-axis-label">feature₁</text>
      </svg>
      <div className="decision-field__metrics">
        <span><strong>87%</strong> confidence</span>
        <span><strong>0.14</strong> loss</span>
        <span><strong>18</strong> samples</span>
      </div>
    </div>
  );
}
