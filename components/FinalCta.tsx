import { Reveal } from './Reveal';
import { StartProjectButton } from './StartProjectButton';

export function FinalCta({ headline, sub }: { headline?: string | null; sub?: string | null }) {
  return (
    <section className="section" id="contact">
      <div className="wrap">
        <Reveal as="div" className="cta-banner">
          <h2>{headline}</h2>
          <p>{sub}</p>
          <div className="cta-actions">
            <StartProjectButton>
              <i className="ph ph-briefcase" aria-hidden="true" /> Start a project
            </StartProjectButton>
            <a
              className="btn btn-secondary"
              href="https://www.linkedin.com/in/louie-dugaduga-514a8912/"
              target="_blank"
              rel="noopener"
            >
              <i className="ph ph-linkedin-logo" aria-hidden="true" /> Connect on LinkedIn
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
