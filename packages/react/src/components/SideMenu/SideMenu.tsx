import { useEffect, type HTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

export interface SideMenuItem {
  label: ReactNode;
  href: string;
  current?: boolean;
  icon?: ReactNode;
}

export interface SideMenuSection {
  title?: ReactNode;
  items: SideMenuItem[];
}

export type SideMenuVariant = 'persistent' | 'drawer';

export interface SideMenuProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  sections: SideMenuSection[];
  variant?: SideMenuVariant;
  /** En mode drawer, contrôle l'ouverture. */
  open?: boolean;
  /** En mode drawer, callback de fermeture (clic sur overlay ou bouton X). */
  onClose?: () => void;
  /** Étiquette ARIA du `<nav>`. */
  'aria-label'?: string;
}

/**
 * Menu latéral hiérarchique avec sections + items.
 * Cf. décision J.3 : variant explicite, pas d'auto-switch responsive.
 */
export function SideMenu({
  sections,
  variant = 'persistent',
  open = true,
  onClose,
  'aria-label': ariaLabel = 'Menu de navigation',
  className,
  ...rest
}: SideMenuProps) {
  // En mode drawer : Escape ferme le menu
  useEffect(() => {
    if (variant !== 'drawer' || !open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [variant, open, onClose]);

  if (variant === 'drawer' && !open) return null;

  const navContent = (
    <nav
      aria-label={ariaLabel}
      className={clsx('ori-side-menu', variant === 'drawer' && 'ori-side-menu--drawer', className)}
      {...rest}
    >
      {variant === 'drawer' && (
        <button
          type="button"
          className="ori-side-menu__close"
          onClick={onClose}
          aria-label="Fermer le menu"
        >
          <X size={18} aria-hidden="true" />
        </button>
      )}
      {sections.map((section, i) => (
        <div key={i} className="ori-side-menu__section">
          {section.title && <div className="ori-side-menu__section-title">{section.title}</div>}
          <ul className="ori-side-menu__list">
            {section.items.map((item, j) => (
              <li key={j}>
                <a
                  href={item.href}
                  className="ori-side-menu__link"
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.icon}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );

  if (variant === 'drawer') {
    return (
      <>
        <div className="ori-side-menu__overlay" onClick={onClose} aria-hidden="true" />
        {navContent}
      </>
    );
  }
  return navContent;
}
