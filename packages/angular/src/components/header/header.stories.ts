import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriHeaderComponent } from './header.component';
import { OriLogoComponent } from '../logo/logo.component';
import { OriButtonComponent } from '../button/button.component';
import { OriAvatarComponent } from '../avatar/avatar.component';
import { OriTagComponent } from '../tag/tag.component';

const meta: Meta<OriHeaderComponent> = {
  title: 'Compositions/Navigation/Header',
  component: OriHeaderComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Header app-level en 3 zones via slots `[brand]`, `[nav]`, `[actions]`.',
      },
    },
    layout: 'fullscreen',
  },
  decorators: [
    moduleMetadata({
      imports: [
        OriHeaderComponent,
        OriLogoComponent,
        OriButtonComponent,
        OriAvatarComponent,
        OriTagComponent,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<OriHeaderComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <ori-header>
        <ori-logo brand title="Polynésie française"></ori-logo>
      </ori-header>
    `,
  }),
};

export const WithSubtitle: Story = {
  render: () => ({
    template: `
      <ori-header>
        <ori-logo brand title="Polynésie française" subtitle="Service en ligne"></ori-logo>
      </ori-header>
    `,
  }),
};

export const WithActions: Story = {
  render: () => ({
    template: `
      <ori-header>
        <ori-logo brand href="/" title="Polynésie française" subtitle="Démarches en ligne"></ori-logo>
        <ng-container actions>
          <ori-button variant="ghost" size="sm">Aide</ori-button>
          <ori-button variant="primary" size="sm">Se connecter</ori-button>
        </ng-container>
      </ori-header>
    `,
  }),
};

export const Authenticated: Story = {
  render: () => ({
    template: `
      <ori-header>
        <ori-logo brand href="/" title="Polynésie française" subtitle="Démarches en ligne"></ori-logo>
        <ng-container actions>
          <ori-tag variant="info">Mode test</ori-tag>
          <ori-avatar alt="Marie Dupont" size="sm"></ori-avatar>
          <ori-button variant="ghost" size="sm">Déconnexion</ori-button>
        </ng-container>
      </ori-header>
    `,
  }),
};
