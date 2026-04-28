import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

export type ErrorPageVariant = 'default' | 'maintenance' | 'danger';

export interface ErrorPageProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /**
   * Code court affiché en badge au-dessus du titre. Typiquement un code
   * HTTP ("404", "403", "500", "503") ou un mot-clé ("Maintenance").
   */
  code: ReactNode;
  /**
   * Titre explicite (h1) de la page d'erreur, en français usager.
   */
  title: ReactNode;
  /**
   * Description longue (1-3 phrases) qui explique ce qui s'est passé et
   * ce que l'usager peut faire.
   */
  description?: ReactNode;
  /**
   * CTAs : un bouton primaire (retour accueil) + éventuellement un secondaire
   * (réessayer, contacter le support). Projeté via children pour rester libre
   * sur le contenu (ori-btn ou autre).
   */
  actions?: ReactNode;
  /**
   * Bloc de détail technique optionnel (référence d'incident, date de
   * fin de maintenance prévue, etc.).
   */
  detail?: ReactNode;
  /**
   * Variante visuelle. `maintenance` colore le badge en orange (warning),
   * `danger` en rouge (erreur serveur), `default` reste neutre.
   */
  variant?: ErrorPageVariant;
}

/**
 * Page d'erreur ou de maintenance pleine hauteur.
 *
 * Pattern composé : un seul composant suffit pour les cas usuels (404, 403,
 * 500, 503). Pour un cas particulier, projeter du contenu via `children`.
 */
export const ErrorPage = forwardRef<HTMLElement, ErrorPageProps>(function ErrorPage(
  { code, title, description, actions, detail, variant = 'default', className, children, ...rest },
  ref,
) {
  return (
    <main
      ref={ref}
      className={clsx(
        'ori-error-page',
        variant !== 'default' && `ori-error-page--${variant}`,
        className,
      )}
      role="main"
      {...rest}
    >
      <div className="ori-error-page__inner">
        <span className="ori-error-page__code">{code}</span>
        <h1 className="ori-error-page__title">{title}</h1>
        {description && <p className="ori-error-page__description">{description}</p>}
        {actions && <div className="ori-error-page__actions">{actions}</div>}
        {children}
        {detail && <div className="ori-error-page__detail">{detail}</div>}
      </div>
    </main>
  );
});
