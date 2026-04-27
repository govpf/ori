import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

let nextUid = 0;

export type OriRadioGroupOrientation = 'vertical' | 'inline';

/**
 * Conteneur d'un groupe de boutons radio.
 *
 * Pose le `<fieldset>`/`<legend>`, gère la valeur sélectionnée et propage
 * le `name` partagé + l'état désactivé/invalide aux `<ori-radio>` enfants
 * qui s'enregistrent via injection.
 */
@Component({
  selector: 'ori-radio-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <fieldset
      class="ori-field"
      style="border: 0; padding: 0; margin: 0;"
      [attr.aria-describedby]="describedBy"
      [attr.aria-invalid]="error ? 'true' : null"
    >
      @if (label) {
        <legend [class]="legendClasses">{{ label }}</legend>
      }
      <div [class]="groupClasses" role="radiogroup">
        <ng-content></ng-content>
      </div>
      @if (hint && !error) {
        <span [attr.id]="hintId" class="ori-field__hint">{{ hint }}</span>
      }
      @if (error) {
        <span [attr.id]="errorId" class="ori-field__error" role="alert">{{ error }}</span>
      }
    </fieldset>
  `,
})
export class OriRadioGroupComponent {
  @Input() label: string = '';
  @Input() hint: string = '';
  @Input() error: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() name: string = '';
  @Input() value: string = '';
  @Input() orientation: OriRadioGroupOrientation = 'vertical';

  @Output() valueChange = new EventEmitter<string>();

  private readonly autoId = `pf-radiogroup-${++nextUid}`;

  get groupName(): string {
    return this.name || this.autoId;
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

  get legendClasses(): string {
    return ['ori-field__label', this.required ? 'ori-field__label--required' : null]
      .filter((c): c is string => Boolean(c))
      .join(' ');
  }

  get groupClasses(): string {
    return ['ori-choice-group', this.orientation === 'inline' ? 'ori-choice-group--inline' : null]
      .filter((c): c is string => Boolean(c))
      .join(' ');
  }

  get invalid(): boolean {
    return Boolean(this.error);
  }

  /** Appelé par les enfants `<ori-radio>` quand l'utilisateur sélectionne. */
  selectValue(value: string): void {
    this.value = value;
    this.valueChange.emit(value);
  }
}
