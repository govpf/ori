import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { LucideAngularModule, Search } from 'lucide-angular';

type LucideIconData = typeof Search;

let nextUid = 0;

export type OriSearchBarSize = 'md' | 'sm';

/**
 * Champ de recherche autonome : input + bouton primaire de soumission.
 *
 * Posé sur un `<form role="search">` pour que la combinaison clavier
 * standard fonctionne (Entrée dans l'input soumet).
 *
 * a11y : `role="search"` sur le form, label associé via `for`/`id`, icône
 * loupe `aria-hidden`.
 */
@Component({
  selector: 'ori-search-bar',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <form [class]="formClasses" role="search" (submit)="onSubmit($event)">
      <label [attr.for]="inputId" [class]="labelClasses">{{ label }}</label>
      <div class="ori-search-bar__field">
        <input
          [id]="inputId"
          type="search"
          class="ori-search-bar__input"
          [attr.placeholder]="placeholder"
          [attr.name]="name || null"
          [value]="value"
          [disabled]="disabled"
          (input)="onInput($event)"
        />
        <button
          type="submit"
          class="ori-search-bar__button"
          [disabled]="disabled"
          [attr.aria-label]="iconOnlyButton ? buttonAriaLabel || buttonLabel : null"
        >
          <lucide-icon
            class="ori-search-bar__button-icon"
            [img]="SearchIcon"
            [size]="16"
            aria-hidden="true"
          ></lucide-icon>
          @if (!iconOnlyButton) {
            <span class="ori-search-bar__button-label">{{ buttonLabel }}</span>
          }
        </button>
      </div>
    </form>
  `,
})
export class OriSearchBarComponent {
  @Input() label: string = 'Rechercher';
  @Input() hideLabel: boolean = true;
  @Input() buttonLabel: string = 'Rechercher';
  @Input() iconOnlyButton: boolean = false;
  @Input() buttonAriaLabel: string = '';
  @Input() placeholder: string = 'Rechercher...';
  @Input() size: OriSearchBarSize = 'md';
  @Input() value: string = '';
  @Input() disabled: boolean = false;
  @Input() name: string = '';
  @Input() id: string = '';

  @Output() valueChange = new EventEmitter<string>();
  @Output() search = new EventEmitter<string>();

  protected readonly SearchIcon: LucideIconData = Search;
  private readonly autoId = `ori-search-${++nextUid}`;

  get inputId(): string {
    return this.id || this.autoId;
  }

  get formClasses(): string {
    return ['ori-search-bar', this.size === 'sm' ? 'ori-search-bar--sm' : null]
      .filter((c): c is string => Boolean(c))
      .join(' ');
  }

  get labelClasses(): string {
    return [
      'ori-search-bar__label',
      this.hideLabel ? 'ori-search-bar__label--visually-hidden' : null,
    ]
      .filter((c): c is string => Boolean(c))
      .join(' ');
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.valueChange.emit(this.value);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.search.emit(this.value);
  }
}
