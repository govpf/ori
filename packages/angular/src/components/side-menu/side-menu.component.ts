import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';

type LucideIconData = typeof X;

export interface OriSideMenuItem {
  label: string;
  href: string;
  current?: boolean;
}

export interface OriSideMenuSection {
  title?: string;
  items: OriSideMenuItem[];
}

export type OriSideMenuVariant = 'persistent' | 'drawer';

/**
 * Menu latéral hiérarchique avec sections + items.
 * Cf. décision J.3 : variant explicite, pas d'auto-switch responsive.
 */
@Component({
  selector: 'ori-side-menu',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (variant === 'persistent' || open) {
      @if (variant === 'drawer') {
        <div class="ori-side-menu__overlay" (click)="closeMenu()" aria-hidden="true"></div>
      }
      <nav [attr.aria-label]="ariaLabel" [class]="navClasses">
        @if (variant === 'drawer') {
          <button
            type="button"
            class="ori-side-menu__close"
            aria-label="Fermer le menu"
            (click)="closeMenu()"
          >
            <lucide-icon [img]="XIcon" [size]="18" aria-hidden="true"></lucide-icon>
          </button>
        }
        @for (section of sections; track $index) {
          <div class="ori-side-menu__section">
            @if (section.title) {
              <div class="ori-side-menu__section-title">{{ section.title }}</div>
            }
            <ul class="ori-side-menu__list">
              @for (item of section.items; track item.href) {
                <li>
                  <a
                    [href]="item.href"
                    class="ori-side-menu__link"
                    [attr.aria-current]="item.current ? 'page' : null"
                    >{{ item.label }}</a
                  >
                </li>
              }
            </ul>
          </div>
        }
      </nav>
    }
  `,
})
export class OriSideMenuComponent {
  @Input() sections: OriSideMenuSection[] = [];
  @Input() variant: OriSideMenuVariant = 'persistent';
  @Input() open: boolean = true;
  @Input() ariaLabel: string = 'Menu de navigation';

  @Output() openChange = new EventEmitter<boolean>();

  protected readonly XIcon: LucideIconData = X;

  get navClasses(): string {
    return ['ori-side-menu', this.variant === 'drawer' ? 'ori-side-menu--drawer' : null]
      .filter((c): c is string => Boolean(c))
      .join(' ');
  }

  closeMenu(): void {
    this.open = false;
    this.openChange.emit(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.variant === 'drawer' && this.open) {
      this.closeMenu();
    }
  }
}
