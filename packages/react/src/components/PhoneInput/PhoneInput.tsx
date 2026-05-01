import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

export interface PhoneInputCountry {
  /** Identifiant pays (ISO 3166-1 alpha-2 par convention : "PF", "FR"…). */
  code: string;
  /** Indicatif international, "+" inclus (ex. "+689"). */
  dialCode: string;
  /** Libellé long (lu par les lecteurs d'écran dans le dropdown). */
  label?: string;
  /**
   * Marqueur visuel optionnel (drapeau emoji, image SVG, etc.). Décoratif :
   * `aria-hidden` est appliqué automatiquement.
   */
  flag?: ReactNode;
}

const DEFAULT_COUNTRIES: PhoneInputCountry[] = [
  { code: 'PF', dialCode: '+689', label: 'Polynésie française' },
];

export interface PhoneInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'onChange'
> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  /**
   * Liste des pays sélectionnables. Si la liste contient un seul item, le
   * sélecteur est rendu en lecture seule (utile pour un service mono-PF).
   * Défaut : `[{ code: 'PF', dialCode: '+689' }]`.
   */
  countries?: PhoneInputCountry[];
  /** Code pays sélectionné. Défaut : premier de `countries`. */
  countryCode?: string;
  defaultCountryCode?: string;
  onCountryChange?: (code: string) => void;
  /** Numéro local (sans indicatif). */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  wrapperClassName?: string;
}

/**
 * Champ de saisie d'un numéro de téléphone.
 *
 * Composé d'un sélecteur d'indicatif (rendu en lecture seule s'il n'y a
 * qu'un seul pays) et d'un input texte pour le numéro local. Le drapeau
 * et le libellé du pays sont décoratifs ; la valeur métier réelle est le
 * couple `(countryCode, value)`. La concaténation `dialCode + value` est
 * laissée à l'app, qui peut formater à sa guise (E.164, espaces, etc.).
 *
 * MVP : le composant ne pose pas de masque ni de validation de format
 * automatique. Une validation peut être branchée par l'app via les attrs
 * standards (`pattern`, `inputMode="tel"` est défini par défaut).
 */
export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(function PhoneInput(
  {
    label,
    hint,
    error,
    required,
    countries = DEFAULT_COUNTRIES,
    countryCode,
    defaultCountryCode,
    onCountryChange,
    value,
    defaultValue,
    onChange,
    readOnly,
    disabled,
    wrapperClassName,
    className,
    id,
    placeholder = '40 41 23 45',
    ...rest
  },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const hintId = hint && !error ? `${reactId}-hint` : undefined;
  const errorId = error ? `${reactId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  const fallbackCode = countries[0]?.code ?? '';
  const [internalCode, setInternalCode] = useState<string>(defaultCountryCode ?? fallbackCode);
  const [internalValue, setInternalValue] = useState<string>(
    defaultValue !== undefined ? String(defaultValue) : '',
  );
  const isCountryControlled = countryCode !== undefined;
  const isValueControlled = value !== undefined;
  const currentCode = isCountryControlled ? countryCode : internalCode;
  const currentValue = isValueControlled ? String(value) : internalValue;
  const currentCountry =
    countries.find((c) => c.code === currentCode) ?? countries[0] ?? DEFAULT_COUNTRIES[0]!;
  const onlyOneCountry = countries.length <= 1;

  return (
    <div
      className={clsx(
        'ori-field',
        error && 'ori-field--invalid',
        readOnly && 'ori-phone-input--readonly',
        wrapperClassName,
      )}
    >
      {label && (
        <label
          htmlFor={inputId}
          className={clsx('ori-field__label', required && 'ori-field__label--required')}
        >
          {label}
        </label>
      )}
      {error && (
        <span id={errorId} className="ori-field__error" role="alert">
          {error}
        </span>
      )}
      <div
        className={clsx(
          'ori-phone-input',
          disabled && 'ori-phone-input--disabled',
          readOnly && 'ori-phone-input--readonly',
          error && 'ori-phone-input--invalid',
        )}
      >
        {onlyOneCountry || readOnly ? (
          <span className="ori-phone-input__country ori-phone-input__country--static">
            {currentCountry.flag && (
              <span className="ori-phone-input__flag" aria-hidden="true">
                {currentCountry.flag}
              </span>
            )}
            <span className="ori-phone-input__dial-code">{currentCountry.dialCode}</span>
          </span>
        ) : (
          <span className="ori-phone-input__country">
            {currentCountry.flag && (
              <span className="ori-phone-input__flag" aria-hidden="true">
                {currentCountry.flag}
              </span>
            )}
            <span className="ori-phone-input__dial-code">{currentCountry.dialCode}</span>
            <ChevronDown size={16} className="ori-phone-input__chevron" aria-hidden="true" />
            <select
              className="ori-phone-input__select"
              aria-label="Indicatif pays"
              value={currentCode}
              disabled={disabled}
              onChange={(e) => {
                if (!isCountryControlled) setInternalCode(e.target.value);
                onCountryChange?.(e.target.value);
              }}
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {(c.label ?? c.code) + ' (' + c.dialCode + ')'}
                </option>
              ))}
            </select>
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          className={clsx('ori-phone-input__number', className)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          value={currentValue}
          onChange={(e) => {
            if (!isValueControlled) setInternalValue(e.target.value);
            onChange?.(e.target.value);
          }}
          {...rest}
        />
      </div>
      {hint && !error && (
        <span id={hintId} className="ori-field__hint">
          {hint}
        </span>
      )}
    </div>
  );
});
