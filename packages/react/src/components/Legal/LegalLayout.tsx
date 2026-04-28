import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

export interface LegalLayoutProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /**
   * Breadcrumb projeté en haut de la page. Optionnel : pour une page
   * autonome (route racine), on peut l'omettre.
   */
  breadcrumb?: ReactNode;
  /**
   * Titre principal (h1) de la page éditoriale.
   */
  title: ReactNode;
  /**
   * Sous-titre court (1-2 lignes) qui résume le rôle de la page.
   */
  subtitle?: ReactNode;
}

/**
 * Mise en page pour les contenus éditoriaux longs : mentions légales,
 * politique RGPD, déclaration d'accessibilité, plan du site, CGU.
 *
 * Le DS fournit la structure et le rythme typographique. Le contenu
 * (responsable de publication, hébergeur, DPO, etc.) est rédigé par
 * chaque service consommateur, qui projette des `<LegalSection>` en
 * children.
 */
export const LegalLayout = forwardRef<HTMLElement, LegalLayoutProps>(function LegalLayout(
  { breadcrumb, title, subtitle, className, children, ...rest },
  ref,
) {
  return (
    <article ref={ref} className={clsx('ori-legal-layout', className)} {...rest}>
      <header className="ori-legal-layout__header">
        {breadcrumb}
        <h1 className="ori-legal-layout__title">{title}</h1>
        {subtitle && <p className="ori-legal-layout__subtitle">{subtitle}</p>}
      </header>
      {children}
    </article>
  );
});
