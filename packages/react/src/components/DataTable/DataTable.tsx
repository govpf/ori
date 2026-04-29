import { forwardRef, useId, useMemo, useState, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { MoreVertical, Search } from 'lucide-react';
import { Table, type TableColumn, type TableSort, type SortDirection } from '../Table/Table.js';
import { Pagination } from '../Pagination/Pagination.js';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../DropdownMenu/DropdownMenu.js';

/**
 * DataTable : Table + Pagination + filtre global + actions de ligne.
 *
 * Composition au-dessus de Table, Pagination et DropdownMenu. Gère l'état
 * (page courante, filtre, tri) en interne par défaut, ou de façon contrôlée
 * via les props `page` / `onPageChange` / `sort` / `onSortChange` /
 * `globalFilter` / `onGlobalFilterChange` si l'app veut piloter elle-même.
 *
 * Volontairement v1 :
 * - tri sur une seule colonne (pas multi-tri)
 * - filtre global texte uniquement (pas de filtres par colonne)
 * - actions de ligne via DropdownMenu (3-dots) ; pas de checkbox sélection
 *
 * Filtre global : applique un `String(value).toLocaleLowerCase().includes(query)`
 * sur les colonnes marquées `filterable: true`. Override via la prop
 * `filterFn` pour des règles métier (recherche fuzzy, multi-mots, etc.).
 *
 * Tri : par défaut, tri lexicographique sur la valeur retournée par
 * l'accesseur de colonne (`render` ou `row[key]` si pas de render). Override
 * via la prop `sortFn` par colonne dans `extendedColumns`.
 */

export interface DataTableColumn<TRow> extends TableColumn<TRow> {
  /** Si true, cette colonne est incluse dans le filtre global. */
  filterable?: boolean;
  /** Fonction de comparaison custom pour le tri. Default : compare strings. */
  sortFn?: (a: TRow, b: TRow) => number;
}

export interface DataTableRowAction {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  destructive?: boolean;
  disabled?: boolean;
  /** Insère un séparateur AVANT cet item dans le menu. */
  separatorBefore?: boolean;
}

export interface DataTableProps<TRow> {
  columns: DataTableColumn<TRow>[];
  data: TRow[];
  /** Identifiant unique d'une row (pour les keys et les actions). */
  rowKey: (row: TRow) => string;

  /** Affiche un input de filtre global au-dessus de la table. Default: true. */
  globalFilter?: boolean;
  /** Placeholder de l'input de filtre. */
  filterPlaceholder?: string;
  /** Override de la fonction de filtrage. Default : includes insensible casse. */
  filterFn?: (row: TRow, query: string) => boolean;

  /** Nombre de lignes par page. Default: 10. */
  pageSize?: number;
  /** Désactive la pagination (affiche toutes les lignes). */
  noPagination?: boolean;

  /** Liste d'actions disponibles par ligne (3-dots menu). */
  rowActions?: (row: TRow) => DataTableRowAction[];
  /** Callback déclenché au clic sur une action de ligne. */
  onRowAction?: (action: string, row: TRow) => void;
  /** Label aria-label du bouton 3-dots. */
  rowActionsLabel?: string;

  /** Texte affiché quand aucune ligne ne correspond après filtrage. */
  emptyMessage?: ReactNode;
  /** État de chargement (passé à Table). */
  loading?: boolean;
  /** Caption de la table (pour les SR). */
  caption?: ReactNode;

  className?: string;
}

const defaultFilter = <TRow,>(
  row: TRow,
  query: string,
  filterableKeys: (keyof TRow | string)[],
): boolean => {
  if (!query) return true;
  const q = query.toLocaleLowerCase();
  return filterableKeys.some((key) => {
    const value = (row as Record<string, unknown>)[key as string];
    if (value == null) return false;
    return String(value).toLocaleLowerCase().includes(q);
  });
};

export const DataTable = forwardRef(function DataTable<TRow>(
  {
    columns,
    data,
    rowKey,
    globalFilter = true,
    filterPlaceholder = 'Rechercher…',
    filterFn,
    pageSize = 10,
    noPagination,
    rowActions,
    onRowAction,
    rowActionsLabel = 'Actions',
    emptyMessage = 'Aucune donnée à afficher.',
    loading,
    caption,
    className,
  }: DataTableProps<TRow>,
  ref: React.Ref<HTMLDivElement>,
) {
  const reactId = useId();
  const filterInputId = `pf-data-table-filter-${reactId}`;

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<TableSort | undefined>(undefined);

  // Filtrage
  const filterableKeys = useMemo(
    () => columns.filter((c) => c.filterable).map((c) => c.key),
    [columns],
  );
  const effectiveFilter =
    filterFn ?? ((row: TRow, q: string) => defaultFilter(row, q, filterableKeys));

  const filtered = useMemo(() => {
    if (!query) return data;
    return data.filter((row) => effectiveFilter(row, query));
  }, [data, query, effectiveFilter]);

  // Tri
  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => c.key === sort.column);
    if (!col) return filtered;
    const sortFn = (col as DataTableColumn<TRow>).sortFn;
    const copy = [...filtered];
    copy.sort((a, b) => {
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
      return sort.direction === 'desc' ? -cmp : cmp;
    });
    return copy;
  }, [filtered, sort, columns]);

  // Pagination
  const totalPages = noPagination ? 1 : Math.max(1, Math.ceil(sorted.length / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    if (noPagination) return sorted;
    const start = (clampedPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, clampedPage, pageSize, noPagination]);

  // Reset page si le filtre/tri change et qu'on dépasse le total
  if (clampedPage !== page && totalPages > 0) {
    setPage(clampedPage);
  }

  const handleSortChange = (newSort: TableSort) => {
    // Toggle : asc → desc → off
    if (sort?.column === newSort.column) {
      const next: SortDirection | undefined = sort.direction === 'asc' ? 'desc' : undefined;
      setSort(next ? { column: newSort.column, direction: next } : undefined);
    } else {
      setSort(newSort);
    }
  };

  // Si rowActions fourni, ajoute une colonne d'actions à droite
  const augmentedColumns: TableColumn<TRow>[] = useMemo(() => {
    if (!rowActions) return columns;
    const actionsColumn: TableColumn<TRow> = {
      key: '__actions',
      label: '',
      width: '3rem',
      align: 'end',
      render: (row) => {
        const actions = rowActions(row);
        if (!actions.length) return null;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="ori-data-table__row-actions-trigger"
                aria-label={rowActionsLabel}
              >
                <MoreVertical size={16} aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {actions.map((a, idx) => (
                <DataTableActionItem
                  key={a.id}
                  action={a}
                  onSelect={() => onRowAction?.(a.id, row)}
                  separatorBefore={a.separatorBefore && idx > 0}
                />
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    };
    return [...columns, actionsColumn];
  }, [columns, rowActions, onRowAction, rowActionsLabel]);

  return (
    <div ref={ref} className={clsx('ori-data-table', className)}>
      {globalFilter && (
        <div className="ori-data-table__toolbar">
          <label htmlFor={filterInputId} className="ori-data-table__filter-label">
            <span className="ori-data-table__filter-icon" aria-hidden="true">
              <Search size={16} />
            </span>
            <input
              id={filterInputId}
              type="search"
              className="ori-data-table__filter-input"
              placeholder={filterPlaceholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </label>
          <span className="ori-data-table__count" aria-live="polite">
            {sorted.length} résultat{sorted.length > 1 ? 's' : ''}
          </span>
        </div>
      )}
      <Table
        columns={augmentedColumns}
        rows={paginated}
        rowKey={rowKey}
        sort={sort}
        onSortChange={handleSortChange}
        loading={loading}
        emptyMessage={emptyMessage}
        caption={caption}
      />
      {!noPagination && totalPages > 1 && (
        <div className="ori-data-table__footer">
          <Pagination
            page={clampedPage}
            totalPages={totalPages}
            onPageChange={setPage}
            aria-label="Pagination du tableau"
          />
        </div>
      )}
    </div>
  );
}) as <TRow>(
  props: DataTableProps<TRow> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;

function DataTableActionItem({
  action,
  onSelect,
  separatorBefore,
}: {
  action: DataTableRowAction;
  onSelect: () => void;
  separatorBefore?: boolean;
}) {
  return (
    <>
      {separatorBefore && <DropdownMenuSeparator />}
      <DropdownMenuItem
        icon={action.icon}
        destructive={action.destructive}
        disabled={action.disabled}
        onSelect={onSelect}
      >
        {action.label}
      </DropdownMenuItem>
    </>
  );
}
