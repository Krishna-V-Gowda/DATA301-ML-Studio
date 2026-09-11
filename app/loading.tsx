export default function Loading() {
  return (
    <main className="route-loading" aria-busy="true" aria-live="polite">
      <div className="route-loading__inner">
        <span className="route-loading__mark" aria-hidden="true" />
        <div>
          <strong>Preparing the learning environment</strong>
          <span>Loading course structure and published material…</span>
        </div>
      </div>
    </main>
  );
}
