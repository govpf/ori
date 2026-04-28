import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SideMenu } from './SideMenu.js';
import { Button } from '../Button/index.js';

const meta = {
  title: 'Composants/Navigation/SideMenu',
  component: SideMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Menu latéral hiérarchique avec sections + items. Variants `persistent` (sidebar fixe) ou `drawer` (overlay). Cf. décision J.3 : pas d'auto-switch responsive, l'app gère via media query.",
      },
    },
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SideMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const sections = [
  {
    title: 'Mes démarches',
    items: [
      { label: 'En cours', href: '/demarches/en-cours', current: true },
      { label: 'Brouillons', href: '/demarches/brouillons' },
      { label: 'Archives', href: '/demarches/archives' },
    ],
  },
  {
    title: 'Documents',
    items: [
      { label: 'Pièces jointes', href: '/documents/pj' },
      { label: 'Justificatifs', href: '/documents/justifs' },
    ],
  },
  {
    title: 'Compte',
    items: [
      { label: 'Profil', href: '/compte/profil' },
      { label: 'Préférences', href: '/compte/prefs' },
      { label: 'Confidentialité', href: '/compte/confidentialite' },
    ],
  },
];

export const Persistent: Story = {
  render: () => (
    <div style={{ display: 'flex', minHeight: 480 }}>
      <SideMenu sections={sections} />
      <main style={{ flex: 1, padding: 24 }}>
        <h2 style={{ marginTop: 0 }}>Contenu principal</h2>
        <p>La sidebar est persistente sur la gauche.</p>
      </main>
    </div>
  ),
};

export const Drawer: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ minHeight: 480, padding: 24 }}>
        <Button onClick={() => setOpen(true)}>Ouvrir le menu</Button>
        <SideMenu sections={sections} variant="drawer" open={open} onClose={() => setOpen(false)} />
        <p style={{ marginTop: 16, color: 'var(--color-text-secondary)' }}>
          ESC ou clic sur l'overlay pour fermer.
        </p>
      </div>
    );
  },
};
