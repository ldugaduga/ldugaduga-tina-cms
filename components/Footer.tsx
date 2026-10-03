import { Icon } from './Icon';

type SocialLink = { label?: string | null; url?: string | null; icon?: string | null };

export function Footer({ socialLinks }: { socialLinks: (SocialLink | null)[] }) {
  return (
    <footer>
      <div className="wrap footer-inner">
        <div className="footer-left">
          <div className="logo">
            <span className="logo-mark">LD</span> Louie Dugaduga
          </div>
          <p>
            © {new Date().getFullYear()} · <a href="https://ldugaduga.github.io/">ldugaduga.github.io</a>
          </p>
        </div>
        <div className="social-row">
          {socialLinks.map((link, i) => (
            <a key={i} href={link?.url ?? '#'} target="_blank" rel="noopener" aria-label={link?.label ?? ''}>
              <Icon icon={link?.icon} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
