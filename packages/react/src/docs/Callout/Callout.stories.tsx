import type { Meta, StoryObj } from '@storybook/react';
import { Callout } from './Callout.js';

const meta = {
  title: 'Publishing/Documentation/Callout',
  component: Callout,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "Bloc éditorial pour mettre en avant une information dans la doc. 4 variantes : note, tip, warning, danger. Distinct d'`Alert` (transactionnel app).",
      },
    },
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['note', 'tip', 'warning', 'danger'],
    },
  },
  args: {
    variant: 'note',
    title: 'À noter',
    children:
      'Cette page documente les choix structurants faits lors de la création du design system.',
  },
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Note: Story = {};

export const Tip: Story = {
  args: {
    variant: 'tip',
    title: 'Astuce',
    children:
      "Préférer la composition à la configuration : passer un node React via children plutôt qu'un prop spécifique.",
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Attention',
    children: 'Cette API est dépréciée et sera retirée dans la version 1.0.',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    title: 'À ne pas faire',
    children: 'Ne jamais désactiver la sandbox des iframes embarquant du contenu utilisateur.',
  },
};

export const NoTitle: Story = {
  args: { title: undefined },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Callout variant="note" title="Note">
        Information neutre.
      </Callout>
      <Callout variant="tip" title="Astuce">
        Conseil pratique.
      </Callout>
      <Callout variant="warning" title="Attention">
        Point de vigilance.
      </Callout>
      <Callout variant="danger" title="Danger">
        À éviter absolument.
      </Callout>
    </div>
  ),
};
