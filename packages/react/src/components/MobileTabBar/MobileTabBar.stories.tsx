import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Home, FileText, MessageCircle, User, Search } from 'lucide-react';
import { MobileTabBar, type MobileTabBarItem } from './MobileTabBar.js';

const meta = {
  title: 'Compositions/Navigation/MobileTabBar',
  component: MobileTabBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Barre de navigation fixée en bas d'écran sur mobile, pattern UX standard (Material BottomNavigation, iOS TabBar). 3 à 5 items, chacun = icône au-dessus d'un label court. Masquée par défaut au-dessus du breakpoint `md` (768px).",
      },
    },
    viewport: { defaultViewport: 'mobile360' },
    layout: 'fullscreen',
  },
} satisfies Meta<typeof MobileTabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseItems: MobileTabBarItem[] = [
  { id: 'home', label: 'Accueil', icon: <Home size={20} aria-hidden="true" />, current: true },
  { id: 'demarches', label: 'Démarches', icon: <FileText size={20} aria-hidden="true" /> },
  { id: 'messages', label: 'Messages', icon: <MessageCircle size={20} aria-hidden="true" /> },
  { id: 'profil', label: 'Profil', icon: <User size={20} aria-hidden="true" /> },
];

export const Default: Story = {
  name: 'Par défaut (4 items)',
  args: {
    items: baseItems,
  },
};

export const ThreeItems: Story = {
  name: '3 items',
  args: {
    items: [
      { id: 'home', label: 'Accueil', icon: <Home size={20} aria-hidden="true" />, current: true },
      { id: 'demarches', label: 'Démarches', icon: <FileText size={20} aria-hidden="true" /> },
      { id: 'profil', label: 'Profil', icon: <User size={20} aria-hidden="true" /> },
    ],
  },
};

export const FiveItems: Story = {
  name: '5 items (max recommandé)',
  args: {
    items: [
      { id: 'home', label: 'Accueil', icon: <Home size={20} aria-hidden="true" />, current: true },
      { id: 'search', label: 'Rechercher', icon: <Search size={20} aria-hidden="true" /> },
      { id: 'demarches', label: 'Démarches', icon: <FileText size={20} aria-hidden="true" /> },
      { id: 'messages', label: 'Messages', icon: <MessageCircle size={20} aria-hidden="true" /> },
      { id: 'profil', label: 'Profil', icon: <User size={20} aria-hidden="true" /> },
    ],
  },
};

export const WithBadges: Story = {
  name: 'Avec pastilles de notification',
  args: {
    items: [
      { id: 'home', label: 'Accueil', icon: <Home size={20} aria-hidden="true" />, current: true },
      {
        id: 'demarches',
        label: 'Démarches',
        icon: <FileText size={20} aria-hidden="true" />,
        badge: 2,
      },
      {
        id: 'messages',
        label: 'Messages',
        icon: <MessageCircle size={20} aria-hidden="true" />,
        badge: '12',
      },
      { id: 'profil', label: 'Profil', icon: <User size={20} aria-hidden="true" /> },
    ],
  },
};

export const WithDisabledItem: Story = {
  name: 'Item désactivé',
  args: {
    items: [
      { id: 'home', label: 'Accueil', icon: <Home size={20} aria-hidden="true" />, current: true },
      { id: 'demarches', label: 'Démarches', icon: <FileText size={20} aria-hidden="true" /> },
      {
        id: 'messages',
        label: 'Messages',
        icon: <MessageCircle size={20} aria-hidden="true" />,
        disabled: true,
      },
      { id: 'profil', label: 'Profil', icon: <User size={20} aria-hidden="true" /> },
    ],
  },
};

export const ButtonsWithCallback: Story = {
  name: 'Boutons (sans href, callback `onSelect`)',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [active, setActive] = useState<string>('home');
    const items: MobileTabBarItem[] = baseItems.map((item) => ({
      ...item,
      href: undefined,
      current: item.id === active,
    }));
    return (
      <MobileTabBar
        items={items}
        onSelect={(item) => {
          if (item.id) setActive(item.id);
        }}
      />
    );
  },
};

export const AlwaysVisible: Story = {
  name: 'Toujours visible (alwaysVisible=true)',
  args: {
    items: baseItems,
    alwaysVisible: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Par défaut la barre est masquée au-dessus du breakpoint `md` (768px). `alwaysVisible` la conserve sur desktop, à utiliser uniquement si l'app n'a pas de Header avec navigation horizontale.",
      },
    },
  },
};
