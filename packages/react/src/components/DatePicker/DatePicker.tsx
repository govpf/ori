import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

export type DatePickerSize = 'sm' | 'md' | 'lg';

export interface DatePickerProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  size?: DatePickerSize;
  /**
   * Valeur au format ISO `yyyy-mm-dd` (format imposé par
   * `<input type="date">`). Le format d'affichage à l'écran dépend du
   * navigateur et de la locale système (en `fr-FR` ou `fr-PF`, c'est
   * `JJ/MM/AAAA` automatiquement).
   */
  value?: string;
  /** Date min ISO (yyyy-mm-dd). */
  min?: string;
  /** Date max ISO (yyyy-mm-dd). */
  max?: string;
  wrapperClassName?: string;
}

/**
 * DatePicker wrappant `<input type="date">`.
 *
 * Choix volontaire (cf. décision E.2) : on garde le natif. Le format
 * d'affichage suit la locale du navigateur ; la valeur reste ISO côté
 * modèle pour rester compatible avec les API. Pour des cas avancés
 * (range picker, désactivation de jours, locale custom), un composant
 * calendrier custom sera introduit plus tard à la demande.
 */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker(
  { label, hint, error, required, size = 'md', wrapperClassName, id, className, ...rest },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={clsx('ori-field', wrapperClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className={clsx('ori-field__label', required && 'ori-field__label--required')}
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type="date"
        className={clsx('ori-input', size !== 'md' && `ori-input--${size}`, className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        required={required}
        {...rest}
      />
      {hint && !error && (
        <span id={hintId} className="ori-field__hint">
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className="ori-field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
});
