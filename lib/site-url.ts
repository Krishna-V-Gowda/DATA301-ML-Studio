function normalizeUrl(value: string) {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return withProtocol.replace(/\/$/, '');
}

export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit && !explicit.includes('YOUR_')) return normalizeUrl(explicit);

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

  return 'http://localhost:3000';
}
