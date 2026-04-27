import { useEffect, useRef, useState, type HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { Globe, ChevronDown } from 'lucide-react';

export interface LanguageOption {
  /** Code ISO 639 (ex: 'fr', 'en', 'ty'). */
  code: string;
  /** Libellé d'affichage dans la liste (ex: 'Français', 'Reo Tahiti'). */
  label: string;
}

export interface LanguageSwitcherProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Langues disponibles. Cf. décision J.2 : fournies par l'app. */
  languages: LanguageOption[];
  /** Code de la langue active. */
  value: string;
  /** Callback de changement. */
  onChange: (code: string) => void;
  /** Étiquette ARIA du bouton (lecteur d'écran). */
  triggerAriaLabel?: string;
}

/**
 * Sélecteur de langue compact pour header (cf. décision J.2).
 * Liste de langues fournie par l'app, pas de hardcoding.
 */
export function LanguageSwitcher({
  languages,
  value,
  onChange,
  triggerAriaLabel = 'Changer la langue',
  className,
  ...rest
}: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Fermeture au clic extérieur
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  // Fermeture sur Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const select = (code: string) => {
    onChange(code);
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className={clsx('ori-language-switcher', className)} {...rest}>
      <button
        type="button"
        className="ori-language-switcher__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={triggerAriaLabel}
        onClick={() => setOpen((o) => !o)}
      >
        <Globe size={14} aria-hidden="true" />
        {value}
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      {open && (
        <ul role="listbox" className="ori-language-switcher__menu">
          {languages.map((lang) => (
            <li key={lang.code} role="presentation">
              <button
                type="button"
                role="option"
                className="ori-language-switcher__option"
                aria-checked={lang.code === value}
                onClick={() => select(lang.code)}
              >
                {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
