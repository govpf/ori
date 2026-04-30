import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriTimelineComponent, type OriTimelineItem } from './timeline.component';

const meta: Meta<OriTimelineComponent> = {
  title: 'Primitives/Affichage/Timeline',
  component: OriTimelineComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Timeline verticale d'événements. Status par item (`completed` / `current` / `pending`) qui adapte la couleur du dot.",
      },
    },
  },
  decorators: [
    moduleMetadata({ imports: [OriTimelineComponent] }),
    (storyFn) => {
      const story = storyFn();
      return {
        ...story,
        template: `<div style="width: 480px; padding: 16px;">${story.template}</div>`,
      };
    },
  ],
  render: (args: Args) => ({
    props: args,
    template: `<ori-timeline [items]="items"></ori-timeline>`,
  }),
};

export default meta;
type Story = StoryObj<OriTimelineComponent>;

const defaultItems: OriTimelineItem[] = [
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
];

export const Default: Story = {
  name: 'Par défaut',
  args: { items: defaultItems },
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
      { id: '3', title: 'Validation finale', timestamp: 'À venir', status: 'pending' },
      { id: '4', title: 'Confirmation par email', timestamp: 'À venir', status: 'pending' },
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
