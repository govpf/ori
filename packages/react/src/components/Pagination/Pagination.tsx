import { clsx } from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  /** Page courante (1-indexed). */
  page: number;
  /** Nombre total de pages. */
  totalPages: number;
  /** Callback de changement de page. */
  onPageChange: (page: number) => void;
  /** Nombre de pages à afficher autour de la courante. Default: 1. */
  siblings?: number;
  /** Étiquette ARIA du `<nav>`. */
  'aria-label'?: string;
  className?: string;
}

/**
 * Calcule la liste de pages à afficher avec ellipses.
 * Ex: page=5, total=10, siblings=1 → [1, '...', 4, 5, 6, '...', 10]
 */
function buildPageList(
  page: number,
  totalPages: number,
  siblings: number,
): (number | 'ellipsis')[] {
  // Si peu de pages, on affiche tout sans ellipses
  const compact = 2 * siblings + 5; // first + last + current + 2*siblings + 2 ellipses au max
  if (totalPages <= compact) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];
  const left = Math.max(2, page - siblings);
  const right = Math.min(totalPages - 1, page + siblings);

  pages.push(1);
  if (left > 2) pages.push('ellipsis');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages - 1) pages.push('ellipsis');
  pages.push(totalPages);

  return pages;
}

/**
 * Pagination accessible : `<nav>` + `<ol>` + boutons.
 * Émet `onPageChange(page)` ; c'est l'app qui met à jour son état.
 */
export function Pagination({
  page,
  totalPages,
  onPageChange,
  siblings = 1,
  'aria-label': ariaLabel = 'Pagination',
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(page, totalPages, siblings);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <nav aria-label={ariaLabel}>
      <ol className={clsx('ori-pagination', className)}>
        <li className="ori-pagination__item">
          <button
            type="button"
            className="ori-pagination__link"
            onClick={() => canPrev && onPageChange(page - 1)}
            disabled={!canPrev}
            aria-label="Page précédente"
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
        </li>
        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <li key={`e-${i}`} className="ori-pagination__ellipsis" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={p} className="ori-pagination__item">
              <button
                type="button"
                className="ori-pagination__link"
                aria-current={p === page ? 'page' : undefined}
                aria-label={`Page ${p}${p === page ? ', page courante' : ''}`}
                onClick={() => p !== page && onPageChange(p)}
              >
                {p}
              </button>
            </li>
          ),
        )}
        <li className="ori-pagination__item">
          <button
            type="button"
            className="ori-pagination__link"
            onClick={() => canNext && onPageChange(page + 1)}
            disabled={!canNext}
            aria-label="Page suivante"
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </li>
      </ol>
    </nav>
  );
}
