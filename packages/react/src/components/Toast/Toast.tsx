import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { clsx } from 'clsx';
import { Info, CircleCheck, TriangleAlert, CircleX, X } from 'lucide-react';

export type ToastVariant = 'info' | 'success' | 'warning' | 'danger';
export type ToastViewportPosition =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center';

export interface ToastOptions {
  /** Titre court (ex: "Succès"). */
  title?: ReactNode;
  /** Message descriptif. */
  description?: ReactNode;
  variant?: ToastVariant;
  /** Durée en ms avant auto-dismiss. 0 = pas d'auto-dismiss. Default: 5000. */
  duration?: number;
}

interface ToastInstance extends ToastOptions {
  id: number;
}

interface ToastContextValue {
  toast: ((options: ToastOptions) => number) & {
    info: (
      description: ReactNode,
      options?: Omit<ToastOptions, 'variant' | 'description'>,
    ) => number;
    success: (
      description: ReactNode,
      options?: Omit<ToastOptions, 'variant' | 'description'>,
    ) => number;
    warning: (
      description: ReactNode,
      options?: Omit<ToastOptions, 'variant' | 'description'>,
    ) => number;
    danger: (
      description: ReactNode,
      options?: Omit<ToastOptions, 'variant' | 'description'>,
    ) => number;
  };
  dismiss: (id: number) => void;
  toasts: ToastInstance[];
}

const ToastContext = createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  children?: ReactNode;
}

let nextId = 0;

/**
 * Provider à monter une fois dans le layout principal de l'app, au-dessus
 * de tout composant qui pourrait appeler `useToast()`.
 *
 * Cf. décision H.1 : pattern service-based custom, pas de dépendance externe.
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastInstance[]>([]);
  const timersRef = useRef<Map<number, number>>(new Map());

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const create = useCallback(
    (options: ToastOptions): number => {
      const id = ++nextId;
      const instance: ToastInstance = { id, variant: 'info', duration: 5000, ...options };
      setToasts((prev) => [...prev, instance]);
      const duration = instance.duration ?? 5000;
      if (duration > 0) {
        const timer = window.setTimeout(() => dismiss(id), duration);
        timersRef.current.set(id, timer);
      }
      return id;
    },
    [dismiss],
  );

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => window.clearTimeout(t));
      timersRef.current.clear();
    };
  }, []);

  const toast = useMemo(() => {
    const fn = ((options: ToastOptions) => create(options)) as ToastContextValue['toast'];
    fn.info = (description, options) => create({ description, variant: 'info', ...options });
    fn.success = (description, options) => create({ description, variant: 'success', ...options });
    fn.warning = (description, options) => create({ description, variant: 'warning', ...options });
    fn.danger = (description, options) => create({ description, variant: 'danger', ...options });
    return fn;
  }, [create]);

  const value = useMemo(() => ({ toast, dismiss, toasts }), [toast, dismiss, toasts]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used inside a <ToastProvider>');
  }
  return ctx;
}

const VARIANT_ICON = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleX,
} as const;

export interface ToastViewportProps {
  position?: ToastViewportPosition;
  /** Étiquette ARIA de la région live. Default: "Notifications". */
  label?: string;
  className?: string;
}

/**
 * Région d'affichage des toasts. À monter une fois dans le layout
 * principal (en général dans `<App />`).
 */
export function ToastViewport({
  position = 'top-right',
  label = 'Notifications',
  className,
}: ToastViewportProps) {
  const { toasts, dismiss } = useToast();

  return (
    <ol
      role="region"
      aria-label={label}
      aria-live="polite"
      className={clsx('ori-toast-viewport', `ori-toast-viewport--${position}`, className)}
    >
      {toasts.map((t) => {
        const variant = t.variant ?? 'info';
        const Icon = VARIANT_ICON[variant];
        const isAlert = variant === 'danger';
        return (
          <li
            key={t.id}
            role={isAlert ? 'alert' : 'status'}
            className={clsx('ori-toast', `ori-toast--${variant}`)}
          >
            <Icon size={20} className="ori-toast__icon" aria-hidden="true" />
            <div className="ori-toast__content">
              {t.title && <div className="ori-toast__title">{t.title}</div>}
              {t.description && <div>{t.description}</div>}
            </div>
            <button
              type="button"
              className="ori-toast__close"
              onClick={() => dismiss(t.id)}
              aria-label="Fermer"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </li>
        );
      })}
    </ol>
  );
}
