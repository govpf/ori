import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriMainNavigationComponent } from './main-navigation.component';
import { OriHeaderComponent } from '../header/header.component';
import { OriLogoComponent } from '../logo/logo.component';
import { OriButtonComponent } from '../button/button.component';

const meta: Meta<OriMainNavigationComponent> = {
  title: 'Composants graphiques/MainNavigation',
  component: OriMainNavigationComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Navigation principale horizontale.',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        OriMainNavigationComponent,
        OriHeaderComponent,
        OriLogoComponent,
        OriButtonComponent,
      ],
    }),
  ],
  render: (args: Args) => ({
    props: args,
    template: `<ori-main-navigation [items]="items"></ori-main-navigation>`,
  }),
};

export default meta;
type Story = StoryObj<OriMainNavigationComponent>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Accueil', href: '/' },
      { label: 'Mes démarches', href: '/demarches', current: true },
      { label: 'Aide', href: '/aide' },
      { label: 'Contact', href: '/contact' },
    ],
  },
};

export const InHeader: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => ({
    template: `
      <ori-header>
        <ori-logo brand href="/" title="Polynésie française" subtitle="Démarches en ligne"></ori-logo>
        <ori-main-navigation
          nav
          [items]="[
            { label: 'Accueil', href: '/' },
            { label: 'Mes démarches', href: '/demarches', current: true },
            { label: 'Mes documents', href: '/documents' },
            { label: 'Aide', href: '/aide' }
          ]"
        ></ori-main-navigation>
        <ori-button actions variant="ghost" size="sm">Se connecter</ori-button>
      </ori-header>
    `,
  }),
};
