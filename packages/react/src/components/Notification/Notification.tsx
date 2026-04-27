import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { Info, CircleCheck, TriangleAlert, CircleX, X } from 'lucide-react';

export type NotificationVariant = 'info' | 'success' | 'warning' | 'danger';

export interface NotificationProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onAction'> {
  variant?: NotificationVariant;
  /** Texte ou éléments du message principal. */
  children?: ReactNode;
  /** Action optionnelle (lien ou bouton). Si fournie, est rendue à droite du texte. */
  action?: {
    label: ReactNode;
    href?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  };
  /** Si `true`, affiche un bouton de fermeture. */
  dismissible?: boolean;
  /** Callback après fermeture (utile pour persister le choix de l'usager). */
  onDismiss?: () => void;
}

const VARIANT_ICON = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleX,
} as const;

/**
 * Notification : bandeau d'information système plein-largeur,
 * typiquement rendu en haut de page (cf. décision H.2).
 *
 * Différent d'Alert (inline contextuel) et de Toast (éphémère overlay) -
 * la Notification persiste jusqu'à fermeture explicite par l'usager.
 */
export function Notification({
  variant = 'info',
  children,
  action,
  dismissible,
  onDismiss,
  className,
  ...rest
}: NotificationProps) {
  const [open, setOpen] = useState(true);
  const Icon = VARIANT_ICON[variant];
  const isAlert = variant === 'danger';

  if (!open) return null;

  const handleDismiss = () => {
    setOpen(false);
    onDismiss?.();
  };

  return (
    <div
      role={isAlert ? 'alert' : 'status'}
      className={clsx('ori-notification', `ori-notification--${variant}`, className)}
      {...rest}
    >
      <Icon size={20} className="ori-notification__icon" aria-hidden="true" />
      <div className="ori-notification__content">
        <span>{children}</span>
        {action &&
          (action.href ? (
            <a href={action.href} className="ori-notification__action">
              {action.label}
            </a>
          ) : (
            <button type="button" className="ori-notification__action" onClick={action.onClick}>
              {action.label}
            </button>
          ))}
      </div>
      {dismissible && (
        <button
          type="button"
          className="ori-notification__close"
          onClick={handleDismiss}
          aria-label="Fermer"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
