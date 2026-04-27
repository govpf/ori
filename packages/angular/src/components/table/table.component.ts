import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { LucideAngularModule, ChevronsUpDown, ChevronUp, ChevronDown } from 'lucide-angular';
import { OriCheckboxComponent } from '../checkbox/checkbox.component';

type LucideIconData = typeof ChevronsUpDown;

export type OriSortDirection = 'asc' | 'desc';

export interface OriTableSort {
  column: string;
  direction: OriSortDirection;
}

export interface OriTableColumn<TRow = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'start' | 'center' | 'end';
  /**
   * Template à utiliser pour le rendu de la cellule. Le contexte
   * passé contient `{ $implicit: row, index }`.
   */
  cellTemplate?: TemplateRef<{ $implicit: TRow; index: number }>;
}

export type OriSelectableMode = 'none' | 'single' | 'multiple';

/**
 * Table data-driven (cf. décisions I.1-I.4).
 *
 * Pagination externe (utiliser `<ori-pagination>`), sort server-driven
 * (`(sortChange)`), sélection 'none' / 'single' / 'multiple'.
 */
@Component({
  selector: 'ori-table',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, OriCheckboxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ori-table-wrap">
      <table [class]="tableClasses">
        @if (caption) {
          <caption class="sr-only">
            {{
              caption
            }}
          </caption>
        }
        <thead>
          <tr>
            @if (selectable === 'multiple') {
              <th class="ori-table__select-cell" scope="col">
                <ori-checkbox
                  [checked]="allSelected"
                  [indeterminate]="indeterminate"
                  (checkedChange)="toggleAll()"
                  [attr.aria-label]="'Tout sélectionner'"
                ></ori-checkbox>
              </th>
            }
            @for (col of columns; track col.key) {
              <th
                scope="col"
                [style.width]="col.width || null"
                [style.text-align]="col.align || 'start'"
                [attr.aria-sort]="ariaSortFor(col)"
              >
                @if (col.sortable) {
                  <button
                    type="button"
                    class="ori-table__sort-button"
                    [attr.aria-sort]="ariaSortFor(col)"
                    (click)="onSort(col.key)"
                  >
                    {{ col.label }}
                    @if (sort?.column === col.key) {
                      @if (sort?.direction === 'asc') {
                        <lucide-icon
                          [img]="ChevronUpIcon"
                          [size]="14"
                          class="ori-table__sort-icon"
                          aria-hidden="true"
                        ></lucide-icon>
                      } @else {
                        <lucide-icon
                          [img]="ChevronDownIcon"
                          [size]="14"
                          class="ori-table__sort-icon"
                          aria-hidden="true"
                        ></lucide-icon>
                      }
                    } @else {
                      <lucide-icon
                        [img]="ChevronsUpDownIcon"
                        [size]="14"
                        class="ori-table__sort-icon"
                        aria-hidden="true"
                      ></lucide-icon>
                    }
                  </button>
                } @else {
                  {{ col.label }}
                }
              </th>
            }
          </tr>
        </thead>
        <tbody>
          @if (loading) {
            <tr>
              <td [attr.colspan]="colSpan" class="ori-table__loading">Chargement…</td>
            </tr>
          } @else if (rows.length === 0) {
            <tr>
              <td [attr.colspan]="colSpan" class="ori-table__empty">{{ emptyMessage }}</td>
            </tr>
          } @else {
            @for (row of rows; track rowKey ? rowKey(row, $index) : $index; let i = $index) {
              @let id = rowKey ? rowKey(row, i) : i.toString();
              @let isSelected = isRowSelected(id);
              <tr [attr.aria-selected]="isSelected ? 'true' : null" (click)="onRowClick(row)">
                @if (selectable === 'multiple') {
                  <td class="ori-table__select-cell">
                    <ori-checkbox
                      [checked]="isSelected"
                      (checkedChange)="toggleRow(id)"
                      [attr.aria-label]="'Sélectionner la ligne ' + (i + 1)"
                      (click)="$event.stopPropagation()"
                    ></ori-checkbox>
                  </td>
                }
                @for (col of columns; track col.key) {
                  <td [style.text-align]="col.align || 'start'">
                    @if (col.cellTemplate) {
                      <ng-container
                        *ngTemplateOutlet="col.cellTemplate; context: { $implicit: row, index: i }"
                      ></ng-container>
                    } @else {
                      {{ getCellValue(row, col.key) }}
                    }
                  </td>
                }
              </tr>
            }
          }
        </tbody>
      </table>
    </div>
  `,
})
export class OriTableComponent<TRow = Record<string, unknown>> {
  @Input() columns: OriTableColumn<TRow>[] = [];
  @Input() rows: TRow[] = [];
  @Input() sort: OriTableSort | null = null;
  @Input() selectable: OriSelectableMode = 'none';
  @Input() selectedRowIds: string[] = [];
  @Input() selectedRowId: string = '';
  @Input() rowKey: ((row: TRow, index: number) => string) | null = null;
  @Input() loading: boolean = false;
  @Input() emptyMessage: string = 'Aucune donnée à afficher.';
  @Input() caption: string = '';
  /**
   * Alterne la couleur de fond des lignes paires/impaires (zebra
   * striping). Default: false. Compatible RGAA.
   */
  @Input() striped: boolean = false;

  @Output() sortChange = new EventEmitter<OriTableSort>();
  @Output() selectionChange = new EventEmitter<string[]>();
  @Output() rowSelect = new EventEmitter<TRow>();

  protected readonly ChevronsUpDownIcon: LucideIconData = ChevronsUpDown;
  protected readonly ChevronUpIcon: LucideIconData = ChevronUp;
  protected readonly ChevronDownIcon: LucideIconData = ChevronDown;

  get tableClasses(): string {
    const isClickable = this.selectable === 'single';
    return [
      'ori-table',
      isClickable ? 'ori-table--clickable' : null,
      this.striped ? 'ori-table--striped' : null,
    ]
      .filter((c): c is string => Boolean(c))
      .join(' ');
  }

  get colSpan(): number {
    return this.columns.length + (this.selectable === 'multiple' ? 1 : 0);
  }

  get allSelected(): boolean {
    if (this.selectable !== 'multiple' || !this.rowKey || this.rows.length === 0) return false;
    const fn = this.rowKey;
    return this.rows.every((r, i) => this.selectedRowIds.includes(fn(r, i)));
  }

  get indeterminate(): boolean {
    if (this.selectable !== 'multiple' || !this.rowKey) return false;
    const fn = this.rowKey;
    const someSelected = this.rows.some((r, i) => this.selectedRowIds.includes(fn(r, i)));
    return someSelected && !this.allSelected;
  }

  ariaSortFor(col: OriTableColumn<TRow>): 'ascending' | 'descending' | 'none' | null {
    if (!col.sortable) return null;
    if (this.sort?.column !== col.key) return 'none';
    return this.sort.direction === 'asc' ? 'ascending' : 'descending';
  }

  onSort(key: string): void {
    const direction: OriSortDirection =
      this.sort?.column === key && this.sort.direction === 'asc' ? 'desc' : 'asc';
    this.sortChange.emit({ column: key, direction });
  }

  isRowSelected(id: string): boolean {
    if (this.selectable === 'multiple') return this.selectedRowIds.includes(id);
    if (this.selectable === 'single') return this.selectedRowId === id;
    return false;
  }

  toggleAll(): void {
    if (!this.rowKey) return;
    if (this.allSelected) {
      this.selectionChange.emit([]);
    } else {
      const fn = this.rowKey;
      this.selectionChange.emit(this.rows.map((r, i) => fn(r, i)));
    }
  }

  toggleRow(id: string): void {
    if (this.selectedRowIds.includes(id)) {
      this.selectionChange.emit(this.selectedRowIds.filter((x) => x !== id));
    } else {
      this.selectionChange.emit([...this.selectedRowIds, id]);
    }
  }

  onRowClick(row: TRow): void {
    if (this.selectable === 'single') {
      this.rowSelect.emit(row);
    }
  }

  getCellValue(row: TRow, key: string): string {
    const v = (row as Record<string, unknown>)[key];
    return v === null || v === undefined ? '' : String(v);
  }
}
