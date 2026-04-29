import { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { clsx } from 'clsx';
import { ChevronDown, Check } from 'lucide-react';

/**
 * Combobox / Autocomplete accessible.
 *
 * Pattern WAI-ARIA "combobox" v1.2 (input texte + listbox externe). Filtre
 * les options à la frappe ; navigation clavier complète ; sélection à
 * l'Entrée ou au clic ; ESC ferme la liste.
 *
 * a11y :
 * - input avec role="combobox", aria-autocomplete="list", aria-expanded,
 *   aria-controls (le listbox), aria-activedescendant (l'option active)
 * - listbox avec role="listbox" + aria-label
 * - chaque option avec role="option" + aria-selected
 *
 * Volontairement pas de multi-select (cf. MultiSelect virtualisé), pas de
 * création d'option à la volée, pas de chargement async (à ouvrir comme
 * extensions si le besoin se confirme côté apps).
 *
 * Volontairement pas basé sur Radix : il n'existe pas (encore) de
 * `@radix-ui/react-combobox` stable. Implémentation custom légère, en parité
 * fonctionnelle avec la version Angular.
 */

export interface ComboboxOption {
  id: string;
  label: string;
  /** Description courte affichée en seconde ligne, optionnelle. */
  description?: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  /** Liste complète des options (filtrée à la frappe par le composant). */
  options: ComboboxOption[];
  /** ID de l'option sélectionnée. */
  value?: string;
  onValueChange?: (id: string | undefined) => void;
  /** Texte du label associé à l'input. Requis pour l'a11y. */
  label: string;
  placeholder?: string;
  disabled?: boolean;
  /** Fonction de filtrage custom. Default : prefix-match insensible à la casse. */
  filterFn?: (option: ComboboxOption, query: string) => boolean;
  /** Texte affiché quand aucune option ne correspond. */
  noResultsLabel?: string;
  className?: string;
}

const defaultFilter = (option: ComboboxOption, query: string): boolean => {
  if (!query) return true;
  const q = query.toLocaleLowerCase();
  return option.label.toLocaleLowerCase().includes(q);
};

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  {
    options,
    value,
    onValueChange,
    label,
    placeholder,
    disabled,
    filterFn = defaultFilter,
    noResultsLabel = 'Aucun résultat',
    className,
  },
  ref,
) {
  const reactId = useId();
  const inputId = `pf-combobox-input-${reactId}`;
  const listboxId = `pf-combobox-listbox-${reactId}`;
  const labelId = `pf-combobox-label-${reactId}`;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = useMemo(() => options.find((o) => o.id === value), [options, value]);

  // Quand la valeur change depuis l'extérieur, on resync le query affiché.
  useEffect(() => {
    if (selectedOption && !open) setQuery(selectedOption.label);
    if (!selectedOption && !open && value === undefined) setQuery('');
  }, [selectedOption, open, value]);

  const filtered = useMemo(() => {
    // Si la query correspond exactement au label sélectionné, on n'applique
    // pas de filtre (sinon l'utilisateur ne voit qu'une option et perd le
    // choix de revenir en arrière).
    if (selectedOption && query === selectedOption.label) return options;
    return options.filter((o) => filterFn(o, query));
  }, [options, query, filterFn, selectedOption]);

  const enabledFiltered = useMemo(() => filtered.filter((o) => !o.disabled), [filtered]);

  const closeList = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  const selectOption = useCallback(
    (option: ComboboxOption) => {
      if (option.disabled) return;
      onValueChange?.(option.id);
      setQuery(option.label);
      closeList();
    },
    [onValueChange, closeList],
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setOpen(true);
    setActiveIndex(0);
    // Si l'utilisateur efface, on désélectionne.
    if (!e.target.value && value !== undefined) onValueChange?.(undefined);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!open) {
          setOpen(true);
          setActiveIndex(0);
        } else if (enabledFiltered.length) {
          setActiveIndex((i) => (i + 1) % enabledFiltered.length);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!open) {
          setOpen(true);
          setActiveIndex(enabledFiltered.length - 1);
        } else if (enabledFiltered.length) {
          setActiveIndex((i) => (i <= 0 ? enabledFiltered.length - 1 : i - 1));
        }
        break;
      case 'Home':
        if (open) {
          e.preventDefault();
          setActiveIndex(0);
        }
        break;
      case 'End':
        if (open) {
          e.preventDefault();
          setActiveIndex(enabledFiltered.length - 1);
        }
        break;
      case 'Enter':
        if (open && activeIndex >= 0 && enabledFiltered[activeIndex]) {
          e.preventDefault();
          selectOption(enabledFiltered[activeIndex]);
        }
        break;
      case 'Escape':
        if (open) {
          e.preventDefault();
          closeList();
          // Revenir à la valeur précédente
          setQuery(selectedOption?.label ?? '');
        }
        break;
      case 'Tab':
        // Tab valide la première option si la liste est ouverte avec une
        // valeur active, sinon laisse passer normalement.
        if (open && activeIndex >= 0 && enabledFiltered[activeIndex]) {
          selectOption(enabledFiltered[activeIndex]);
        }
        break;
    }
  };

  // Click outside : ferme et restore la valeur affichée.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        closeList();
        setQuery(selectedOption?.label ?? '');
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, selectedOption, closeList]);

  // ID de l'option active pour aria-activedescendant
  const activeOptionId =
    open && activeIndex >= 0 && enabledFiltered[activeIndex]
      ? `${listboxId}-option-${enabledFiltered[activeIndex].id}`
      : undefined;

  return (
    <div ref={wrapperRef} className={clsx('ori-combobox', className)}>
      <label id={labelId} htmlFor={inputId} className="ori-combobox__label">
        {label}
      </label>
      <div className="ori-combobox__field">
        <input
          ref={ref}
          id={inputId}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={activeOptionId}
          aria-labelledby={labelId}
          autoComplete="off"
          spellCheck={false}
          disabled={disabled}
          placeholder={placeholder}
          value={query}
          onChange={onInputChange}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="ori-combobox__input"
        />
        <span className="ori-combobox__chevron" aria-hidden="true">
          <ChevronDown size={16} />
        </span>
      </div>
      {open && (
        <ul id={listboxId} role="listbox" aria-label={label} className="ori-combobox__listbox">
          {filtered.length === 0 ? (
            <li className="ori-combobox__empty" aria-disabled="true">
              {noResultsLabel}
            </li>
          ) : (
            filtered.map((option) => {
              // Index dans enabledFiltered pour le calcul de l'option active
              const enabledIndex = option.disabled ? -1 : enabledFiltered.indexOf(option);
              const isActive = enabledIndex === activeIndex;
              const isSelected = option.id === value;
              return (
                <li
                  key={option.id}
                  id={`${listboxId}-option-${option.id}`}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled || undefined}
                  className={clsx(
                    'ori-combobox__option',
                    isActive && 'ori-combobox__option--active',
                    isSelected && 'ori-combobox__option--selected',
                    option.disabled && 'ori-combobox__option--disabled',
                  )}
                  onMouseDown={(e) => {
                    // Empêche le blur de l'input au mousedown
                    e.preventDefault();
                  }}
                  onClick={() => selectOption(option)}
                  onMouseEnter={() => {
                    if (!option.disabled) setActiveIndex(enabledIndex);
                  }}
                >
                  <span className="ori-combobox__option-text">
                    <span className="ori-combobox__option-label">{option.label}</span>
                    {option.description && (
                      <span className="ori-combobox__option-description">{option.description}</span>
                    )}
                  </span>
                  {isSelected && (
                    <Check size={16} className="ori-combobox__option-check" aria-hidden="true" />
                  )}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
});
