import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { LucideAngularModule, ChevronDown } from 'lucide-angular';

type LucideIconData = typeof ChevronDown;

let nextUid = 0;

export interface OriPhoneInputCountry {
  code: string;
  dialCode: string;
  label?: string;
  /** Marqueur visuel optionnel : passer un caractère emoji (ex. "🇵🇫"). */
  flag?: string;
}

const DEFAULT_COUNTRIES: OriPhoneInputCountry[] = [
  { code: 'PF', dialCode: '+689', label: 'Polynésie française' },
];

/**
 * Champ de saisie d'un numéro de téléphone.
 *
 * Composé d'un sélecteur d'indicatif et d'un input texte. Si la liste de
 * pays contient un seul élément, le sélecteur est rendu en lecture seule.
 *
 * MVP : pas de masque ni de validation de format ; à brancher par l'app
 * via `pattern` ou un validateur Angular.
 */
@Component({
  selector: 'ori-phone-input',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="fieldClasses">
      @if (label) {
        <label [attr.for]="inputId" [class]="labelClasses">{{ label }}</label>
      }
      @if (error) {
        <span [attr.id]="errorId" class="ori-field__error" role="alert">{{ error }}</span>
      }
      <div [class]="wrapperClasses">
        @if (onlyOneCountry || readOnly) {
          <span class="ori-phone-input__country ori-phone-input__country--static">
            @if (currentCountry?.flag) {
              <span class="ori-phone-input__flag" aria-hidden="true">{{
                currentCountry?.flag
              }}</span>
            }
            <span class="ori-phone-input__dial-code">{{ currentCountry?.dialCode }}</span>
          </span>
        } @else {
          <span class="ori-phone-input__country">
            @if (currentCountry?.flag) {
              <span class="ori-phone-input__flag" aria-hidden="true">{{
                currentCountry?.flag
              }}</span>
            }
            <span class="ori-phone-input__dial-code">{{ currentCountry?.dialCode }}</span>
            <lucide-icon
              class="ori-phone-input__chevron"
              [img]="ChevronDownIcon"
              [size]="16"
              aria-hidden="true"
            ></lucide-icon>
            <select
              class="ori-phone-input__select"
              aria-label="Indicatif pays"
              [value]="countryCode"
              [disabled]="disabled"
              (change)="onCountrySelect($event)"
            >
              @for (c of countries; track c.code) {
                <option [value]="c.code">
                  {{ (c.label || c.code) + ' (' + c.dialCode + ')' }}
                </option>
              }
            </select>
          </span>
        }
        <input
          [id]="inputId"
          type="tel"
          inputmode="tel"
          autocomplete="tel-national"
          class="ori-phone-input__number"
          [attr.placeholder]="placeholder"
          [required]="required"
          [disabled]="disabled"
          [readonly]="readOnly"
          [attr.aria-describedby]="describedBy"
          [attr.aria-invalid]="error ? 'true' : null"
          [value]="value"
          (input)="onValueInput($event)"
        />
      </div>
      @if (hint && !error) {
        <span [attr.id]="hintId" class="ori-field__hint">{{ hint }}</span>
      }
    </div>
  `,
})
export class OriPhoneInputComponent {
  @Input() label: string = '';
  @Input() hint: string = '';
  @Input() error: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() readOnly: boolean = false;
  @Input() id: string = '';
  @Input() placeholder: string = '40 41 23 45';
  @Input() countries: OriPhoneInputCountry[] = DEFAULT_COUNTRIES;
  @Input() countryCode: string = 'PF';
  @Input() value: string = '';

  @Output() countryCodeChange = new EventEmitter<string>();
  @Output() valueChange = new EventEmitter<string>();

  protected readonly ChevronDownIcon: LucideIconData = ChevronDown;
  private readonly autoId = `ori-phone-${++nextUid}`;

  get inputId(): string {
    return this.id || this.autoId;
  }

  get hintId(): string | null {
    return this.hint && !this.error ? `${this.autoId}-hint` : null;
  }

  get errorId(): string | null {
    return this.error ? `${this.autoId}-error` : null;
  }

  get describedBy(): string | null {
    const ids = [this.hintId, this.errorId].filter(Boolean) as string[];
    return ids.length ? ids.join(' ') : null;
  }

  get fieldClasses(): string {
    return [
      'ori-field',
      this.error ? 'ori-field--invalid' : null,
      this.readOnly ? 'ori-phone-input--readonly' : null,
    ]
      .filter((c): c is string => Boolean(c))
      .join(' ');
  }

  get labelClasses(): string {
    return ['ori-field__label', this.required ? 'ori-field__label--required' : null]
      .filter((c): c is string => Boolean(c))
      .join(' ');
  }

  get wrapperClasses(): string {
    return [
      'ori-phone-input',
      this.disabled ? 'ori-phone-input--disabled' : null,
      this.readOnly ? 'ori-phone-input--readonly' : null,
      this.error ? 'ori-phone-input--invalid' : null,
    ]
      .filter((c): c is string => Boolean(c))
      .join(' ');
  }

  get currentCountry(): OriPhoneInputCountry | undefined {
    return (
      this.countries.find((c) => c.code === this.countryCode) ??
      this.countries[0] ??
      DEFAULT_COUNTRIES[0]
    );
  }

  get onlyOneCountry(): boolean {
    return this.countries.length <= 1;
  }

  onCountrySelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.countryCode = target.value;
    this.countryCodeChange.emit(this.countryCode);
  }

  onValueInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.valueChange.emit(this.value);
  }
}
