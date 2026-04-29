import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { LucideAngularModule, ChevronDown, Check } from 'lucide-angular';

// LucideIconData n'est pas exporté par le barrel public ; on le dérive depuis
// une icône connue pour éviter TS2742 en mode partial-compilation.
type LucideIconData = typeof ChevronDown;

let nextUid = 0;

export interface OriComboboxOption {
  id: string;
  label: string;
  /** Description courte affichée en seconde ligne, optionnelle. */
  description?: string;
  disabled?: boolean;
}

/**
 * Combobox / Autocomplete accessible.
 *
 * Pattern WAI-ARIA "combobox" v1.2 (input texte + listbox externe). Filtre
 * les options à la frappe ; navigation clavier complète ; sélection à
 * l'Entrée ou au clic ; ESC ferme la liste.
 *
 * a11y :
 * - input avec role="combobox", aria-autocomplete="list", aria-expanded,
 *   aria-controls, aria-activedescendant
 * - listbox avec role="listbox" + aria-label
 * - chaque option avec role="option" + aria-selected
 *
 * Volontairement pas de multi-select, pas de chargement async, pas de
 * création d'option à la volée. Parité fonctionnelle avec la version React.
 */
@Component({
  selector: 'ori-combobox',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ori-combobox">
      <label [id]="labelId" [attr.for]="inputId" class="ori-combobox__label">{{ label }}</label>
      <div class="ori-combobox__field">
        <input
          #input
          [id]="inputId"
          type="text"
          role="combobox"
          aria-autocomplete="list"
          [attr.aria-expanded]="open"
          [attr.aria-controls]="listboxId"
          [attr.aria-activedescendant]="activeOptionId"
          [attr.aria-labelledby]="labelId"
          autocomplete="off"
          spellcheck="false"
          [disabled]="disabled"
          [placeholder]="placeholder"
          [value]="query"
          (input)="onInput($event)"
          (focus)="setOpen(true)"
          (click)="setOpen(true)"
          (keydown)="onKeyDown($event)"
          class="ori-combobox__input"
        />
        <span class="ori-combobox__chevron" aria-hidden="true">
          <lucide-icon [img]="ChevronDownIcon" [size]="16"></lucide-icon>
        </span>
      </div>
      @if (open) {
        <ul [id]="listboxId" role="listbox" [attr.aria-label]="label" class="ori-combobox__listbox">
          @if (filtered.length === 0) {
            <li class="ori-combobox__empty" aria-disabled="true">{{ noResultsLabel }}</li>
          } @else {
            @for (option of filtered; track option.id; let i = $index) {
              <li
                [id]="optionId(option)"
                role="option"
                [attr.aria-selected]="option.id === value"
                [attr.aria-disabled]="option.disabled || null"
                [class.ori-combobox__option]="true"
                [class.ori-combobox__option--active]="enabledIndexOf(option) === activeIndex"
                [class.ori-combobox__option--selected]="option.id === value"
                [class.ori-combobox__option--disabled]="option.disabled"
                (mousedown)="$event.preventDefault()"
                (click)="selectOption(option)"
                (mouseenter)="setActive(option)"
              >
                <span class="ori-combobox__option-text">
                  <span class="ori-combobox__option-label">{{ option.label }}</span>
                  @if (option.description) {
                    <span class="ori-combobox__option-description">{{ option.description }}</span>
                  }
                </span>
                @if (option.id === value) {
                  <lucide-icon
                    class="ori-combobox__option-check"
                    [img]="CheckIcon"
                    [size]="16"
                    aria-hidden="true"
                  ></lucide-icon>
                }
              </li>
            }
          }
        </ul>
      }
    </div>
  `,
})
export class OriComboboxComponent {
  @Input() set options(value: OriComboboxOption[]) {
    this._options = value ?? [];
    this.recompute();
  }
  get options(): OriComboboxOption[] {
    return this._options;
  }

  @Input() set value(v: string | undefined) {
    this._value = v;
    if (!this.open) {
      const opt = this._options.find((o) => o.id === v);
      this.query = opt?.label ?? '';
    }
    this.recompute();
  }
  get value(): string | undefined {
    return this._value;
  }

  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() noResultsLabel: string = 'Aucun résultat';
  /** Fonction de filtrage custom. Default : prefix-match insensible à la casse. */
  @Input() filterFn: (option: OriComboboxOption, query: string) => boolean = (option, q) => {
    if (!q) return true;
    return option.label.toLocaleLowerCase().includes(q.toLocaleLowerCase());
  };

  @Output() valueChange = new EventEmitter<string | undefined>();

  @ViewChild('input') protected inputRef?: ElementRef<HTMLInputElement>;

  protected readonly ChevronDownIcon: LucideIconData = ChevronDown;
  protected readonly CheckIcon: LucideIconData = Check;

  private readonly uid = ++nextUid;
  protected readonly inputId = `pf-combobox-input-${this.uid}`;
  protected readonly listboxId = `pf-combobox-listbox-${this.uid}`;
  protected readonly labelId = `pf-combobox-label-${this.uid}`;

  protected open = false;
  protected query = '';
  protected activeIndex = -1;
  protected filtered: OriComboboxOption[] = [];
  protected enabledFiltered: OriComboboxOption[] = [];

  private _options: OriComboboxOption[] = [];
  private _value: string | undefined;

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly hostRef = inject(ElementRef<HTMLElement>);

  protected get activeOptionId(): string | null {
    if (!this.open || this.activeIndex < 0) return null;
    const opt = this.enabledFiltered[this.activeIndex];
    return opt ? this.optionId(opt) : null;
  }

  protected optionId(option: OriComboboxOption): string {
    return `${this.listboxId}-option-${option.id}`;
  }

  protected enabledIndexOf(option: OriComboboxOption): number {
    return this.enabledFiltered.indexOf(option);
  }

  protected setOpen(open: boolean): void {
    if (this.open === open) return;
    this.open = open;
    if (open && this.activeIndex < 0) this.activeIndex = 0;
    this.recompute();
  }

  protected setActive(option: OriComboboxOption): void {
    if (option.disabled) return;
    const idx = this.enabledFiltered.indexOf(option);
    if (idx >= 0 && idx !== this.activeIndex) {
      this.activeIndex = idx;
      this.cdr.markForCheck();
    }
  }

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.query = target.value;
    this.open = true;
    this.activeIndex = 0;
    if (!target.value && this._value !== undefined) {
      this._value = undefined;
      this.valueChange.emit(undefined);
    }
    this.recompute();
  }

  protected selectOption(option: OriComboboxOption): void {
    if (option.disabled) return;
    this._value = option.id;
    this.query = option.label;
    this.valueChange.emit(option.id);
    this.closeList();
  }

  protected onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.open) {
          this.open = true;
          this.activeIndex = 0;
          this.recompute();
        } else if (this.enabledFiltered.length) {
          this.activeIndex = (this.activeIndex + 1) % this.enabledFiltered.length;
          this.cdr.markForCheck();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!this.open) {
          this.open = true;
          this.activeIndex = this.enabledFiltered.length - 1;
          this.recompute();
        } else if (this.enabledFiltered.length) {
          this.activeIndex =
            this.activeIndex <= 0 ? this.enabledFiltered.length - 1 : this.activeIndex - 1;
          this.cdr.markForCheck();
        }
        break;
      case 'Home':
        if (this.open) {
          event.preventDefault();
          this.activeIndex = 0;
          this.cdr.markForCheck();
        }
        break;
      case 'End':
        if (this.open) {
          event.preventDefault();
          this.activeIndex = this.enabledFiltered.length - 1;
          this.cdr.markForCheck();
        }
        break;
      case 'Enter':
        if (this.open && this.activeIndex >= 0 && this.enabledFiltered[this.activeIndex]) {
          event.preventDefault();
          this.selectOption(this.enabledFiltered[this.activeIndex]);
        }
        break;
      case 'Escape':
        if (this.open) {
          event.preventDefault();
          this.closeList();
          // Restaurer le label de la valeur actuelle
          const opt = this._options.find((o) => o.id === this._value);
          this.query = opt?.label ?? '';
          this.cdr.markForCheck();
        }
        break;
      case 'Tab':
        if (this.open && this.activeIndex >= 0 && this.enabledFiltered[this.activeIndex]) {
          this.selectOption(this.enabledFiltered[this.activeIndex]);
        }
        break;
    }
  }

  @HostListener('document:mousedown', ['$event'])
  protected onDocumentMouseDown(event: MouseEvent): void {
    if (!this.open) return;
    const target = event.target as Node;
    if (!this.hostRef.nativeElement.contains(target)) {
      this.closeList();
      const opt = this._options.find((o) => o.id === this._value);
      this.query = opt?.label ?? '';
      this.cdr.markForCheck();
    }
  }

  private closeList(): void {
    this.open = false;
    this.activeIndex = -1;
    this.cdr.markForCheck();
  }

  private recompute(): void {
    const selected = this._options.find((o) => o.id === this._value);
    if (selected && this.query === selected.label) {
      this.filtered = this._options.slice();
    } else {
      this.filtered = this._options.filter((o) => this.filterFn(o, this.query));
    }
    this.enabledFiltered = this.filtered.filter((o) => !o.disabled);
    if (this.activeIndex >= this.enabledFiltered.length) {
      this.activeIndex = this.enabledFiltered.length - 1;
    }
    this.cdr.markForCheck();
  }
}
