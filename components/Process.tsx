import { Icon } from './Icon';
import { Reveal } from './Reveal';

type ProcessStep = {
  title?: string | null;
  description?: string | null;
  icon?: string | null;
};

export function Process({ steps }: { steps: ProcessStep[] }) {
  return (
    <section className="section" id="process">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <h2>How a project runs</h2>
          <p>No surprises between the kickoff call and the invoice.</p>
        </Reveal>
        <div className="process-row">
          {steps.map((step, i) => (
            <Reveal as="div" className="proc-item" key={i}>
              <div className="proc-dot">
                <Icon icon={step.icon} />
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
