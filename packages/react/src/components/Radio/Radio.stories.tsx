import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Radio, RadioGroup } from './Radio.js';

const meta = {
  title: 'Primitives/Saisie/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Choix exclusif au sein d'un groupe. Toujours utilisé via `<RadioGroup>` (qui pose le `<fieldset>`/`<legend>`, gère la sélection et l'ARIA). Un `<Radio>` isolé n'est pas recommandé.",
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('email');
    return (
      <RadioGroup label="Canal de notification préféré" value={value} onChange={setValue}>
        <Radio value="email" label="Par email" />
        <Radio value="sms" label="Par SMS" />
        <Radio value="none" label="Aucune notification" />
      </RadioGroup>
    );
  },
};

export const WithHints: Story = {
  render: () => {
    const [value, setValue] = useState('standard');
    return (
      <RadioGroup
        label="Mode de livraison"
        hint="Le délai dépend de la disponibilité en stock."
        value={value}
        onChange={setValue}
      >
        <Radio value="standard" label="Standard" hint="3 à 5 jours ouvrés" />
        <Radio value="express" label="Express" hint="24h, +9 €" />
        <Radio value="pickup" label="Retrait en agence" hint="Disponible sous 1h" />
      </RadioGroup>
    );
  },
};

export const Required: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <RadioGroup label="Civilité" required value={value} onChange={setValue}>
        <Radio value="mme" label="Madame" />
        <Radio value="m" label="Monsieur" />
        <Radio value="autre" label="Autre" />
      </RadioGroup>
    );
  },
};

export const WithError: Story = {
  render: () => (
    <RadioGroup label="Civilité" required error="Vous devez sélectionner une option.">
      <Radio value="mme" label="Madame" />
      <Radio value="m" label="Monsieur" />
      <Radio value="autre" label="Autre" />
    </RadioGroup>
  ),
};

export const Inline: Story = {
  render: () => {
    const [value, setValue] = useState('oui');
    return (
      <RadioGroup
        label="Êtes-vous résident polynésien ?"
        orientation="inline"
        value={value}
        onChange={setValue}
      >
        <Radio value="oui" label="Oui" />
        <Radio value="non" label="Non" />
      </RadioGroup>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup label="Mode de livraison" disabled value="standard">
      <Radio value="standard" label="Standard" />
      <Radio value="express" label="Express" />
    </RadioGroup>
  ),
};
