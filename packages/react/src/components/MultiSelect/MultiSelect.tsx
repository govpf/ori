import { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { clsx } from 'clsx';
import { ChevronDown, Check, X } from 'lucide-react';

/**
 * MultiSelect virtualisé accessible.
 *
 * Variante multi-sélection de la Combobox, avec virtualisation manuelle pour
 * gérer plusieurs milliers d'options sans pénaliser le rendu (ne monte que la
 * fenêtre visible + un buffer). Sélections affichées sous forme de tags
 * supprimables sous l'input.
 *
 * a11y :
 * - input role="combobox" + aria-multiselectable n'existe pas sur combobox,
 *   le multi est porté par le listbox via `aria-multiselectable="true"`
 * - chaque option avec role="option" + aria-selected (true / false) ; les
 *   options sélectionnées ne sont pas masquées (l'utilisateur peut les
 *   décocher en re-cliquant)
 * - tags des sélections : bouton "Supprimer X" focusable, accessible via Tab
 *
 * Volontairement pas de groupes (à ouvrir comme extension), pas de chargement
 * async (idem). La virtualisation suppose une hauteur d'option constante.
 */

export interface MultiSelectOption {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  /** IDs sélectionnés (ordre conservé selon l'ordre de sélection). */
  values: string[];
  onValuesChange?: (ids: string[]) => void;
  /** Texte du label associé à l'input. Requis pour l'a11y. */
  label: string;
  placeholder?: string;
  disabled?: boolean;
  filterFn?: (option: MultiSelectOption, query: string) => boolean;
  noResultsLabel?: string;
  /** Hauteur du listbox en px. Default : 240. */
  listboxHeight?: number;
  /** Hauteur d'une option en px (doit être constante pour la virtualisation). Default : 36. */
  optionHeight?: number;
  /** Nombre maximum de sélections. Default : illimité. */
  maxSelected?: number;
  /** Label de l'aria-label sur le bouton de suppression d'un tag (préfixe). */
  removeTagLabel?: string;
  className?: string;
}

const defaultFilter = (option: MultiSelectOption, query: string): boolean => {
  if (!query) return true;
  return option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase());
};

