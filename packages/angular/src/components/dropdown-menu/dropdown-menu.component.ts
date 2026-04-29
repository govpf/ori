import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  Output,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
  inject,
  type QueryList,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { LucideAngularModule, Edit } from 'lucide-angular';

type LucideIconData = typeof Edit;

let nextUid = 0;

/**
 * Item d'un `<ori-dropdown-menu>`.
 *
 * - `separator: true` rend une ligne de séparation et ignore les autres champs.
 * - `id` est requis sauf pour les séparateurs ; il est renvoyé par l'event
 *   `(select)` quand l'item est activé.
 */
export interface OriDropdownMenuItem {
  id?: string;
  label?: string;
  icon?: LucideIconData;
  shortcut?: string;
  destructive?: boolean;
  disabled?: boolean;
  separator?: boolean;
}

/**
 * DropdownMenu accessible, sans dépendance externe.
 *
 * - In-place dans le DOM (pas de portal, cohérent avec décision B.1)
 * - Click outside et touche Escape pour fermer
 * - Navigation clavier : ArrowUp / ArrowDown (avec wrap), Home, End
 * - ARIA : `role="menu"` / `role="menuitem"`, `aria-haspopup="menu"`,
 *   `aria-expanded` sur le trigger
 *
 * Le trigger doit être projeté avec `slot="trigger"`. Les items sont passés en
 * data-driven via la prop `[items]`. Pour des items custom (composants
 * imbriqués, contenus riches), une variante composée pourra être ajoutée si
 * le besoin se confirme côté apps consommatrices.
 */
