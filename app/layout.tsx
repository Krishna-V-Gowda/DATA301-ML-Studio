import type { Metadata, Viewport } from 'next';
import 'katex/dist/katex.min.css';
import './globals.css';
import { RecoveryRedirect } from '@/components/admin/RecoveryRedirect';
import { getSiteUrl } from '@/lib/site-url';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'DATA301 · Machine Learning Studio',
    template: '%s · DATA301',
  },
  description:
    'An independent machine-learning experimentation studio with visual lessons, interactive labs, reproducible algorithms, and a secure publishing workflow.',
  applicationName: 'DATA301 Machine Learning Studio',
  keywords: [
    'machine learning',
    'DATA301',
    'interactive learning',
    'data science',
  ],
  authors: [{ name: 'Krishna V. Gowda' }],
  openGraph: {
    type: 'website',
    title: 'DATA301 · Machine Learning Studio',
    description: 'Learn machine learning from intuition to implementation.',
    siteName: 'DATA301 Machine Learning Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DATA301 · Machine Learning Studio',
    description: 'Learn machine learning from intuition to implementation.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f6f1' },
    { media: '(prefers-color-scheme: dark)', color: '#07111f' },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}<RecoveryRedirect /></body>
    </html>
  );
}
