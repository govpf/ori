import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

let nextUid = 0;

/**
 * Barre de progression basée sur l'élément `<progress>` natif
 * (cf. décision G.2). Mode indéterminé en omettant `value`.
 */
@Component({
  selector: 'ori-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (label) {
      <div class="ori-progress-wrap">
        <div class="ori-progress__label">
          <label [attr.for]="progressId">{{ label }}</label>
          @if (shouldShowValue) {
            <span class="ori-progress__value">{{ displayValue }}%</span>
          }
        </div>
        <progress
          [id]="progressId"
          class="ori-progress"
          [value]="value !== null ? value : null"
          [max]="max"
        ></progress>
      </div>
    } @else {
      <progress
        [id]="progressId"
        class="ori-progress"
        [value]="value !== null ? value : null"
        [max]="max"
      ></progress>
    }
  `,
})
export class OriProgressComponent {
  /** Valeur courante. `null` = mode indéterminé. */
  @Input() value: number | null = null;
  @Input() max: number = 100;
  @Input() label: string = '';
  /** Force l'affichage de la valeur en pourcentage (default : auto). */
  @Input() showValue: boolean | null = null;
  @Input() id: string = '';

  private readonly autoId = `pf-progress-${++nextUid}`;

  get progressId(): string {
    return this.id || this.autoId;
  }

  get displayValue(): number {
    if (this.value === null) return 0;
    return Math.round((this.value / this.max) * 100);
  }

  get shouldShowValue(): boolean {
    if (this.showValue !== null) return this.showValue;
    return Boolean(this.label) && this.value !== null;
  }
}