@Component({
  selector: 'ori-dropdown-menu',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ori-dropdown-menu-wrap">
      <span
        #triggerWrap
        class="ori-dropdown-menu-trigger-wrap"
        [attr.aria-haspopup]="'menu'"
        [attr.aria-expanded]="isOpen"
        [attr.aria-controls]="menuId"
        (click)="toggle()"
        (keydown)="onTriggerKeyDown($event)"
      >
        <ng-content select="[slot=trigger]"></ng-content>
      </span>

      @if (isOpen) {
        <div
          [id]="menuId"
          class="ori-dropdown-menu"
          [class.ori-dropdown-menu--align-end]="align === 'end'"
          [class.ori-dropdown-menu--align-center]="align === 'center'"
          role="menu"
          [attr.aria-label]="ariaLabel || null"
        >
          @for (item of items; track item.id ?? $index; let i = $index) {
            @if (item.separator) {
              <div class="ori-dropdown-menu__separator" role="separator"></div>
            } @else {
              <button
                #menuItem
                type="button"
                role="menuitem"
                class="ori-dropdown-menu__item"
                [class.ori-dropdown-menu__item--destructive]="item.destructive"
                [disabled]="item.disabled"
                [attr.tabindex]="i === activeIndex ? 0 : -1"
                (click)="selectItem(item)"
                (keydown)="onItemKeyDown($event, i, item)"
                (mouseenter)="setActive(i)"
              >
                @if (item.icon) {
                  <span class="ori-dropdown-menu__item-icon" aria-hidden="true">
                    <lucide-icon [img]="item.icon" [size]="16"></lucide-icon>
                  </span>
                }
                <span class="ori-dropdown-menu__item-label">{{ item.label }}</span>
                @if (item.shortcut) {
                  <span class="ori-dropdown-menu__item-shortcut">{{ item.shortcut }}</span>
                }
              </button>
            }
          }
        </div>
      }
    </div>
  `,
})
export class OriDropdownMenuComponent {
  @Input() items: OriDropdownMenuItem[] = [];
  /** Alignement horizontal du menu sous le trigger. */
  @Input() align: 'start' | 'center' | 'end' = 'start';
  /** Label accessible du menu (lu par les lecteurs d'écran à l'ouverture). */
  @Input() ariaLabel: string = '';

  @Output() select = new EventEmitter<OriDropdownMenuItem>();
  @Output() openChange = new EventEmitter<boolean>();

  @ViewChild('triggerWrap') protected triggerWrap?: ElementRef<HTMLElement>;
  @ViewChildren('menuItem') protected menuItems?: QueryList<ElementRef<HTMLButtonElement>>;

  protected isOpen = false;
  protected activeIndex = -1;
  protected readonly menuId = `pf-dropdown-menu-${++nextUid}`;

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly hostRef = inject(ElementRef<HTMLElement>);

  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  toggle(): void {
    if (this.isOpen) this.closeMenu();
    else this.openMenu();
  }

  openMenu(): void {
    if (this.isOpen) return;
    this.isOpen = true;
    this.activeIndex = this.firstEnabledIndex();
    this.openChange.emit(true);
    this.cdr.markForCheck();
    requestAnimationFrame(() => this.focusActive());
  }

  closeMenu(restoreFocus = true): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.activeIndex = -1;
    this.openChange.emit(false);
    this.cdr.markForCheck();
    if (restoreFocus) {
      // Re-focus le premier élément focusable du trigger (le plus souvent un button)
      const focusable = this.triggerWrap?.nativeElement.querySelector<HTMLElement>(
        'button, [tabindex]:not([tabindex="-1"])',
      );
      focusable?.focus();
    }
  }

  selectItem(item: OriDropdownMenuItem): void {
    if (item.disabled || item.separator) return;
    this.select.emit(item);
    this.closeMenu();
  }

  protected setActive(index: number): void {
    if (this.activeIndex === index) return;
    this.activeIndex = index;
    this.cdr.markForCheck();
  }

  protected onTriggerKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!this.isOpen) this.openMenu();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!this.isOpen) {
        this.openMenu();
        // Focus sur le dernier item activable
        const last = this.lastEnabledIndex();
        if (last >= 0) {
          this.activeIndex = last;
          requestAnimationFrame(() => this.focusActive());
        }
      }
    } else if (event.key === 'Escape' && this.isOpen) {
      event.preventDefault();
      this.closeMenu();
    }
  }

  protected onItemKeyDown(event: KeyboardEvent, index: number, item: OriDropdownMenuItem): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.moveFocus(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.moveFocus(-1);
        break;
      case 'Home':
        event.preventDefault();
        this.activeIndex = this.firstEnabledIndex();
        this.focusActive();
        break;
      case 'End':
        event.preventDefault();
        this.activeIndex = this.lastEnabledIndex();
        this.focusActive();
        break;
      case 'Escape':
        event.preventDefault();
        this.closeMenu();
        break;
      case 'Tab':
        // Tab ferme le menu sans bloquer la navigation naturelle
        this.closeMenu(false);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectItem(item);
        break;
    }
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen) return;
    const target = event.target as Node;
    if (!this.hostRef.nativeElement.contains(target)) {
      this.closeMenu(false);
    }
  }

  private moveFocus(delta: number): void {
    const enabledIndices = this.items
      .map((it, idx) => ({ it, idx }))
      .filter(({ it }) => !it.separator && !it.disabled)
      .map(({ idx }) => idx);
    if (!enabledIndices.length) return;
    const currentPos = enabledIndices.indexOf(this.activeIndex);
    const nextPos = (currentPos + delta + enabledIndices.length) % enabledIndices.length;
    this.activeIndex = enabledIndices[nextPos];
    this.focusActive();
  }

  private firstEnabledIndex(): number {
    return this.items.findIndex((it) => !it.separator && !it.disabled);
  }

  private lastEnabledIndex(): number {
    for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i];
      if (!it.separator && !it.disabled) return i;
    }
    return -1;
  }

  private focusActive(): void {
    if (this.activeIndex < 0) return;
    const buttons = this.menuItems?.toArray() ?? [];
    // L'index dans la query list ne correspond pas à activeIndex (les
    // séparateurs ne sont pas rendus comme menuItem). On retrouve le bon
    // bouton via son ordinal parmi les items non-séparateur précédents.
    let visibleOrdinal = 0;
    for (let i = 0; i < this.activeIndex; i++) {
      if (!this.items[i].separator) visibleOrdinal++;
    }
    buttons[visibleOrdinal]?.nativeElement.focus();
    this.cdr.markForCheck();
  }
}
