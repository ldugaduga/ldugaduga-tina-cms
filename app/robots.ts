import type { MetadataRoute } from 'next';
import { getSettings } from '@/lib/content';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSettings();
  const base = settings?.canonicalUrl?.replace(/\/$/, '') ?? '';

  return {
    rules: {
      userAgent: '*',
      disallow: '/form',
    },
    sitemap: base ? `${base}/sitemap.xml` : undefined,
  };
}
