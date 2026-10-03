'use client';

import { useEffect, useRef, useState } from 'react';

type Testimonial = {
  quote?: string | null;
  attribution?: string | null;
  rating?: number | null;
};

export function Testimonials({ items }: { items: Testimonial[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function updateNavState() {
      if (!track) return;
      const max = track.scrollWidth - track.clientWidth - 4;
      setAtStart(track.scrollLeft <= 4);
      setAtEnd(track.scrollLeft >= max);
    }

    function onScroll() {
      window.requestAnimationFrame(updateNavState);
    }

    updateNavState();
    track.addEventListener('scroll', onScroll);
    window.addEventListener('resize', updateNavState);
    return () => {
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateNavState);
    };
  }, []);

  function slideStep() {
    const track = trackRef.current;
    const first = track?.querySelector<HTMLElement>('.testi-slide');
    return first ? first.getBoundingClientRect().width + 20 : 300;
  }

  function slide(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: direction * slideStep(), behavior: prefersReduced ? 'auto' : 'smooth' });
  }

  return (
    <section className="section" id="testimonials" aria-labelledby="testiTitle">
      <div className="wrap">
        <div className="section-head testi-head">
          <div>
            <h2 id="testiTitle">What clients say</h2>
            <p>Pulled from verified reviews on Upwork.</p>
          </div>
          <div className="slider-nav">
            <button
              className="slider-btn"
              type="button"
              aria-label="Previous testimonials"
              disabled={atStart}
              onClick={() => slide(-1)}
            >
              <i className="ph ph-arrow-left" aria-hidden="true" />
            </button>
            <button
              className="slider-btn"
              type="button"
              aria-label="Next testimonials"
              disabled={atEnd}
              onClick={() => slide(1)}
            >
              <i className="ph ph-arrow-right" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="testi-slider">
          <div className="testi-track" ref={trackRef}>
            {items.map((item, i) => (
              <div className="quote-card testi-slide" key={i}>
                <div>
                  <div className="stars" role="img" aria-label={`${item.rating ?? 5} out of 5 stars`}>
                    {'★'.repeat(item.rating ?? 5)}
                  </div>
                  <p className="body">&quot;{item.quote}&quot;</p>
                </div>
                <div className="quote-attr">{item.attribution}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
