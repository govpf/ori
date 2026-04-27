import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import { Table, type TableSort } from './Table.js';
import { Tag } from '../Tag/index.js';
import { Pagination } from '../Pagination/index.js';

const meta = {
  title: 'Composants graphiques/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Table data-driven : props `columns` + `rows`. Pagination externe (utiliser `<Pagination>`), sort server-driven (`onSortChange`), sélection via prop `selectable: 'none' | 'single' | 'multiple'`.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 800 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

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

const STATUT_VARIANT = {
  brouillon: 'neutral',
  en_cours: 'info',
  valide: 'success',
  refuse: 'danger',
} as const;

const STATUT_LABEL = {
  brouillon: 'Brouillon',
  en_cours: 'En cours',
  valide: 'Validé',
  refuse: 'Refusé',
} as const;

export const Default: Story = {
  render: () => (
    <Table<Demande>
      caption="Liste des demandes"
      columns={[
        { key: 'numero', label: 'Numéro', width: '120px' },
        { key: 'demandeur', label: 'Demandeur' },
        { key: 'type', label: 'Type' },
        {
          key: 'statut',
          label: 'Statut',
          render: (row) => (
            <Tag variant={STATUT_VARIANT[row.statut]}>{STATUT_LABEL[row.statut]}</Tag>
          ),
        },
        { key: 'date', label: 'Date', width: '120px' },
      ]}
      rows={demandes}
    />
  ),
};

export const Sortable: Story = {
  render: () => {
    const [sort, setSort] = useState<TableSort>({ column: 'date', direction: 'desc' });
    const sortedRows = useMemo(() => {
      return [...demandes].sort((a, b) => {
        const av = String((a as Record<string, unknown>)[sort.column] ?? '');
        const bv = String((b as Record<string, unknown>)[sort.column] ?? '');
        const cmp = av.localeCompare(bv, 'fr');
        return sort.direction === 'asc' ? cmp : -cmp;
      });
    }, [sort]);

    return (
      <Table<Demande>
        sort={sort}
        onSortChange={setSort}
        columns={[
          { key: 'numero', label: 'Numéro', width: '120px', sortable: true },
          { key: 'demandeur', label: 'Demandeur', sortable: true },
          { key: 'type', label: 'Type' },
          { key: 'date', label: 'Date', width: '120px', sortable: true },
        ]}
        rows={sortedRows}
      />
    );
  },
};

export const SingleSelect: Story = {
  render: () => {
    const [selectedId, setSelectedId] = useState<string>('');
    const selected = demandes.find((d) => d.id === selectedId);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Table<Demande>
          selectable="single"
          selectedRowId={selectedId}
          onRowSelect={(row) => setSelectedId(row.id)}
          rowKey={(row) => row.id}
          columns={[
            { key: 'numero', label: 'Numéro', width: '120px' },
            { key: 'demandeur', label: 'Demandeur' },
            { key: 'type', label: 'Type' },
          ]}
          rows={demandes}
        />
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: 14 }}>
          Sélection : <strong>{selected ? selected.demandeur : '(aucune)'}</strong>
        </p>
      </div>
    );
  },
};

export const MultipleSelect: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Table<Demande>
          selectable="multiple"
          selectedRowIds={selected}
          onSelectionChange={setSelected}
          rowKey={(row) => row.id}
          columns={[
            { key: 'numero', label: 'Numéro', width: '120px' },
            { key: 'demandeur', label: 'Demandeur' },
            { key: 'type', label: 'Type' },
          ]}
          rows={demandes}
        />
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: 14 }}>
          {selected.length} ligne{selected.length > 1 ? 's' : ''} sélectionnée
          {selected.length > 1 ? 's' : ''}
        </p>
      </div>
    );
  },
};

export const WithPagination: Story = {
  render: () => {
    const allRows = useMemo(() => {
      const result: Demande[] = [];
      for (let i = 0; i < 47; i++) {
        result.push({
          id: String(i),
          numero: `2026-${String(1000 - i).padStart(4, '0')}`,
          demandeur: `Demandeur ${i + 1}`,
          type: ['Permis bateau', 'Licence', 'Inscription'][i % 3],
          statut: (['brouillon', 'en_cours', 'valide', 'refuse'] as const)[i % 4],
          date: '2026-04-22',
        });
      }
      return result;
    }, []);
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const totalPages = Math.ceil(allRows.length / pageSize);
    const visibleRows = allRows.slice((page - 1) * pageSize, page * pageSize);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Table<Demande>
          columns={[
            { key: 'numero', label: 'Numéro', width: '120px' },
            { key: 'demandeur', label: 'Demandeur' },
            { key: 'type', label: 'Type' },
            {
              key: 'statut',
              label: 'Statut',
              render: (row) => (
                <Tag variant={STATUT_VARIANT[row.statut]}>{STATUT_LABEL[row.statut]}</Tag>
              ),
            },
          ]}
          rows={visibleRows}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
            {allRows.length} résultats - page {page}/{totalPages}
          </span>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    );
  },
};

export const Striped: Story = {
  render: () => (
    <Table<Demande>
      striped
      caption="Liste des demandes (zebra striping)"
      columns={[
        { key: 'numero', label: 'Numéro', width: '120px' },
        { key: 'demandeur', label: 'Demandeur' },
        { key: 'type', label: 'Type' },
        {
          key: 'statut',
          label: 'Statut',
          render: (row) => (
            <Tag variant={STATUT_VARIANT[row.statut]}>{STATUT_LABEL[row.statut]}</Tag>
          ),
        },
        { key: 'date', label: 'Date', width: '120px' },
      ]}
      rows={demandes}
    />
  ),
};

export const Empty: Story = {
  render: () => (
    <Table
      columns={[
        { key: 'numero', label: 'Numéro' },
        { key: 'demandeur', label: 'Demandeur' },
      ]}
      rows={[]}
      emptyMessage="Aucune demande pour le moment. Créez-en une nouvelle pour commencer."
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <Table
      columns={[
        { key: 'numero', label: 'Numéro' },
        { key: 'demandeur', label: 'Demandeur' },
      ]}
      rows={[]}
      loading
    />
  ),
};
