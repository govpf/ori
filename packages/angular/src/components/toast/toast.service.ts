import { Injectable, signal } from '@angular/core';

export type OriToastVariant = 'info' | 'success' | 'warning' | 'danger';

export interface OriToastOptions {
  title?: string;
  description?: string;
  variant?: OriToastVariant;
  /** Durée en ms avant auto-dismiss. 0 = pas d'auto-dismiss. Default: 5000. */
  duration?: number;
}

export interface OriToastInstance extends Required<Pick<OriToastOptions, 'variant' | 'duration'>> {
  id: number;
  title?: string;
  description?: string;
}

let nextId = 0;

/**
 * Service Toast injectable globalement (cf. décision H.1).
 *
 * Usage :
 * ```ts
 * private toast = inject(OriToastService);
 * this.toast.success('Modifications enregistrées.');
 * ```
 *
 * Le composant `<ori-toast-viewport>` doit être monté une fois dans
 * l'AppComponent pour afficher les toasts émis.
 */
@Injectable({ providedIn: 'root' })
export class OriToastService {
  private readonly _toasts = signal<OriToastInstance[]>([]);
  private readonly timers = new Map<number, number>();

  /** Signal exposant la liste courante des toasts (consommé par la viewport). */
  readonly toasts = this._toasts.asReadonly();

  show(options: OriToastOptions): number {
    const id = ++nextId;
    const instance: OriToastInstance = {
      id,
      title: options.title,
      description: options.description,
      variant: options.variant ?? 'info',
      duration: options.duration ?? 5000,
    };
    this._toasts.update((prev) => [...prev, instance]);
    if (instance.duration > 0) {
      const timer = window.setTimeout(() => this.dismiss(id), instance.duration);
      this.timers.set(id, timer);
    }
    return id;
  }

  info(description: string, options?: Omit<OriToastOptions, 'variant' | 'description'>): number {
    return this.show({ description, variant: 'info', ...options });
  }

  success(description: string, options?: Omit<OriToastOptions, 'variant' | 'description'>): number {
    return this.show({ description, variant: 'success', ...options });
  }

  warning(description: string, options?: Omit<OriToastOptions, 'variant' | 'description'>): number {
    return this.show({ description, variant: 'warning', ...options });
  }

  danger(description: string, options?: Omit<OriToastOptions, 'variant' | 'description'>): number {
    return this.show({ description, variant: 'danger', ...options });
  }

  dismiss(id: number): void {
    this._toasts.update((prev) => prev.filter((t) => t.id !== id));
    const timer = this.timers.get(id);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      this.timers.delete(id);
    }
  }

  dismissAll(): void {
    this._toasts.set([]);
    this.timers.forEach((t) => window.clearTimeout(t));
    this.timers.clear();
  }
}
