import {
  forwardRef,
  useId,
  type FormHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { clsx } from 'clsx';

/**
 * Form layout standardisé.
 *
 * Pose la structure standard d'un formulaire administratif : sections avec
 * titre + description, champs avec label + hint + erreur, actions en pied.
 * Espacement vertical et alignement cohérents entre toutes les apps.
 *
 * Volontairement minimal côté state : Ori ne fournit ni validation ni
 * gestion d'erreurs (chaque app a déjà sa lib préférée — react-hook-form,
 * Formik, Angular Reactive Forms, signals…). Le DS ne pose que la
 * structure visuelle et l'a11y, pas la logique métier.
 *
 * a11y :
 * - chaque <FormField> lie automatiquement le label au control via
 *   useId + htmlFor (l'enfant doit recevoir l'id via le contexte ou le
 *   poser manuellement)
 * - hint text et erreur sont liés via aria-describedby
 * - required marker rendu visuel (*) ET annoncé via aria-required sur le
 *   control (l'enfant doit lire la prop)
 *
 * Pattern composé : Form + FormSection + FormField + FormActions.
 */

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children?: ReactNode;
}

export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  { className, children, ...rest },
  ref,
) {
  return (
    <form ref={ref} className={clsx('ori-form', className)} noValidate {...rest}>
      {children}
    </form>
  );
});

export interface FormSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Titre de la section (peut être un ReactNode, pas seulement une string). */
  title?: ReactNode;
  /** Description courte (1-2 phrases). */
  description?: ReactNode;
  children?: ReactNode;
}

export const FormSection = forwardRef<HTMLElement, FormSectionProps>(function FormSection(
  { title, description, className, children, ...rest },
  ref,
) {
  const reactId = useId();
  const titleId = title ? `pf-form-section-${reactId}` : undefined;
  return (
    <section
      ref={ref}
      aria-labelledby={titleId}
      className={clsx('ori-form-section', className)}
      {...rest}
    >
      {(title || description) && (
        <header className="ori-form-section__header">
          {title && (
            <h3 id={titleId} className="ori-form-section__title">
              {title}
            </h3>
          )}
          {description && <p className="ori-form-section__description">{description}</p>}
        </header>
      )}
      <div className="ori-form-section__fields">{children}</div>
    </section>
  );
});

export interface FormFieldProps {
  /** Label du champ (obligatoire pour l'a11y). */
  label: ReactNode;
  /** Texte d'aide affiché sous le champ, lié via aria-describedby. */
  hint?: ReactNode;
  /** Message d'erreur affiché sous le champ, lié via aria-describedby. */
  error?: ReactNode;
  /** Affiche le marker visuel (*) et expose required à l'enfant. */
  required?: boolean;
  /** Render-prop : reçoit l'id, aria-describedby, aria-invalid à appliquer
   *  sur le control. */
  children: (renderProps: FormFieldRenderProps) => ReactNode;
  className?: string;
}

export interface FormFieldRenderProps {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  required?: boolean;
}

export function FormField({ label, hint, error, required, children, className }: FormFieldProps) {
  const reactId = useId();
  const id = `pf-form-field-${reactId}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={clsx('ori-form-field', error && 'ori-form-field--invalid', className)}>
      <label htmlFor={id} className="ori-form-field__label">
        {label}
        {required && (
          <span className="ori-form-field__required" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children({
        id,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
        required,
      })}
      {hint && (
        <p id={hintId} className="ori-form-field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="ori-form-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export interface FormActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** Aligne les boutons à gauche, centre ou droite (défaut). */
  align?: 'start' | 'center' | 'end';
  children?: ReactNode;
}

export const FormActions = forwardRef<HTMLDivElement, FormActionsProps>(function FormActions(
  { align = 'end', className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={clsx('ori-form-actions', `ori-form-actions--${align}`, className)}
      {...rest}
    >
      {children}
    </div>
  );
});
