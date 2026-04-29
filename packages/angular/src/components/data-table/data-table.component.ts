import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, MoreVertical, Search } from 'lucide-angular';
import {
  OriTableComponent,
  type OriTableColumn,
  type OriTableSort,
} from '../table/table.component';
import { OriPaginationComponent } from '../pagination/pagination.component';
import {
  OriDropdownMenuComponent,
  type OriDropdownMenuItem,
} from '../dropdown-menu/dropdown-menu.component';

type LucideIconData = typeof MoreVertical;

let nextUid = 0;

export interface OriDataTableColumn<TRow = Record<string, unknown>> extends OriTableColumn<TRow> {
  /** Si true, cette colonne est incluse dans le filtre global. */
  filterable?: boolean;
  /** Fonction de comparaison custom pour le tri. Default : compare strings. */
  sortFn?: (a: TRow, b: TRow) => number;
}

export interface OriDataTableRowAction {
  id: string;
  label: string;
  icon?: LucideIconData;
  destructive?: boolean;
  disabled?: boolean;
  /** Insère un séparateur AVANT cet item dans le menu. */
  separatorBefore?: boolean;
}

export interface OriDataTableRowActionEvent<TRow> {
  action: string;
  row: TRow;
}

/**
 * DataTable : Table + Pagination + filtre global + actions de ligne.
 *
 * Composition au-dessus de Table, Pagination et DropdownMenu. Gère l'état
 * (page courante, filtre, tri) en interne. Pour les très grosses tables
 * server-paginées, utiliser directement <ori-table> + <ori-pagination> et
 * piloter pagination/sort/filter côté app.
 *
 * Volontairement v1 :
 * - tri sur une seule colonne (pas multi-tri)
 * - filtre global texte uniquement (pas de filtres par colonne)
 * - actions de ligne via DropdownMenu (3-dots) ; pas de checkbox sélection
 */
