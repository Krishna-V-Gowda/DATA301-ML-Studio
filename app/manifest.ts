import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DATA301 Machine Learning Studio',
    short_name: 'DATA301 ML',
    description: 'Visual lessons, interactive labs, projects, and course resources for DATA301.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f4ef',
    theme_color: '#07182e',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/icon-maskable.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
    ],
  };
}
