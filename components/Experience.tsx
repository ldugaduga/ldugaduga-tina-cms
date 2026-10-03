import { Reveal } from './Reveal';

type ExperienceItem = {
  company?: string | null;
  role?: string | null;
  dateRange?: string | null;
  current?: boolean | null;
};

export function Experience({ items }: { items: ExperienceItem[] }) {
  return (
    <section className="section" id="experience">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <h2>Experience</h2>
          <p>{items.length} client relationships across eighteen years, most of them still on speed dial.</p>
        </Reveal>
        <Reveal as="div" className="timeline">
          {items.map((item, i) => (
            <div className={`tl-item ${item.current ? 'current' : ''}`.trim()} key={i}>
              <span className="tl-dot" />
              <div className="tl-head">
                <h3>{item.company}</h3>
                <span className="tl-date">{item.dateRange}</span>
              </div>
              <p className="tl-role">{item.role}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
