import { readFile, readdir } from 'fs/promises';
import path from 'path';
import { cache } from 'react';

const CONTENT_DIR = path.join(process.cwd(), 'content');

async function readCollection<T>(collection: string): Promise<T[]> {
  const dir = path.join(CONTENT_DIR, collection);
  const files = (await readdir(dir)).filter((f) => f.endsWith('.json'));
  const items = await Promise.all(
    files.map(async (file) => JSON.parse(await readFile(path.join(dir, file), 'utf-8')) as T)
  );
  return items;
}

function byOrder<T extends { order?: number | null }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

type Settings = {
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
  ogImage?: string | null;
  gaId?: string | null;
  heroHeadline?: string | null;
  heroSub?: string | null;
  availabilityText?: string | null;
  stats?: ({ value?: number | null; label?: string | null } | null)[] | null;
  contactFormAction?: string | null;
  ctaHeadline?: string | null;
  ctaSub?: string | null;
  socialLinks?: ({ label?: string | null; url?: string | null; icon?: string | null } | null)[] | null;
};

type Service = {
  title?: string | null;
  description?: string | null;
  icon?: string | null;
  featured?: boolean | null;
  tags?: (string | null)[] | null;
  order?: number | null;
};

type ProcessStep = {
  title?: string | null;
  description?: string | null;
  icon?: string | null;
  order?: number | null;
};

type Work = {
  title?: string | null;
  description?: string | null;
  url?: string | null;
  image?: string | null;
  alt?: string | null;
  platform?: string | null;
  category?: string | null;
  featured?: boolean | null;
  order?: number | null;
};

type Experience = {
  company?: string | null;
  role?: string | null;
  dateRange?: string | null;
  current?: boolean | null;
  order?: number | null;
};

type Testimonial = {
  quote?: string | null;
  attribution?: string | null;
  rating?: number | null;
  order?: number | null;
};

// Content is read straight from the committed JSON files edited through the Tina admin
// (see content/), deduped per request — no live GraphQL/CMS backend required to render.
export const getSettings = cache(async (): Promise<Settings> => {
  const raw = await readFile(path.join(CONTENT_DIR, 'settings', 'site.json'), 'utf-8');
  return JSON.parse(raw) as Settings;
});

export async function getServices() {
  return byOrder(await readCollection<Service>('services'));
}

export async function getProcessSteps() {
  return byOrder(await readCollection<ProcessStep>('process'));
}

export async function getWork() {
  return byOrder(await readCollection<Work>('work'));
}

export async function getExperience() {
  return byOrder(await readCollection<Experience>('experience'));
}

export async function getTestimonials() {
  return byOrder(await readCollection<Testimonial>('testimonials'));
}
