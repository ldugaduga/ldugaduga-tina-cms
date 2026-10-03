import { getSettings } from '@/lib/content';
import { ContactModalProvider } from '@/components/ContactModalContext';
import { ContactModal } from '@/components/ContactModal';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <ContactModalProvider>
      <Header />
      <main id="top">{children}</main>
      <Footer socialLinks={settings?.socialLinks ?? []} />
      <ContactModal formAction={settings?.contactFormAction ?? ''} />
    </ContactModalProvider>
  );
}
