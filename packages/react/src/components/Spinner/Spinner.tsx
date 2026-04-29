import { forwardRef } from 'react';
import { clsx } from 'clsx';

/**
 * Spinner inline accessible.
 *
 * Indicateur de chargement compact, destiné à se glisser dans un bouton, un
 * champ ou un texte sans imposer de taille fixe au parent. Pour les
 * chargements pleine page, utiliser le Skeleton ou un overlay applicatif
 * dédié plutôt qu'un Spinner.
 *
 * a11y :
 * - `role="status"` (annonce polite par défaut)
 * - `aria-label` requis (ex : "Chargement…", "Vérification…", "Envoi…")
 * - `aria-hidden="true"` sur le SVG pour ne pas dupliquer le label
 *
 * Couleur : héritée du contexte via `currentColor` ; pour forcer une teinte,
 * appliquer une classe Tailwind ou une CSS variable au parent.
 */

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'aria-label'> {
  /** Taille : sm = 12px, md = 16px (défaut), lg = 20px. */
  size?: SpinnerSize;
  /** Label accessible annoncé par les lecteurs d'écran. */
  label?: string;
}

const sizeMap: Record<SpinnerSize, number> = { sm: 12, md: 16, lg: 20 };

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'md', label = 'Chargement…', className, ...rest },
  ref,
) {
  const px = sizeMap[size];
  return (
    <span
      ref={ref}
      role="status"
      aria-label={label}
      className={clsx('ori-spinner', `ori-spinner--${size}`, className)}
      {...rest}
    >
      <svg
        className="ori-spinner__svg"
        viewBox="0 0 16 16"
        width={px}
        height={px}
        aria-hidden="true"
        focusable="false"
      >
        <circle
          cx="8"
          cy="8"
          r="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="28 12"
        />
      </svg>
    </span>
  );
});
