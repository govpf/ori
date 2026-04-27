import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

export type OriSelectSize = 'sm' | 'md' | 'lg';

export interface OriSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

let nextUid = 0;

/**
 * Liste déroulante simple basée sur `<select>` natif.
 *
 * Choix volontaire (cf. décision E.1) : on garde le natif pour l'a11y,
 * la cohérence mobile (picker système) et le bundle minimal. Un
 * `<ori-combobox>` séparé sera introduit à la demande pour les cas
 * search / multi-select.
 *
 * Bind : compatible avec [(ngModel)] via [value] / (valueChange).
 */
@Component({
  selector: 'ori-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="fieldClasses">
      @if (label) {
        <label [class]="labelClasses" [attr.for]="selectId">{{ label }}</label>
      }
      <select
        [id]="selectId"
        [class]="selectClasses"
        [value]="value ?? ''"
        [disabled]="disabled"
        [required]="required"
        [attr.name]="name || null"
        [attr.aria-invalid]="error ? 'true' : null"
        [attr.aria-describedby]="describedBy"
        (change)="onChange($event)"
        (blur)="blur.emit()"
      >
        @if (placeholder) {
          <option value="" disabled>{{ placeholder }}</option>
        }
        @for (opt of options; track opt.value) {
          <option [value]="opt.value" [disabled]="opt.disabled || null">{{ opt.label }}</option>
        }
      </select>
      @if (hint && !error) {
        <span [attr.id]="hintId" class="ori-field__hint">{{ hint }}</span>
      }
      @if (error) {
        <span [attr.id]="errorId" class="ori-field__error" role="alert">{{ error }}</span>
      }
    </div>
  `,
})
export class OriSelectComponent {
  @Input() label: string = '';
  @Input() hint: string = '';
  @Input() error: string = '';
  @Input() placeholder: string = '';
  @Input() size: OriSelectSize = 'md';
  @Input() value: string = '';
  @Input() options: OriSelectOption[] = [];
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() wrapperClass: string = '';

  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();

  private readonly autoId = `pf-select-${++nextUid}`;

  get selectId(): string {
    return this.id || this.autoId;
  }

  get hintId(): string | null {
    return this.hint && !this.error ? `${this.selectId}-hint` : null;
  }

  get errorId(): string | null {
    return this.error ? `${this.selectId}-error` : null;
  }

  get describedBy(): string | null {
    const ids = [this.hintId, this.errorId].filter(Boolean) as string[];
    return ids.length ? ids.join(' ') : null;
  }

  get fieldClasses(): string {
    return ['ori-field', this.wrapperClass].filter((c): c is string => Boolean(c)).join(' ');
  }

  get labelClasses(): string {
    return ['ori-field__label', this.required ? 'ori-field__label--required' : null]
      .filter((c): c is string => Boolean(c))
      .join(' ');
  }

  get selectClasses(): string {
    return ['ori-select', this.size !== 'md' ? `ori-select--${this.size}` : null]
      .filter((c): c is string => Boolean(c))
      .join(' ');
  }

  onChange(event: Event): void {
    const v = (event.target as HTMLSelectElement).value;
    this.value = v;
    this.valueChange.emit(v);
  }
}
