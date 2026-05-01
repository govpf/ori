import type { Meta, StoryObj } from '@storybook/react';
import { DownloadButton } from './DownloadButton.js';

const meta = {
  title: 'Primitives/Actions/DownloadButton',
  component: DownloadButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Lien de téléchargement de fichier avec icône intégrée et métadonnées (type + taille) optionnelles. Utilise l'attribut natif HTML `download`.",
      },
    },
  },
} satisfies Meta<typeof DownloadButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Par défaut',
  args: {
    href: '#',
    children: 'Télécharger la brochure',
    fileType: 'PDF',
    fileSize: '2.55 MB',
  },
};

export const PDF: Story = {
  name: 'Fichier PDF',
  args: {
    href: '#',
    children: "Notice d'information",
    fileType: 'PDF',
    fileSize: '847 Ko',
  },
};

export const Word: Story = {
  name: 'Fichier Word',
  args: {
    href: '#',
    children: 'Modèle de demande',
    fileType: 'DOCX',
    fileSize: '124 Ko',
  },
};

export const Excel: Story = {
  name: 'Fichier Excel',
  args: {
    href: '#',
    children: 'Tableau de suivi',
    fileType: 'XLSX',
    fileSize: '3.2 MB',
  },
};

export const SansMeta: Story = {
  name: 'Sans métadonnées',
  args: {
    href: '#',
    children: 'Télécharger',
    hideMeta: true,
  },
};
