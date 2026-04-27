import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { LucideAngularModule, Info, CircleCheck, TriangleAlert, CircleX, X } from 'lucide-angular';

type LucideIconData = typeof Info;

export type OriNotificationVariant = 'info' | 'success' | 'warning' | 'danger';

const VARIANT_ICON: Record<OriNotificationVariant, LucideIconData> = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleX,
};

/**
 * Notification : bandeau d'information système plein-largeur (cf.
 * décision H.2). Différent d'Alert (inline contextuel) et de Toast
 * (éphémère overlay) - persiste jusqu'à fermeture explicite.
 */
@Component({
  selector: 'ori-notification',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (open) {
      <div [attr.role]="variant === 'danger' ? 'alert' : 'status'" [class]="notificationClasses">
        <lucide-icon
          [img]="iconFor(variant)"
          [size]="20"
          class="ori-notification__icon"
          aria-hidden="true"
        ></lucide-icon>
        <div class="ori-notification__content">
          <span><ng-content></ng-content></span>
          @if (actionLabel && actionHref) {
            <a [href]="actionHref" class="ori-notification__action">{{ actionLabel }}</a>
          } @else if (actionLabel) {
            <button
              type="button"
              class="ori-notification__action"
              (click)="actionClick.emit($event)"
            >
              {{ actionLabel }}
            </button>
          }
        </div>
        @if (dismissible) {
          <button
            type="button"
            class="ori-notification__close"
            aria-label="Fermer"
            (click)="onDismiss()"
          >
            <lucide-icon [img]="XIcon" [size]="16" aria-hidden="true"></lucide-icon>
          </button>
        }
      </div>
    }
  `,
})
export class OriNotificationComponent {
  @Input() variant: OriNotificationVariant = 'info';
  @Input() dismissible: boolean = false;
  /** Texte du lien/bouton d'action optionnel. */
  @Input() actionLabel: string = '';
  /** Si fourni, l'action est rendue comme `<a href>` ; sinon comme `<button>`. */
  @Input() actionHref: string = '';

  @Output() actionClick = new EventEmitter<MouseEvent>();
  @Output() dismiss = new EventEmitter<void>();

  open = true;

  protected readonly XIcon: LucideIconData = X;

  iconFor(variant: OriNotificationVariant): LucideIconData {
    return VARIANT_ICON[variant];
  }

  get notificationClasses(): string {
    return `ori-notification ori-notification--${this.variant}`;
  }

  onDismiss(): void {
    this.open = false;
    this.dismiss.emit();
  }
}
