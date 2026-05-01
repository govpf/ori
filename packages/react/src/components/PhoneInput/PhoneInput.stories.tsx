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
    // Faux positif color-contrast : le pattern d'accessibilité utilise un
    // <select> natif en position absolute + opacity:0 par-dessus le pill
    // visible (drapeau + indicatif). axe-core résout le fond visible à
    // travers le select transparent et tombe sur le body blanc plutôt que
    // sur le brand-primary du parent. Validé manuellement : le ratio
    // brand-on-primary/brand-primary (#fff sur #073ca5) est >10:1.
    // Format `options.rules` (objet) : passé au axe.run du test-runner
    // pour désactiver une règle ponctuellement.
    a11y: {
      options: {
        rules: { 'color-contrast': { enabled: false } },
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
