import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { clsx } from 'clsx';

/**
 * Login layout générique.
 *
 * Page d'authentification : logo + carte centrée verticalement et
 * horizontalement contenant titre / description / contenu (formulaire,
 * AuthButton GOV Connect, etc.) + footer optionnel.
 *
 * Volontairement agnostique : le DS pose le layout, l'app projette son
 * contenu d'authentification (formulaire de mot de passe, bouton fournisseur
 * d'identité, sélecteur d'IdP, …). Pour brancher GOV Connect, glisser un
 * `<AuthButton>` dans le slot principal.
 *
 * Pas de role ARIA dédié sur la carte : c'est un layout, pas une région
 * sémantique. Le titre est en h1 (par défaut une page de login = page
 * autonome avec son propre h1).
 */

export interface LoginLayoutProps {
  /** Logo affiché au-dessus de la carte (typiquement <Logo>). */
  logo?: ReactNode;
  /** Titre de la page (h1). */
  title: ReactNode;
  /** Description courte sous le titre. */
  description?: ReactNode;
  /** Contenu principal (formulaire, AuthButton, mix). */
  children?: ReactNode;
  /** Pied de carte : liens secondaires (mot de passe oublié, créer un compte). */
  cardFooter?: ReactNode;
  /** Pied de page sous la carte : mentions légales, copyright. */
  footer?: ReactNode;
  className?: string;
}

export const LoginLayout = forwardRef<HTMLDivElement, LoginLayoutProps>(function LoginLayout(
  { logo, title, description, children, cardFooter, footer, className },
  ref,
) {
  return (
    <div ref={ref} className={clsx('ori-login-layout', className)}>
      <div className="ori-login-layout__inner">
        {logo && <div className="ori-login-layout__logo">{logo}</div>}
        <div className="ori-login-layout__card">
          <header className="ori-login-layout__header">
            <h1 className="ori-login-layout__title">{title}</h1>
            {description && <p className="ori-login-layout__description">{description}</p>}
          </header>
          <div className="ori-login-layout__body">{children}</div>
          {cardFooter && <div className="ori-login-layout__card-footer">{cardFooter}</div>}
        </div>
        {footer && <div className="ori-login-layout__footer">{footer}</div>}
      </div>
    </div>
  );
});
