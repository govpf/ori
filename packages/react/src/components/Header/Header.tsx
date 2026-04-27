import type { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import { Logo } from '../Logo/Logo.js';

export interface HeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /**
   * Logo personnalisé. Si omis, on rend le `<Logo>` par défaut avec
   * les props `title` et `subtitle`.
   */
  logo?: ReactNode;
  /** Titre passé au `<Logo>` par défaut. */
  title?: ReactNode;
  /** Sous-titre passé au `<Logo>` par défaut. */
  subtitle?: ReactNode;
  /** URL du logo (rendu comme `<a>`). */
  logoHref?: string;
}

/**
 * Header app-level en 3 zones (cf. décision J.1) :
 * - gauche : `<Header.Brand>` (par défaut, le `<Logo>` PF)
 * - centre : `<Header.Nav>` (typiquement un `<MainNavigation>`)
 * - droite : `<Header.Actions>` (zone applicative libre)
 *
 * Aucune logique métier hardcodée. L'app insère ce qu'elle veut dans
 * Actions (auth, notifications, profil, etc., cf. J.5).
 */
export function Header({
  logo,
  title,
  subtitle,
  logoHref,
  className,
  children,
  ...rest
}: HeaderProps) {
  // Si pas de children mais un logo/title/subtitle, on rend le brand
  // par défaut (cas d'usage minimal : `<Header />`)
  const hasChildren = Boolean(children);
  const defaultBrand = (
    <HeaderBrand>{logo ?? <Logo title={title} subtitle={subtitle} href={logoHref} />}</HeaderBrand>
  );

  return (
    <header className={clsx('ori-header', className)} {...rest}>
      {hasChildren ? children : defaultBrand}
    </header>
  );
}

export function HeaderBrand({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('ori-header__brand', className)} {...rest}>
      {children}
    </div>
  );
}

export function HeaderNav({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('ori-header__nav', className)} {...rest}>
      {children}
    </div>
  );
}

export function HeaderActions({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('ori-header__actions', className)} {...rest}>
      {children}
    </div>
  );
}

Header.Brand = HeaderBrand;
Header.Nav = HeaderNav;
Header.Actions = HeaderActions;
