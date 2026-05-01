import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

/**
 * Login layout générique.
 *
 * Page d'authentification : carte centrée contenant logo + titre +
 * contenu (formulaire, AuthButton, etc.) + cardFooter optionnel.
 * Footer hors carte (mentions légales) optionnel.
 *
 * Pattern visuel aligné sur la mire Keycloak `AuthLogin.mdx` (décision
 * K.1) : logo et titre vivent dans la carte pour offrir une expérience
 * d'authentification cohérente entre la mire SSO et les pages de
 * connexion d'apps internes.
 *
 * Slots :
 * - `slot="logo"` : logo en haut de la carte (centré)
 * - `slot="cardFooter"` : pied de carte (créer un compte)
 * - `slot="footer"` : pied de page sous la carte (mentions légales, copyright)
 * - projection par défaut : contenu principal de la carte (formulaire, boutons)
 */
@Component({
  selector: 'ori-login-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ori-login-layout">
      <div class="ori-login-layout__inner">
        <div class="ori-login-layout__card">
          @if (hasLogo) {
            <div class="ori-login-layout__logo">
              <ng-content select="[slot=logo]"></ng-content>
            </div>
          }
          <header class="ori-login-layout__header">
            <h1 class="ori-login-layout__title">{{ title }}</h1>
            @if (description) {
              <p class="ori-login-layout__description">{{ description }}</p>
            }
          </header>
          <div class="ori-login-layout__body">
            <ng-content></ng-content>
          </div>
          @if (hasCardFooter) {
            <div class="ori-login-layout__card-footer">
              <ng-content select="[slot=cardFooter]"></ng-content>
            </div>
          }
        </div>
        @if (hasFooter) {
          <div class="ori-login-layout__footer">
            <ng-content select="[slot=footer]"></ng-content>
          </div>
        }
      </div>
    </div>
  `,
})
export class OriLoginLayoutComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  /** Indique si le slot logo est utilisé. Default: false. */
  @Input() hasLogo: boolean = false;
  /** Indique si le slot cardFooter est utilisé. Default: false. */
  @Input() hasCardFooter: boolean = false;
  /** Indique si le slot footer est utilisé. Default: false. */
  @Input() hasFooter: boolean = false;
}
