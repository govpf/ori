import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Select } from './Select.js';

const meta = {
  title: 'Primitives/Saisie/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Liste déroulante simple basée sur `<select>` natif. Conçu pour l'a11y native, l'UX mobile (picker système) et un bundle minimal. Pour search ou multi-select stylé, un `<Combobox>` séparé sera introduit à la demande.",
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Civilité',
    placeholder: 'Sélectionnez votre civilité',
    options: [
      { value: 'mme', label: 'Madame' },
      { value: 'm', label: 'Monsieur' },
      { value: 'autre', label: 'Autre' },
    ],
    size: 'md',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: 'Par défaut' };

export const WithHint: Story = {
  name: 'Avec indication',
  args: {
    hint: "Telle que figurant sur votre pièce d'identité.",
  },
};

export const Required: Story = { args: { required: true } };

export const WithError: Story = {
  name: 'Avec erreur',
  args: {
    error: 'Ce champ est obligatoire.',
    required: true,
  },
};

export const Disabled: Story = {
  name: 'Désactivé',
  args: { disabled: true, defaultValue: 'mme' },
};

export const WithDisabledOption: Story = {
  name: 'Avec option désactivée',
  args: {
    label: 'Mode de livraison',
    placeholder: 'Choisir un mode',
    options: [
      { value: 'standard', label: 'Standard (3-5 jours)' },
      { value: 'express', label: 'Express (24h)', disabled: true },
      { value: 'pickup', label: 'Retrait en agence' },
    ],
  },
};

export const Sizes: Story = {
  name: 'Tailles',
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Select {...args} size="sm" label="Petit" />
      <Select {...args} size="md" label="Moyen" />
      <Select {...args} size="lg" label="Grand" />
    </div>
  ),
  // Tag `skip-visual` : les options React héritent des args du meta
  // (« Madame / Monsieur / Autre »), alors que la version Angular utilise
  // des options inline « Option A / Option B » - divergence pédagogique
  // volontaire.
  tags: ['skip-visual'],
};

export const Controlled: Story = {
  name: 'Contrôlé',
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Select {...args} value={value} onChange={(e) => setValue(e.target.value)} />
        <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
          Valeur sélectionnée : <strong>{value || '(aucune)'}</strong>
        </p>
      </div>
    );
  },
};
