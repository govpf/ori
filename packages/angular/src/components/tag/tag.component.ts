import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';

type LucideIconData = typeof X;

export type OriTagVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'ori-tag',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span [class]="tagClasses">
      <ng-content></ng-content>
      @if (removable) {
        <button
          type="button"
          class="ori-tag__remove"
          [attr.aria-label]="removeLabel"
          (click)="remove.emit($event)"
        >
          <lucide-icon [img]="XIcon" [size]="12" aria-hidden="true"></lucide-icon>
        </button>
      }
    </span>
  `,
})
export class OriTagComponent {
  @Input() variant: OriTagVariant = 'neutral';
  /** Affiche un bouton de suppression à droite. */
  @Input() removable: boolean = false;
  @Input() removeLabel: string = 'Retirer';

  @Output() remove = new EventEmitter<MouseEvent>();

  protected readonly XIcon: LucideIconData = X;

  get tagClasses(): string {
    return `ori-tag ori-tag--${this.variant}`;
  }
}
