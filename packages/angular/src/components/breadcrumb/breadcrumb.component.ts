import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { LucideAngularModule, ChevronRight } from 'lucide-angular';

type LucideIconData = typeof ChevronRight;

export interface OriBreadcrumbItem {
  label: string;
  /** URL du lien. Omettre pour l'item courant (dernier). */
  href?: string;
}

/**
 * Fil d'Ariane sémantique : `<nav aria-label>` + `<ol>` ordonné +
 * `aria-current="page"` sur le dernier item.
 */
@Component({
  selector: 'ori-breadcrumb',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <nav [attr.aria-label]="ariaLabel">
      <ol class="ori-breadcrumb">
        @for (item of items; track $index; let last = $last) {
          <li class="ori-breadcrumb__item">
            @if (last || !item.href) {
              <span class="ori-breadcrumb__current" [attr.aria-current]="last ? 'page' : null">{{
                item.label
              }}</span>
            } @else {
              <a
                [href]="item.href"
                class="ori-breadcrumb__link"
                (click)="onClick($event, $index, item)"
                >{{ item.label }}</a
              >
            }
          </li>
          @if (!last) {
            <li class="ori-breadcrumb__separator" aria-hidden="true">
              @if (separator) {
                {{ separator }}
              } @else {
                <lucide-icon [img]="ChevronIcon" [size]="14"></lucide-icon>
              }
            </li>
          }
        }
      </ol>
    </nav>
  `,
})
export class OriBreadcrumbComponent {
  @Input() items: OriBreadcrumbItem[] = [];
  /** Caractère ou texte de séparateur. Omettre pour utiliser le chevron Lucide par défaut. */
  @Input() separator: string = '';
  @Input() ariaLabel: string = "Fil d'Ariane";

  /**
   * Émis au clic sur un item (utile en SPA pour intercepter avec
   * `event.preventDefault()` et naviguer côté router).
   */
  @Output() itemClick = new EventEmitter<{
    index: number;
    item: OriBreadcrumbItem;
    event: MouseEvent;
  }>();

  protected readonly ChevronIcon: LucideIconData = ChevronRight;

  onClick(event: MouseEvent, index: number, item: OriBreadcrumbItem): void {
    this.itemClick.emit({ index, item, event });
  }
}
