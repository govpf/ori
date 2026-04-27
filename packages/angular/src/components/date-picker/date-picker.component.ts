import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

export type OriDatePickerSize = 'sm' | 'md' | 'lg';

let nextUid = 0;

/**
 * Sélecteur de date basé sur `<input type="date">` natif.
 *
 * Choix volontaire (cf. décision E.2) : on garde le natif. La valeur
 * est stockée au format ISO `yyyy-mm-dd`. L'affichage suit la locale
 * du navigateur (`JJ/MM/AAAA` en fr-FR/fr-PF). Pour un calendrier
 * custom (range, désactivation de jours), un composant dédié sera
 * introduit à la demande.
 *
 * Bind : compatible avec [(ngModel)] via [value] / (valueChange).
 */
@Component({
  selector: 'ori-date-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="fieldClasses">
      @if (label) {
        <label [class]="labelClasses" [attr.for]="inputId">{{ label }}</label>
      }
      <input
        type="date"
        [id]="inputId"
        [class]="inputClasses"
        [value]="value ?? ''"
        [disabled]="disabled"
        [required]="required"
        [attr.name]="name || null"
        [attr.min]="min || null"
        [attr.max]="max || null"
        [attr.aria-invalid]="error ? 'true' : null"
        [attr.aria-describedby]="describedBy"
        (input)="onInput($event)"
        (blur)="blur.emit()"
      />
      @if (hint && !error) {
        <span [attr.id]="hintId" class="ori-field__hint">{{ hint }}</span>
      }
      @if (error) {
        <span [attr.id]="errorId" class="ori-field__error" role="alert">{{ error }}</span>
      }
    </div>
  `,
})
export class OriDatePickerComponent {
  @Input() label: string = '';
  @Input() hint: string = '';
  @Input() error: string = '';
  @Input() size: OriDatePickerSize = 'md';
  /** Valeur ISO `yyyy-mm-dd`. */
  @Input() value: string = '';
  /** Date min ISO. */
  @Input() min: string = '';
  /** Date max ISO. */
  @Input() max: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() wrapperClass: string = '';

  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();

  private readonly autoId = `pf-date-${++nextUid}`;

  get inputId(): string {
    return this.id || this.autoId;
  }

  get hintId(): string | null {
    return this.hint && !this.error ? `${this.inputId}-hint` : null;
  }

  get errorId(): string | null {
    return this.error ? `${this.inputId}-error` : null;
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

  get inputClasses(): string {
    return ['ori-input', this.size !== 'md' ? `ori-input--${this.size}` : null]
      .filter((c): c is string => Boolean(c))
      .join(' ');
  }

  onInput(event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    this.value = v;
    this.valueChange.emit(v);
  }
}
