import type { Metadata, Viewport } from 'next';
import 'katex/dist/katex.min.css';
import './globals.css';
import './cosmic.css';
import './v5.css';
import './v6.css';
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
    'The DATA301 Machine Learning course platform at Vidyashilp University: visual lessons, interactive labs, projects, notes, and course resources.',
  applicationName: 'DATA301 Machine Learning Studio',
  keywords: [
    'machine learning',
    'DATA301',
    'Vidyashilp University',
    'interactive learning',
    'data science',
  ],
  authors: [{ name: 'Krishna V Gowda', url: 'https://github.com/Krishna-V-Gowda' }],
  creator: 'Krishna V Gowda',
  publisher: 'Vidyashilp University',
  formatDetection: { telephone: false, address: false, email: false },
  appleWebApp: { capable: true, title: 'DATA301 ML', statusBarStyle: 'default' },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    title: 'DATA301 · Machine Learning Studio',
    description: 'DATA301 at Vidyashilp University: course overview, connected lessons, interactive labs, and instructor-managed resources.',
    siteName: 'DATA301 Machine Learning Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DATA301 · Machine Learning Studio',
    description: 'DATA301 at Vidyashilp University: course overview, connected lessons, interactive labs, and instructor-managed resources.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f2e8' },
    { media: '(prefers-color-scheme: dark)', color: '#0f2838' },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}<RecoveryRedirect /></body>
    </html>
  );
}
