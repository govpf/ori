import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Steps } from './Steps.js';

const meta = {
  title: 'Primitives/Navigation/Steps',
  component: Steps,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Indicateur de progression d'un workflow. Read-only par défaut (cf. décision F.3) ; opt-in `clickable` pour permettre le retour à une étape précédente complétée. Les étapes futures ne sont jamais cliquables.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 720 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Steps>;

export default meta;
type Story = StoryObj<typeof meta>;

const steps = [
  { title: 'Identité', description: 'Vos informations' },
  { title: 'Adresse', description: 'Justificatif de domicile' },
  { title: 'Pièces', description: 'Documents requis' },
  { title: 'Validation', description: 'Récapitulatif' },
];

export const Default: Story = {
  args: { steps, current: 1 },
};

export const FirstStep: Story = {
  args: { steps, current: 0 },
};

export const LastStep: Story = {
  args: { steps, current: 3 },
};

export const Clickable: Story = {
  render: () => {
    const [current, setCurrent] = useState(2);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Steps steps={steps} current={current} clickable onStepClick={setCurrent} />
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: 14 }}>
          Étape courante : <strong>{current + 1}</strong>. Cliquer sur une étape verte pour y
          revenir.
        </p>
      </div>
    );
  },
};

export const SimpleTitlesOnly: Story = {
  args: {
    current: 1,
    steps: [{ title: 'Étape 1' }, { title: 'Étape 2' }, { title: 'Étape 3' }],
  },
};
