import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Textarea } from './Textarea.js';

const meta = {
  title: 'Primitives/Saisie/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Champ de saisie multi-lignes. Mêmes patterns que Input (label, hint, error, ARIA) avec `rows` configurable et resize vertical par défaut.',
      },
    },
  },
  argTypes: {
    rows: { control: { type: 'number', min: 1, max: 20 } },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Description',
    placeholder: 'Décrivez votre demande en quelques lignes…',
    rows: 4,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: 'Maximum 500 caractères.' },
};

export const Required: Story = {
  args: { required: true },
};

export const WithError: Story = {
  args: {
    value: '',
    error: 'La description est obligatoire.',
    required: true,
  },
};

export const Disabled: Story = {
  args: { disabled: true, value: 'Texte verrouillé qui ne peut pas être modifié.' },
};

export const WithCounter: Story = {
  render: () => {
    const max = 280;
    const [value, setValue] = useState('');
    return (
      <Textarea
        label="Message"
        hint={`${value.length} / ${max} caractères`}
        maxLength={max}
        rows={5}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};
