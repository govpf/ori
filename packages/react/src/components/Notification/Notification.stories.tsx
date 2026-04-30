import type { Meta, StoryObj } from '@storybook/react';
import { Notification } from './Notification.js';

const meta = {
  title: 'Primitives/Feedback/Notification',
  component: Notification,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Bandeau d'information système plein-largeur. Différent d'Alert (inline contextuel) et de Toast (éphémère overlay) : persiste jusqu'à fermeture explicite par l'usager.",
      },
    },
    layout: 'fullscreen',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['info', 'success', 'warning', 'danger'] },
    dismissible: { control: 'boolean' },
  },
  args: {
    variant: 'info',
    children: 'Maintenance programmée demain de 22h à 23h.',
    dismissible: true,
  },
} satisfies Meta<typeof Notification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: 'Par défaut' };

export const WithAction: Story = {
  args: {
    variant: 'warning',
    children: "Votre profil n'est pas complet.",
    action: { label: 'Compléter mon profil', href: '/profil' },
    dismissible: true,
  },
};

export const Variants: Story = {
  name: 'Variantes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Notification variant="info">
        Le service sera indisponible dimanche entre 2h et 4h.
      </Notification>
      <Notification variant="success">Votre dossier a été transmis avec succès.</Notification>
      <Notification variant="warning" action={{ label: 'En savoir plus', href: '/cookies' }}>
        Cette page utilise des cookies pour améliorer votre expérience.
      </Notification>
      <Notification variant="danger" dismissible>
        Une panne réseau affecte actuellement le service.
      </Notification>
    </div>
  ),
};

export const NonDismissible: Story = {
  args: {
    variant: 'danger',
    children: 'Ce message persiste tant que la situation est active.',
    dismissible: false,
  },
};
