import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { AppShell } from './AppShell.js';
import { Button } from '../Button/Button.js';

const meta = {
  title: 'Compositions/Layout/AppShell',
  component: AppShell,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockHeader = (
  <header
    style={{
      height: 56,
      paddingInline: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: '#fff',
    }}
  >
    <strong>Démo AppShell</strong>
    <span style={{ fontSize: 14, color: '#6b7280' }}>Header projeté</span>
  </header>
);

const mockSidebar = (
  <nav
    style={{
      width: 240,
      paddingBlock: 16,
      paddingInline: 12,
      borderRight: '1px solid #e5e7eb',
      backgroundColor: '#f9fafb',
      height: '100%',
    }}
    aria-label="Navigation"
  >
    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <li>
        <a href="#a">Tableau de bord</a>
      </li>
      <li>
        <a href="#b">Mes demandes</a>
      </li>
      <li>
        <a href="#c">Documents</a>
      </li>
      <li>
        <a href="#d">Préférences</a>
      </li>
    </ul>
  </nav>
);

const mockFooter = (
  <footer
    style={{
      paddingBlock: 12,
      paddingInline: 16,
      borderTop: '1px solid #e5e7eb',
      backgroundColor: '#fff',
      fontSize: 14,
      color: '#6b7280',
      textAlign: 'center',
    }}
  >
    © 2026 Démo Ori
  </footer>
);

const mockMain = (
  <div style={{ padding: 24 }}>
    <h1 style={{ marginTop: 0 }}>Page de démonstration</h1>
    <p>
      Le main est le seul slot non-optionnel. Il porte un <code>id</code> et un{' '}
      <code>tabindex=-1</code> pour permettre au skip link "Aller au contenu principal" de
      fonctionner correctement.
    </p>
    {Array.from({ length: 8 }).map((_, i) => (
      <p key={i}>Paragraphe {i + 1} pour démontrer le scroll vertical du main.</p>
    ))}
  </div>
);

/** Layout complet : header + sidebar + main + footer. */
export const Default: Story = {
  name: 'Par défaut',
  render: () => (
    <div style={{ height: 600, border: '1px dashed #d4d4d8' }}>
      <AppShell header={mockHeader} sidebar={mockSidebar} footer={mockFooter}>
        {mockMain}
      </AppShell>
    </div>
  ),
};

/** Sans sidebar : layout simple (header + main + footer). */
export const NoSidebar: Story = {
  name: 'Sans sidebar',
  render: () => (
    <div style={{ height: 600, border: '1px dashed #d4d4d8' }}>
      <AppShell header={mockHeader} footer={mockFooter}>
        {mockMain}
      </AppShell>
    </div>
  ),
};

/** Drawer mobile : démontre le toggle de la sidebar piloté par l'app. */
export const SidebarDrawer: Story = {
  name: 'Sidebar en drawer',
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ height: 600, border: '1px dashed #d4d4d8' }}>
        <AppShell
          header={
            <header
              style={{
                height: 56,
                paddingInline: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#fff',
              }}
            >
              <Button variant="secondary" onClick={() => setOpen((v) => !v)}>
                ☰ Menu
              </Button>
              <strong>Démo drawer</strong>
              <span style={{ fontSize: 14, color: '#6b7280', marginLeft: 'auto' }}>
                Sidebar ouvert : {open ? 'oui' : 'non'}
              </span>
            </header>
          }
          sidebar={mockSidebar}
          sidebarOpen={open}
          onSidebarOpenChange={setOpen}
        >
          <div style={{ padding: 24 }}>
            <p>
              Au-dessus de 768px, la sidebar est toujours visible et le toggle Menu n'a pas d'effet.
              En réduisant la fenêtre, la sidebar devient un drawer piloté par le bouton "Menu"
              (clic sur le scrim ou ESC pour fermer).
            </p>
          </div>
        </AppShell>
      </div>
    );
  },
};
