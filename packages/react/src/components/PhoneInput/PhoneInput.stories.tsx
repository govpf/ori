import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PhoneInput, type PhoneInputCountry } from './PhoneInput.js';

const meta = {
  title: 'Primitives/Saisie/PhoneInput',
  component: PhoneInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Champ de saisie d'un numéro de téléphone avec sélecteur d'indicatif. Par défaut configuré sur Polynésie française (+689) en lecture seule. Fournir une liste de pays pour activer le dropdown.",
      },
    },
  },
} satisfies Meta<typeof PhoneInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const REGIONAL_COUNTRIES: PhoneInputCountry[] = [
  { code: 'PF', dialCode: '+689', label: 'Polynésie française' },
  { code: 'NC', dialCode: '+687', label: 'Nouvelle-Calédonie' },
  { code: 'WF', dialCode: '+681', label: 'Wallis-et-Futuna' },
  { code: 'FR', dialCode: '+33', label: 'France métropolitaine' },
];

export const Default: Story = {
  name: 'Par défaut',
  args: {
    label: 'Téléphone',
  },
};

export const Rempli: Story = {
  name: 'Rempli',
  render: () => {
    const [value, setValue] = useState('40 40 40 40');
    return <PhoneInput label="Téléphone" value={value} onChange={setValue} />;
  },
};

export const AvecErreur: Story = {
  name: 'Avec erreur',
  args: {
    label: 'Téléphone',
    required: true,
    error: 'Numéro obligatoire.',
  },
};

export const AvecAide: Story = {
  name: 'Avec aide',
  args: {
    label: 'Téléphone',
    hint: 'Format international requis pour les notifications par SMS.',
  },
};

export const Desactive: Story = {
  name: 'Désactivé',
  args: {
    label: 'Téléphone',
    disabled: true,
    defaultValue: '40 40 40 40',
  },
};

export const LectureSeule: Story = {
  name: 'Lecture seule',
  args: {
    label: 'Téléphone',
    readOnly: true,
    defaultValue: '40 40 40 40',
  },
};

export const PlusieursIndicatifs: Story = {
  name: 'Plusieurs indicatifs',
  render: () => {
    const [code, setCode] = useState('PF');
    const [value, setValue] = useState('');
    return (
      <PhoneInput
        label="Téléphone"
        countries={REGIONAL_COUNTRIES}
        countryCode={code}
        onCountryChange={setCode}
        value={value}
        onChange={setValue}
        hint="Sélectionnez l'indicatif puis saisissez le numéro local."
      />
    );
  },
};
