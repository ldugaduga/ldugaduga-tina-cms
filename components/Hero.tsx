import { Reveal } from './Reveal';
import { RichLabel } from './RichLabel';
import { StartProjectButton } from './StartProjectButton';
import { StatCounter } from './StatCounter';

type Stat = { value?: number | null; label?: string | null };

export function Hero({
  headline,
  sub,
  stats,
}: {
  headline?: string | null;
  sub?: string | null;
  stats?: (Stat | null)[] | null;
}) {
  return (
    <section className="hero">
      <div className="wrap">
        <Reveal className="in">
          <h1>
            <RichLabel text={headline} />
          </h1>
          <p className="sub">{sub}</p>
          <div className="hero-ctas">
            <StartProjectButton>
              <i className="ph ph-briefcase" aria-hidden="true" /> Start a project
            </StartProjectButton>
            <a className="btn btn-secondary" href="#work">
              View my work
            </a>
          </div>
        </Reveal>
        <Reveal className="stat-panel in">
          {(stats ?? []).map((stat, i) => (
            <div className="stat-card" key={i}>
              <StatCounter value={stat?.value ?? 0} />
              <div className="label">{stat?.label}</div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
