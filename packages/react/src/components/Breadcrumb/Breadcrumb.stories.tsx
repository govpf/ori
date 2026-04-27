import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb } from './Breadcrumb.js';

const meta = {
  title: 'Composants graphiques/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Fil d\'Ariane sémantique : `<nav aria-label>` + `<ol>` ordonné + `aria-current="page"` sur l\'item courant. Aucune dépendance externe.',
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Accueil', href: '/' },
      { label: 'Mes démarches', href: '/demarches' },
      { label: 'Demande de licence' },
    ],
  },
};

export const Long: Story = {
  args: {
    items: [
      { label: 'Accueil', href: '/' },
      { label: 'Services', href: '/services' },
      { label: 'Affaires maritimes', href: '/services/maritime' },
      { label: 'Permis bateau', href: '/services/maritime/permis' },
      { label: 'Demande en cours' },
    ],
  },
};

export const CustomSeparator: Story = {
  args: {
    separator: '/',
    items: [
      { label: 'Accueil', href: '/' },
      { label: 'Profil', href: '/profil' },
      { label: 'Modifier' },
    ],
  },
};
