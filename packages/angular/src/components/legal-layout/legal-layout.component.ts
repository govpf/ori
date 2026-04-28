import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

/**
 * Mise en page pour les contenus éditoriaux longs : mentions légales,
 * politique RGPD, déclaration d'accessibilité, plan du site, CGU.
 *
 * Le breadcrumb est projeté via le slot nommé `[oriLegalBreadcrumb]`,
 * les sections via le slot par défaut.
 */
@Component({
  selector: 'ori-legal-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<article class="ori-legal-layout">
    <header class="ori-legal-layout__header">
      <ng-content select="[oriLegalBreadcrumb]"></ng-content>
      <h1 class="ori-legal-layout__title">{{ title }}</h1>
      @if (subtitle) {
        <p class="ori-legal-layout__subtitle">{{ subtitle }}</p>
      }
    </header>
    <ng-content></ng-content>
  </article>`,
})
export class OriLegalLayoutComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
}
