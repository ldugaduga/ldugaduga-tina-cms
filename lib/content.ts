import { cache } from 'react';
import { client } from '@/tina/__generated__/client';

function byOrder<T extends { order?: number | null }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

// Deduped per request: both layout.tsx (metadata/GA/footer) and page.tsx (hero/strip) need settings.
export const getSettings = cache(async () => {
  const res = await client.queries.settings({ relativePath: 'site.json' });
  return res.data.settings;
});

export async function getServices() {
  const res = await client.queries.serviceConnection();
  const items = (res.data.serviceConnection.edges ?? []).map((e) => e!.node!);
  return byOrder(items);
}

export async function getProcessSteps() {
  const res = await client.queries.processStepConnection();
  const items = (res.data.processStepConnection.edges ?? []).map((e) => e!.node!);
  return byOrder(items);
}

export async function getWork() {
  const res = await client.queries.workConnection();
  const items = (res.data.workConnection.edges ?? []).map((e) => e!.node!);
  return byOrder(items);
}

export async function getExperience() {
  const res = await client.queries.experienceConnection();
  const items = (res.data.experienceConnection.edges ?? []).map((e) => e!.node!);
  return byOrder(items);
}

export async function getTestimonials() {
  const res = await client.queries.testimonialConnection();
  const items = (res.data.testimonialConnection.edges ?? []).map((e) => e!.node!);
  return byOrder(items);
}
