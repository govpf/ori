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
import { LucideAngularModule, ChevronDown, Check, X } from 'lucide-angular';

type LucideIconData = typeof ChevronDown;

let nextUid = 0;

export interface OriMultiSelectOption {
  id: string;
  label: string;
  disabled?: boolean;
}

/**
 * MultiSelect virtualisé accessible.
 *
 * Variante multi-sélection de la Combobox, avec virtualisation manuelle pour
 * gérer plusieurs milliers d'options sans pénaliser le rendu. Sélections
 * affichées sous forme de tags supprimables sous l'input.
 *
 * a11y :
 * - listbox role="listbox" + aria-multiselectable="true"
 * - options role="option" + aria-selected (true / false)
 * - tags des sélections : bouton "Retirer X" focusable
 *
 * Volontairement pas de groupes ni de chargement async (extensions à ouvrir
 * si le besoin se confirme côté apps). La virtualisation suppose une hauteur
 * d'option constante.
 */
@Component({
  selector: 'ori-multi-select',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ori-multi-select">
      <label [id]="labelId" [attr.for]="inputId" class="ori-multi-select__label">{{ label }}</label>
      <div
        [class.ori-multi-select__field]="true"
        [class.ori-multi-select__field--disabled]="disabled"
      >
        @if (selectedOptions.length > 0) {
          <ul class="ori-multi-select__tags" aria-label="Sélections">
            @for (option of selectedOptions; track option.id) {
              <li class="ori-multi-select__tag">
                <span class="ori-multi-select__tag-label">{{ option.label }}</span>
                <button
                  type="button"
                  class="ori-multi-select__tag-remove"
                  [attr.aria-label]="removeTagLabel + ' ' + option.label"
                  [disabled]="disabled"
                  (click)="removeValue(option.id)"
                >
                  <lucide-icon [img]="XIcon" [size]="12" aria-hidden="true"></lucide-icon>
                </button>
              </li>
            }
          </ul>
        }
        <div class="ori-multi-select__input-wrap">
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
            [placeholder]="selectedOptions.length === 0 ? placeholder : null"
            [value]="query"
            (input)="onInput($event)"
            (focus)="setOpen(true)"
            (click)="setOpen(true)"
            (keydown)="onKeyDown($event)"
            class="ori-multi-select__input"
          />
          <span class="ori-multi-select__chevron" aria-hidden="true">
            <lucide-icon [img]="ChevronDownIcon" [size]="16"></lucide-icon>
          </span>
        </div>
      </div>
      @if (open) {
        <div
          #listboxRef
          role="listbox"
          [id]="listboxId"
          [attr.aria-label]="label"
          aria-multiselectable="true"
          class="ori-multi-select__listbox"
          [style.maxHeight.px]="listboxHeight"
          (scroll)="onScroll($event)"
        >
          @if (filtered.length === 0) {
            <div class="ori-multi-select__empty" aria-disabled="true">{{ noResultsLabel }}</div>
          } @else {
            <div [style.paddingTop.px]="paddingTop" [style.paddingBottom.px]="paddingBottom">
              @for (option of visibleSlice; track option.id) {
                <div
                  [id]="optionId(option)"
                  role="option"
                  [attr.aria-selected]="isSelected(option)"
                  [attr.aria-disabled]="option.disabled || isBlocked(option) || null"
                  [class.ori-multi-select__option]="true"
                  [class.ori-multi-select__option--active]="enabledIndexOf(option) === activeIndex"
                  [class.ori-multi-select__option--selected]="isSelected(option)"
                  [class.ori-multi-select__option--disabled]="option.disabled || isBlocked(option)"
                  [style.height.px]="optionHeight"
                  (mousedown)="$event.preventDefault()"
                  (click)="onOptionClick(option)"
                  (mouseenter)="setActive(option)"
                >
                  <span
                    [class.ori-multi-select__option-checkbox]="true"
                    [class.ori-multi-select__option-checkbox--checked]="isSelected(option)"
                    aria-hidden="true"
                  >
                    @if (isSelected(option)) {
                      <lucide-icon [img]="CheckIcon" [size]="12"></lucide-icon>
                    }
                  </span>
                  <span class="ori-multi-select__option-label">{{ option.label }}</span>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class OriMultiSelectComponent {
  @Input() set options(value: OriMultiSelectOption[]) {
    this._options = value ?? [];
    this.recompute();
  }
  get options(): OriMultiSelectOption[] {
    return this._options;
  }

  @Input() set values(v: string[]) {
    this._values = v ?? [];
    this.refreshSelected();
  }
  get values(): string[] {
    return this._values;
  }

  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() noResultsLabel: string = 'Aucun résultat';
  @Input() listboxHeight: number = 240;
  @Input() optionHeight: number = 36;
  @Input() maxSelected: number | undefined;
  @Input() removeTagLabel: string = 'Retirer';
  @Input() filterFn: (option: OriMultiSelectOption, query: string) => boolean = (option, q) => {
    if (!q) return true;
    return option.label.toLocaleLowerCase().includes(q.toLocaleLowerCase());
  };

  @Output() valuesChange = new EventEmitter<string[]>();

  @ViewChild('input') protected inputRef?: ElementRef<HTMLInputElement>;
  @ViewChild('listboxRef') protected listboxElementRef?: ElementRef<HTMLDivElement>;

  protected readonly ChevronDownIcon: LucideIconData = ChevronDown;
  protected readonly CheckIcon: LucideIconData = Check;
  protected readonly XIcon: LucideIconData = X;

  private readonly uid = ++nextUid;
  protected readonly inputId = `pf-multi-input-${this.uid}`;
  protected readonly listboxId = `pf-multi-listbox-${this.uid}`;
  protected readonly labelId = `pf-multi-label-${this.uid}`;

  protected open = false;
  protected query = '';
  protected activeIndex = -1;
  protected scrollTop = 0;
  protected filtered: OriMultiSelectOption[] = [];
  protected enabledFiltered: OriMultiSelectOption[] = [];
  protected visibleSlice: OriMultiSelectOption[] = [];
  protected selectedOptions: OriMultiSelectOption[] = [];
  protected paddingTop = 0;
  protected paddingBottom = 0;

  private _options: OriMultiSelectOption[] = [];
  private _values: string[] = [];
  private _selectedSet = new Set<string>();

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly hostRef = inject(ElementRef<HTMLElement>);

  protected get activeOptionId(): string | null {
    if (!this.open || this.activeIndex < 0) return null;
    const opt = this.enabledFiltered[this.activeIndex];
    return opt ? this.optionId(opt) : null;
  }

  protected optionId(option: OriMultiSelectOption): string {
    return `${this.listboxId}-option-${option.id}`;
  }

  protected enabledIndexOf(option: OriMultiSelectOption): number {
    return this.enabledFiltered.indexOf(option);
  }

  protected isSelected(option: OriMultiSelectOption): boolean {
    return this._selectedSet.has(option.id);
  }

  protected isBlocked(option: OriMultiSelectOption): boolean {
    return (
      this.maxSelected !== undefined &&
      this._values.length >= this.maxSelected &&
      !this._selectedSet.has(option.id)
    );
  }

  protected setOpen(open: boolean): void {
    if (this.open === open) return;
    this.open = open;
    if (open && this.activeIndex < 0) this.activeIndex = 0;
    this.recompute();
  }

  protected setActive(option: OriMultiSelectOption): void {
    if (option.disabled || this.isBlocked(option)) return;
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
    this.recompute();
  }

  protected onScroll(event: Event): void {
    this.scrollTop = (event.target as HTMLDivElement).scrollTop;
    this.recomputeWindow();
    this.cdr.markForCheck();
  }

  protected onOptionClick(option: OriMultiSelectOption): void {
    if (option.disabled || this.isBlocked(option)) return;
    this.toggleOption(option);
  }

  protected removeValue(id: string): void {
    this._values = this._values.filter((v) => v !== id);
    this.refreshSelected();
    this.valuesChange.emit(this._values);
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
          this.scrollActiveIntoView();
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
          this.scrollActiveIntoView();
          this.cdr.markForCheck();
        }
        break;
      case 'Home':
        if (this.open) {
          event.preventDefault();
          this.activeIndex = 0;
          this.scrollActiveIntoView();
          this.cdr.markForCheck();
        }
        break;
      case 'End':
        if (this.open) {
          event.preventDefault();
          this.activeIndex = this.enabledFiltered.length - 1;
          this.scrollActiveIntoView();
          this.cdr.markForCheck();
        }
        break;
      case 'Enter':
        if (this.open && this.activeIndex >= 0 && this.enabledFiltered[this.activeIndex]) {
          event.preventDefault();
          this.toggleOption(this.enabledFiltered[this.activeIndex]);
        }
        break;
      case 'Escape':
        if (this.open) {
          event.preventDefault();
          this.closeList();
        }
        break;
      case 'Backspace':
        if (!this.query && this._values.length > 0) {
          event.preventDefault();
          this.removeValue(this._values[this._values.length - 1]);
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
    }
  }

  private toggleOption(option: OriMultiSelectOption): void {
    if (this._selectedSet.has(option.id)) {
      this._values = this._values.filter((v) => v !== option.id);
    } else {
      if (this.maxSelected !== undefined && this._values.length >= this.maxSelected) return;
      this._values = [...this._values, option.id];
    }
    this.refreshSelected();
    this.valuesChange.emit(this._values);
  }

  private closeList(): void {
    this.open = false;
    this.activeIndex = -1;
    this.cdr.markForCheck();
  }

  private refreshSelected(): void {
    this._selectedSet = new Set(this._values);
    this.selectedOptions = this._values
      .map((id) => this._options.find((o) => o.id === id))
      .filter((o): o is OriMultiSelectOption => Boolean(o));
    this.cdr.markForCheck();
  }

  private recompute(): void {
    this.filtered = this._options.filter((o) => this.filterFn(o, this.query));
    this.enabledFiltered = this.filtered.filter((o) => !o.disabled && !this.isBlocked(o));
    if (this.activeIndex >= this.enabledFiltered.length) {
      this.activeIndex = this.enabledFiltered.length - 1;
    }
    this.recomputeWindow();
    this.cdr.markForCheck();
  }

  private recomputeWindow(): void {
    const buffer = 4;
    const visibleCount = Math.ceil(this.listboxHeight / this.optionHeight);
    const startIndex = Math.max(0, Math.floor(this.scrollTop / this.optionHeight) - buffer);
    const endIndex = Math.min(this.filtered.length, startIndex + visibleCount + buffer * 2);
    this.visibleSlice = this.filtered.slice(startIndex, endIndex);
    this.paddingTop = startIndex * this.optionHeight;
    this.paddingBottom = (this.filtered.length - endIndex) * this.optionHeight;
  }

  private scrollActiveIntoView(): void {
    if (!this.listboxElementRef || this.activeIndex < 0) return;
    const optionInFiltered = this.enabledFiltered[this.activeIndex];
    if (!optionInFiltered) return;
    const indexInFiltered = this.filtered.indexOf(optionInFiltered);
    const optionTop = indexInFiltered * this.optionHeight;
    const optionBottom = optionTop + this.optionHeight;
    const listEl = this.listboxElementRef.nativeElement;
    const scrollTopNow = listEl.scrollTop;
    const scrollBottom = scrollTopNow + this.listboxHeight;
    if (optionTop < scrollTopNow) {
      listEl.scrollTop = optionTop;
    } else if (optionBottom > scrollBottom) {
      listEl.scrollTop = optionBottom - this.listboxHeight;
    }
  }
}
