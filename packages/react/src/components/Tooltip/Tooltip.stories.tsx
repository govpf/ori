import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip.js';
import { Button } from '../Button/index.js';

const meta = {
  title: 'Primitives/Feedback/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Tooltip minimaliste sans dépendance. Apparition au hover + focus, fermeture au mouseleave + blur + Escape. Délai par défaut 700ms. ARIA `role="tooltip"` + `aria-describedby` sur le trigger.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 80, display: 'flex', justifyContent: 'center' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: 'Action de suppression définitive',
    children: <Button variant="danger">Supprimer</Button>,
  },
};

export const Sides: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
      <Tooltip content="Tooltip en haut" side="top">
        <Button variant="secondary">Top</Button>
      </Tooltip>
      <Tooltip content="Tooltip à droite" side="right">
        <Button variant="secondary">Right</Button>
      </Tooltip>
      <Tooltip content="Tooltip en bas" side="bottom">
        <Button variant="secondary">Bottom</Button>
      </Tooltip>
      <Tooltip content="Tooltip à gauche" side="left">
        <Button variant="secondary">Left</Button>
      </Tooltip>
    </div>
  ),
};

export const FastDelay: Story = {
  args: {
    content: 'Apparition rapide (100ms)',
    openDelay: 100,
    children: <Button>Survoler</Button>,
  },
};

export const Disabled: Story = {
  args: {
    content: "Ce tooltip ne s'affichera pas",
    disabled: true,
    children: <Button variant="ghost">Tooltip désactivé</Button>,
  },
};
