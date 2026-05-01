import { createContext, forwardRef, useContext, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

interface RichRadioGroupContextValue {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
}

const RichRadioGroupContext = createContext<RichRadioGroupContextValue | null>(null);

export interface RichRadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  /** Valeur de l'option dans le groupe. Obligatoire. */
  value: string;
  /** Titre de l'option. */
  label: ReactNode;
  /** Description courte sous le titre. */
  description?: ReactNode;
  /**
   * Slot rendu en bord droit de la carte (image, icône, illustration).
   * Décoratif : aria-hidden recommandé sur le contenu projeté.
   */
  trailing?: ReactNode;
  wrapperClassName?: string;
}

/**
 * Option d'un `<RichRadioGroup>` rendue sous forme de carte.
 *
 * Reprend le pattern Radio classique : un input radio natif (donc
 * accessible clavier + lecteur d'écran), enveloppé dans un `<label>` qui
 * porte le visuel "carte" (bordure, padding, état sélectionné). À utiliser
 * quand le choix mérite une description ou un visuel d'accompagnement
 * (mode de livraison, type de profil, niveau d'abonnement, etc.).
 */
export const RichRadio = forwardRef<HTMLInputElement, RichRadioProps>(function RichRadio(
  {
    value,
    label,
    description,
    trailing,
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
  const descriptionId = description ? `${inputId}-desc` : undefined;
  const ctx = useContext(RichRadioGroupContext);

  const effectiveName = ctx?.name ?? name;
  const effectiveDisabled = disabled || ctx?.disabled;
  const effectiveChecked = ctx ? ctx.value === value : checked;
  const effectiveInvalid = ctx?.invalid;

  return (
    <label
      className={clsx(
        'ori-rich-radio',
        effectiveChecked && 'ori-rich-radio--checked',
        effectiveDisabled && 'ori-rich-radio--disabled',
        effectiveInvalid && 'ori-rich-radio--invalid',
        wrapperClassName,
      )}
    >
      <span className="ori-rich-radio__control">
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
          aria-describedby={descriptionId}
          onChange={(e) => {
            ctx?.onChange?.(value);
            onChange?.(e);
          }}
          {...rest}
        />
        <span className="ori-rich-radio__text">
          <span className="ori-rich-radio__label">{label}</span>
          {description && (
            <span id={descriptionId} className="ori-rich-radio__description">
              {description}
            </span>
          )}
        </span>
      </span>
      {trailing && <span className="ori-rich-radio__trailing">{trailing}</span>}
    </label>
  );
});

export interface RichRadioGroupProps {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  /** Nom partagé par tous les radios. Auto-généré si omis. */
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  /** Disposition des cartes. Défaut : `vertical`. */
  orientation?: 'vertical' | 'horizontal';
  className?: string;
  children?: ReactNode;
}

/**
 * Conteneur d'un groupe de `<RichRadio>`.
 *
 * Pose le `<fieldset>`/`<legend>`, propage le `name` partagé + l'état
 * (value, disabled, invalid) aux enfants via React Context.
 */
export function RichRadioGroup({
  label,
  hint,
  error,
  required,
  name,
  value,
  onChange,
  disabled,
  orientation = 'vertical',
  className,
  children,
}: RichRadioGroupProps) {
  const reactId = useId();
  const groupName = name ?? `ori-rich-radiogroup-${reactId}`;
  const hintId = hint ? `${reactId}-hint` : undefined;
  const errorId = error ? `${reactId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <RichRadioGroupContext.Provider
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
            'ori-rich-radio-group',
            orientation === 'horizontal' && 'ori-rich-radio-group--horizontal',
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
    </RichRadioGroupContext.Provider>
  );
}
