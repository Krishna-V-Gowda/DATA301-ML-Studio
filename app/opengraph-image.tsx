import { ImageResponse } from 'next/og';

export const alt = 'DATA301 Machine Learning Studio at Vidyashilp University';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        background: '#f6f2e8',
        color: '#13202a',
        padding: '62px 72px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: 405,
          height: '100%',
          display: 'flex',
          background: '#0f2838',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 46,
          top: 52,
          width: 312,
          height: 526,
          display: 'flex',
          border: '1px solid rgba(251,249,243,.28)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 78,
          top: 88,
          width: 248,
          height: 330,
          display: 'flex',
          backgroundImage:
            'linear-gradient(rgba(251,249,243,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(251,249,243,.12) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
        }}
      />
      <svg
        width="252"
        height="190"
        viewBox="0 0 252 190"
        style={{ position: 'absolute', right: 76, top: 148 }}
      >
        <path
          d="M12 162 C52 146 80 136 112 116 C148 94 176 66 238 25"
          fill="none"
          stroke="#76aee0"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M12 174 C54 158 82 148 114 128 C150 106 178 78 238 37"
          fill="none"
          stroke="#e6a158"
          strokeWidth="3"
          strokeDasharray="8 8"
        />
        {[42, 80, 118, 156, 194, 224].map((x, index) => (
          <circle key={x} cx={x} cy={150 - index * 20} r="7" fill="#fbf9f3" />
        ))}
      </svg>
      <div
        style={{
          position: 'absolute',
          right: 78,
          bottom: 78,
          width: 248,
          display: 'flex',
          flexDirection: 'column',
          gap: 9,
          color: '#fbf9f3',
        }}
      >
        <span style={{ fontSize: 14, letterSpacing: 3, fontWeight: 800 }}>LIVE COURSE SYSTEM</span>
        <span style={{ fontSize: 22, lineHeight: 1.3 }}>Concept → experiment → explanation</span>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: 700,
          height: '100%',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ width: 34, height: 2, display: 'flex', background: '#1f5cb6' }} />
          <span style={{ fontSize: 18, letterSpacing: 4, fontWeight: 800 }}>VIDYASHILP UNIVERSITY · DATA301</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 18 }}>
          <span
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 90,
              lineHeight: .92,
              letterSpacing: -5,
            }}
          >
            Machine learning,
          </span>
          <span
            style={{
              marginTop: 12,
              color: '#b51e3b',
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              fontSize: 88,
              lineHeight: .92,
              letterSpacing: -5,
            }}
          >
            made visible.
          </span>
        </div>
        <div style={{ display: 'flex', gap: 28, fontSize: 16, letterSpacing: 1, color: '#47545d' }}>
          <span>12 interactive labs</span>
          <span>30 lecture sessions</span>
          <span>4 connected modules</span>
        </div>
      </div>
    </div>,
    size,
  );
}
