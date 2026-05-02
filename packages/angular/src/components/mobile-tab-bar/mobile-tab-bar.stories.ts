import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Home, FileText, MessageCircle, User, Search } from 'lucide-angular';
import { OriMobileTabBarComponent, type OriMobileTabBarItem } from './mobile-tab-bar.component';

const baseItems: OriMobileTabBarItem[] = [
  { id: 'home', label: 'Accueil', icon: Home, current: true },
  { id: 'demarches', label: 'Démarches', icon: FileText },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
  { id: 'profil', label: 'Profil', icon: User },
];

const meta: Meta<OriMobileTabBarComponent> = {
  title: 'Compositions/Navigation/MobileTabBar',
  component: OriMobileTabBarComponent,
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
  decorators: [
    moduleMetadata({
      imports: [OriMobileTabBarComponent],
    }),
  ],
  render: (args: Args) => ({
    props: args,
    template: `<ori-mobile-tab-bar [items]="items" [alwaysVisible]="alwaysVisible"></ori-mobile-tab-bar>`,
  }),
};

export default meta;
type Story = StoryObj<OriMobileTabBarComponent>;

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
      { id: 'home', label: 'Accueil', icon: Home, current: true },
      { id: 'demarches', label: 'Démarches', icon: FileText },
      { id: 'profil', label: 'Profil', icon: User },
    ],
  },
};

export const FiveItems: Story = {
  name: '5 items (max recommandé)',
  args: {
    items: [
      { id: 'home', label: 'Accueil', icon: Home, current: true },
      { id: 'search', label: 'Rechercher', icon: Search },
      { id: 'demarches', label: 'Démarches', icon: FileText },
      { id: 'messages', label: 'Messages', icon: MessageCircle },
      { id: 'profil', label: 'Profil', icon: User },
    ],
  },
};

export const WithBadges: Story = {
  name: 'Avec pastilles de notification',
  args: {
    items: [
      { id: 'home', label: 'Accueil', icon: Home, current: true },
      { id: 'demarches', label: 'Démarches', icon: FileText, badge: 2 },
      { id: 'messages', label: 'Messages', icon: MessageCircle, badge: '12' },
      { id: 'profil', label: 'Profil', icon: User },
    ],
  },
};

export const WithDisabledItem: Story = {
  name: 'Item désactivé',
  args: {
    items: [
      { id: 'home', label: 'Accueil', icon: Home, current: true },
      { id: 'demarches', label: 'Démarches', icon: FileText },
      { id: 'messages', label: 'Messages', icon: MessageCircle, disabled: true },
      { id: 'profil', label: 'Profil', icon: User },
    ],
  },
};

export const ButtonsWithCallback: Story = {
  name: 'Boutons (sans href, événement (select))',
  parameters: {
    docs: {
      description: {
        story:
          "Sans `href`, l'item est rendu en `<button>` et l'événement `(select)` permet de gérer la navigation côté app (Angular Router, signal, etc.).",
      },
    },
  },
  render: () => ({
    props: {
      items: baseItems.map((item) => ({ ...item, href: undefined })),
      onSelect: (item: OriMobileTabBarItem) => console.log('selected', item.id),
    },
    template: `
      <ori-mobile-tab-bar
        [items]="items"
        (select)="onSelect($event)"
      ></ori-mobile-tab-bar>
    `,
  }),
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
          "Par défaut la barre est masquée au-dessus du breakpoint `md` (768px). `alwaysVisible` la conserve sur desktop, à utiliser uniquement si l'app n'a pas de header avec navigation horizontale.",
      },
    },
  },
};
