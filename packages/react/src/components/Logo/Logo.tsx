import type { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import { CrestSvg } from './crest.js';

export interface LogoProps extends Omit<HTMLAttributes<HTMLAnchorElement>, 'title'> {
  /**
   * Lien cible. Si fourni, le logo est rendu comme `<a>`. Sinon
   * comme `<span>`.
   */
  href?: string;
  /** Titre principal (ex: nom du service ou de l'app). */
  title?: ReactNode;
  /** Sous-titre optionnel (ex: catégorie, branding sectoriel). */
  subtitle?: ReactNode;
  /**
   * Si `true`, masque le crest et n'affiche que le texte. Default: false.
   */
  hideCrest?: boolean;
}

/**
 * Logo institutionnel : écusson PF + titre/sous-titre.
 *
 * Cf. décision J.4 : asset SVG embarqué dans le DS pour garantir la
 * cohérence et permettre les mises à jour futures sans toucher aux apps.
 */
export function Logo({
  href,
  title = 'Polynésie française',
  subtitle,
  hideCrest,
  className,
  ...rest
}: LogoProps) {
  const content = (
    <>
      {!hideCrest && <CrestSvg className="ori-logo__crest" aria-hidden="true" />}
      <span className="ori-logo__text">
        {title && <span className="ori-logo__title">{title}</span>}
        {subtitle && <span className="ori-logo__subtitle">{subtitle}</span>}
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={clsx('ori-logo', className)} {...rest}>
        {content}
      </a>
    );
  }
  // Pas de href : on rend en span (l'a11y de "logo" est porté par le
  // texte, pas besoin de role explicite)
  return <span className={clsx('ori-logo', className)}>{content}</span>;
}
