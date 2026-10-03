'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Reveal } from './Reveal';

type WorkItem = {
  title?: string | null;
  description?: string | null;
  url?: string | null;
  image?: string | null;
  alt?: string | null;
  platform?: string | null;
  category?: string | null;
  featured?: boolean | null;
};

const BATCH_SIZE = 6;

export function Work({ items }: { items: WorkItem[] }) {
  const featuredCount = items.filter((item) => item.featured).length;
  const initialVisible = featuredCount || Math.min(BATCH_SIZE, items.length);
  const [visibleCount, setVisibleCount] = useState(initialVisible);

  const visible = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  return (
    <section className="section" id="work">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <h2>Selected work</h2>
          <p>{items.length} live builds across WordPress and Shopify, from enterprise tech to fashion retail.</p>
        </Reveal>
        <div className="work-grid work-grid-3">
          {visible.map((item, i) => (
            <Reveal as="a" className="work-card" key={i} href={item.url ?? '#'} target="_blank" rel="noopener">
              <div className="work-thumb">
                {item.image ? (
                  <Image src={item.image} alt={item.alt ?? ''} width={960} height={600} loading="lazy" />
                ) : null}
              </div>
              <div className="work-body">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className={`tag ${item.platform === 'shopify' ? 'tag-shopify' : 'tag-wp'}`}>
                  {item.platform === 'shopify' ? 'Shopify' : 'WordPress'} · {item.category}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
        {hasMore && (
          <div className="work-more">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => setVisibleCount((v) => Math.min(v + BATCH_SIZE, items.length))}
            >
              Load more work
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
