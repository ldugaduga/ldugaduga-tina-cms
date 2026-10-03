import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { getSettings } from '@/lib/content';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    metadataBase: settings?.canonicalUrl ? new URL(settings.canonicalUrl) : undefined,
    title: settings?.seoTitle ?? 'Louie Dugaduga',
    description: settings?.seoDescription ?? undefined,
    alternates: settings?.canonicalUrl ? { canonical: settings.canonicalUrl } : undefined,
    openGraph: {
      type: 'website',
      url: settings?.canonicalUrl ?? undefined,
      title: settings?.seoTitle ?? undefined,
      description: settings?.seoDescription ?? undefined,
      images: settings?.ogImage ? [settings.ogImage] : undefined,
    },
    twitter: { card: 'summary_large_image' },
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Louie Dugaduga',
              jobTitle: 'WordPress & Frontend Developer',
              url: 'https://ldugaduga.github.io/',
              address: { '@type': 'PostalAddress', addressCountry: 'PH' },
              sameAs: [
                'https://www.linkedin.com/in/louie-dugaduga-514a8912/',
                'https://github.com/ldugaduga/',
                'https://www.upwork.com/freelancers/~01a9b9d3c52f9eeb7e',
              ],
            }),
          }}
        />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/regular/style.css" />
      </head>
      <body>
        {settings?.gaId && (
          <>
            <Script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.gaId}`} />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${settings.gaId}');`}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
