import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { clsx } from 'clsx';

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

export interface TooltipProps {
  /** Contenu textuel du tooltip. */
  content: ReactNode;
  /** Côté d'apparition. Default: 'top'. */
  side?: TooltipSide;
  /** Délai en ms avant apparition (au hover ou focus). Default: 700. */
  openDelay?: number;
  /** Désactive le tooltip. */
  disabled?: boolean;
  /** L'élément trigger doit être un seul React element clonable. */
  children: ReactElement;
}

/**
 * Tooltip minimaliste sans dépendance externe (cf. décision G.1).
 *
 * - Apparaît au mouseenter + focus, disparaît au mouseleave + blur + ESC
 * - Délai par défaut 700ms (recommandation WAI-ARIA pour ne pas spammer)
 * - Position fixe via prop `side` (pas de positionnement dynamique
 *   anti-débordement : pour ces cas, basculer sur Floating UI à la
 *   demande)
 * - ARIA : `role="tooltip"` + `aria-describedby` injecté sur le trigger
 */
export function Tooltip({
  content,
  side = 'top',
  openDelay = 700,
  disabled,
  children,
}: TooltipProps) {
  const reactId = useId();
  const tooltipId = `pf-tooltip-${reactId}`;
  const [open, setOpen] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  const clearTimer = () => {
    if (timerRef.current !== undefined) {
      window.clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  };

  const show = () => {
    if (disabled) return;
    clearTimer();
    timerRef.current = window.setTimeout(() => setOpen(true), openDelay);
  };

  const hide = () => {
    clearTimer();
    setOpen(false);
  };

  useEffect(() => () => clearTimer(), []);

  // Fermeture sur Escape (capture global pour ne pas dépendre du focus)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (!isValidElement(children)) {
    throw new Error('Tooltip children must be a single valid React element');
  }

  // On clone le trigger pour câbler les events et aria-describedby sans
  // imposer un wrapper supplémentaire qui changerait la sémantique.
  const trigger = cloneElement(children as ReactElement<Record<string, unknown>>, {
    'aria-describedby': open ? tooltipId : undefined,
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: show,
    onBlur: hide,
  });

  return (
    <span className="ori-tooltip-wrap">
      {trigger}
      {open && content && (
        <span role="tooltip" id={tooltipId} className={clsx('ori-tooltip', `ori-tooltip--${side}`)}>
          {content}
        </span>
      )}
    </span>
  );
}
