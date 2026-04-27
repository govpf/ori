import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  size?: InputSize;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
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
