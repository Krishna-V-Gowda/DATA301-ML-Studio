'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
          <section style={{ width: 'min(100%, 560px)', padding: '32px', border: '1px solid #d9dee7', borderRadius: '20px', background: '#fff', boxShadow: '0 20px 70px rgba(8, 19, 33, .12)' }}>
            <p style={{ margin: '0 0 8px', color: '#3157d5', fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', fontSize: '12px' }}>DATA301 Machine Learning Studio</p>
            <h1 style={{ margin: '0 0 12px', fontSize: '34px' }}>The application needs a fresh start.</h1>
            <p style={{ color: '#5f6d80', lineHeight: 1.7 }}>No course content was changed. Reload the application and try the request again.</p>
            <button type="button" onClick={reset} style={{ marginTop: '12px', minHeight: '44px', padding: '10px 18px', border: 0, borderRadius: '10px', background: '#3157d5', color: '#fff', cursor: 'pointer', fontWeight: 800 }}>Reload application</button>
          </section>
        </main>
      </body>
    </html>
  );
}
