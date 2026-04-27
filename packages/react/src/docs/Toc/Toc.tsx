import { forwardRef, useEffect, useState } from 'react';
import type { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

export interface TocItem {
  depth: number;
  slug: string;
  text: string;
}

export interface TocProps extends HTMLAttributes<HTMLElement> {
  headings: TocItem[];
  title?: string;
  /**
   * Profondeurs à afficher. Par défaut h2 et h3 ([2, 3]).
   */
  depths?: number[];
}

/**
 * Table des matières latérale avec scroll-spy.
 *
 * Les `headings` sont en général fournis par le compilateur MDX du framework
 * (Astro, Next.js, Docusaurus...) qui les extrait à la compilation. Le scroll-spy
 * marque le titre actif via `aria-current="true"` à mesure que l'utilisateur
 * scrolle dans le document.
 */
export const Toc = forwardRef<HTMLElement, TocProps>(function Toc(
  { headings, title = 'Sur cette page', depths = [2, 3], className, ...rest },
  ref,
) {
  const filtered = headings.filter((h) => depths.includes(h.depth));
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (filtered.length === 0 || typeof window === 'undefined') return;
    const targets = filtered
      .map((h) => document.getElementById(h.slug))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-20% 0px -70% 0px' },
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [filtered]);

  if (filtered.length === 0) return null;

  return (
    <nav ref={ref} className={clsx('ori-toc', className)} aria-label={title} {...rest}>
      <p className="ori-toc__title">{title}</p>
      <ol className="ori-toc__list">
        {filtered.map((h) => (
          <li key={h.slug}>
            <a
              className="ori-toc__link"
              href={`#${h.slug}`}
              aria-current={activeId === h.slug ? 'true' : undefined}
              style={h.depth === 3 ? { paddingLeft: '1.5rem' } : undefined}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
});
