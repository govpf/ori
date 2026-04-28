import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

let nextUid = 0;

/**
 * Case à cocher binaire avec état indéterminé optionnel.
 *
 * - Bind compatible avec [(ngModel)] via [checked] / (checkedChange).
 * - Indeterminate est une property DOM (pas un attribut), gérée via ViewChild.
 * - Auto-génère un id si non fourni pour câbler `<label for="...">`.
 */
@Component({
  selector: 'ori-checkbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  // aria-label sur le wrapper custom element a un rôle "generic" qui
  // l'interdit (axe : aria-prohibited-attr). Retiré ici, repropagé sur
  // le <input> interne où il est sémantiquement valide.
  host: {
    '[attr.aria-label]': 'null',
  },
  template: `
    <label [class]="wrapperClasses" [attr.data-disabled]="disabled ? 'true' : null">
      <input
        #inputEl
        type="checkbox"
        class="ori-checkbox"
        [id]="inputId"
        [checked]="checked"
        [disabled]="disabled"
        [attr.name]="name || null"
        [attr.value]="value || null"
        [attr.aria-invalid]="error ? 'true' : null"
        [attr.aria-describedby]="describedBy"
        [attr.aria-label]="ariaLabel"
        (change)="onChange($event)"
      />
      @if (label || hint || error) {
        <span class="ori-choice__label">
          {{ label }}
          @if (hint && !error) {
            <span [attr.id]="hintId" class="ori-choice__hint">{{ hint }}</span>
          }
          @if (error) {
            <span
              [attr.id]="errorId"
              class="ori-choice__hint"
              role="alert"
              style="color: var(--color-feedback-danger)"
              >{{ error }}</span
            >
          }
        </span>
      }
    </label>
  `,
})
export class OriCheckboxComponent implements AfterViewInit, OnChanges {
  @Input() label: string = '';
  @Input() hint: string = '';
  @Input() error: string = '';
  @Input() checked: boolean = false;
  @Input() indeterminate: boolean = false;
  @Input() disabled: boolean = false;
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() value: string = '';
  @Input() wrapperClass: string = '';
  /**
   * Forwardé sur l'`<input>` interne. À renseigner pour les checkbox
   * sans label visible (ex: case "Tout sélectionner" dans un Table).
   */
  @Input('aria-label') ariaLabel: string | null = null;

  @Output() checkedChange = new EventEmitter<boolean>();

  @ViewChild('inputEl') private inputEl?: ElementRef<HTMLInputElement>;

  private readonly autoId = `pf-checkbox-${++nextUid}`;

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

  get wrapperClasses(): string {
    return ['ori-choice', this.wrapperClass].filter((c): c is string => Boolean(c)).join(' ');
  }

  ngAfterViewInit(): void {
    this.applyIndeterminate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['indeterminate']) {
      this.applyIndeterminate();
    }
  }

  private applyIndeterminate(): void {
    if (this.inputEl) {
      this.inputEl.nativeElement.indeterminate = this.indeterminate;
    }
  }

  onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.checkedChange.emit(target.checked);
  }
}
