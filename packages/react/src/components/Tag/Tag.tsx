import type { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

export type TagVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onRemove'> {
  variant?: TagVariant;
  /**
   * Si défini, affiche un bouton de suppression à droite. La callback
   * reçoit l'événement click pour permettre `stopPropagation()` si le
   * Tag est dans un container cliquable.
   */
  onRemove?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Étiquette ARIA du bouton de suppression. */
  removeLabel?: string;
  children?: ReactNode;
}

/**
 * Tag (badge) pour afficher un état, une catégorie ou un filtre actif.
 * 5 variantes sémantiques. Optionnellement supprimable.
 */
export function Tag({
  variant = 'neutral',
  onRemove,
  removeLabel = 'Retirer',
  className,
  children,
  ...rest
}: TagProps) {
  return (
    <span className={clsx('ori-tag', `ori-tag--${variant}`, className)} {...rest}>
      {children}
      {onRemove && (
        <button
          type="button"
          className="ori-tag__remove"
          onClick={onRemove}
          aria-label={removeLabel}
        >
          <X size={12} aria-hidden="true" />
        </button>
      )}
    </span>
  );
}
