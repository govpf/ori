import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { clsx } from 'clsx';

/**
 * EmptyState inline.
 *
 * Bloc d'absence de données, à utiliser quand une zone (liste, table,
 * recherche, page) ne contient rien à afficher. Communique trois choses :
 * pourquoi c'est vide, ce que l'utilisateur peut faire, comment le faire.
 *
 * Pas de role ARIA dédié : l'EmptyState est un contenu textuel normal qui
 * vit dans le flux du document. Si la page est entièrement composée d'un
 * EmptyState (404 par exemple), envisager `<ErrorPage>` à la place qui pose
 * la sémantique de niveau page.
 *
 * Tailles :
 * - `sm` : pour les petites zones (filtre vide dans une table, dropdown
 *   sans résultat) ; icône 32px, padding compact
 * - `md` : taille par défaut, pour la majorité des cas (liste vide d'une
 *   page applicative) ; icône 48px
 * - `lg` : pour les écrans entièrement vides (premier login, onboarding) ;
 *   icône 64px, padding aéré
 */

export type EmptyStateSize = 'sm' | 'md' | 'lg';

export interface EmptyStateProps {
  /** Icône décorative (rendue avec aria-hidden). */
  icon?: ReactNode;
  /** Titre court explicitant l'état vide. */
  title: ReactNode;
  /** Description optionnelle (1-2 phrases) sur le pourquoi et l'action. */
  description?: ReactNode;
  /** Boutons d'action ; 2 max (primaire + secondaire). */
  actions?: ReactNode;
  size?: EmptyStateSize;
  className?: string;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { icon, title, description, actions, size = 'md', className },
  ref,
) {
  return (
    <div ref={ref} className={clsx('ori-empty-state', `ori-empty-state--${size}`, className)}>
      {icon && (
        <span className="ori-empty-state__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <h3 className="ori-empty-state__title">{title}</h3>
      {description && <p className="ori-empty-state__description">{description}</p>}
      {actions && <div className="ori-empty-state__actions">{actions}</div>}
    </div>
  );
});
