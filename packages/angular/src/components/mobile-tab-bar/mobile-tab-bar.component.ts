import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { LucideAngularModule, Edit } from 'lucide-angular';

type LucideIconData = typeof Edit;

/**
 * Item d'une `<ori-mobile-tab-bar>`.
 *
 * - `href` rend l'item en `<a>`, sinon en `<button>` qui émet l'event `(select)`.
 * - `icon` accepte une icône Lucide (cohérent avec `<ori-dropdown-menu>`).
 * - `badge` est une chaîne ou un nombre affichés en pastille (notification).
 */
export interface OriMobileTabBarItem {
  /** Identifiant stable, utile si plusieurs items ont le même libellé. */
  id?: string;
  /** Libellé court (idéalement 1 à 2 mots). */
  label: string;
  /** URL cible. Si fournie, l'item est rendu en `<a>`. */
  href?: string;
  /** Marque l'item comme courant. Pose `aria-current="page"` et le style actif. */
  current?: boolean;
  /** Icône Lucide (taille 24px), affichée au-dessus du label. */
  icon?: LucideIconData;
  /** Pastille optionnelle affichée en débordement de l'icône. */
  badge?: string | number;
  /** Désactive l'item (apparence grisée, non cliquable). */
  disabled?: boolean;
}

/**
 * Barre de navigation fixée en bas d'écran sur mobile, pattern UX standard
 * (Material BottomNavigation, iOS TabBar). 3 à 5 items, chacun = icône
 * au-dessus d'un label court.
 *
 * Masquée par défaut au-dessus du breakpoint `md` (768px), où la navigation
 * principale passe par le `<ori-header>` + `<ori-side-menu>`. La prop
 * `alwaysVisible` permet de forcer l'affichage si l'app le justifie.
 *
 * Touch target de 56px minimum sur chaque item, indépendamment de la règle
 * globale `@media (pointer: coarse)`, parce que la barre est intrinsèquement
 * destinée au tactile.
 *
 * Sécurité iOS : le conteneur respecte `env(safe-area-inset-bottom)` pour
 * ne pas s'afficher sous le home indicator des iPhone récents.
 */
@Component({
  selector: 'ori-mobile-tab-bar',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <nav
      class="ori-mobile-tab-bar"
      [class.ori-mobile-tab-bar--always-visible]="alwaysVisible"
      [attr.aria-label]="ariaLabel"
    >
      <ul class="ori-mobile-tab-bar__list">
        @for (item of items; track item.id ?? item.label; let i = $index) {
          <li class="ori-mobile-tab-bar__item">
            @if (item.href) {
              <a
                [href]="item.disabled ? null : item.href"
                class="ori-mobile-tab-bar__link"
                [attr.aria-current]="item.current ? 'page' : null"
                [attr.aria-disabled]="item.disabled ? true : null"
                (click)="onLinkClick($event, item)"
              >
                @if (item.icon) {
                  <span class="ori-mobile-tab-bar__icon" aria-hidden="true">
                    <lucide-icon [img]="item.icon" [size]="20"></lucide-icon>
                  </span>
                }
                @if (item.badge !== undefined && item.badge !== null) {
                  <span class="ori-mobile-tab-bar__badge" aria-hidden="true">{{ item.badge }}</span>
                }
                <span class="ori-mobile-tab-bar__label">{{ item.label }}</span>
              </a>
            } @else {
              <button
                type="button"
                class="ori-mobile-tab-bar__link"
                [attr.aria-current]="item.current ? 'page' : null"
                [disabled]="item.disabled"
                (click)="select.emit(item)"
              >
                @if (item.icon) {
                  <span class="ori-mobile-tab-bar__icon" aria-hidden="true">
                    <lucide-icon [img]="item.icon" [size]="20"></lucide-icon>
                  </span>
                }
                @if (item.badge !== undefined && item.badge !== null) {
                  <span class="ori-mobile-tab-bar__badge" aria-hidden="true">{{ item.badge }}</span>
                }
                <span class="ori-mobile-tab-bar__label">{{ item.label }}</span>
              </button>
            }
          </li>
        }
      </ul>
    </nav>
  `,
})
export class OriMobileTabBarComponent {
  /** Items à afficher. 3 à 5 items recommandés (Material / iOS HIG). */
  @Input() items: OriMobileTabBarItem[] = [];

  /** Étiquette ARIA du `<nav>`. */
  @Input() ariaLabel: string = 'Navigation mobile';

  /**
   * Si `true`, la barre reste visible au-dessus du breakpoint `md` (768px).
   * Par défaut elle est masquée sur desktop.
   */
  @Input() alwaysVisible: boolean = false;

  /**
   * Émis au clic sur un item dépourvu de `href` (mode bouton). Permet à l'app
   * de gérer le routing via Angular Router ou tout autre mécanisme.
   */
  @Output() select = new EventEmitter<OriMobileTabBarItem>();

  onLinkClick(event: MouseEvent, item: OriMobileTabBarItem): void {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    this.select.emit(item);
  }
}
