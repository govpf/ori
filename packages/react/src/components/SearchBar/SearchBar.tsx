import {
  forwardRef,
  useId,
  useState,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { clsx } from 'clsx';
import { Search } from 'lucide-react';

export type SearchBarSize = 'md' | 'sm';

export interface SearchBarProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'onSubmit'
> {
  /** Libellé associé à l'input. Visible si `hideLabel=false`, masqué visuellement sinon. */
  label?: ReactNode;
  /** Si `true`, le label est rendu masqué visuellement mais reste lu. Défaut : false. */
  hideLabel?: boolean;
  /** Texte du bouton de soumission. Défaut : "Rechercher". */
  buttonLabel?: string;
  /** Si `true`, n'affiche que l'icône dans le bouton (utile en colonnes étroites). */
  iconOnlyButton?: boolean;
  /** Variante de taille. */
  size?: SearchBarSize;
  /**
   * Callback déclenché à la soumission (Entrée dans l'input ou clic sur
   * le bouton). Reçoit la valeur courante.
   */
  onSearch?: (value: string) => void;
  /** Override du libellé accessible du bouton quand `iconOnlyButton`. Défaut : `buttonLabel`. */
  buttonAriaLabel?: string;
  className?: string;
}

/**
 * Champ de recherche autonome : input + bouton primaire de soumission.
 *
 * Posé sur un `<form role="search">` pour que la combinaison clavier
 * standard fonctionne (Entrée dans l'input soumet, Échap n'efface pas
 * mais le navigateur en prend note pour les inputs `type="search"`).
 *
 * Composant non contrôlé par défaut (la valeur est gérée en interne) ;
 * fournir `value` + `onChange` pour passer en mode contrôlé.
 *
 * a11y : `role="search"` sur le formulaire, label associé via `for`/`id`,
 * icône loupe `aria-hidden`.
 */
export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(function SearchBar(
  {
    label = 'Rechercher',
    hideLabel = true,
    buttonLabel = 'Rechercher',
    iconOnlyButton = false,
    size = 'md',
    onSearch,
    buttonAriaLabel,
    placeholder = 'Rechercher...',
    className,
    id,
    value,
    defaultValue,
    onChange,
    ...rest
  },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const [internalValue, setInternalValue] = useState<string>(
    defaultValue !== undefined ? String(defaultValue) : '',
  );
  const isControlled = value !== undefined;
  const currentValue = isControlled ? String(value) : internalValue;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch?.(currentValue);
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={clsx('ori-search-bar', size === 'sm' && 'ori-search-bar--sm', className)}
    >
      <label
        htmlFor={inputId}
        className={clsx(
          'ori-search-bar__label',
          hideLabel && 'ori-search-bar__label--visually-hidden',
        )}
      >
        {label}
      </label>
      <div className="ori-search-bar__field">
        <input
          ref={ref}
          id={inputId}
          type="search"
          className="ori-search-bar__input"
          placeholder={placeholder}
          value={currentValue}
          onChange={(e) => {
            if (!isControlled) setInternalValue(e.target.value);
            onChange?.(e);
          }}
          {...rest}
        />
        <button
          type="submit"
          className="ori-search-bar__button"
          aria-label={iconOnlyButton ? (buttonAriaLabel ?? buttonLabel) : undefined}
        >
          <Search size={16} className="ori-search-bar__button-icon" aria-hidden="true" />
          {!iconOnlyButton && <span className="ori-search-bar__button-label">{buttonLabel}</span>}
        </button>
      </div>
    </form>
  );
});
