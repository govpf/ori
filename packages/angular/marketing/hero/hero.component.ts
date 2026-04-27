import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

/**
 * Bloc Hero pour landing page institutionnelle.
 *
 * Composition typique :
 *
 *   <ori-hero
 *     eyebrow="Démarches en ligne"
 *     title="..."
 *     subtitle="...">
 *     <ori-button variant="primary">Commencer</ori-button>
 *     <ori-button variant="ghost">En savoir plus</ori-button>
 *   </ori-hero>
 */
@Component({
  selector: 'ori-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<section [class]="classes">
    <div class="ori-hero__inner">
      @if (eyebrow) {
        <span class="ori-hero__eyebrow">{{ eyebrow }}</span>
      }
      <h1 class="ori-hero__title">{{ title }}</h1>
      @if (subtitle) {
        <p class="ori-hero__subtitle">{{ subtitle }}</p>
      }
      <div class="ori-hero__actions">
        <ng-content></ng-content>
      </div>
    </div>
  </section>`,
})
export class OriHeroComponent {
  @Input({ required: true }) title!: string;
  @Input() eyebrow?: string;
  @Input() subtitle?: string;
  @Input() muted: boolean = false;

  get classes(): string {
    return ['ori-hero', this.muted ? 'ori-hero--muted' : null]
      .filter((c): c is string => Boolean(c))
      .join(' ');
  }
}
