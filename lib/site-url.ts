function normalizeUrl(value: string) {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  const normalized = withProtocol.replace(/\/$/, '');
  const parsed = new URL(normalized);
  if (
    !['http:', 'https:'].includes(parsed.protocol)
    || parsed.username
    || parsed.password
    || parsed.pathname !== '/'
    || parsed.search
    || parsed.hash
  ) {
    throw new Error('NEXT_PUBLIC_SITE_URL must be an http(s) origin without credentials or a path.');
  }
  return normalized;
}

export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit && !explicit.includes('YOUR_')) {
    const normalized = normalizeUrl(explicit);
    if (process.env.VERCEL === '1' && /^(localhost|127\.0\.0\.1)$/i.test(new URL(normalized).hostname)) {
      throw new Error('A public canonical site URL is required in production; localhost is not permitted.');
    }
    return normalized;
  }

  const production = (
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
    || process.env.VERCEL_PROJECT_PRODUCTION_URL
  )?.trim();
  if (production) return normalizeUrl(production);

  const deployment = (
    process.env.NEXT_PUBLIC_VERCEL_URL
    || process.env.VERCEL_URL
  )?.trim();
  if (deployment) return normalizeUrl(deployment);

  if (process.env.VERCEL === '1') {
    throw new Error('A canonical production site URL is required for robots and sitemap generation.');
  }

  return 'http://localhost:3000';
}
