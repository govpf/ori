import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

/**
 * Login layout générique.
 *
 * Page d'authentification : logo + carte centrée contenant titre /
 * description / contenu (formulaire, AuthButton, etc.) + footer optionnel.
 *
 * Volontairement agnostique : le DS pose le layout, l'app projette son
 * contenu d'authentification (formulaire de mot de passe, bouton fournisseur
 * d'identité, sélecteur d'IdP). Pour brancher GOV Connect, glisser un
 * `<ori-auth-button>` dans le slot principal.
 *
 * Slots :
 * - `slot="logo"` : logo au-dessus de la carte
 * - `slot="cardFooter"` : pied de carte (mot de passe oublié, créer un compte)
 * - `slot="footer"` : pied de page (mentions légales, copyright)
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
        @if (hasLogo) {
          <div class="ori-login-layout__logo">
            <ng-content select="[slot=logo]"></ng-content>
          </div>
        }
        <div class="ori-login-layout__card">
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
