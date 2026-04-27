import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  ViewEncapsulation,
  signal,
} from '@angular/core';

export interface OriTocItem {
  depth: number;
  slug: string;
  text: string;
}

/**
 * Table des matières latérale avec scroll-spy.
 *
 * Les `headings` sont en général fournis par le compilateur MDX du framework
 * (Analog, Scully, etc.) qui les extrait à la compilation. Le scroll-spy marque
 * le titre actif via `aria-current="true"` à mesure que l'utilisateur scrolle.
 */
@Component({
  selector: 'ori-toc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `@if (filtered.length > 0) {
    <nav class="ori-toc" [attr.aria-label]="title">
      <p class="ori-toc__title">{{ title }}</p>
      <ol class="ori-toc__list">
        @for (h of filtered; track h.slug) {
          <li>
            <a
              class="ori-toc__link"
              [href]="'#' + h.slug"
              [attr.aria-current]="activeId() === h.slug ? 'true' : null"
              [style.padding-left]="h.depth === 3 ? '1.5rem' : null"
            >
              {{ h.text }}
            </a>
          </li>
        }
      </ol>
    </nav>
  }`,
})
export class OriTocComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) headings: OriTocItem[] = [];
  @Input() title: string = 'Sur cette page';
  @Input() depths: number[] = [2, 3];

  protected readonly activeId = signal<string | null>(null);
  private observer?: IntersectionObserver;

  get filtered(): OriTocItem[] {
    return this.headings.filter((h) => this.depths.includes(h.depth));
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || this.filtered.length === 0) return;
    const targets = this.filtered
      .map((h) => document.getElementById(h.slug))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) this.activeId.set(visible.target.id);
      },
      { rootMargin: '-20% 0px -70% 0px' },
    );
    targets.forEach((t) => this.observer!.observe(t));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
