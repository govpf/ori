import type { Meta, StoryObj } from '@storybook/react';
import { MainNavigation } from './MainNavigation.js';
import { Header } from '../Header/index.js';
import { Button } from '../Button/index.js';

const meta = {
  title: 'Compositions/Navigation/MainNavigation',
  component: MainNavigation,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Navigation principale horizontale, typiquement dans le `<Header>`. `<nav aria-label>` + `<ul>` + `aria-current="page"`.',
      },
    },
  },
} satisfies Meta<typeof MainNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

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
  render: () => (
    <Header title="Polynésie française" subtitle="Démarches en ligne" logoHref="/">
      <Header.Brand>
        <a href="/" className="ori-logo" style={{ textDecoration: 'none' }}>
          <span className="ori-logo__text">
            <span className="ori-logo__title">Polynésie française</span>
            <span className="ori-logo__subtitle">Démarches en ligne</span>
          </span>
        </a>
      </Header.Brand>
      <Header.Nav>
        <MainNavigation
          items={[
            { label: 'Accueil', href: '/' },
            { label: 'Mes démarches', href: '/demarches', current: true },
            { label: 'Mes documents', href: '/documents' },
            { label: 'Aide', href: '/aide' },
          ]}
        />
      </Header.Nav>
      <Header.Actions>
        <Button variant="ghost" size="sm">
          Se connecter
        </Button>
      </Header.Actions>
    </Header>
  ),
};
