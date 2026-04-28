import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

export type OriErrorPageVariant = 'default' | 'maintenance' | 'danger';

/**
 * Page d'erreur ou de maintenance pleine hauteur.
 *
 * Pattern composé : un seul composant suffit pour les cas usuels (404, 403,
 * 500, 503). Le contenu (titre, description, CTAs) est passé en inputs ou
 * projeté via slots nommés (`[oriErrorActions]`, `[oriErrorDetail]`).
 *
 * Usage typique :
 *
 *   <ori-error-page
 *     code="404"
 *     title="Cette page est introuvable"
 *     description="...">
 *     <ori-button oriErrorActions variant="primary">Retour à l'accueil</ori-button>
 *   </ori-error-page>
 */
@Component({
  selector: 'ori-error-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<main [class]="classes" role="main">
    <div class="ori-error-page__inner">
      <span class="ori-error-page__code">{{ code }}</span>
      <h1 class="ori-error-page__title">{{ title }}</h1>
      @if (description) {
        <p class="ori-error-page__description">{{ description }}</p>
      }
      <div class="ori-error-page__actions">
        <ng-content select="[oriErrorActions]"></ng-content>
      </div>
      <ng-content></ng-content>
      <div class="ori-error-page__detail">
        <ng-content select="[oriErrorDetail]"></ng-content>
      </div>
    </div>
  </main>`,
})
export class OriErrorPageComponent {
  @Input({ required: true }) code!: string;
  @Input({ required: true }) title!: string;
  @Input() description?: string;
  @Input() variant: OriErrorPageVariant = 'default';

  get classes(): string {
    return ['ori-error-page', this.variant !== 'default' ? `ori-error-page--${this.variant}` : null]
      .filter((c): c is string => Boolean(c))
      .join(' ');
  }
}
