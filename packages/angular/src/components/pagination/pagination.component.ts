import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';

type LucideIconData = typeof ChevronLeft;

type PageItem = number | 'ellipsis';

function buildPageList(page: number, totalPages: number, siblings: number): PageItem[] {
  const compact = 2 * siblings + 5;
  if (totalPages <= compact) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: PageItem[] = [];
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
 * Émet `(pageChange)` ; c'est l'app qui met à jour son état.
 */
@Component({
  selector: 'ori-pagination',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (totalPages > 1) {
      <nav [attr.aria-label]="ariaLabel">
        <ol class="ori-pagination">
          <li class="ori-pagination__item">
            <button
              type="button"
              class="ori-pagination__link"
              [disabled]="!canPrev"
              (click)="canPrev && pageChange.emit(page - 1)"
              aria-label="Page précédente"
            >
              <lucide-icon [img]="ChevronLeftIcon" [size]="16" aria-hidden="true"></lucide-icon>
            </button>
          </li>
          @for (item of pages; track $index) {
            @if (item === 'ellipsis') {
              <li class="ori-pagination__ellipsis" aria-hidden="true">…</li>
            } @else {
              <li class="ori-pagination__item">
                <button
                  type="button"
                  class="ori-pagination__link"
                  [attr.aria-current]="item === page ? 'page' : null"
                  [attr.aria-label]="
                    item === page ? 'Page ' + item + ', page courante' : 'Page ' + item
                  "
                  (click)="item !== page && pageChange.emit(item)"
                >
                  {{ item }}
                </button>
              </li>
            }
          }
          <li class="ori-pagination__item">
            <button
              type="button"
              class="ori-pagination__link"
              [disabled]="!canNext"
              (click)="canNext && pageChange.emit(page + 1)"
              aria-label="Page suivante"
            >
              <lucide-icon [img]="ChevronRightIcon" [size]="16" aria-hidden="true"></lucide-icon>
            </button>
          </li>
        </ol>
      </nav>
    }
  `,
})
export class OriPaginationComponent implements OnChanges {
  @Input() page: number = 1;
  @Input() totalPages: number = 1;
  @Input() siblings: number = 1;
  @Input() ariaLabel: string = 'Pagination';

  @Output() pageChange = new EventEmitter<number>();

  pages: PageItem[] = [];

  protected readonly ChevronLeftIcon: LucideIconData = ChevronLeft;
  protected readonly ChevronRightIcon: LucideIconData = ChevronRight;

  get canPrev(): boolean {
    return this.page > 1;
  }

  get canNext(): boolean {
    return this.page < this.totalPages;
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.pages = buildPageList(this.page, this.totalPages, this.siblings);
  }
}
