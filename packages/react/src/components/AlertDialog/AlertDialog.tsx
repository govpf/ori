import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import * as RadixAlertDialog from '@radix-ui/react-alert-dialog';
import { clsx } from 'clsx';

/**
 * AlertDialog accessible, basé sur @radix-ui/react-alert-dialog.
 *
 * Distinct du Dialog : sémantique `role="alertdialog"` et focus initial sur
 * le bouton de confirmation (cancel ou action). À utiliser pour interrompre
 * un flux et exiger une décision binaire de l'utilisateur, typiquement une
 * confirmation d'action destructive (suppression, déconnexion forcée).
 *
 * Différences clés vs Dialog :
 * - role="alertdialog" (au lieu de role="dialog")
 * - pas de bouton de fermeture (X) : l'utilisateur DOIT cliquer Cancel ou
 *   Action, ce qui rend l'intention explicite
 * - le clic sur le backdrop ne ferme pas (idem)
 * - description requise (aria-describedby)
 *
 * Visuellement, la classe `.ori-alert-dialog` réutilise `.ori-dialog` avec
 * une variante pour les actions destructives (bouton danger en avant).
 */

export interface AlertDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

export function AlertDialog({ open, defaultOpen, onOpenChange, children }: AlertDialogProps) {
  return (
    <RadixAlertDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {children}
    </RadixAlertDialog.Root>
  );
}

export const AlertDialogTrigger = RadixAlertDialog.Trigger;
export const AlertDialogCancel = RadixAlertDialog.Cancel;
export const AlertDialogAction = RadixAlertDialog.Action;

export interface AlertDialogContentProps {
  /** Titre court (obligatoire pour aria-labelledby). */
  title: ReactNode;
  /** Description du choix à faire (obligatoire pour aria-describedby). */
  description: ReactNode;
  /** Boutons d'action (Cancel + Action via les sous-composants). */
  footer: ReactNode;
  className?: string;
}

export const AlertDialogContent = forwardRef<HTMLDivElement, AlertDialogContentProps>(
  function AlertDialogContent({ title, description, footer, className }, ref) {
    return (
      <RadixAlertDialog.Portal>
        <RadixAlertDialog.Overlay className="ori-dialog-overlay" />
        <RadixAlertDialog.Content
          ref={ref}
          className={clsx('ori-dialog', 'ori-alert-dialog', className)}
        >
          <div className="ori-dialog__header">
            <RadixAlertDialog.Title className="ori-dialog__title">{title}</RadixAlertDialog.Title>
          </div>
          <div className="ori-dialog__body">
            <RadixAlertDialog.Description>{description}</RadixAlertDialog.Description>
          </div>
          <div className="ori-dialog__footer">{footer}</div>
        </RadixAlertDialog.Content>
      </RadixAlertDialog.Portal>
    );
  },
);
