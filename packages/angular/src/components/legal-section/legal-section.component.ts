import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

export type OriLegalSectionVariant = 'default' | 'flat';

/**
 * Bloc thématique au sein d'un `<ori-legal-layout>`. Présente un titre
 * h2 et un corps de texte rythmé selon les conventions Ori.
 *
 * Variante `flat` : visuellement plus discret (fond muted, padding
 * réduit), pour un bloc de fin de page comme la date de mise à jour.
 */
@Component({
  selector: 'ori-legal-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<section [class]="classes">
    @if (title) {
      <h2 class="ori-legal-section__title">{{ title }}</h2>
    }
    <ng-content></ng-content>
  </section>`,
})
export class OriLegalSectionComponent {
  @Input() title?: string;
  @Input() variant: OriLegalSectionVariant = 'default';

  get classes(): string {
    return [
      'ori-legal-section',
      this.variant !== 'default' ? `ori-legal-section--${this.variant}` : null,
    ]
      .filter((c): c is string => Boolean(c))
      .join(' ');
  }
}
