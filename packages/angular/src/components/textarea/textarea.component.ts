import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

let nextUid = 0;

/**
 * Champ de saisie multi-lignes.
 *
 * - Bind compatible avec [(ngModel)] via [value] / (valueChange).
 * - Gère label, hint, error (avec aria-invalid + aria-describedby).
 * - `rows` configure la hauteur initiale, l'utilisateur peut redimensionner
 *   verticalement via le handle natif.
 */
@Component({
  selector: 'ori-textarea',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="fieldClasses">
      @if (label) {
        <label [class]="labelClasses" [attr.for]="textareaId">{{ label }}</label>
      }
      <textarea
        [id]="textareaId"
        class="ori-textarea"
        [rows]="rows"
        [value]="value ?? ''"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [required]="required"
        [attr.name]="name || null"
        [attr.maxlength]="maxLength || null"
        [attr.aria-invalid]="error ? 'true' : null"
        [attr.aria-describedby]="describedBy"
        (input)="onInput($event)"
        (blur)="blur.emit()"
      ></textarea>
      @if (hint && !error) {
        <span [attr.id]="hintId" class="ori-field__hint">{{ hint }}</span>
      }
      @if (error) {
        <span [attr.id]="errorId" class="ori-field__error" role="alert">{{ error }}</span>
      }
    </div>
  `,
})
export class OriTextareaComponent {
  @Input() label: string = '';
  @Input() hint: string = '';
  @Input() error: string = '';
  @Input() placeholder: string = '';
  @Input() value: string = '';
  @Input() rows: number = 4;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() maxLength: number | null = null;
  @Input() wrapperClass: string = '';

  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();

  private readonly autoId = `pf-textarea-${++nextUid}`;

  get textareaId(): string {
    return this.id || this.autoId;
  }

  get hintId(): string | null {
    return this.hint && !this.error ? `${this.textareaId}-hint` : null;
  }

  get errorId(): string | null {
    return this.error ? `${this.textareaId}-error` : null;
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

  onInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.value = value;
    this.valueChange.emit(value);
  }
}
