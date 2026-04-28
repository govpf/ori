import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

export interface OriLegalDefinitionListItem {
  term: string;
  description: string;
}

/**
 * Liste de définitions clé/valeur pour les pages légales (adresse,
 * téléphone, courriel, numéro Tahiti, DPO, etc.).
 *
 * Rendue en grille responsive : libellé à gauche en gras, valeur à droite.
 */
@Component({
  selector: 'ori-legal-definition-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<dl class="ori-legal-dl">
    @for (item of items; track item.term) {
      <dt>{{ item.term }}</dt>
      <dd>{{ item.description }}</dd>
    }
  </dl>`,
})
export class OriLegalDefinitionListComponent {
  @Input({ required: true }) items: OriLegalDefinitionListItem[] = [];
}
