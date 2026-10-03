import { Icon } from './Icon';
import { Reveal } from './Reveal';

type Service = {
  title?: string | null;
  description?: string | null;
  icon?: string | null;
  featured?: boolean | null;
  tags?: (string | null)[] | null;
};

export function Services({ services }: { services: Service[] }) {
  return (
    <section className="section" id="services">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <h2>What I do</h2>
          <p>A few things, done properly, instead of ten things done half-well.</p>
        </Reveal>
        <div className="services-grid">
          {services.map((service, i) => (
            <Reveal as="div" className={`svc-card ${service.featured ? 'svc-featured' : ''}`.trim()} key={i}>
              <div className="svc-icon">
                <Icon icon={service.icon} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <div className="tag-row">
                {(service.tags ?? []).map((tag, j) => (
                  <span className="tag" key={j}>
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
