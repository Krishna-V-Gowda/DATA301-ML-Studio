const INTERNAL_BASE = 'https://data301.internal';

/**
 * Convert an untrusted redirect candidate into a same-origin relative path.
 * Protocol-relative URLs, backslash variants, credentials, and external origins
 * are rejected rather than normalized into a redirect target.
 */
export function safeInternalPath(candidate: string | null | undefined, fallback = '/') {
  if (!candidate || !candidate.startsWith('/') || candidate.startsWith('//') || candidate.includes('\\')) {
    return fallback;
  }

  try {
    const base = new URL(INTERNAL_BASE);
    const parsed = new URL(candidate, base);
    if (parsed.origin !== base.origin || parsed.username || parsed.password) return fallback;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}

export function safeAdminPath(candidate: string | null | undefined) {
  const path = safeInternalPath(candidate, '/admin');
  return path === '/admin' || path.startsWith('/admin/') || path.startsWith('/admin?')
    ? path
    : '/admin';
}
