import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

export type OriButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type OriButtonSize = 'sm' | 'md' | 'lg';
export type OriButtonType = 'button' | 'submit' | 'reset';

/**
 * Bouton du design system Ori.
 *
 * - Standalone (pas de NgModule).
 * - ViewEncapsulation.None : les classes `.ori-button*` sont définies globalement
 *   par `@govpf/ori-css` (ou `@govpf/ori-tailwind-preset` côté app).
 * - Le contenu (texte, icône, etc.) est projeté via `<ng-content>` pour
 *   permettre la composition : `<ori-button><ori-icon /> Envoyer</ori-button>`.
 */
@Component({
  selector: 'ori-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  // Le custom element <ori-button> a le rôle "generic" qui interdit
  // aria-label (axe : aria-prohibited-attr). On le retire du wrapper
  // pour le repropager sur le <button> interne où il est sémantiquement
  // valide.
  host: {
    '[attr.aria-label]': 'null',
  },
  template: `<button
    [type]="type"
    [class]="classes"
    [disabled]="disabled"
    [attr.aria-disabled]="disabled || null"
    [attr.aria-label]="ariaLabel"
  >
    <ng-content></ng-content>
  </button>`,
})
export class OriButtonComponent {
  @Input() variant: OriButtonVariant = 'primary';
  @Input() size: OriButtonSize = 'md';
  @Input() block: boolean = false;
  @Input() disabled: boolean = false;
  @Input() type: OriButtonType = 'button';
  /**
   * Forwardé sur le `<button>` interne, pour les boutons icon-only
   * qui doivent rester accessibles (lecteurs d'écran). À renseigner
   * obligatoirement quand le contenu projeté est uniquement visuel.
   *
   * L'alias `'aria-label'` permet d'écrire `<ori-button aria-label="...">`
   * comme sur un button HTML natif.
   */
  @Input('aria-label') ariaLabel: string | null = null;

  get classes(): string {
    return [
      'ori-button',
      `ori-button--${this.variant}`,
      this.size !== 'md' ? `ori-button--${this.size}` : null,
      this.block ? 'ori-button--block' : null,
    ]
      .filter((c): c is string => Boolean(c))
      .join(' ');
  }
}
