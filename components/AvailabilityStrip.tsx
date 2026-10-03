import { RichLabel } from './RichLabel';

export function AvailabilityStrip({ text }: { text?: string | null }) {
  return (
    <div className="strip">
      <div className="wrap">
        <span className="dot-live" />
        <p>
          <RichLabel text={text} /> <a href="#contact">Get in touch</a>
        </p>
      </div>
    </div>
  );
}
