import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

/**
 * Carte de feature dans une `<ori-feature-grid>`. L'icône est projetée via
 * un slot nommé : `<ng-content select="[oriFeatureIcon]"></ng-content>`.
 *
 * Usage typique :
 *
 *   <ori-feature-card title="Bundle minimal" description="...">
 *     <i-lucide oriFeatureIcon name="package" />
 *   </ori-feature-card>
 */
@Component({
  selector: 'ori-feature-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<article class="ori-feature-card">
    <span class="ori-feature-card__icon" aria-hidden="true">
      <ng-content select="[oriFeatureIcon]"></ng-content>
    </span>
    <h3 class="ori-feature-card__title">{{ title }}</h3>
    @if (description) {
      <p class="ori-feature-card__description">{{ description }}</p>
    }
    <ng-content></ng-content>
  </article>`,
})
export class OriFeatureCardComponent {
  @Input({ required: true }) title!: string;
  @Input() description?: string;
}
