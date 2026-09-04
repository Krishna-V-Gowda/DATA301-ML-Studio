import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main-content" className="not-found shell">
      <span className="eyebrow">404 · Off the learning path</span>
      <h1>This concept is not mapped yet.</h1>
      <p>The page may have moved, or the topic may still be awaiting publication.</p>
      <Link className="button button--primary" href="/learn">Return to the roadmap</Link>
    </main>
  );
}
