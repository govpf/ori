import type { Meta, StoryObj } from '@storybook/react';
import { Download, Eye, Pencil, Trash2 } from 'lucide-react';
import { FileCard } from './FileCard.js';

const meta = {
  title: 'Compositions/Saisie/FileCard',
  component: FileCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Tuile de fichier (pièce jointe, document, archive) avec icône typée, métadonnées et actions. Mapping `type → icône` porté par le DS pour garantir l'homogénéité entre services. [→ Description complète & bonnes pratiques](?path=/docs/documentation-générale-composants-graphiques-filecard--docs)",
      },
    },
  },
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
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: 'Par défaut' };

export const AvecActions: Story = {
  name: 'Avec actions',
  args: {
    actions: [
      { label: 'Aperçu', icon: <Eye size={16} aria-hidden="true" /> },
      { label: 'Télécharger', icon: <Download size={16} aria-hidden="true" /> },
      { label: 'Supprimer', icon: <Trash2 size={16} aria-hidden="true" />, variant: 'danger' },
    ],
  },
};

export const AvecLien: Story = {
  name: 'Avec lien',
  args: {
    link: { label: 'Lié à 2026-0042', href: '#42' },
    actions: [
      { label: 'Aperçu', icon: <Eye size={16} aria-hidden="true" /> },
      { label: 'Télécharger', icon: <Download size={16} aria-hidden="true" /> },
    ],
  },
};

export const TousLesTypes: Story = {
  name: 'Tous les types',
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
      }}
    >
      <FileCard name="Récépissé.pdf" type="pdf" size="120 Ko" meta="2026-04-22" />
      <FileCard name="Photo identité.jpg" type="image" size="2.3 Mo" meta="2026-04-20" />
      <FileCard name="Statuts.docx" type="doc" size="180 Ko" meta="2026-04-15" />
      <FileCard name="Budget 2026.xlsx" type="spreadsheet" size="42 Ko" meta="2026-04-10" />
      <FileCard name="Dossier complet.zip" type="archive" size="15 Mo" meta="2026-04-08" />
      <FileCard name="Note interne" type="other" size="8 Ko" meta="2026-04-05" />
    </div>
  ),
};

export const NomLong: Story = {
  name: 'Nom long',
  args: {
    name: 'Justificatif de domicile - Avenue Pouvanaa a Oopa - Avril 2026.pdf',
    actions: [
      { label: 'Télécharger', icon: <Download size={16} aria-hidden="true" /> },
      { label: 'Supprimer', icon: <Trash2 size={16} aria-hidden="true" />, variant: 'danger' },
    ],
  },
};

export const SansActions: Story = {
  name: 'Sans actions',
  args: {
    name: 'Attestation employeur.pdf',
    type: 'pdf',
    size: '430 Ko',
    meta: 'Ajouté le 2026-04-15',
  },
};

export const CollectionLiéeÀUneDemarche: Story = {
  name: 'Collection liée à une démarche',
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
      }}
    >
      <FileCard
        name="Pièce identité.pdf"
        type="pdf"
        size="1.2 Mo"
        meta="2026-04-22"
        link={{ label: 'Lié à 2026-0042', href: '#42' }}
        actions={[
          { label: 'Aperçu', icon: <Eye size={16} aria-hidden="true" /> },
          { label: 'Télécharger', icon: <Download size={16} aria-hidden="true" /> },
          { label: 'Supprimer', icon: <Trash2 size={16} aria-hidden="true" />, variant: 'danger' },
        ]}
      />
      <FileCard
        name="Justificatif domicile.pdf"
        type="pdf"
        size="850 Ko"
        meta="2026-04-22"
        link={{ label: 'Lié à 2026-0042', href: '#42' }}
        actions={[
          { label: 'Aperçu', icon: <Eye size={16} aria-hidden="true" /> },
          { label: 'Télécharger', icon: <Download size={16} aria-hidden="true" /> },
          { label: 'Supprimer', icon: <Trash2 size={16} aria-hidden="true" />, variant: 'danger' },
        ]}
      />
      <FileCard
        name="Photo identité.jpg"
        type="image"
        size="2.3 Mo"
        meta="2026-04-20"
        link={{ label: 'Lié à 2026-0041', href: '#41' }}
        actions={[
          { label: 'Aperçu', icon: <Eye size={16} aria-hidden="true" /> },
          { label: 'Modifier', icon: <Pencil size={16} aria-hidden="true" /> },
        ]}
      />
    </div>
  ),
};
