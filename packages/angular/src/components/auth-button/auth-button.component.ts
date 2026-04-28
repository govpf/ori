import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

export type OriAuthButtonVariant = 'rumia' | 'gov-connect' | 'microsoft';

const DEFAULT_LABELS: Record<OriAuthButtonVariant, string> = {
  rumia: 'Se connecter avec Rumia',
  'gov-connect': 'Se connecter avec GOV Connect',
  microsoft: 'Se connecter avec Microsoft',
};

/**
 * Bouton d'authentification fédérée.
 *
 * Trois variantes imposées par les chartes des fournisseurs :
 * - `rumia` : IdP usager (peuple polynésien)
 * - `gov-connect` : IdP agent (broker vers Entra ID)
 * - `microsoft` : Entra ID direct, Microsoft Identity Branding Guidelines
 *
 * Le logo Rumia n'est pas embarqué dans le composant : projeter une `<img>`
 * via le slot `[oriAuthLogo]` ou laisser le slot vide. Pour Microsoft et
 * GOV Connect, le logo officiel est rendu en SVG inline.
 *
 * Usage :
 *
 *   <ori-auth-button variant="rumia">
 *     <img oriAuthLogo src="/assets/rumia-logo.png" alt="" />
 *   </ori-auth-button>
 *
 *   <ori-auth-button variant="gov-connect"></ori-auth-button>
 *   <ori-auth-button variant="microsoft" href="/login/microsoft"></ori-auth-button>
 */
@Component({
  selector: 'ori-auth-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `@if (href) {
      <a [class]="classes" [href]="href">
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </a>
    } @else {
      <button type="button" [class]="classes" [disabled]="disabled">
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </button>
    }

    <ng-template #content>
      <span class="ori-auth-btn__logo">
        @if (variant === 'microsoft') {
          <svg
            viewBox="0 0 21 21"
            aria-hidden="true"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0" y="0" width="9.5" height="9.5" fill="#F25022" />
            <rect x="11" y="0" width="9.5" height="9.5" fill="#7FBA00" />
            <rect x="0" y="11" width="9.5" height="9.5" fill="#00A4EF" />
            <rect x="11" y="11" width="9.5" height="9.5" fill="#FFB900" />
          </svg>
        } @else {
          <ng-content select="[oriAuthLogo]"></ng-content>
        }
      </span>
      <span>{{ label || defaultLabel }}</span>
    </ng-template>`,
  imports: [NgTemplateOutlet],
})
export class OriAuthButtonComponent {
  @Input({ required: true }) variant!: OriAuthButtonVariant;
  @Input() label?: string;
  @Input() href?: string;
  @Input() disabled: boolean = false;

  get classes(): string {
    return `ori-auth-btn ori-auth-btn--${this.variant}`;
  }

  get defaultLabel(): string {
    return DEFAULT_LABELS[this.variant];
  }
}
