import type { Meta, StoryObj } from '@storybook/react';
import { DataTable, type DataTableColumn, type DataTableRowAction } from './DataTable.js';
import { Tag } from '../Tag/Tag.js';
import { Edit, Eye, Trash2, Mail, Archive } from 'lucide-react';

interface Demande {
  id: string;
  numero: string;
  objet: string;
  service: string;
  statut: 'envoyee' | 'en-cours' | 'cloturee' | 'rejetee';
  date: string;
}

const demandes: Demande[] = Array.from({ length: 47 }, (_, i) => {
  const statuts: Demande['statut'][] = ['envoyee', 'en-cours', 'cloturee', 'rejetee'];
  const statutsLabel = ['envoyée', 'en cours', 'clôturée', 'rejetée'];
  const services = ['DGI', 'DASS', 'DPAC', 'DTT', 'DRE', 'DAM', 'DJS'];
  const objets = [
    'Demande de carte grise',
    'Demande de permis maritime',
    'Inscription scolaire',
    'Subvention culturelle',
    "Renouvellement de pièce d'identité",
    'Déclaration fiscale',
    "Demande d'extrait d'acte",
    "Réservation d'équipement sportif",
  ];
  return {
    id: `d-${i + 1}`,
    numero: `DEM-2026-${(1000 + i).toString()}`,
    objet: objets[i % objets.length] ?? 'Demande administrative',
    service: services[i % services.length] ?? 'DGI',
    statut: statuts[i % statuts.length] ?? 'envoyee',
    date: `2026-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  };
});

const statutVariant: Record<Demande['statut'], 'info' | 'warning' | 'success' | 'danger'> = {
  envoyee: 'info',
  'en-cours': 'warning',
  cloturee: 'success',
  rejetee: 'danger',
};
const statutLabel: Record<Demande['statut'], string> = {
  envoyee: 'Envoyée',
  'en-cours': 'En cours',
  cloturee: 'Clôturée',
  rejetee: 'Rejetée',
};

const columns: DataTableColumn<Demande>[] = [
  { key: 'numero', label: 'Numéro', sortable: true, filterable: true, width: '12rem' },
  { key: 'objet', label: 'Objet', sortable: true, filterable: true },
  { key: 'service', label: 'Service', sortable: true, filterable: true, width: '6rem' },
  {
    key: 'statut',
    label: 'Statut',
    sortable: true,
    width: '8rem',
    render: (row) => <Tag variant={statutVariant[row.statut]}>{statutLabel[row.statut]}</Tag>,
  },
  { key: 'date', label: 'Date', sortable: true, width: '8rem' },
];

const rowActions = (row: Demande): DataTableRowAction[] => [
  { id: 'view', label: 'Voir le détail', icon: <Eye size={16} /> },
  { id: 'edit', label: 'Modifier', icon: <Edit size={16} />, disabled: row.statut === 'cloturee' },
  { id: 'mail', label: 'Notifier le demandeur', icon: <Mail size={16} /> },
  { id: 'archive', label: 'Archiver', icon: <Archive size={16} />, separatorBefore: true },
  {
    id: 'delete',
    label: 'Supprimer',
    icon: <Trash2 size={16} />,
    destructive: true,
    disabled: row.statut === 'cloturee',
  },
];

const meta = {
  title: 'Compositions/Données/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DataTable<Demande>>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Cas standard : 47 demandes, filtre + tri + actions + pagination 10 par page. */
export const Default: Story = {
  args: {
    columns,
    data: demandes,
    rowKey: (row) => row.id,
    pageSize: 10,
    rowActions,
    onRowAction: (action, row) => {
      // eslint-disable-next-line no-console
      console.log('Action', action, 'sur', row.numero);
    },
  },
};

/** Sans actions de ligne : table consultative. */
export const ReadOnly: Story = {
  args: {
    columns,
    data: demandes.slice(0, 15),
    rowKey: (row) => row.id,
    pageSize: 5,
  },
};

/** Sans pagination : affichage compact pour listes courtes (≤ 20 lignes typiquement). */
export const NoPagination: Story = {
  args: {
    columns,
    data: demandes.slice(0, 8),
    rowKey: (row) => row.id,
    noPagination: true,
    rowActions,
  },
};

/** État de chargement. */
export const Loading: Story = {
  args: {
    columns,
    data: [],
    rowKey: (row) => row.id,
    loading: true,
  },
};

/** Aucune donnée correspondante. */
export const EmptyAfterFilter: Story = {
  args: {
    columns,
    data: demandes.slice(0, 5),
    rowKey: (row) => row.id,
    emptyMessage: "Aucune demande ne correspond aux critères. Essayez d'élargir votre recherche.",
  },
  render: (args) => (
    <div>
      <p style={{ marginTop: 0 }}>
        Tapez un texte qui ne correspond à aucune demande pour voir l'état vide (par exemple « xyz
        »).
      </p>
      <DataTable {...args} />
    </div>
  ),
};
