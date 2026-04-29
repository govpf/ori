import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx';

/**
 * DropdownMenu accessible, basé sur @radix-ui/react-dropdown-menu.
 *
 * Couvre les cas d'usage standard : menu d'actions sur un bouton, menu
 * utilisateur dans un header, actions de ligne dans une table.
 *
 * Radix gère : focus management, type-ahead, navigation clavier
 * (Tab, Flèches, Home/End, Esc), ARIA (role="menu" / "menuitem"),
 * auto-positioning avec collision detection, fermeture click-outside.
 *
 * Non couvert v1 : sous-menus imbriqués, items checkbox / radio.
 * Ces variantes pourront être ajoutées comme primitives séparées si le
 * besoin se confirme côté apps consommatrices.
 */

export interface DropdownMenuProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

export function DropdownMenu({ open, defaultOpen, onOpenChange, children }: DropdownMenuProps) {
  return (
    <RadixDropdownMenu.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {children}
    </RadixDropdownMenu.Root>
  );
}

export const DropdownMenuTrigger = RadixDropdownMenu.Trigger;

export type DropdownMenuSide = 'top' | 'right' | 'bottom' | 'left';
export type DropdownMenuAlign = 'start' | 'center' | 'end';

export interface DropdownMenuContentProps {
  /** Côté d'apparition par rapport au trigger. Default: 'bottom'. */
  side?: DropdownMenuSide;
  /** Alignement par rapport au trigger. Default: 'start'. */
  align?: DropdownMenuAlign;
  /** Décalage en pixels par rapport au trigger. Default: 4. */
  sideOffset?: number;
  className?: string;
  children?: ReactNode;
}

export const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  function DropdownMenuContent(
    { side = 'bottom', align = 'start', sideOffset = 4, className, children },
    ref,
  ) {
    return (
      <RadixDropdownMenu.Portal>
        <RadixDropdownMenu.Content
          ref={ref}
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={clsx('ori-dropdown-menu', className)}
        >
          {children}
        </RadixDropdownMenu.Content>
      </RadixDropdownMenu.Portal>
    );
  },
);

export interface DropdownMenuItemProps {
  /** Icône optionnelle affichée en début d'item (recommandé : lucide-react). */
  icon?: ReactNode;
  /** Raccourci clavier affiché en fin d'item (informatif, non câblé). */
  shortcut?: string;
  /** Variante destructive (rouge) pour les actions de suppression. */
  destructive?: boolean;
  /** Désactive l'item ; reste visible mais non focusable / non cliquable. */
  disabled?: boolean;
  /** Callback déclenché au clic ou à la touche Entrée / Espace. */
  onSelect?: (event: Event) => void;
  className?: string;
  children?: ReactNode;
}

export const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  function DropdownMenuItem(
    { icon, shortcut, destructive, disabled, onSelect, className, children },
    ref,
  ) {
    return (
      <RadixDropdownMenu.Item
        ref={ref}
        disabled={disabled}
        onSelect={onSelect}
        className={clsx(
          'ori-dropdown-menu__item',
          destructive && 'ori-dropdown-menu__item--destructive',
          className,
        )}
      >
        {icon && (
          <span className="ori-dropdown-menu__item-icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="ori-dropdown-menu__item-label">{children}</span>
        {shortcut && <span className="ori-dropdown-menu__item-shortcut">{shortcut}</span>}
      </RadixDropdownMenu.Item>
    );
  },
);

export interface DropdownMenuLabelProps {
  className?: string;
  children?: ReactNode;
}

export const DropdownMenuLabel = forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  function DropdownMenuLabel({ className, children }, ref) {
    return (
      <RadixDropdownMenu.Label ref={ref} className={clsx('ori-dropdown-menu__label', className)}>
        {children}
      </RadixDropdownMenu.Label>
    );
  },
);

export const DropdownMenuSeparator = forwardRef<HTMLDivElement, { className?: string }>(
  function DropdownMenuSeparator({ className }, ref) {
    return (
      <RadixDropdownMenu.Separator
        ref={ref}
        className={clsx('ori-dropdown-menu__separator', className)}
      />
    );
  },
);
