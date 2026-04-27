import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DatePicker } from './DatePicker.js';

const meta = {
  title: 'Composants graphiques/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Sélecteur de date basé sur `<input type="date">` natif. Format d\'affichage selon la locale du navigateur (`JJ/MM/AAAA` en fr-FR/fr-PF), valeur stockée au format ISO `yyyy-mm-dd`. Pour un calendrier custom (range, désactivation de jours), un composant dédié sera introduit à la demande.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Date de naissance',
    size: 'md',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: {
    hint: "Telle qu'elle figure sur votre pièce d'identité.",
  },
};

export const WithDefaultValue: Story = {
  args: { defaultValue: '1985-06-15' },
};

export const WithBounds: Story = {
  args: {
    label: 'Date de la demande',
    hint: "Doit être comprise entre aujourd'hui et dans 6 mois.",
    min: '2026-04-25',
    max: '2026-10-25',
  },
};

export const Required: Story = { args: { required: true } };

export const WithError: Story = {
  args: {
    error: "Cette date doit être antérieure à aujourd'hui.",
    defaultValue: '2030-01-01',
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: '2026-04-25' },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <DatePicker {...args} value={value} onChange={(e) => setValue(e.target.value)} />
        <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
          Valeur ISO : <strong>{value || '(aucune)'}</strong>
        </p>
      </div>
    );
  },
};
