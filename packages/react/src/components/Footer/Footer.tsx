import type { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

export interface FooterColumn {
  title: ReactNode;
  links: { label: ReactNode; href: string }[];
}

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  /** Texte de marque / signature institutionnelle. */
  brand?: ReactNode;
  /** Description courte sous la marque. */
  description?: ReactNode;
  /** Colonnes de liens (services, démarches, contact, etc.). */
  columns?: FooterColumn[];
  /** Mention légale en bas. */
  legal?: ReactNode;
  /** Liens utilitaires en bas (mentions légales, accessibilité, plan du site). */
  utilityLinks?: { label: ReactNode; href: string }[];
}

/**
 * Footer app-level. Construit en 3 zones empilées :
 * - en haut : brand/description + colonnes de liens
 * - séparateur
 * - en bas : mention légale + liens utilitaires (accessibilité, mentions, etc.)
 */
export function Footer({
  brand = 'Polynésie française',
  description,
  columns = [],
  legal,
  utilityLinks = [],
  className,
  children,
  ...rest
}: FooterProps) {
  return (
    <footer className={clsx('ori-footer', className)} {...rest}>
      {children ?? (
        <>
          <div className="ori-footer__content">
            <div className="ori-footer__brand">
              <strong style={{ color: 'var(--color-text-primary)', fontSize: '0.9375rem' }}>
                {brand}
              </strong>
              {description && <span>{description}</span>}
            </div>
            {columns.length > 0 && (
              <div className="ori-footer__columns">
                {columns.map((col, i) => (
                  <div key={i} className="ori-footer__column">
                    <span className="ori-footer__column-title">{col.title}</span>
                    {col.links.map((link, j) => (
                      <a key={j} href={link.href} className="ori-link ori-link--quiet">
                        {link.label}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
          {(legal || utilityLinks.length > 0) && (
            <div className="ori-footer__bottom">
              {legal && <span>{legal}</span>}
              {utilityLinks.length > 0 && (
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {utilityLinks.map((link, i) => (
                    <a key={i} href={link.href} className="ori-link ori-link--quiet">
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </footer>
  );
}
