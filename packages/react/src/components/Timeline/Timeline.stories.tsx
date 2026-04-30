import type { Meta, StoryObj } from '@storybook/react';
import { CheckCircle2, Clock, FileText, AlertCircle } from 'lucide-react';
import { Timeline } from './Timeline.js';

const meta = {
  title: 'Primitives/Affichage/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Timeline verticale d'événements (historique, journal d'audit, suivi d'actions). Status par item (`completed` / `current` / `pending`) qui adapte la couleur du dot. Icône custom par item via la prop `icon`.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      {
        id: '1',
        title: 'Pièce justificative ajoutée',
        timestamp: '2026-04-23 14:30',
        actor: 'Vous',
        description: 'Justificatif domicile.pdf',
      },
      {
        id: '2',
        title: 'Demande validée par le service instructeur',
        timestamp: '2026-04-23 09:12',
        actor: 'Service A',
      },
      {
        id: '3',
        title: 'Demande déposée',
        timestamp: '2026-04-22 16:45',
        actor: 'Vous',
      },
      {
        id: '4',
        title: 'Brouillon créé',
        timestamp: '2026-04-22 16:30',
        actor: 'Vous',
      },
    ],
  },
};

export const WithStatuses: Story = {
  args: {
    items: [
      {
        id: '1',
        title: 'Identité validée',
        timestamp: '2026-04-23 09:00',
        status: 'completed',
        actor: 'Service A',
      },
      {
        id: '2',
        title: "Pièces justificatives en cours d'examen",
        timestamp: '2026-04-23 10:15',
        status: 'current',
        actor: 'Service A',
        description: 'Délai estimé : 24h',
      },
      {
        id: '3',
        title: 'Validation finale',
        timestamp: 'À venir',
        status: 'pending',
      },
      {
        id: '4',
        title: 'Confirmation par email',
        timestamp: 'À venir',
        status: 'pending',
      },
    ],
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      {
        id: '1',
        title: 'Document ajouté',
        timestamp: '2026-04-23 14:30',
        icon: <FileText size={14} aria-hidden="true" />,
      },
      {
        id: '2',
        title: 'Validation effectuée',
        timestamp: '2026-04-23 09:12',
        icon: <CheckCircle2 size={14} aria-hidden="true" />,
      },
      {
        id: '3',
        title: 'En attente de réponse',
        timestamp: '2026-04-22 16:45',
        status: 'current',
        icon: <Clock size={14} aria-hidden="true" />,
      },
      {
        id: '4',
        title: 'Erreur de soumission corrigée',
        timestamp: '2026-04-22 11:00',
        icon: <AlertCircle size={14} aria-hidden="true" />,
      },
    ],
  },
};

export const SingleEntry: Story = {
  args: {
    items: [
      {
        id: '1',
        title: 'Compte créé',
        timestamp: '2026-04-22 09:30',
        actor: 'Inscription en ligne',
      },
    ],
  },
};
