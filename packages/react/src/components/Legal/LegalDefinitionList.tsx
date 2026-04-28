import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

export interface LegalDefinitionListItem {
  term: ReactNode;
  description: ReactNode;
}

export interface LegalDefinitionListProps extends HTMLAttributes<HTMLDListElement> {
  items: LegalDefinitionListItem[];
}

/**
 * Liste de définitions clé/valeur pour les pages légales (adresse,
 * téléphone, courriel, numéro Tahiti, DPO, etc.).
 *
 * Rendue en grille responsive : libellé à gauche en gras, valeur à droite.
 */
export const LegalDefinitionList = forwardRef<HTMLDListElement, LegalDefinitionListProps>(
  function LegalDefinitionList({ items, className, ...rest }, ref) {
    return (
      <dl ref={ref} className={clsx('ori-legal-dl', className)} {...rest}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'contents' }}>
            <dt>{item.term}</dt>
            <dd>{item.description}</dd>
          </div>
        ))}
      </dl>
    );
  },
);
