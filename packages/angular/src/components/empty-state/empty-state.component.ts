import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

export type OriEmptyStateSize = 'sm' | 'md' | 'lg';

/**
 * EmptyState inline.
 *
 * Bloc d'absence de données : zone vide d'une liste, recherche sans résultat,
 * onboarding. Communique pourquoi c'est vide, ce que l'utilisateur peut
 * faire et comment.
 *
 * Pas de role ARIA dédié : c'est du contenu textuel normal qui vit dans le
 * flux. Pour une page entièrement vide (404), envisager `<ori-error-page>`
 * qui pose la sémantique de niveau page.
 *
 * Slots : `slot="icon"` (rendu en aria-hidden), `slot="actions"` (boutons,
 * 2 max recommandé).
 */
@Component({
  selector: 'ori-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="'ori-empty-state ori-empty-state--' + size">
      <span class="ori-empty-state__icon" aria-hidden="true">
        <ng-content select="[slot=icon]"></ng-content>
      </span>
      <h3 class="ori-empty-state__title">{{ title }}</h3>
      @if (description) {
        <p class="ori-empty-state__description">{{ description }}</p>
      }
      <div class="ori-empty-state__actions">
        <ng-content select="[slot=actions]"></ng-content>
      </div>
    </div>
  `,
})
export class OriEmptyStateComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() size: OriEmptyStateSize = 'md';
}
