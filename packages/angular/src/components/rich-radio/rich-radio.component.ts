import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Optional,
  Output,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { OriRichRadioGroupComponent } from './rich-radio-group.component';

let nextUid = 0;

/**
 * Option d'un `<ori-rich-radio-group>` rendue sous forme de carte.
 *
 * Pattern identique à `<ori-radio>` (input radio natif + label) avec un
 * visuel "carte" : titre + description sous-jacente + slot trailing pour
 * une icône ou une image décorative à droite.
 */
@Component({
  selector: 'ori-rich-radio',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <label [class]="cardClasses">
      <span class="ori-rich-radio__control">
        <input
          type="radio"
          class="ori-radio"
          [id]="inputId"
          [name]="effectiveName"
          [value]="value"
          [checked]="effectiveChecked"
          [disabled]="effectiveDisabled"
          [attr.aria-invalid]="effectiveInvalid ? 'true' : null"
          [attr.aria-describedby]="descriptionId"
          (change)="onChange($event)"
        />
        <span class="ori-rich-radio__text">
          <span class="ori-rich-radio__label">{{ label }}</span>
          @if (description) {
            <span [attr.id]="descriptionId" class="ori-rich-radio__description">
              {{ description }}
            </span>
          }
        </span>
      </span>
      <span class="ori-rich-radio__trailing">
        <ng-content select="[slot=trailing]"></ng-content>
      </span>
    </label>
  `,
})
export class OriRichRadioComponent {
  @Input() label: string = '';
  @Input() description: string = '';
  @Input() value: string = '';
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() name: string = '';
  @Input() id: string = '';

  @Output() checkedChange = new EventEmitter<boolean>();

  private readonly group = inject(OriRichRadioGroupComponent, { optional: true, host: true });
  private readonly autoId = `ori-rich-radio-${++nextUid}`;

  get inputId(): string {
    return this.id || this.autoId;
  }

  get descriptionId(): string | null {
    return this.description ? `${this.inputId}-desc` : null;
  }

  get effectiveName(): string {
    return this.group?.groupName || this.name || '';
  }

  get effectiveChecked(): boolean {
    return this.group ? this.group.value === this.value : this.checked;
  }

  get effectiveDisabled(): boolean {
    return this.disabled || Boolean(this.group?.disabled);
  }

  get effectiveInvalid(): boolean {
    return Boolean(this.group?.invalid);
  }

  get cardClasses(): string {
    return [
      'ori-rich-radio',
      this.effectiveChecked ? 'ori-rich-radio--checked' : null,
      this.effectiveDisabled ? 'ori-rich-radio--disabled' : null,
      this.effectiveInvalid ? 'ori-rich-radio--invalid' : null,
    ]
      .filter((c): c is string => Boolean(c))
      .join(' ');
  }

  onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      if (this.group) {
        this.group.selectValue(this.value);
      } else {
        this.checked = true;
        this.checkedChange.emit(true);
      }
    }
  }
}
