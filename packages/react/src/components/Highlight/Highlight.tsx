import type { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

export interface HighlightProps extends HTMLAttributes<HTMLElement> {
  /**
   * Si fourni, surligne automatiquement les occurrences de cette
   * sous-chaîne dans `children` (insensible à la casse, sans regex).
   * Utile pour des résultats de recherche.
   */
  query?: string;
  children?: ReactNode;
}

/**
 * Surlignage sémantique basé sur l'élément `<mark>` natif HTML5
 * (annoncé correctement par les lecteurs d'écran).
 *
 * Mode 1 : `<Highlight>texte</Highlight>` - surligne tout le contenu
 * Mode 2 : `<Highlight query="ti">titre</Highlight>` - surligne
 *           uniquement les occurrences de `query`
 *
 * Quand `query` est passé mais vide (recherche inactive), le composant
 * renvoie les `children` tels quels sans surlignage. C'est le cas type
 * d'une liste filtrée par un input dont la valeur courante est `""`.
 */
export function Highlight({ query, className, children, ...rest }: HighlightProps) {
  // Mode 1 : pas de prop `query` du tout - surligne tout
  if (query === undefined) {
    return (
      <mark className={clsx('ori-highlight', className)} {...rest}>
        {children}
      </mark>
    );
  }

  // Mode 2 (recherche) : query passé mais vide ou children non-string -
  // pas de match possible, on rend sans surlignage
  if (query === '' || typeof children !== 'string') {
    return <>{children}</>;
  }

  // Mode "auto-highlight" sur une chaîne
  const text = children;
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const parts: ReactNode[] = [];
  let cursor = 0;
  let i = 0;
  while (cursor < text.length) {
    const idx = lowerText.indexOf(lowerQuery, cursor);
    if (idx === -1) {
      parts.push(text.slice(cursor));
      break;
    }
    if (idx > cursor) parts.push(text.slice(cursor, idx));
    parts.push(
      <mark key={i++} className={clsx('ori-highlight', className)} {...rest}>
        {text.slice(idx, idx + query.length)}
      </mark>,
    );
    cursor = idx + query.length;
  }
  return <>{parts}</>;
}
