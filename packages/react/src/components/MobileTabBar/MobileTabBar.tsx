import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';
import { clsx } from 'clsx';

export interface MobileTabBarItem {
  /** Identifiant stable, utile si plusieurs items ont le même libellé. */
  id?: string;
  /** Libellé court (idéalement 1 mot, 2 max). */
  label: ReactNode;
  /** URL cible. Si fournie, l'item est rendu en `<a>`, sinon en `<button>`. */
  href?: string;
  /** Marque l'item comme courant. Pose `aria-current="page"` et le style actif. */
  current?: boolean;
  /** Icône (idéalement 24x24px) rendue au-dessus du label. */
  icon?: ReactNode;
  /** Pastille optionnelle affichée en débordement de l'icône (notification, compteur). */
  badge?: ReactNode;
  /** Désactive l'item (apparence grisée, non cliquable). */
  disabled?: boolean;
}

export interface MobileTabBarProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  /** Items à afficher. 3 à 5 items recommandés (Material / iOS HIG). */
  items: MobileTabBarItem[];
  /** Étiquette ARIA du `<nav>`. */
  'aria-label'?: string;
  /**
   * Si `true`, la barre reste visible au-dessus du breakpoint `md` (768px).
   * Par défaut elle est masquée sur desktop, où la navigation est censée
   * passer par le `Header` + `SideMenu`.
   */
  alwaysVisible?: boolean;
  /**
   * Callback appelé au clic sur un item dépourvu de `href`. L'événement
   * natif est passé en second argument pour permettre un `preventDefault`.
   */
  onSelect?: (item: MobileTabBarItem, event: MouseEvent<HTMLElement>) => void;
}

/**
 * Barre de navigation fixée en bas d'écran sur mobile, pattern UX standard
 * (Material BottomNavigation, iOS TabBar). 3 à 5 items, chacun = icône
 * au-dessus d'un label court.
 *
 * Masquée par défaut au-dessus du breakpoint `md` (768px), où la navigation
 * principale passe par le `Header` + `SideMenu`. La prop `alwaysVisible`
 * permet de forcer l'affichage si l'app le justifie.
 *
 * Touch target de 56px minimum sur chaque item, indépendamment de la règle
 * globale `@media (pointer: coarse)`, parce que la barre est intrinsèquement
 * destinée au tactile.
 *
 * Sécurité iOS : le conteneur respecte `env(safe-area-inset-bottom)` pour
 * ne pas s'afficher sous le home indicator des iPhone récents.
 */
export function MobileTabBar({
  items,
  'aria-label': ariaLabel = 'Navigation mobile',
  alwaysVisible = false,
  onSelect,
  className,
  ...rest
}: MobileTabBarProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={clsx(
        'ori-mobile-tab-bar',
        alwaysVisible && 'ori-mobile-tab-bar--always-visible',
        className,
      )}
      {...rest}
    >
      <ul className="ori-mobile-tab-bar__list">
        {items.map((item, i) => {
          const key = item.id ?? `${i}-${typeof item.label === 'string' ? item.label : ''}`;
          const ariaCurrent = item.current ? 'page' : undefined;
          const ariaDisabled = item.disabled ? true : undefined;
          const content = (
            <>
              {item.icon !== undefined && (
                <span className="ori-mobile-tab-bar__icon" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              {item.badge !== undefined && (
                <span className="ori-mobile-tab-bar__badge" aria-hidden="true">
                  {item.badge}
                </span>
              )}
              <span className="ori-mobile-tab-bar__label">{item.label}</span>
            </>
          );
          return (
            <li key={key} className="ori-mobile-tab-bar__item">
              {item.href ? (
                <a
                  href={item.disabled ? undefined : item.href}
                  className="ori-mobile-tab-bar__link"
                  aria-current={ariaCurrent}
                  aria-disabled={ariaDisabled}
                  onClick={(event) => {
                    if (item.disabled) {
                      event.preventDefault();
                      return;
                    }
                    onSelect?.(item, event);
                  }}
                >
                  {content}
                </a>
              ) : (
                <button
                  type="button"
                  className="ori-mobile-tab-bar__link"
                  aria-current={ariaCurrent}
                  aria-disabled={ariaDisabled}
                  disabled={item.disabled}
                  onClick={(event) => onSelect?.(item, event)}
                >
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
