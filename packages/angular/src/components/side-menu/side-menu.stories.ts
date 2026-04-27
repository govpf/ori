import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriSideMenuComponent, type OriSideMenuSection } from './side-menu.component';
import { OriButtonComponent } from '../button/button.component';

const sections: OriSideMenuSection[] = [
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
    ],
  },
];

@Component({
  selector: 'ori-side-menu-drawer-demo',
  standalone: true,
  imports: [OriSideMenuComponent, OriButtonComponent],
  template: `
    <ori-button (click)="open = true">Ouvrir le menu</ori-button>
    <ori-side-menu
      variant="drawer"
      [open]="open"
      [sections]="sections"
      (openChange)="open = $event"
    ></ori-side-menu>
    <p style="margin-top: 16px; color: var(--color-text-secondary);">
      ESC ou clic sur l'overlay pour fermer.
    </p>
  `,
})
class SideMenuDrawerDemo {
  open = false;
  sections = sections;
}

const meta: Meta<OriSideMenuComponent> = {
  title: 'Composants graphiques/SideMenu',
  component: OriSideMenuComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Menu latéral hiérarchique. Variants `persistent` ou `drawer`.',
      },
    },
    layout: 'fullscreen',
  },
  decorators: [
    moduleMetadata({
      imports: [OriSideMenuComponent, OriButtonComponent, SideMenuDrawerDemo],
    }),
  ],
};

export default meta;
type Story = StoryObj<OriSideMenuComponent>;

export const Persistent: Story = {
  render: () => ({
    props: { sections },
    template: `
      <div style="display: flex; min-height: 480px;">
        <ori-side-menu [sections]="sections"></ori-side-menu>
        <main style="flex: 1; padding: 24px;">
          <h2 style="margin-top: 0;">Contenu principal</h2>
          <p>La sidebar est persistente sur la gauche.</p>
        </main>
      </div>
    `,
  }),
};

export const Drawer: Story = {
  render: () => ({
    template: `<div style="min-height: 480px; padding: 24px;"><ori-side-menu-drawer-demo></ori-side-menu-drawer-demo></div>`,
  }),
};