export const MultiSelect = forwardRef<HTMLInputElement, MultiSelectProps>(function MultiSelect(
  {
    options,
    values,
    onValuesChange,
    label,
    placeholder,
    disabled,
    filterFn = defaultFilter,
    noResultsLabel = 'Aucun résultat',
    listboxHeight = 240,
    optionHeight = 36,
    maxSelected,
    removeTagLabel = 'Retirer',
    className,
  },
  ref,
) {
  const reactId = useId();
  const inputId = `pf-multi-input-${reactId}`;
  const listboxId = `pf-multi-listbox-${reactId}`;
  const labelId = `pf-multi-label-${reactId}`;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [scrollTop, setScrollTop] = useState(0);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  const selectedSet = useMemo(() => new Set(values), [values]);
  const selectedOptions = useMemo(
    () =>
      values.map((id) => options.find((o) => o.id === id)).filter(Boolean) as MultiSelectOption[],
    [values, options],
  );

  const filtered = useMemo(
    () => options.filter((o) => filterFn(o, query)),
    [options, filterFn, query],
  );
  const enabledFiltered = useMemo(() => filtered.filter((o) => !o.disabled), [filtered]);

  const limitReached = maxSelected !== undefined && values.length >= maxSelected;

  // Virtualisation : on rend [startIndex, endIndex) avec un buffer.
  const buffer = 4;
  const visibleCount = Math.ceil(listboxHeight / optionHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / optionHeight) - buffer);
  const endIndex = Math.min(filtered.length, startIndex + visibleCount + buffer * 2);
  const paddingTop = startIndex * optionHeight;
  const paddingBottom = (filtered.length - endIndex) * optionHeight;

  const closeList = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  const toggleOption = useCallback(
    (option: MultiSelectOption) => {
      if (option.disabled) return;
      if (selectedSet.has(option.id)) {
        onValuesChange?.(values.filter((v) => v !== option.id));
      } else {
        if (limitReached) return;
        onValuesChange?.([...values, option.id]);
      }
    },
    [onValuesChange, selectedSet, values, limitReached],
  );

  const removeValue = useCallback(
    (id: string) => {
      onValuesChange?.(values.filter((v) => v !== id));
    },
    [onValuesChange, values],
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setOpen(true);
    setActiveIndex(0);
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
          toggleOption(enabledFiltered[activeIndex]);
        }
        break;
      case 'Escape':
        if (open) {
          e.preventDefault();
          closeList();
        }
        break;
      case 'Backspace': {
        // Si la query est vide, Backspace retire la dernière sélection
        const last = values[values.length - 1];
        if (!query && last !== undefined) {
          e.preventDefault();
          removeValue(last);
        }
        break;
      }
    }
  };

  // Click outside : ferme la liste
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        closeList();
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, closeList]);

  // Garder l'option active dans la fenêtre virtuelle (auto-scroll)
  useEffect(() => {
    if (!open || activeIndex < 0 || !listboxRef.current) return;
    const optionInFiltered = enabledFiltered[activeIndex];
    if (!optionInFiltered) return;
    const indexInFiltered = filtered.indexOf(optionInFiltered);
    const optionTop = indexInFiltered * optionHeight;
    const optionBottom = optionTop + optionHeight;
    const scrollTopNow = listboxRef.current.scrollTop;
    const scrollBottom = scrollTopNow + listboxHeight;
    if (optionTop < scrollTopNow) {
      listboxRef.current.scrollTop = optionTop;
    } else if (optionBottom > scrollBottom) {
      listboxRef.current.scrollTop = optionBottom - listboxHeight;
    }
  }, [activeIndex, open, enabledFiltered, filtered, optionHeight, listboxHeight]);

  const activeOptionId =
    open && activeIndex >= 0 && enabledFiltered[activeIndex]
      ? `${listboxId}-option-${enabledFiltered[activeIndex].id}`
      : undefined;

  const visibleSlice = filtered.slice(startIndex, endIndex);

  return (
    <div ref={wrapperRef} className={clsx('ori-multi-select', className)}>
      <label id={labelId} htmlFor={inputId} className="ori-multi-select__label">
        {label}
      </label>
      <div
        className={clsx('ori-multi-select__field', disabled && 'ori-multi-select__field--disabled')}
      >
        {selectedOptions.length > 0 && (
          <ul className="ori-multi-select__tags" aria-label="Sélections">
            {selectedOptions.map((option) => (
              <li key={option.id} className="ori-multi-select__tag">
                <span className="ori-multi-select__tag-label">{option.label}</span>
                <button
                  type="button"
                  className="ori-multi-select__tag-remove"
                  aria-label={`${removeTagLabel} ${option.label}`}
                  onClick={() => removeValue(option.id)}
                  disabled={disabled}
                >
                  <X size={12} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="ori-multi-select__input-wrap">
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
            placeholder={selectedOptions.length === 0 ? placeholder : undefined}
            value={query}
            onChange={onInputChange}
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}
            onKeyDown={onKeyDown}
            className="ori-multi-select__input"
          />
          <span className="ori-multi-select__chevron" aria-hidden="true">
            <ChevronDown size={16} />
          </span>
        </div>
      </div>
      {open && (
        <div
          ref={listboxRef}
          role="listbox"
          id={listboxId}
          aria-label={label}
          aria-multiselectable="true"
          className="ori-multi-select__listbox"
          style={{ maxHeight: listboxHeight }}
          onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
        >
          {filtered.length === 0 ? (
            <div className="ori-multi-select__empty" aria-disabled="true">
              {noResultsLabel}
            </div>
          ) : (
            <div style={{ paddingTop, paddingBottom }}>
              {visibleSlice.map((option) => {
                const enabledIndex = option.disabled ? -1 : enabledFiltered.indexOf(option);
                const isActive = enabledIndex === activeIndex;
                const isSelected = selectedSet.has(option.id);
                const blocked = !isSelected && limitReached;
                return (
                  <div
                    key={option.id}
                    id={`${listboxId}-option-${option.id}`}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled || blocked || undefined}
                    className={clsx(
                      'ori-multi-select__option',
                      isActive && 'ori-multi-select__option--active',
                      isSelected && 'ori-multi-select__option--selected',
                      (option.disabled || blocked) && 'ori-multi-select__option--disabled',
                    )}
                    style={{ height: optionHeight }}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => !blocked && toggleOption(option)}
                    onMouseEnter={() => {
                      if (!option.disabled && !blocked) setActiveIndex(enabledIndex);
                    }}
                  >
                    <span
                      className={clsx(
                        'ori-multi-select__option-checkbox',
                        isSelected && 'ori-multi-select__option-checkbox--checked',
                      )}
                      aria-hidden="true"
                    >
                      {isSelected && <Check size={12} />}
                    </span>
                    <span className="ori-multi-select__option-label">{option.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
