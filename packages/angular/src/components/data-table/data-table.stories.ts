import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Edit, Eye, Trash2, Mail, Archive } from 'lucide-angular';
import {
  OriDataTableComponent,
  type OriDataTableColumn,
  type OriDataTableRowAction,
} from './data-table.component';
import { OriTagComponent } from '../tag/tag.component';

interface Demande {
  id: string;
  numero: string;
  objet: string;
  service: string;
  statut: 'envoyee' | 'en-cours' | 'cloturee' | 'rejetee';
  date: string;
}

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

const demandes: Demande[] = Array.from({ length: 47 }, (_, i) => {
  const statuts: Demande['statut'][] = ['envoyee', 'en-cours', 'cloturee', 'rejetee'];
  const services = ['DGI', 'DASS', 'DPAC', 'DTT', 'DRE', 'DAM', 'DJS'];
  return {
    id: `d-${i + 1}`,
    numero: `DEM-2026-${(1000 + i).toString()}`,
    objet: objets[i % objets.length] ?? 'Demande administrative',
    service: services[i % services.length] ?? 'DGI',
    statut: statuts[i % statuts.length] ?? 'envoyee',
    date: `2026-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  };
});

const columns: OriDataTableColumn<Demande>[] = [
  { key: 'numero', label: 'Numéro', sortable: true, filterable: true, width: '12rem' },
  { key: 'objet', label: 'Objet', sortable: true, filterable: true },
  { key: 'service', label: 'Service', sortable: true, filterable: true, width: '6rem' },
  { key: 'statut', label: 'Statut', sortable: true, width: '8rem' },
  { key: 'date', label: 'Date', sortable: true, width: '8rem' },
];

const rowActions = (row: Demande): OriDataTableRowAction[] => [
  { id: 'view', label: 'Voir le détail', icon: Eye },
  { id: 'edit', label: 'Modifier', icon: Edit, disabled: row.statut === 'cloturee' },
  { id: 'mail', label: 'Notifier le demandeur', icon: Mail },
  { id: 'archive', label: 'Archiver', icon: Archive, separatorBefore: true },
  {
    id: 'delete',
    label: 'Supprimer',
    icon: Trash2,
    destructive: true,
    disabled: row.statut === 'cloturee',
  },
];

const meta: Meta<OriDataTableComponent<Demande>> = {
  title: 'Compositions/Données/DataTable',
  component: OriDataTableComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [OriDataTableComponent, OriTagComponent] })],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Composition Table + Pagination + filtre + actions de ligne. Pour les très grosses tables server-paginées, utiliser <ori-table> + <ori-pagination> directement et piloter pagination/sort/filter côté app.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<OriDataTableComponent<Demande>>;

export const Default: Story = {
  name: 'Par défaut',
  render: () => ({
    props: {
      columns,
      data: demandes,
      rowKey: (row: Demande) => row.id,
      pageSize: 10,
      rowActions,
      onRowAction: (event: { action: string; row: Demande }) => {
        // eslint-disable-next-line no-console
        console.log('Action', event.action, 'sur', event.row.numero);
      },
    },
    template: `
      <ori-data-table
        [columns]="columns"
        [data]="data"
        [rowKey]="rowKey"
        [pageSize]="pageSize"
        [rowActions]="rowActions"
        (rowAction)="onRowAction($event)"
      ></ori-data-table>
    `,
  }),
};

export const ReadOnly: Story = {
  name: 'Consultation seule',
  render: () => ({
    props: {
      columns,
      data: demandes.slice(0, 15),
      rowKey: (row: Demande) => row.id,
      pageSize: 5,
    },
    template: `
      <ori-data-table
        [columns]="columns"
        [data]="data"
        [rowKey]="rowKey"
        [pageSize]="pageSize"
      ></ori-data-table>
    `,
  }),
};

export const NoPagination: Story = {
  name: 'Sans pagination',
  render: () => ({
    props: {
      columns,
      data: demandes.slice(0, 8),
      rowKey: (row: Demande) => row.id,
      rowActions,
    },
    template: `
      <ori-data-table
        [columns]="columns"
        [data]="data"
        [rowKey]="rowKey"
        [noPagination]="true"
        [rowActions]="rowActions"
      ></ori-data-table>
    `,
  }),
};

export const Loading: Story = {
  name: 'Chargement',
  render: () => ({
    props: {
      columns,
      rowKey: (row: Demande) => row.id,
    },
    template: `
      <ori-data-table
        [columns]="columns"
        [data]="[]"
        [rowKey]="rowKey"
        [loading]="true"
      ></ori-data-table>
    `,
  }),
};
