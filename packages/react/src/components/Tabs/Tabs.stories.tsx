import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tabs } from './Tabs.js';

const meta = {
  title: 'Primitives/Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Onglets avec activation manuelle au clavier (ArrowLeft / ArrowRight pour déplacer le focus, Enter / Space pour activer). Conforme WAI-ARIA Authoring Practices, choix volontaire pour préserver l'a11y des panneaux à contenu lourd.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="profile">
      <Tabs.List aria-label="Réglages utilisateur">
        <Tabs.Tab value="profile">Profil</Tabs.Tab>
        <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
        <Tabs.Tab value="security">Sécurité</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="profile">
        <p>Modifiez vos informations personnelles, votre photo et vos coordonnées.</p>
      </Tabs.Panel>
      <Tabs.Panel value="notifications">
        <p>Choisissez les emails et notifications que vous souhaitez recevoir.</p>
      </Tabs.Panel>
      <Tabs.Panel value="security">
        <p>Mot de passe, authentification à deux facteurs et sessions actives.</p>
      </Tabs.Panel>
    </Tabs>
  ),
};

export const WithDisabled: Story = {
  render: () => (
    <Tabs defaultValue="general">
      <Tabs.List aria-label="Configuration">
        <Tabs.Tab value="general">Général</Tabs.Tab>
        <Tabs.Tab value="advanced">Avancé</Tabs.Tab>
        <Tabs.Tab value="experimental" disabled>
          Expérimental (verrouillé)
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="general">
        <p>Réglages de base.</p>
      </Tabs.Panel>
      <Tabs.Panel value="advanced">
        <p>Réglages avancés réservés aux administrateurs.</p>
      </Tabs.Panel>
    </Tabs>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('a');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Tabs value={value} onValueChange={setValue}>
          <Tabs.List aria-label="Sections">
            <Tabs.Tab value="a">Section A</Tabs.Tab>
            <Tabs.Tab value="b">Section B</Tabs.Tab>
            <Tabs.Tab value="c">Section C</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="a">Contenu A</Tabs.Panel>
          <Tabs.Panel value="b">Contenu B</Tabs.Panel>
          <Tabs.Panel value="c">Contenu C</Tabs.Panel>
        </Tabs>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: 14 }}>
          Tab actif (state externe) : <strong>{value}</strong>
        </p>
      </div>
    );
  },
};
