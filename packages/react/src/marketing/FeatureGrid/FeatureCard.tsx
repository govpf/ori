import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

export interface FeatureCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
}

/**
 * Carte de feature dans une FeatureGrid. Le contenu peut être passé via
 * `description` ou via `children` pour une mise en forme plus libre.
 */
export const FeatureCard = forwardRef<HTMLElement, FeatureCardProps>(function FeatureCard(
  { icon, title, description, className, children, ...rest },
  ref,
) {
  return (
    <article ref={ref} className={clsx('ori-feature-card', className)} {...rest}>
      {icon && (
        <span className="ori-feature-card__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <h3 className="ori-feature-card__title">{title}</h3>
      {description && <p className="ori-feature-card__description">{description}</p>}
      {children}
    </article>
  );
});
