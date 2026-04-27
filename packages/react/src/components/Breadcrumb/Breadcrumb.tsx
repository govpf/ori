import { Fragment, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: ReactNode;
  /** URL du lien. Omettre pour l'item courant (dernier). */
  href?: string;
  /** Callback alternatif (utile en SPA pour intercepter la navigation). */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /**
   * Séparateur entre les items. Default : chevron Lucide. Peut être
   * remplacé par un caractère ("/", "›", etc.) ou un nœud React.
   */
  separator?: ReactNode;
  /** Étiquette ARIA du `<nav>` parent. */
  'aria-label'?: string;
  className?: string;
}

/**
 * Fil d'Ariane (breadcrumb) - structure HTML sémantique avec
 * `<nav aria-label>` + `<ol>` ordonné. Le dernier item est marqué
 * `aria-current="page"` (sans lien).
 */
export function Breadcrumb({
  items,
  separator,
  'aria-label': ariaLabel = "Fil d'Ariane",
  className,
}: BreadcrumbProps) {
  const sep = separator ?? <ChevronRight size={14} aria-hidden="true" />;

  return (
    <nav aria-label={ariaLabel}>
      <ol className={clsx('ori-breadcrumb', className)}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <Fragment key={i}>
              <li className="ori-breadcrumb__item">
                {isLast || !item.href ? (
                  <span
                    className="ori-breadcrumb__current"
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                ) : (
                  <a href={item.href} className="ori-breadcrumb__link" onClick={item.onClick}>
                    {item.label}
                  </a>
                )}
              </li>
              {!isLast && (
                <li className="ori-breadcrumb__separator" aria-hidden="true">
                  {sep}
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
