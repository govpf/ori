import type { Meta, StoryObj } from '@storybook/react';
import { Send, Undo2, Trash2 } from 'lucide-react';
import { Button } from './Button.js';

const meta = {
  title: 'Primitives/Actions/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Élément d'interaction principal. 4 variantes, 3 tailles, bloc, désactivé. [→ Description complète & bonnes pratiques](?path=/docs/documentation-générale-composants-graphiques-button--docs)",
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
    block: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    children: 'Envoyer',
    variant: 'primary',
    size: 'md',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Ghost: Story = {
  args: { variant: 'ghost' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Supprimer' },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button {...args} size="sm">
        Petit
      </Button>
      <Button {...args} size="md">
        Moyen
      </Button>
      <Button {...args} size="lg">
        Grand
      </Button>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="primary" disabled>
        Disabled
      </Button>
    </div>
  ),
};

export const Block: Story = {
  args: { block: true, children: 'Bouton pleine largeur' },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Démo de composition : le bouton accepte n'importe quel contenu projeté
 * (texte + emoji, HTML enrichi, icônes…).
 */
export const Composition: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="primary">
        <Send size={16} aria-hidden="true" /> Envoyer
      </Button>
      <Button variant="secondary">
        <Undo2 size={16} aria-hidden="true" /> Retour
      </Button>
      <Button variant="danger">
        <Trash2 size={16} aria-hidden="true" /> Supprimer
      </Button>
    </div>
  ),
};
