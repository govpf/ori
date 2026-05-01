import { Component, Input } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriTableComponent, type OriTableColumn, type OriTableSort } from './table.component';
import { OriTagComponent } from '../tag/tag.component';
import { OriPaginationComponent } from '../pagination/pagination.component';

interface Demande {
  id: string;
  numero: string;
  demandeur: string;
  type: string;
  statut: 'brouillon' | 'en_cours' | 'valide' | 'refuse';
  date: string;
}

const demandes: Demande[] = [
  {
    id: '1',
    numero: '2026-0042',
    demandeur: 'Marie Dupont',
    type: 'Permis bateau',
    statut: 'en_cours',
    date: '2026-04-22',
  },
  {
    id: '2',
    numero: '2026-0041',
    demandeur: 'Jean Martin',
    type: 'Renouvellement licence',
    statut: 'valide',
    date: '2026-04-21',
  },
  {
    id: '3',
    numero: '2026-0040',
    demandeur: 'Léa Tehina',
    type: 'Inscription navire',
    statut: 'brouillon',
    date: '2026-04-21',
  },
  {
    id: '4',
    numero: '2026-0039',
    demandeur: 'Pierre Faatau',
    type: 'Permis bateau',
    statut: 'refuse',
    date: '2026-04-20',
  },
  {
    id: '5',
    numero: '2026-0038',
    demandeur: 'Sophie Lai',
    type: 'Permis hauturier',
    statut: 'valide',
    date: '2026-04-19',
  },
];

const STATUT_VARIANT: Record<
  Demande['statut'],
  'neutral' | 'info' | 'success' | 'warning' | 'danger'
> = {
  brouillon: 'neutral',
  en_cours: 'info',
  valide: 'success',
  refuse: 'danger',
};

const STATUT_LABEL: Record<Demande['statut'], string> = {
  brouillon: 'Brouillon',
  en_cours: 'En cours',
  valide: 'Validé',
  refuse: 'Refusé',
};

@Component({
  selector: 'ori-table-demo',
  standalone: true,
  imports: [OriTableComponent, OriTagComponent, OriPaginationComponent],
  template: `
    <ori-table
      caption="Liste des demandes"
      [columns]="columns"
      [rows]="rows"
      [rowKey]="rowKey"
      [selectable]="selectable"
      [selectedRowIds]="selectedIds"
      [selectedRowId]="selectedId"
      [sort]="sort"
      [striped]="striped"
      (sortChange)="onSortChange($event)"
      (selectionChange)="selectedIds = $event"
      (rowSelect)="onRowSelect($event)"
    >
      <ng-template #statutTpl let-row>
        <ori-tag [variant]="variantFor(row.statut)">{{ labelFor(row.statut) }}</ori-tag>
      </ng-template>
    </ori-table>
    @if (selectable === 'multiple') {
      <p style="color: var(--color-text-secondary); margin: 12px 0 0; font-size: 14px;">
        {{ selectedIds.length }} ligne(s) sélectionnée(s)
      </p>
    }
    @if (selectable === 'single' && selectedRow) {
      <p style="color: var(--color-text-secondary); margin: 12px 0 0; font-size: 14px;">
        Sélection : <strong>{{ selectedRow.demandeur }}</strong>
      </p>
    }
  `,
})
class TableDemo {
  @Input() selectable: 'none' | 'single' | 'multiple' = 'none';
  @Input() sortable = false;
  @Input() striped = false;
  @Input() rows: Demande[] = demandes;

  selectedIds: string[] = [];
  selectedId = '';
  selectedRow: Demande | null = null;
  sort: OriTableSort | null = null;

  rowKey = (r: Demande) => r.id;

  get columns(): OriTableColumn<Demande>[] {
    return [
      { key: 'numero', label: 'Numéro', width: '120px', sortable: this.sortable },
      { key: 'demandeur', label: 'Demandeur', sortable: this.sortable },
      { key: 'type', label: 'Type' },
      { key: 'statut', label: 'Statut' },
      { key: 'date', label: 'Date', width: '120px', sortable: this.sortable },
    ];
  }

  variantFor(s: Demande['statut']) {
    return STATUT_VARIANT[s];
  }

  labelFor(s: Demande['statut']) {
    return STATUT_LABEL[s];
  }

  onSortChange(s: OriTableSort): void {
    this.sort = s;
    const av = (a: Demande) => String((a as unknown as Record<string, unknown>)[s.column] ?? '');
    this.rows = [...this.rows].sort((a, b) => {
      const cmp = av(a).localeCompare(av(b), 'fr');
      return s.direction === 'asc' ? cmp : -cmp;
    });
  }

  onRowSelect(row: Demande): void {
    this.selectedRow = row;
    this.selectedId = row.id;
  }
}

const meta: Meta<TableDemo> = {
  title: 'Primitives/Affichage/Table',
  component: TableDemo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Table data-driven : `[columns]` + `[rows]`. Pagination externe (utiliser `<ori-pagination>`), sort server-driven (`(sortChange)`), sélection via `[selectable]=\"'none' | 'single' | 'multiple'\"`.",
      },
    },
  },
  decorators: [
    moduleMetadata({ imports: [TableDemo] }),
    (storyFn) => {
      const story = storyFn();
      return { ...story, template: `<div style="width: 800px;">${story.template}</div>` };
    },
  ],
};

export default meta;
type Story = StoryObj<TableDemo>;

export const Default: Story = { args: {} };

export const Sortable: Story = {
  args: { sortable: true },
  // Tag `skip-visual` : la story Angular conserve la colonne `statut`
  // alors que la version React n'inclut pas cette colonne dans ses
  // `columns` - divergence volontaire de la configuration de colonnes.
  tags: ['skip-visual'],
};

export const SingleSelect: Story = {
  args: { selectable: 'single' },
  // Tag `skip-visual` : la colonne `statut` est affichée comme texte
  // brut côté Angular, alors que la version React la rend via un `<Tag>`
  // (prop `render` retournant JSX) - divergence pédagogique volontaire.
  tags: ['skip-visual'],
};

export const MultipleSelect: Story = {
  args: { selectable: 'multiple' },
  // Tag `skip-visual` : la colonne `statut` est affichée comme texte
  // brut côté Angular, alors que la version React la rend via un `<Tag>`
  // (prop `render` retournant JSX) - divergence pédagogique volontaire.
  tags: ['skip-visual'],
};

export const Striped: Story = {
  args: { striped: true },
  // Tag `skip-visual` : la colonne `statut` est affichée comme texte
  // brut côté Angular, alors que la version React la rend via un `<Tag>`
  // (prop `render` retournant JSX) - divergence pédagogique volontaire.
  tags: ['skip-visual'],
};
