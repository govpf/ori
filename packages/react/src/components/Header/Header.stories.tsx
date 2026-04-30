import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header.js';
import { Button } from '../Button/index.js';
import { Avatar } from '../Avatar/index.js';
import { Tag } from '../Tag/index.js';

const meta = {
  title: 'Compositions/Navigation/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Header app-level en 3 zones : Brand (Logo PF par défaut) / Nav (optionnelle) / Actions (libre). Aucune logique métier hardcodée - l'app remplit la zone Actions avec ce qu'elle veut.",
      },
    },
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Par défaut',
  args: { title: 'Polynésie française' },
};

export const WithSubtitle: Story = {
  name: 'Avec sous-titre',
  args: { title: 'Polynésie française', subtitle: 'Service en ligne' },
};

export const WithActions: Story = {
  name: 'Avec actions',
  render: () => (
    <Header>
      <Header.Brand>
        <a href="/" className="ori-logo" style={{ textDecoration: 'none' }}>
          <span className="ori-logo__text">
            <span className="ori-logo__title">Polynésie française</span>
            <span className="ori-logo__subtitle">Démarches en ligne</span>
          </span>
        </a>
      </Header.Brand>
      <Header.Actions>
        <Button variant="ghost" size="sm">
          Aide
        </Button>
        <Button variant="primary" size="sm">
          Se connecter
        </Button>
      </Header.Actions>
    </Header>
  ),
};

export const Authenticated: Story = {
  render: () => (
    <Header>
      <Header.Brand>
        <a href="/" className="ori-logo" style={{ textDecoration: 'none' }}>
          <span className="ori-logo__text">
            <span className="ori-logo__title">Polynésie française</span>
            <span className="ori-logo__subtitle">Démarches en ligne</span>
          </span>
        </a>
      </Header.Brand>
      <Header.Actions>
        <Tag variant="info">Mode test</Tag>
        <Avatar alt="Marie Dupont" size="sm" />
        <Button variant="ghost" size="sm">
          Déconnexion
        </Button>
      </Header.Actions>
    </Header>
  ),
};
