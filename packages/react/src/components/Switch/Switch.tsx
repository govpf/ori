import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode;
  hint?: ReactNode;
  wrapperClassName?: string;
}

/**
 * Bascule on/off pour un réglage qui s'applique immédiatement (à la
 * différence d'un Checkbox qui s'applique après validation d'un formulaire).
 *
 * Sémantique HTML : c'est un `<input type="checkbox" role="switch">`. Ça
 * combine la gestion native (focus, ESC, formulaires) avec la sémantique
 * "switch" pour les lecteurs d'écran.
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, hint, wrapperClassName, id, className, disabled, ...rest },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const hintId = hint ? `${inputId}-hint` : undefined;

  return (
    <label
      className={clsx('ori-choice', wrapperClassName)}
      data-disabled={disabled ? 'true' : undefined}
      htmlFor={inputId}
    >
      <span className="ori-switch">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          role="switch"
          className={clsx('ori-switch__input', className)}
          aria-describedby={hintId}
          disabled={disabled}
          {...rest}
        />
        <span className="ori-switch__track" aria-hidden="true" />
      </span>
      {(label || hint) && (
        <span className="ori-choice__label">
          {label}
          {hint && (
            <span id={hintId} className="ori-choice__hint">
              {hint}
            </span>
          )}
        </span>
      )}
    </label>
  );
});
