import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton.js';

const meta = {
  title: 'Composants/Affichage/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Placeholder animé (shimmer) pour indiquer un chargement. Décoratif (`aria-hidden`) ; l'app doit fournir un message live pour les lecteurs d'écran.",
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['text', 'rect', 'circle'] },
  },
  args: { variant: 'rect', width: 200, height: 16 },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: { variant: 'text', width: 240 },
};

export const Rectangle: Story = {
  args: { variant: 'rect', width: 280, height: 120 },
};

export const Circle: Story = {
  args: { variant: 'circle', width: 48, height: 48 },
};

export const ListItem: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 360 }}>
      {[1, 2, 3].map((n) => (
        <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Skeleton variant="circle" width={40} height={40} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="90%" />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Card: Story = {
  render: () => (
    <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Skeleton variant="rect" width="100%" height={160} />
      <Skeleton variant="text" width="80%" height={20} />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="90%" />
    </div>
  ),
};
