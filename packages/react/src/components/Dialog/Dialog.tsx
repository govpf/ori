import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

/**
 * Dialog accessible, basé sur @radix-ui/react-dialog.
 * - focus trap, ESC pour fermer, portal, backdrop, aria-* : gérés par Radix.
 * - le style provient intégralement des classes sémantiques .ori-dialog* du DS.
 */

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

export function Dialog({ open, defaultOpen, onOpenChange, children }: DialogProps) {
  return (
    <RadixDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {children}
    </RadixDialog.Root>
  );
}

export const DialogTrigger = RadixDialog.Trigger;
export const DialogPortal = RadixDialog.Portal;

export interface DialogContentProps {
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
  showCloseButton?: boolean;
  closeLabel?: string;
}

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  {
    title,
    description,
    children,
    footer,
    className,
    showCloseButton = true,
    closeLabel = 'Fermer',
  },
  ref,
) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="ori-dialog-overlay" />
      <RadixDialog.Content ref={ref} className={clsx('ori-dialog', className)}>
        <div className="ori-dialog__header">
          <RadixDialog.Title className="ori-dialog__title">{title}</RadixDialog.Title>
          {showCloseButton && (
            <RadixDialog.Close asChild>
              <button type="button" className="ori-dialog__close" aria-label={closeLabel}>
                <X size={18} aria-hidden="true" />
              </button>
            </RadixDialog.Close>
          )}
        </div>
        <div className="ori-dialog__body">
          {description && <RadixDialog.Description>{description}</RadixDialog.Description>}
          {children}
        </div>
        {footer && <div className="ori-dialog__footer">{footer}</div>}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
});

export const DialogClose = RadixDialog.Close;
