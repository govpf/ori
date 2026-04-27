import { forwardRef, useEffect, useId, useRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  /**
   * État indéterminé. Indépendant de `checked` (un checkbox indéterminé peut
   * être checked ou non, c'est une indication visuelle pour des sélections
   * partielles - typiquement le checkbox d'un header de table qui sélectionne
   * une partie des lignes).
   */
  indeterminate?: boolean;
  wrapperClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, hint, error, indeterminate, wrapperClassName, id, className, disabled, ...rest },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  // Indeterminate n'est pas un attribut HTML, c'est une property de l'élément
  // DOM uniquement. On la pose après le render via ref.
  const localRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (localRef.current) {
      localRef.current.indeterminate = Boolean(indeterminate);
    }
  }, [indeterminate]);

  return (
    <label
      className={clsx('ori-choice', wrapperClassName)}
      data-disabled={disabled ? 'true' : undefined}
    >
      <input
        ref={(node) => {
          localRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        id={inputId}
        type="checkbox"
        className={clsx('ori-checkbox', className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        disabled={disabled}
        {...rest}
      />
      {(label || hint || error) && (
        <span className="ori-choice__label">
          {label}
          {hint && !error && (
            <span id={hintId} className="ori-choice__hint">
              {hint}
            </span>
          )}
          {error && (
            <span
              id={errorId}
              className="ori-choice__hint"
              role="alert"
              style={{ color: 'var(--color-feedback-danger)' }}
            >
              {error}
            </span>
          )}
        </span>
      )}
    </label>
  );
});
