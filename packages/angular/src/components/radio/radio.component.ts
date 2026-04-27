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
import { OriRadioGroupComponent } from './radio-group.component';

let nextUid = 0;

/**
 * Bouton radio individuel.
 *
 * Conçu pour vivre à l'intérieur d'un `<ori-radio-group>` qui orchestre la
 * sélection. Si utilisé seul (sans groupe parent), le composant fonctionne
 * en autonome via [checked] / (checkedChange) + [name] manuel.
 */
@Component({
  selector: 'ori-radio',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <label class="ori-choice" [attr.data-disabled]="effectiveDisabled ? 'true' : null">
      <input
        type="radio"
        class="ori-radio"
        [id]="inputId"
        [name]="effectiveName"
        [value]="value"
        [checked]="effectiveChecked"
        [disabled]="effectiveDisabled"
        [attr.aria-invalid]="effectiveInvalid ? 'true' : null"
        [attr.aria-describedby]="hintId"
        (change)="onChange($event)"
      />
      @if (label || hint) {
        <span class="ori-choice__label">
          {{ label }}
          @if (hint) {
            <span [attr.id]="hintId" class="ori-choice__hint">{{ hint }}</span>
          }
        </span>
      }
    </label>
  `,
})
export class OriRadioComponent {
  @Input() label: string = '';
  @Input() hint: string = '';
  /** Valeur de cet item dans le groupe. Obligatoire. */
  @Input() value: string = '';
  /** Utilisé uniquement hors groupe. Dans un groupe, le checked vient du parent. */
  @Input() checked: boolean = false;
  /** Utilisé uniquement hors groupe. */
  @Input() disabled: boolean = false;
  /** Utilisé uniquement hors groupe. */
  @Input() name: string = '';
  @Input() id: string = '';

  @Output() checkedChange = new EventEmitter<boolean>();

  private readonly group = inject(OriRadioGroupComponent, { optional: true, host: true });
  private readonly autoId = `pf-radio-${++nextUid}`;

  get inputId(): string {
    return this.id || this.autoId;
  }

  get hintId(): string | null {
    return this.hint ? `${this.inputId}-hint` : null;
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
