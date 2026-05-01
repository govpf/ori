import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { clsx } from 'clsx';

/**
 * Login layout générique.
 *
 * Page d'authentification : carte centrée verticalement et horizontalement,
 * contenant logo + titre + contenu (formulaire, AuthButton, etc.) +
 * cardFooter optionnel. Footer hors carte (mentions légales) optionnel.
 *
 * Pattern visuel aligné sur la mire Keycloak `AuthLogin.mdx` (décision
 * K.1) : logo et titre vivent dans la carte pour offrir une expérience
 * d'authentification cohérente entre la mire SSO et les pages de
 * connexion d'apps internes.
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
  /** Logo affiché en haut de la carte, centré (typiquement <Logo>). */
  logo?: ReactNode;
  /** Titre de la page (h1, centré). */
  title: ReactNode;
  /** Description courte sous le titre (centrée). */
  description?: ReactNode;
  /** Contenu principal (formulaire, AuthButton, mix). */
  children?: ReactNode;
  /** Pied de carte : liens secondaires (créer un compte). */
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
        <div className="ori-login-layout__card">
          {logo && <div className="ori-login-layout__logo">{logo}</div>}
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
