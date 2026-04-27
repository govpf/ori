import { useId, type ProgressHTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';

export interface ProgressProps extends Omit<ProgressHTMLAttributes<HTMLProgressElement>, 'max'> {
  /** Valeur courante 0..max. Omettre pour mode indéterminé. */
  value?: number;
  /** Maximum. Default: 100. */
  max?: number;
  /** Label affiché au-dessus de la barre. */
  label?: ReactNode;
  /**
   * Si `true`, affiche la valeur en pourcentage à droite du label.
   * Default : `true` quand `label` est fourni et `value` connu.
   */
  showValue?: boolean;
  className?: string;
}

/**
 * Barre de progression basée sur l'élément `<progress>` natif HTML
 * (cf. décision G.2). Mode indéterminé gratuit en omettant `value`.
 */
export function Progress({
  value,
  max = 100,
  label,
  showValue,
  className,
  id,
  ...rest
}: ProgressProps) {
  const reactId = useId();
  const progressId = id ?? reactId;
  const indeterminate = value === undefined;
  const displayValue = !indeterminate ? Math.round((value / max) * 100) : null;
  const shouldShowValue = showValue ?? (label && displayValue !== null);

  if (!label) {
    return (
      <progress
        id={progressId}
        value={value}
        max={max}
        className={clsx('ori-progress', className)}
        {...rest}
      />
    );
  }

  return (
    <div className="ori-progress-wrap">
      <div className="ori-progress__label">
        <label htmlFor={progressId}>{label}</label>
        {shouldShowValue && <span className="ori-progress__value">{displayValue}%</span>}
      </div>
      <progress
        id={progressId}
        value={value}
        max={max}
        className={clsx('ori-progress', className)}
        {...rest}
      />
    </div>
  );
}
