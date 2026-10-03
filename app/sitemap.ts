import type { MetadataRoute } from 'next';
import { getSettings } from '@/lib/content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSettings();
  const base = settings?.canonicalUrl?.replace(/\/$/, '') ?? '';

  return [
    {
      url: base ? `${base}/` : '/',
    },
  ];
}