@Component({
  selector: 'ori-data-table',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    OriTableComponent,
    OriPaginationComponent,
    OriDropdownMenuComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ori-data-table">
      @if (globalFilter) {
        <div class="ori-data-table__toolbar">
          <label [attr.for]="filterInputId" class="ori-data-table__filter-label">
            <span class="ori-data-table__filter-icon" aria-hidden="true">
              <lucide-icon [img]="SearchIcon" [size]="16"></lucide-icon>
            </span>
            <input
              [id]="filterInputId"
              type="search"
              class="ori-data-table__filter-input"
              [placeholder]="filterPlaceholder"
              [value]="query"
              (input)="onFilterInput($event)"
            />
          </label>
          <span class="ori-data-table__count" aria-live="polite">
            {{ sortedFiltered.length }} résultat{{ sortedFiltered.length > 1 ? 's' : '' }}
          </span>
        </div>
      }
      <ori-table
        [columns]="augmentedColumns"
        [rows]="paginatedRows"
        [sort]="sort"
        [rowKey]="rowKey"
        [loading]="loading"
        [emptyMessage]="emptyMessage"
        [caption]="caption"
        (sortChange)="onSortChange($event)"
      ></ori-table>
      @if (!noPagination && totalPages > 1) {
        <div class="ori-data-table__footer">
          <ori-pagination
            [page]="clampedPage"
            [totalPages]="totalPages"
            (pageChange)="onPageChange($event)"
            ariaLabel="Pagination du tableau"
          ></ori-pagination>
        </div>
      }
      <ng-template #actionsTpl let-row>
        @if (rowActions) {
          @let actions = rowActions(row);
          @if (actions.length > 0) {
            <ori-dropdown-menu
              [items]="actionsToMenuItems(actions)"
              align="end"
              [ariaLabel]="rowActionsLabel"
              (select)="onMenuSelect($event, row)"
            >
              <button
                type="button"
                slot="trigger"
                class="ori-data-table__row-actions-trigger"
                [attr.aria-label]="rowActionsLabel"
              >
                <lucide-icon [img]="MoreVerticalIcon" [size]="16" aria-hidden="true"></lucide-icon>
              </button>
            </ori-dropdown-menu>
          }
        }
      </ng-template>
    </div>
  `,
})
export class OriDataTableComponent<TRow = Record<string, unknown>> implements AfterViewInit {
  @Input() set columns(value: OriDataTableColumn<TRow>[]) {
    this._columns = value ?? [];
    this.recompute();
  }
  get columns(): OriDataTableColumn<TRow>[] {
    return this._columns;
  }

  @Input() set data(value: TRow[]) {
    this._data = value ?? [];
    this.recompute();
  }
  get data(): TRow[] {
    return this._data;
  }

  @Input() rowKey: ((row: TRow, index: number) => string) | null = null;

  @Input() globalFilter: boolean = true;
  @Input() filterPlaceholder: string = 'Rechercher…';
  @Input() filterFn: ((row: TRow, query: string) => boolean) | null = null;

  @Input() pageSize: number = 10;
  @Input() noPagination: boolean = false;

  @Input() set rowActions(value: ((row: TRow) => OriDataTableRowAction[]) | null) {
    this._rowActions = value;
    this.recompute();
  }
  get rowActions(): ((row: TRow) => OriDataTableRowAction[]) | null {
    return this._rowActions;
  }

  @Input() rowActionsLabel: string = 'Actions';

  @Input() loading: boolean = false;
  @Input() emptyMessage: string = 'Aucune donnée à afficher.';
  @Input() caption: string = '';

  @Output() rowAction = new EventEmitter<OriDataTableRowActionEvent<TRow>>();

  @ViewChild('actionsTpl', { static: false })
  protected actionsTpl?: TemplateRef<{ $implicit: TRow; index: number }>;

  protected readonly SearchIcon: LucideIconData = Search;
  protected readonly MoreVerticalIcon: LucideIconData = MoreVertical;

  protected readonly filterInputId = `pf-data-table-filter-${++nextUid}`;

  protected query: string = '';
  protected page: number = 1;
  protected sort: OriTableSort | null = null;

  protected sortedFiltered: TRow[] = [];
  protected paginatedRows: TRow[] = [];
  protected augmentedColumns: OriTableColumn<TRow>[] = [];

  private _columns: OriDataTableColumn<TRow>[] = [];
  private _data: TRow[] = [];
  private _rowActions: ((row: TRow) => OriDataTableRowAction[]) | null = null;

  private readonly cdr = inject(ChangeDetectorRef);

  ngAfterViewInit(): void {
    // Une fois la TemplateRef disponible, on rebranche les colonnes augmentées
    // pour que la cellule d'actions utilise le template du dropdown.
    this.recompute();
  }

  protected get totalPages(): number {
    if (this.noPagination) return 1;
    return Math.max(1, Math.ceil(this.sortedFiltered.length / this.pageSize));
  }

  protected get clampedPage(): number {
    return Math.min(this.page, this.totalPages);
  }

  protected onFilterInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.query = target.value;
    this.page = 1;
    this.recompute();
  }

  protected onSortChange(newSort: OriTableSort): void {
    if (this.sort && this.sort.column === newSort.column) {
      // Toggle : asc → desc → off
      if (this.sort.direction === 'asc') {
        this.sort = { column: newSort.column, direction: 'desc' };
      } else {
        this.sort = null;
      }
    } else {
      this.sort = newSort;
    }
    this.recompute();
  }

  protected onPageChange(page: number): void {
    this.page = page;
    this.recompute();
  }

  protected onMenuSelect(item: OriDropdownMenuItem, row: TRow): void {
    if (!item.id) return;
    this.rowAction.emit({ action: item.id, row });
  }

  protected actionsToMenuItems(actions: OriDataTableRowAction[]): OriDropdownMenuItem[] {
    const items: OriDropdownMenuItem[] = [];
    actions.forEach((a, idx) => {
      if (a.separatorBefore && idx > 0) {
        items.push({ separator: true });
      }
      items.push({
        id: a.id,
        label: a.label,
        icon: a.icon,
        destructive: a.destructive,
        disabled: a.disabled,
      });
    });
    return items;
  }

  private recompute(): void {
    // Filtrage
    const filterableKeys = this._columns.filter((c) => c.filterable).map((c) => c.key);
    let filtered: TRow[];
    if (!this.query) {
      filtered = this._data.slice();
    } else if (this.filterFn) {
      filtered = this._data.filter((row) => this.filterFn!(row, this.query));
    } else {
      const q = this.query.toLocaleLowerCase();
      filtered = this._data.filter((row) =>
        filterableKeys.some((key) => {
          const value = (row as Record<string, unknown>)[key];
          return value != null && String(value).toLocaleLowerCase().includes(q);
        }),
      );
    }

    // Tri
    if (this.sort) {
      const col = this._columns.find((c) => c.key === this.sort!.column);
      if (col) {
        const direction = this.sort.direction;
        const sortFn = col.sortFn;
        filtered = filtered.slice().sort((a, b) => {
          let cmp: number;
          if (sortFn) {
            cmp = sortFn(a, b);
          } else {
            const aVal = (a as Record<string, unknown>)[col.key];
            const bVal = (b as Record<string, unknown>)[col.key];
            const aStr = aVal == null ? '' : String(aVal);
            const bStr = bVal == null ? '' : String(bVal);
            cmp = aStr.localeCompare(bStr);
          }
          return direction === 'desc' ? -cmp : cmp;
        });
      }
    }

    this.sortedFiltered = filtered;

    // Pagination
    if (this.noPagination) {
      this.paginatedRows = filtered;
    } else {
      const start = (this.clampedPage - 1) * this.pageSize;
      this.paginatedRows = filtered.slice(start, start + this.pageSize);
    }

    // Colonnes augmentées : ajout d'une colonne actions si rowActions fourni,
    // utilisant la TemplateRef interne actionsTpl pour rendre le DropdownMenu.
    if (this._rowActions) {
      this.augmentedColumns = [
        ...this._columns,
        {
          key: '__actions',
          label: '',
          width: '3rem',
          align: 'end',
          cellTemplate: this.actionsTpl,
        },
      ];
    } else {
      this.augmentedColumns = this._columns.slice();
    }

    this.cdr.markForCheck();
  }
}
