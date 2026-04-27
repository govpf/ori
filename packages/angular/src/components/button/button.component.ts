import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

export type OriButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type OriButtonSize = 'sm' | 'md' | 'lg';
export type OriButtonType = 'button' | 'submit' | 'reset';

/**
 * Bouton du design system Ori.
 *
 * - Standalone (pas de NgModule).
 * - ViewEncapsulation.None : les classes `.ori-btn*` sont définies globalement
 *   par `@govpf/ori-css` (ou `@govpf/ori-tailwind-preset` côté app).
 * - Le contenu (texte, icône, etc.) est projeté via `<ng-content>` pour
 *   permettre la composition : `<ori-button><ori-icon /> Envoyer</ori-button>`.
 */
@Component({
  selector: 'ori-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<button
    [type]="type"
    [class]="classes"
    [disabled]="disabled"
    [attr.aria-disabled]="disabled || null"
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

  get classes(): string {
    return [
      'ori-btn',
      `ori-btn--${this.variant}`,
      this.size !== 'md' ? `ori-btn--${this.size}` : null,
      this.block ? 'ori-btn--block' : null,
    ]
      .filter((c): c is string => Boolean(c))
      .join(' ');
  }
}
