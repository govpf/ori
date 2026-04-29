import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

export type OriSpinnerSize = 'sm' | 'md' | 'lg';

/**
 * Spinner inline accessible.
 *
 * Indicateur de chargement compact pour bouton, champ ou texte. Pour les
 * chargements pleine page, utiliser un overlay applicatif dédié.
 *
 * a11y :
 * - role="status" (annonce polite par défaut)
 * - aria-label requis (par défaut "Chargement…")
 * - SVG en aria-hidden pour ne pas dupliquer le label
 *
 * Couleur : héritée du parent via currentColor.
 */
@Component({
  selector: 'ori-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span role="status" [attr.aria-label]="label" [class]="'ori-spinner ori-spinner--' + size">
      <svg
        class="ori-spinner__svg"
        viewBox="0 0 16 16"
        [attr.width]="px"
        [attr.height]="px"
        aria-hidden="true"
        focusable="false"
      >
        <circle
          cx="8"
          cy="8"
          r="6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-dasharray="28 12"
        />
      </svg>
    </span>
  `,
})
export class OriSpinnerComponent {
  /** Taille : sm = 12px, md = 16px (défaut), lg = 20px. */
  @Input() size: OriSpinnerSize = 'md';
  /** Label accessible annoncé par les lecteurs d'écran. */
  @Input() label: string = 'Chargement…';

  protected get px(): number {
    return this.size === 'sm' ? 12 : this.size === 'lg' ? 20 : 16;
  }
}
