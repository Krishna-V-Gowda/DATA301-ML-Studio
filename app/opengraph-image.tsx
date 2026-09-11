import { ImageResponse } from 'next/og';

export const alt = 'DATA301 Machine Learning Studio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{
      width: '100%', height: '100%', display: 'flex', position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(125deg, #06111f, #0b2c52)', color: 'white',
      fontFamily: 'Arial, sans-serif', padding: '72px 84px',
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: .17, backgroundImage: 'linear-gradient(rgba(255,255,255,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.25) 1px, transparent 1px)', backgroundSize: '54px 54px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', width: '72%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#aebfe0', fontSize: 24, textTransform: 'uppercase', letterSpacing: 4 }}>
          <span style={{ border: '1px solid rgba(255,255,255,.25)', borderRadius: 10, padding: '8px 12px', color: 'white' }}>DATA301</span>
          Vidyashilp University
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 82, fontWeight: 750, letterSpacing: -5, lineHeight: 1.02 }}>Machine Learning Studio</div>
          <div style={{ marginTop: 24, color: '#a9bcff', fontSize: 36 }}>From intuition to implementation.</div>
        </div>
        <div style={{ color: '#b4c4d8', fontSize: 23 }}>Visual lessons · Interactive labs · Course materials · Projects</div>
      </div>
      <div style={{ position: 'absolute', width: 430, height: 430, right: -90, top: 70, border: '2px solid rgba(148,174,255,.32)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', width: 280, height: 280, right: -15, top: 145, border: '2px solid rgba(148,174,255,.32)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', width: 130, height: 130, right: 60, top: 220, background: '#3157d5', borderRadius: '50%', boxShadow: '0 0 80px rgba(49,87,213,.7)' }} />
    </div>,
    size,
  );
}
