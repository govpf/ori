import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { Progress } from './Progress.js';

const meta = {
  title: 'Composants graphiques/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Barre de progression basée sur l'élément `<progress>` natif HTML. A11y native (annoncé par les lecteurs d'écran avec valeur courante / max). Mode indéterminé gratuit en omettant `value`.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 60, max: 100 },
};

export const WithLabel: Story = {
  args: { value: 35, max: 100, label: 'Téléversement en cours' },
};

export const Indeterminate: Story = {
  args: { label: 'Traitement en cours' },
};

export const Live: Story = {
  render: () => {
    const [value, setValue] = useState(0);
    useEffect(() => {
      const t = setInterval(() => {
        setValue((v) => (v >= 100 ? 0 : v + 5));
      }, 400);
      return () => clearInterval(t);
    }, []);
    return <Progress value={value} max={100} label="Synchronisation des données" />;
  },
};
