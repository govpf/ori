import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { LucideAngularModule, Info, CircleCheck, TriangleAlert, CircleX, X } from 'lucide-angular';
import { OriToastService, type OriToastVariant } from './toast.service';

type LucideIconData = typeof Info;

export type OriToastViewportPosition =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center';

const VARIANT_ICON: Record<OriToastVariant, LucideIconData> = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleX,
};

/**
 * Région d'affichage des toasts émis par `OriToastService`.
 * À monter une fois dans le AppComponent.
 */
@Component({
  selector: 'ori-toast-viewport',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ol
      role="region"
      [attr.aria-label]="ariaLabel"
      aria-live="polite"
      [class]="'ori-toast-viewport ori-toast-viewport--' + position"
    >
      @for (t of toastService.toasts(); track t.id) {
        <li
          [attr.role]="t.variant === 'danger' ? 'alert' : 'status'"
          [class]="'ori-toast ori-toast--' + t.variant"
        >
          <lucide-icon
            [img]="iconFor(t.variant)"
            [size]="20"
            class="ori-toast__icon"
            aria-hidden="true"
          ></lucide-icon>
          <div class="ori-toast__content">
            @if (t.title) {
              <div class="ori-toast__title">{{ t.title }}</div>
            }
            @if (t.description) {
              <div>{{ t.description }}</div>
            }
          </div>
          <button
            type="button"
            class="ori-toast__close"
            aria-label="Fermer"
            (click)="toastService.dismiss(t.id)"
          >
            <lucide-icon [img]="XIcon" [size]="16" aria-hidden="true"></lucide-icon>
          </button>
        </li>
      }
    </ol>
  `,
})
export class OriToastViewportComponent {
  @Input() position: OriToastViewportPosition = 'top-right';
  @Input() ariaLabel: string = 'Notifications';

  protected readonly toastService = inject(OriToastService);
  protected readonly XIcon: LucideIconData = X;

  iconFor(variant: OriToastVariant): LucideIconData {
    return VARIANT_ICON[variant];
  }
}
