import type { Metadata } from 'next';
import { getSettings } from '@/lib/content';
import { FallbackContactForm } from '@/components/FallbackContactForm';

export const metadata: Metadata = {
  title: 'Contact form test — Louie Dugaduga',
  robots: { index: false, follow: false },
};

export default async function FormPage() {
  const settings = await getSettings();
  return <FallbackContactForm formAction={settings?.contactFormAction ?? ''} />;
}
