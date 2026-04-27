import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { LucideAngularModule, Check } from 'lucide-angular';

type LucideIconData = typeof Check;

export type OriStepStatus = 'completed' | 'current' | 'todo';

export interface OriStepItem {
  title: string;
  description?: string;
}

/**
 * Indicateur de progression d'un workflow (cf. décision F.3).
 * Read-only par défaut, opt-in `[clickable]="true"` pour permettre
 * le retour à une étape précédente complétée.
 */
@Component({
  selector: 'ori-steps',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ol class="ori-steps">
      @for (step of steps; track $index; let i = $index; let last = $last) {
        @let status = getStatus(i);
        @let isClickable = clickable && status === 'completed';
        <li
          [class]="'ori-steps__item ori-steps__item--' + status"
          [attr.aria-current]="status === 'current' ? 'step' : null"
        >
          @if (isClickable) {
            <button
              type="button"
              class="ori-steps__button"
              [attr.aria-label]="'Revenir à l\\'étape ' + (i + 1)"
              (click)="stepClick.emit(i)"
            >
              <span class="ori-steps__marker" aria-hidden="true">
                @if (status === 'completed') {
                  <lucide-icon [img]="CheckIcon" [size]="16"></lucide-icon>
                } @else {
                  {{ i + 1 }}
                }
              </span>
              <span class="ori-steps__label">
                <span class="ori-steps__title">{{ step.title }}</span>
                @if (step.description) {
                  <span class="ori-steps__description">{{ step.description }}</span>
                }
              </span>
            </button>
          } @else {
            <span class="ori-steps__marker" aria-hidden="true">
              @if (status === 'completed') {
                <lucide-icon [img]="CheckIcon" [size]="16"></lucide-icon>
              } @else {
                {{ i + 1 }}
              }
            </span>
            <span class="ori-steps__label">
              <span class="ori-steps__title">{{ step.title }}</span>
              @if (step.description) {
                <span class="ori-steps__description">{{ step.description }}</span>
              }
            </span>
          }
        </li>
        @if (!last) {
          <li class="ori-steps__separator" aria-hidden="true"></li>
        }
      }
    </ol>
  `,
})
export class OriStepsComponent {
  @Input() steps: OriStepItem[] = [];
  @Input() current: number = 0;
  @Input() clickable: boolean = false;

  @Output() stepClick = new EventEmitter<number>();

  protected readonly CheckIcon: LucideIconData = Check;

  getStatus(index: number): OriStepStatus {
    if (index < this.current) return 'completed';
    if (index === this.current) return 'current';
    return 'todo';
  }
}
