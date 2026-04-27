import { createContext, forwardRef, useContext, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

// ─── Context ─────────────────────────────────────────────────────────────
// Permet à <Radio> de hériter du `name`, `value` sélectionnée et `onChange`
// fournis par <RadioGroup> sans avoir à les passer manuellement à chaque item.

interface RadioGroupContextValue {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

// ─── Radio ───────────────────────────────────────────────────────────────

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode;
  hint?: ReactNode;
  /** Valeur de cet item du groupe. Obligatoire si imbriqué dans un RadioGroup. */
  value: string;
  wrapperClassName?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    label,
    hint,
    value,
    wrapperClassName,
    id,
    className,
    disabled,
    name,
    checked,
    onChange,
    ...rest
  },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const ctx = useContext(RadioGroupContext);

  // Si on est dans un RadioGroup, le name et l'état checked viennent du
  // context. Sinon, on retombe sur les props natives.
  const effectiveName = ctx?.name ?? name;
  const effectiveDisabled = disabled || ctx?.disabled;
  const effectiveChecked = ctx ? ctx.value === value : checked;
  const effectiveInvalid = ctx?.invalid;

  return (
    <label
      className={clsx('ori-choice', wrapperClassName)}
      data-disabled={effectiveDisabled ? 'true' : undefined}
    >
      <input
        ref={ref}
        id={inputId}
        type="radio"
        className={clsx('ori-radio', className)}
        name={effectiveName}
        value={value}
        checked={effectiveChecked}
        disabled={effectiveDisabled}
        aria-invalid={effectiveInvalid ? true : undefined}
        aria-describedby={hintId}
        onChange={(e) => {
          ctx?.onChange?.(value);
          onChange?.(e);
        }}
        {...rest}
      />
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

// ─── RadioGroup ──────────────────────────────────────────────────────────

export interface RadioGroupProps {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  /** Nom partagé par tous les radios du groupe. Auto-généré si omis. */
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  /** `inline` empile horizontalement, sinon verticalement. */
  orientation?: 'vertical' | 'inline';
  className?: string;
  children?: ReactNode;
}

export function RadioGroup({
  label,
  hint,
  error,
  required,
  name,
  value,
  defaultValue: _defaultValue,
  onChange,
  disabled,
  orientation = 'vertical',
  className,
  children,
}: RadioGroupProps) {
  const reactId = useId();
  const groupName = name ?? `pf-radiogroup-${reactId}`;
  const hintId = hint ? `${reactId}-hint` : undefined;
  const errorId = error ? `${reactId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <RadioGroupContext.Provider
      value={{ name: groupName, value, onChange, disabled, invalid: Boolean(error) }}
    >
      <fieldset
        className={clsx('ori-field', className)}
        style={{ border: 0, padding: 0, margin: 0 }}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
      >
        {label && (
          <legend className={clsx('ori-field__label', required && 'ori-field__label--required')}>
            {label}
          </legend>
        )}
        <div
          className={clsx(
            'ori-choice-group',
            orientation === 'inline' && 'ori-choice-group--inline',
          )}
          role="radiogroup"
        >
          {children}
        </div>
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
      </fieldset>
    </RadioGroupContext.Provider>
  );
}
