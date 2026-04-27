import { forwardRef, useId } from 'react';
import type { SelectHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  size?: SelectSize;
  /**
   * Liste d'options. Alternative à passer des `<option>` en children.
   * Si les deux sont fournis, `options` a la priorité.
   */
  options?: SelectOption[];
  /** Texte affiché tant qu'aucune option n'est sélectionnée. */
  placeholder?: string;
  wrapperClassName?: string;
}

/**
 * Select wrappant `<select>` natif.
 *
 * Choix volontaire (cf. décision E.1) : on garde le natif pour l'a11y,
 * la cohérence mobile (picker système) et le bundle minimal. Si un cas
 * d'usage demande search ou multi-select stylé, on introduira un
 * `<Combobox>` séparé sans casser cette API.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    hint,
    error,
    required,
    size = 'md',
    options,
    placeholder,
    wrapperClassName,
    id,
    className,
    children,
    ...rest
  },
  ref,
) {
  const reactId = useId();
  const selectId = id ?? reactId;
  const hintId = hint ? `${selectId}-hint` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={clsx('ori-field', wrapperClassName)}>
      {label && (
        <label
          htmlFor={selectId}
          className={clsx('ori-field__label', required && 'ori-field__label--required')}
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={clsx('ori-select', size !== 'md' && `ori-select--${size}`, className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        required={required}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
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
