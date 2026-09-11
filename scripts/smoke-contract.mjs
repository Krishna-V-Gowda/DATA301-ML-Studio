export const publicRoutes = [
  '/',
  '/course',
  '/learn',
  '/learn/module/introduction-and-data',
  '/learn/module/supervised-learning',
  '/labs',
  '/projects',
  '/resources',
  '/search',
  '/about',
];

export function normalizeSmokeBase(value) {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return withProtocol.replace(/\/$/, '');
}

export function routeIdentityPassed({ requestedPath, response, html }) {
  if (!response.ok || !html.includes('<main')) return false;

  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1];
  if (canonical && !canonical.endsWith(requestedPath || '/')) return false;

  const heading = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim();
  return Boolean(heading);
}

export function searchPayloadPassed(payload) {
  return Boolean(
    payload
    && Number.isInteger(payload.count)
    && Array.isArray(payload.results)
    && payload.count === payload.results.length
    && payload.results.every((item) => item && typeof item.href === 'string' && typeof item.type === 'string')
    && payload.results.some((item) => item.href === '/learn/module/supervised-learning')
    && payload.results.some((item) => item.href === '/topics/supervised-learning'),
  );
}

export function originPayloadPassed(body, expectedBase) {
  const hasExpectedOrigin = body.includes(expectedBase);
  const hasLocalhost = /https?:\/\/localhost(?::\d+)?/i.test(body);
  return hasExpectedOrigin && !hasLocalhost;
}

export function materialPrivacyPassed({ publicHtml, publicRouteStatus, coursePlanId }) {
  return !publicHtml.includes(`/api/materials/${coursePlanId}`) && publicRouteStatus === 404;
}