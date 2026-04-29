import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from './DropdownMenu.js';
import { Button } from '../Button/Button.js';
import {
  ChevronDown,
  Edit,
  Copy,
  Share2,
  Trash2,
  User,
  Settings,
  LogOut,
  HelpCircle,
} from 'lucide-react';

// Pas d'autodocs : Radix Portal rend dans document.body, le rendu auto-doc en
// isolation casse ("Cannot destructure 'document'"). Mêmes contraintes que Dialog.
const meta = {
  title: 'Composants/Navigation/DropdownMenu',
  component: DropdownMenu,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          Actions <ChevronDown size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem icon={<Edit size={16} />}>Modifier</DropdownMenuItem>
        <DropdownMenuItem icon={<Copy size={16} />}>Dupliquer</DropdownMenuItem>
        <DropdownMenuItem icon={<Share2 size={16} />}>Partager</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={<Trash2 size={16} />} destructive>
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const UserMenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          <User size={16} aria-hidden="true" /> Mon compte{' '}
          <ChevronDown size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Connecté en tant que Léonard T.</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={<User size={16} />}>Profil</DropdownMenuItem>
        <DropdownMenuItem icon={<Settings size={16} />}>Préférences</DropdownMenuItem>
        <DropdownMenuItem icon={<HelpCircle size={16} />}>Aide</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={<LogOut size={16} />} destructive>
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithShortcuts: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Édition</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem icon={<Edit size={16} />} shortcut="Ctrl+E">
          Modifier
        </DropdownMenuItem>
        <DropdownMenuItem icon={<Copy size={16} />} shortcut="Ctrl+C">
          Copier
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={<Trash2 size={16} />} shortcut="Suppr" destructive>
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithDisabledItem: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Plus d'options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem icon={<Edit size={16} />}>Modifier</DropdownMenuItem>
        <DropdownMenuItem icon={<Share2 size={16} />} disabled>
          Partager (à venir)
        </DropdownMenuItem>
        <DropdownMenuItem icon={<Copy size={16} />}>Dupliquer</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const ControlledOpen: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <p style={{ margin: 0 }}>Menu {open ? 'ouvert' : 'fermé'}</p>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button>Toggle</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setOpen(false)}>Action A</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setOpen(false)}>Action B</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  },
};
