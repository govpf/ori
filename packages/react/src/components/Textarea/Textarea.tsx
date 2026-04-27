import { forwardRef, useId } from 'react';
import type { TextareaHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  wrapperClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, required, wrapperClassName, id, className, rows = 4, ...rest },
  ref,
) {
  const reactId = useId();
  const textareaId = id ?? reactId;
  const hintId = hint ? `${textareaId}-hint` : undefined;
  const errorId = error ? `${textareaId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={clsx('ori-field', wrapperClassName)}>
      {label && (
        <label
          htmlFor={textareaId}
          className={clsx('ori-field__label', required && 'ori-field__label--required')}
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={clsx('ori-textarea', className)}
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
