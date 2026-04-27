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
 * Bascule on/off pour un réglage qui s'applique immédiatement (à la
 * différence d'une checkbox qui s'applique après validation d'un formulaire).
 *
 * Sémantique HTML : `<input type="checkbox" role="switch">` - on hérite de
 * la gestion native (focus, formulaires) tout en exposant la sémantique
 * "switch" pour les lecteurs d'écran.
 */
@Component({
  selector: 'ori-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <label
      [class]="wrapperClasses"
      [attr.data-disabled]="disabled ? 'true' : null"
      [attr.for]="inputId"
    >
      <span class="ori-switch">
        <input
          type="checkbox"
          role="switch"
          class="ori-switch__input"
          [id]="inputId"
          [checked]="checked"
          [disabled]="disabled"
          [attr.name]="name || null"
          [attr.aria-describedby]="hintId"
          (change)="onChange($event)"
        />
        <span class="ori-switch__track" aria-hidden="true"></span>
      </span>
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
export class OriSwitchComponent {
  @Input() label: string = '';
  @Input() hint: string = '';
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() wrapperClass: string = '';

  @Output() checkedChange = new EventEmitter<boolean>();

  private readonly autoId = `pf-switch-${++nextUid}`;

  get inputId(): string {
    return this.id || this.autoId;
  }

  get hintId(): string | null {
    return this.hint ? `${this.inputId}-hint` : null;
  }

  get wrapperClasses(): string {
    return ['ori-choice', this.wrapperClass].filter((c): c is string => Boolean(c)).join(' ');
  }

  onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.checkedChange.emit(target.checked);
  }
}
