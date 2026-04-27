import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

export type FeatureGridProps = HTMLAttributes<HTMLDivElement>;

/**
 * Grille responsive de FeatureCard. Auto-fit sur des colonnes de 16rem
 * minimum, gap automatique. À combiner avec <FeatureCard>.
 */
export const FeatureGrid = forwardRef<HTMLDivElement, FeatureGridProps>(function FeatureGrid(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={clsx('ori-feature-grid', className)} {...rest}>
      {children}
    </div>
  );
});
