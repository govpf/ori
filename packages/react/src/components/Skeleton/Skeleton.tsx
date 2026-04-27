import type { CSSProperties, HTMLAttributes } from 'react';
import { clsx } from 'clsx';

export type SkeletonVariant = 'text' | 'rect' | 'circle';

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: SkeletonVariant;
  /** Largeur (CSS valid value, default '100%' pour text/rect). */
  width?: string | number;
  /** Hauteur (CSS valid value). */
  height?: string | number;
}

/**
 * Skeleton placeholder animé (shimmer) pour indiquer un chargement.
 *
 * 3 variantes :
 * - `text` : ligne fine pour simuler du texte
 * - `rect` : rectangle pour simuler un bloc (image, card, etc.)
 * - `circle` : pastille pour simuler un avatar
 *
 * `aria-hidden="true"` automatique : le composant est purement
 * décoratif. L'app doit fournir un message de loading pour les
 * lecteurs d'écran via une zone live à part.
 */
export function Skeleton({
  variant = 'rect',
  width,
  height,
  className,
  style,
  ...rest
}: SkeletonProps) {
  const finalStyle: CSSProperties = {
    ...style,
    ...(width !== undefined && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height !== undefined && { height: typeof height === 'number' ? `${height}px` : height }),
  };

  return (
    <span
      className={clsx('ori-skeleton', `ori-skeleton--${variant}`, className)}
      style={finalStyle}
      aria-hidden="true"
      {...rest}
    />
  );
}
