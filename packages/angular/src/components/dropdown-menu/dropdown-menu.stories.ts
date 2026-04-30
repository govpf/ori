import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Edit, Copy, Share2, Trash2, User, Settings, LogOut, HelpCircle } from 'lucide-angular';
import { OriDropdownMenuComponent, type OriDropdownMenuItem } from './dropdown-menu.component';
import { OriButtonComponent } from '../button/button.component';

const meta: Meta<OriDropdownMenuComponent> = {
  title: 'Primitives/Navigation/DropdownMenu',
  component: OriDropdownMenuComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [OriDropdownMenuComponent, OriButtonComponent] })],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Menu déroulant accessible (role="menu"), avec navigation clavier complète, click-outside et restauration du focus. Items data-driven via la prop `[items]`, trigger projeté via `slot="trigger"`.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<OriDropdownMenuComponent>;

const actions: OriDropdownMenuItem[] = [
  { id: 'edit', label: 'Modifier', icon: Edit },
  { id: 'duplicate', label: 'Dupliquer', icon: Copy },
  { id: 'share', label: 'Partager', icon: Share2 },
  { id: 'sep1', separator: true },
  { id: 'delete', label: 'Supprimer', icon: Trash2, destructive: true },
];

const userActions: OriDropdownMenuItem[] = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'prefs', label: 'Préférences', icon: Settings },
  { id: 'help', label: 'Aide', icon: HelpCircle },
  { id: 'sep1', separator: true },
  { id: 'logout', label: 'Se déconnecter', icon: LogOut, destructive: true },
];

const editActions: OriDropdownMenuItem[] = [
  { id: 'edit', label: 'Modifier', icon: Edit, shortcut: 'Ctrl+E' },
  { id: 'copy', label: 'Copier', icon: Copy, shortcut: 'Ctrl+C' },
  { id: 'sep1', separator: true },
  { id: 'delete', label: 'Supprimer', icon: Trash2, shortcut: 'Suppr', destructive: true },
];

const moreActions: OriDropdownMenuItem[] = [
  { id: 'edit', label: 'Modifier', icon: Edit },
  { id: 'share', label: 'Partager (à venir)', icon: Share2, disabled: true },
  { id: 'duplicate', label: 'Dupliquer', icon: Copy },
];

export const Default: Story = {
  name: 'Par défaut',
  render: () => ({
    props: {
      items: actions,
      handleSelect: (item: OriDropdownMenuItem) => {
        // eslint-disable-next-line no-console
        console.log('Action sélectionnée :', item.id);
      },
    },
    template: `
      <ori-dropdown-menu [items]="items" (select)="handleSelect($event)" ariaLabel="Actions">
        <ori-button slot="trigger">Actions ▾</ori-button>
      </ori-dropdown-menu>
    `,
  }),
};

export const UserMenu: Story = {
  name: 'Menu utilisateur',
  render: () => ({
    props: {
      items: userActions,
      handleSelect: (item: OriDropdownMenuItem) => {
        // eslint-disable-next-line no-console
        console.log('Action utilisateur :', item.id);
      },
    },
    template: `
      <ori-dropdown-menu [items]="items" align="end" (select)="handleSelect($event)" ariaLabel="Mon compte">
        <ori-button variant="secondary" slot="trigger">Mon compte ▾</ori-button>
      </ori-dropdown-menu>
    `,
  }),
};

export const WithShortcuts: Story = {
  name: 'Avec raccourcis',
  render: () => ({
    props: {
      items: editActions,
    },
    template: `
      <ori-dropdown-menu [items]="items" ariaLabel="Édition">
        <ori-button slot="trigger">Édition ▾</ori-button>
      </ori-dropdown-menu>
    `,
  }),
};

export const WithDisabledItem: Story = {
  name: 'Avec élément désactivé',
  render: () => ({
    props: {
      items: moreActions,
    },
    template: `
      <ori-dropdown-menu [items]="items" ariaLabel="Plus d'options">
        <ori-button slot="trigger">Plus d'options ▾</ori-button>
      </ori-dropdown-menu>
    `,
  }),
};
