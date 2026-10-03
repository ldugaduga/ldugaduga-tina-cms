'use client';

import { useState } from 'react';
import { StartProjectButton } from './StartProjectButton';

const NAV_LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#services', label: 'Services' },
  { href: '#process', label: 'Process' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a href="#top" className="logo">
          <span className="logo-mark">LD</span>
          Louie Dugaduga
        </a>
        <nav className="links">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="nav-cta">
          <StartProjectButton>Start a project</StartProjectButton>
          <button
            type="button"
            className="nav-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobileMenu"
            onClick={() => setOpen((v) => !v)}
          >
            <i className={`ph ${open ? 'ph-x' : 'ph-list'}`} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className={`mobile-menu ${open ? 'open' : ''}`} id="mobileMenu">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
        <StartProjectButton onClick={() => setOpen(false)}>Start a project</StartProjectButton>
      </div>
    </header>
  );
}
