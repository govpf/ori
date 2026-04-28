import { forwardRef } from 'react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

export type AuthButtonVariant = 'rumia' | 'gov-connect' | 'microsoft';

interface AuthButtonBaseProps {
  /**
   * Fournisseur d'identité ciblé. Détermine le label par défaut, le logo
   * et la charte visuelle. Aucun mélange usager/agent sur un même écran.
   */
  variant: AuthButtonVariant;
  /**
   * Override du libellé. Par défaut : "Se connecter avec <fournisseur>".
   */
  label?: ReactNode;
  /**
   * Override du logo. Permet de fournir un asset officiel récent ou un
   * SVG inline. Par défaut chaque variante affiche son logo officiel.
   */
  logo?: ReactNode;
}

type AuthButtonAsButton = AuthButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
    href?: undefined;
  };

type AuthButtonAsAnchor = AuthButtonBaseProps & AnchorHTMLAttributes<HTMLAnchorElement>;

export type AuthButtonProps = AuthButtonAsButton | AuthButtonAsAnchor;

const DEFAULT_LABELS: Record<AuthButtonVariant, string> = {
  rumia: 'Se connecter avec Rumia',
  'gov-connect': 'Se connecter avec GOV Connect',
  microsoft: 'Se connecter avec Microsoft',
};

function MicrosoftLogo() {
  return (
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
  );
}

function getDefaultLogo(variant: AuthButtonVariant, fallback?: ReactNode): ReactNode {
  if (fallback) return fallback;
  switch (variant) {
    case 'microsoft':
      return <MicrosoftLogo />;
    case 'gov-connect':
    case 'rumia':
      // Pas de SVG inline embarqué : le logo PF (gov-connect = identité de la
      // Polynésie française, fichier vectoriel détaillé) et le picto Rumia
      // sont des assets externes. L'intégrateur fournit l'image via la prop
      // `logo` :
      //
      //   <AuthButton variant="gov-connect"
      //     logo={<img src="/assets/logo-pf.svg" alt="" />} />
      //   <AuthButton variant="rumia"
      //     logo={<img src="/assets/rumia-logo.png" alt="" />} />
      //
      // Les fichiers officiels sont distribués par `@govpf/ori-css/assets/`
      // (`logo-pf.svg`, `rumia-logo.png`).
      return null;
    default:
      return null;
  }
}

/**
 * Bouton d'authentification fédérée.
 *
 * Trois variantes imposées par les chartes des fournisseurs :
 * - `rumia` : IdP usager (peuple polynésien)
 * - `gov-connect` : IdP agent (broker vers Entra ID)
 * - `microsoft` : Entra ID direct, Microsoft Identity Branding Guidelines
 *
 * Rendu en `<a>` si `href` est fourni, en `<button>` sinon.
 *
 * Pour la variante `rumia`, fournir le logo officiel via la prop `logo` :
 *   <AuthButton variant="rumia" logo={<img src={rumiaLogo} alt="" />} />
 * où `rumiaLogo` est importé depuis `@govpf/ori-css/assets/rumia-logo.png`.
 */
export const AuthButton = forwardRef<HTMLElement, AuthButtonProps>(function AuthButton(props, ref) {
  const { variant, label, logo, className, children, ...rest } = props;
  const classes = clsx('ori-auth-btn', `ori-auth-btn--${variant}`, className);
  const resolvedLogo = getDefaultLogo(variant, logo);
  const content = (
    <>
      {resolvedLogo && <span className="ori-auth-btn__logo">{resolvedLogo}</span>}
      <span>{children ?? label ?? DEFAULT_LABELS[variant]}</span>
    </>
  );

  if ('href' in rest && rest.href !== undefined) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={classes}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  const { type = 'button', ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      className={classes}
      {...buttonRest}
    >
      {content}
    </button>
  );
});
