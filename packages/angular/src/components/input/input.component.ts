import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

export type OriInputSize = 'sm' | 'md' | 'lg';
export type OriInputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
export type OriInputMode =
  | 'none'
  | 'text'
  | 'tel'
  | 'url'
  | 'email'
  | 'numeric'
  | 'decimal'
  | 'search';

let nextUid = 0;

/**
 * Champ texte du DS.
 *
 * - Bind compatible avec [(ngModel)] via le couple [value] / (valueChange).
 * - Gère label, hint, error (avec aria-invalid + aria-describedby).
 * - Génère automatiquement un id si non fourni.
 * - Expose les attributs natifs HTML les plus courants pour les formulaires
 *   (autocomplete, name, inputMode, pattern). Pour des cas avancés, le
 *   consommateur peut wrapper et accéder au DOM via ViewChild.
 */
@Component({
  selector: 'ori-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="fieldClasses">
      @if (label) {
        <label [class]="labelClasses" [attr.for]="inputId">{{ label }}</label>
      }
      <input
        [id]="inputId"
        [class]="inputClasses"
        [type]="type"
        [value]="value ?? ''"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [required]="required"
        [attr.name]="name || null"
        [attr.autocomplete]="autocomplete || null"
        [attr.inputmode]="inputMode || null"
        [attr.pattern]="pattern || null"
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
export class OriInputComponent {
  @Input() label: string = '';
  @Input() hint: string = '';
  @Input() error: string = '';
  @Input() placeholder: string = '';
  @Input() type: OriInputType = 'text';
  @Input() size: OriInputSize = 'md';
  @Input() value: string | number | readonly string[] | null = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() id: string = '';
  /**
   * Classe CSS appliquée au wrapper `.ori-field` (pour permettre à l'app
   * consommatrice de styler le bloc complet : marges, layout, etc.).
   */
  @Input() wrapperClass: string = '';

  // Attributs natifs HTML exposés explicitement pour les besoins courants des
  // formulaires (alignement avec ce que React reçoit gratuitement via le
  // spread d'InputHTMLAttributes).
  @Input() name: string = '';
  @Input() autocomplete: string = '';
  @Input() inputMode: OriInputMode | '' = '';
  @Input() pattern: string = '';

  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();

  private readonly autoId = `pf-input-${++nextUid}`;

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
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.valueChange.emit(value);
  }
}
