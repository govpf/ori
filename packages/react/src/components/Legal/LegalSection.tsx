import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

export type LegalSectionVariant = 'default' | 'flat';

export interface LegalSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /**
   * Titre de la section (h2 sémantique). Optionnel pour les blocs
   * périphériques (date de mise à jour, etc.).
   */
  title?: ReactNode;
  /**
   * `flat` : visuellement plus discret (fond muted, padding réduit),
   * pour des informations de bas de page comme la date de dernière
   * mise à jour.
   */
  variant?: LegalSectionVariant;
}

/**
 * Bloc thématique au sein d'un `<LegalLayout>`. Présente un titre h2 et
 * un corps de texte rythmé selon les conventions Ori (paragraphes, gras,
 * listes de définitions via `<LegalDefinitionList>`).
 */
export const LegalSection = forwardRef<HTMLElement, LegalSectionProps>(function LegalSection(
  { title, variant = 'default', className, children, ...rest },
  ref,
) {
  return (
    <section
      ref={ref}
      className={clsx(
        'ori-legal-section',
        variant !== 'default' && `ori-legal-section--${variant}`,
        className,
      )}
      {...rest}
    >
      {title && <h2 className="ori-legal-section__title">{title}</h2>}
      {children}
    </section>
  );
});
