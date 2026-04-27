import type { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

export interface MainNavigationItem {
  label: ReactNode;
  href: string;
  /** Si `true`, l'item est marqué comme courant (`aria-current="page"`). */
  current?: boolean;
  /** Icône optionnelle à gauche du label. */
  icon?: ReactNode;
}

export interface MainNavigationProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  items: MainNavigationItem[];
  /** Étiquette ARIA du `<nav>`. */
  'aria-label'?: string;
}

/**
 * Navigation principale horizontale (typiquement dans le `<Header>`).
 * `<nav aria-label>` + `<ul>` sémantique + `aria-current="page"` sur
 * l'item actif.
 */
export function MainNavigation({
  items,
  'aria-label': ariaLabel = 'Navigation principale',
  className,
  ...rest
}: MainNavigationProps) {
  return (
    <nav aria-label={ariaLabel} className={className} {...rest}>
      <ul className="ori-main-nav">
        {items.map((item, i) => (
          <li key={i} className="ori-main-nav__item">
            <a
              href={item.href}
              className="ori-main-nav__link"
              aria-current={item.current ? 'page' : undefined}
            >
              {item.icon}
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
