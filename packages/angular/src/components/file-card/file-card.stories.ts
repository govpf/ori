import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Download, Eye, Pencil, Trash2 } from 'lucide-angular';
import { OriFileCardComponent } from './file-card.component';

const meta: Meta<OriFileCardComponent> = {
  title: 'Composants graphiques/FileCard',
  component: OriFileCardComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Tuile de fichier (pièce jointe, document, archive) avec icône typée, métadonnées et actions. Mapping `type → icône` porté par le DS pour garantir l'homogénéité entre services. [→ Description complète & bonnes pratiques](?path=/docs/documentation-générale-composants-graphiques-filecard--docs)",
      },
    },
  },
  decorators: [moduleMetadata({ imports: [OriFileCardComponent] })],
  argTypes: {
    type: {
      control: 'select',
      options: ['pdf', 'image', 'doc', 'spreadsheet', 'archive', 'other'],
    },
  },
  args: {
    name: 'Pièce identité.pdf',
    type: 'pdf',
    size: '1.2 Mo',
    meta: 'Ajouté le 2026-04-22',
  },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-file-card
        [name]="name"
        [type]="type"
        [size]="size"
        [meta]="meta"
        [link]="link"
        [actions]="actions"
      ></ori-file-card>
    `,
  }),
};

export default meta;
type Story = StoryObj<OriFileCardComponent>;

export const Default: Story = {};

export const AvecActions: Story = {
  args: {
    actions: [
      { id: 'preview', label: 'Aperçu', icon: Eye },
      { id: 'download', label: 'Télécharger', icon: Download },
      { id: 'delete', label: 'Supprimer', icon: Trash2, variant: 'danger' },
    ],
  },
};

export const AvecLien: Story = {
  args: {
    link: { label: 'Lié à 2026-0042', href: '#42' },
    actions: [
      { id: 'preview', label: 'Aperçu', icon: Eye },
      { id: 'download', label: 'Télécharger', icon: Download },
    ],
  },
};

export const TousLesTypes: Story = {
  render: () => ({
    props: { Eye, Download, Trash2 },
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
        <ori-file-card name="Récépissé.pdf" type="pdf" size="120 Ko" meta="2026-04-22"></ori-file-card>
        <ori-file-card name="Photo identité.jpg" type="image" size="2.3 Mo" meta="2026-04-20"></ori-file-card>
        <ori-file-card name="Statuts.docx" type="doc" size="180 Ko" meta="2026-04-15"></ori-file-card>
        <ori-file-card name="Budget 2026.xlsx" type="spreadsheet" size="42 Ko" meta="2026-04-10"></ori-file-card>
        <ori-file-card name="Dossier complet.zip" type="archive" size="15 Mo" meta="2026-04-08"></ori-file-card>
        <ori-file-card name="Note interne" type="other" size="8 Ko" meta="2026-04-05"></ori-file-card>
      </div>
    `,
  }),
};

export const NomLong: Story = {
  args: {
    name: 'Justificatif de domicile - Avenue Pouvanaa a Oopa - Avril 2026.pdf',
    actions: [
      { id: 'download', label: 'Télécharger', icon: Download },
      { id: 'delete', label: 'Supprimer', icon: Trash2, variant: 'danger' },
    ],
  },
};

export const SansActions: Story = {
  args: {
    name: 'Attestation employeur.pdf',
    type: 'pdf',
    size: '430 Ko',
    meta: 'Ajouté le 2026-04-15',
  },
};
