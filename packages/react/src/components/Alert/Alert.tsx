import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import { Info, CircleCheck, TriangleAlert, CircleX, X } from 'lucide-react';

export type AlertSeverity = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'role'> {
  severity?: AlertSeverity;
  title?: ReactNode;
  /**
   * Icône custom. `null` pour désactiver l'icône, `undefined` pour utiliser
   * l'icône Lucide par défaut associée à la sévérité.
   */
  icon?: ReactNode;
  /**
   * Affiche le bouton de fermeture. Indépendant de la présence de `onDismiss`
   * (on peut vouloir un dismiss visuel sans handler côté app).
   */
  dismissible?: boolean;
  onDismiss?: () => void;
  dismissLabel?: string;
}

/**
 * Mapping severity -> icône Lucide. Toutes héritent de `currentColor` (règle
 * monochrome Ori) ; la couleur sémantique est portée par la classe
 * `.ori-alert--<severity>`.
 */
const DefaultIcons: Record<AlertSeverity, ReactNode> = {
  info: <Info size={20} aria-hidden="true" />,
  success: <CircleCheck size={20} aria-hidden="true" />,
  warning: <TriangleAlert size={20} aria-hidden="true" />,
  danger: <CircleX size={20} aria-hidden="true" />,
};

/**
 * Rôle ARIA selon la sévérité :
 * - `danger` -> `role="alert"` (intrusif, lu immédiatement par les
 *   technologies d'assistance, justifié pour une erreur bloquante)
 * - `info`/`success`/`warning` -> `role="status"` (poli, n'interrompt pas
 *   l'utilisateur). Aligne le comportement React sur Angular.
 */
const roleFor = (severity: AlertSeverity): 'alert' | 'status' =>
  severity === 'danger' ? 'alert' : 'status';

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    severity = 'info',
    title,
    icon,
    dismissible = false,
    onDismiss,
    dismissLabel = 'Fermer',
    className,
    children,
    ...rest
  },
  ref,
) {
  const resolvedIcon = icon === null ? null : (icon ?? DefaultIcons[severity]);

  return (
    <div
      ref={ref}
      role={roleFor(severity)}
      className={clsx('ori-alert', `ori-alert--${severity}`, className)}
      {...rest}
    >
      {resolvedIcon && <span className="ori-alert__icon">{resolvedIcon}</span>}
      <div className="ori-alert__content">
        {title && <div className="ori-alert__title">{title}</div>}
        {children}
      </div>
      {dismissible && (
        <button
          type="button"
          className="ori-alert__close"
          onClick={onDismiss}
          aria-label={dismissLabel}
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
});
