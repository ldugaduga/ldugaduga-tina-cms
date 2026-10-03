import { getSettings, getServices, getProcessSteps, getWork, getExperience, getTestimonials } from '@/lib/content';
import { Hero } from '@/components/Hero';
import { AvailabilityStrip } from '@/components/AvailabilityStrip';
import { Services } from '@/components/Services';
import { Process } from '@/components/Process';
import { Work } from '@/components/Work';
import { Experience } from '@/components/Experience';
import { Testimonials } from '@/components/Testimonials';
import { FinalCta } from '@/components/FinalCta';

export default async function Home() {
  const [settings, services, processSteps, work, experience, testimonials] = await Promise.all([
    getSettings(),
    getServices(),
    getProcessSteps(),
    getWork(),
    getExperience(),
    getTestimonials(),
  ]);

  return (
    <>
      <Hero headline={settings?.heroHeadline} sub={settings?.heroSub} stats={settings?.stats} />
      <AvailabilityStrip text={settings?.availabilityText} />
      <Services services={services} />
      <Process steps={processSteps} />
      <Work items={work} />
      <Experience items={experience} />
      <Testimonials items={testimonials} />
      <FinalCta headline={settings?.ctaHeadline} sub={settings?.ctaSub} />
    </>
  );
}
