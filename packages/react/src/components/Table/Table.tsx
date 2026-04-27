import { useMemo, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { ChevronsUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { Checkbox } from '../Checkbox/index.js';

export type SortDirection = 'asc' | 'desc';

export interface TableSort {
  column: string;
  direction: SortDirection;
}

export interface TableColumn<TRow = Record<string, unknown>> {
  /** Identifiant unique de la colonne, sert de clé pour le sort. */
  key: string;
  /** Libellé d'en-tête. */
  label: ReactNode;
  /** Si `true`, la colonne est cliquable pour trier. */
  sortable?: boolean;
  /** Largeur CSS de la colonne (ex: `'160px'`, `'20%'`). */
  width?: string;
  /** Alignement du texte dans les cellules. Default: 'start'. */
  align?: 'start' | 'center' | 'end';
  /**
   * Fonction de rendu de la cellule. Si omise, on affiche
   * `String(row[key])`. Permet d'embed des composants (Tag, Avatar, etc.).
   */
  render?: (row: TRow, index: number) => ReactNode;
}

export type SelectableMode = 'none' | 'single' | 'multiple';

export interface TableProps<TRow = Record<string, unknown>> {
  columns: TableColumn<TRow>[];
  rows: TRow[];
  /** État de tri courant. */
  sort?: TableSort;
  /** Callback de changement de tri. */
  onSortChange?: (sort: TableSort) => void;
  /** Mode de sélection. Default: 'none'. */
  selectable?: SelectableMode;
  /** Identifiants des rows sélectionnés (mode 'multiple'). */
  selectedRowIds?: string[];
  /** Callback en mode 'multiple' avec les ids sélectionnés. */
  onSelectionChange?: (ids: string[]) => void;
  /** Callback en mode 'single' avec la row sélectionnée. */
  onRowSelect?: (row: TRow) => void;
  /** Identifiant de la row sélectionnée en mode 'single'. */
  selectedRowId?: string;
  /** Fonction calculant l'identifiant unique d'une row. Obligatoire si `selectable !== 'none'`. */
  rowKey?: (row: TRow, index: number) => string;
  /** État de chargement (affiche un message au centre du tbody). */
  loading?: boolean;
  /** Texte affiché quand `rows` est vide. */
  emptyMessage?: ReactNode;
  /** Étiquette ARIA de la table. */
  caption?: ReactNode;
  /**
   * Alterne la couleur de fond des lignes paires/impaires (zebra
   * striping) pour faciliter la lecture des tables denses. Default:
   * false. Compatible RGAA (le contraste texte reste valide sur les
   * deux fonds, le hover et la sélection l'emportent visuellement).
   */
  striped?: boolean;
  className?: string;
}

/**
 * Table data-driven (cf. décisions I.1-I.4).
 *
 * - Pagination externe : utiliser `<Pagination>` séparément
 * - Sort server-driven : émet `onSortChange`, reçoit `rows` déjà triées
 * - Sélection : 'none' / 'single' / 'multiple' avec checkbox header
 *   indeterminate en mode multiple
 */
export function Table<TRow = Record<string, unknown>>({
  columns,
  rows,
  sort,
  onSortChange,
  selectable = 'none',
  selectedRowIds = [],
  onSelectionChange,
  onRowSelect,
  selectedRowId,
  rowKey,
  loading,
  emptyMessage = 'Aucune donnée à afficher.',
  caption,
  striped,
  className,
}: TableProps<TRow>) {
  const handleSort = (key: string) => {
    if (!onSortChange) return;
    const direction: SortDirection =
      sort?.column === key && sort.direction === 'asc' ? 'desc' : 'asc';
    onSortChange({ column: key, direction });
  };

  const allSelected = useMemo(
    () =>
      selectable === 'multiple' &&
      rows.length > 0 &&
      rowKey !== undefined &&
      rows.every((r, i) => selectedRowIds.includes(rowKey(r, i))),
    [selectable, rows, rowKey, selectedRowIds],
  );
  const someSelected = useMemo(
    () =>
      selectable === 'multiple' &&
      rowKey !== undefined &&
      rows.some((r, i) => selectedRowIds.includes(rowKey(r, i))),
    [selectable, rows, rowKey, selectedRowIds],
  );
  const indeterminate = someSelected && !allSelected;

  const toggleAll = () => {
    if (!onSelectionChange || !rowKey) return;
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(rows.map((r, i) => rowKey(r, i)));
    }
  };

  const toggleRow = (id: string) => {
    if (!onSelectionChange) return;
    if (selectedRowIds.includes(id)) {
      onSelectionChange(selectedRowIds.filter((x) => x !== id));
    } else {
      onSelectionChange([...selectedRowIds, id]);
    }
  };

  const colCount = columns.length + (selectable === 'multiple' ? 1 : 0);
  const isClickable = selectable === 'single' && Boolean(onRowSelect);

  return (
    <div className="ori-table-wrap">
      <table
        className={clsx(
          'ori-table',
          isClickable && 'ori-table--clickable',
          striped && 'ori-table--striped',
          className,
        )}
      >
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr>
            {selectable === 'multiple' && (
              <th className="ori-table__select-cell" scope="col">
                <Checkbox
                  checked={allSelected}
                  indeterminate={indeterminate}
                  onChange={toggleAll}
                  aria-label="Tout sélectionner"
                />
              </th>
            )}
            {columns.map((col) => {
              const ariaSort: 'ascending' | 'descending' | 'none' | undefined = col.sortable
                ? sort?.column === col.key
                  ? sort.direction === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none'
                : undefined;
              return (
                <th
                  key={col.key}
                  scope="col"
                  style={{ width: col.width, textAlign: col.align ?? 'start' }}
                  aria-sort={ariaSort}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      className="ori-table__sort-button"
                      aria-sort={ariaSort}
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}
                      {sort?.column === col.key ? (
                        sort.direction === 'asc' ? (
                          <ChevronUp
                            size={14}
                            className="ori-table__sort-icon"
                            aria-hidden="true"
                          />
                        ) : (
                          <ChevronDown
                            size={14}
                            className="ori-table__sort-icon"
                            aria-hidden="true"
                          />
                        )
                      ) : (
                        <ChevronsUpDown
                          size={14}
                          className="ori-table__sort-icon"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={colCount} className="ori-table__loading">
                Chargement…
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={colCount} className="ori-table__empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => {
              const id = rowKey ? rowKey(row, i) : String(i);
              const isSelected =
                selectable === 'multiple'
                  ? selectedRowIds.includes(id)
                  : selectable === 'single'
                    ? selectedRowId === id
                    : false;
              return (
                <tr
                  key={id}
                  aria-selected={isSelected || undefined}
                  onClick={isClickable ? () => onRowSelect?.(row) : undefined}
                >
                  {selectable === 'multiple' && (
                    <td className="ori-table__select-cell">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => toggleRow(id)}
                        aria-label={`Sélectionner la ligne ${i + 1}`}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} style={{ textAlign: col.align ?? 'start' }}>
                      {col.render
                        ? col.render(row, i)
                        : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
