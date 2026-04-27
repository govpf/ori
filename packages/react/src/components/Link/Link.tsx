import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { ExternalLink } from 'lucide-react';

export type LinkVariant = 'default' | 'quiet';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: LinkVariant;
  /**
   * Si `true`, ajoute `target="_blank"` + `rel="noreferrer noopener"`
   * + une icône externe et un texte d'aide pour les lecteurs d'écran.
   * Détecté automatiquement si `href` commence par `http(s):` ou
   * démarre par `//`. Forcer à `false` pour désactiver.
   */
  external?: boolean;
  children?: ReactNode;
}

function isExternalUrl(href: string | undefined): boolean {
  if (!href) return false;
  return /^(https?:|\/\/)/i.test(href);
}

/**
 * Lien stylé : `<a>` natif avec couleur primaire et focus visible.
 *
 * Variante `quiet` : couleur héritée, soulignement uniquement au hover
 * (utile dans des listes de liens denses où le bleu serait trop fort).
 *
 * Détection automatique des liens externes : ajoute `target="_blank"`
 * + `rel="noreferrer noopener"` + icône + libellé "(nouvel onglet)" pour
 * les lecteurs d'écran.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { variant = 'default', external, className, children, href, target, rel, ...rest },
  ref,
) {
  const isExternal = external ?? isExternalUrl(href);
  const finalTarget = target ?? (isExternal ? '_blank' : undefined);
  const finalRel = rel ?? (isExternal ? 'noreferrer noopener' : undefined);

  return (
    <a
      ref={ref}
      href={href}
      target={finalTarget}
      rel={finalRel}
      className={clsx('ori-link', variant === 'quiet' && 'ori-link--quiet', className)}
      {...rest}
    >
      {children}
      {isExternal && (
        <>
          <ExternalLink size={14} className="ori-link__external" aria-hidden="true" />
          <span
            style={{
              position: 'absolute',
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: 'hidden',
              clip: 'rect(0,0,0,0)',
              whiteSpace: 'nowrap',
              border: 0,
            }}
          >
            (nouvel onglet)
          </span>
        </>
      )}
    </a>
  );
});
