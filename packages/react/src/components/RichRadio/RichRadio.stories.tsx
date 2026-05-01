import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Truck, Mail, Building2 } from 'lucide-react';
import { RichRadio, RichRadioGroup } from './RichRadio.js';

const meta = {
  title: 'Primitives/Saisie/RichRadio',
  component: RichRadioGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Choix exclusif rendu sous forme de cartes. Chaque option propose un titre, une description et un slot `trailing` pour une icône ou une image décorative. À utiliser quand le choix mérite plus de contexte qu'un simple label.",
      },
    },
  },
} satisfies Meta<typeof RichRadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Par défaut',
  render: () => {
    const [value, setValue] = useState('standard');
    return (
      <RichRadioGroup label="Mode de livraison" value={value} onChange={setValue}>
        <RichRadio
          value="standard"
          label="Livraison standard"
          description="3 à 5 jours ouvrés - gratuit"
        />
        <RichRadio value="express" label="Livraison express" description="24h, +9 €" />
        <RichRadio
          value="pickup"
          label="Retrait en agence"
          description="Disponible sous 1h dans 12 points de retrait"
        />
      </RichRadioGroup>
    );
  },
};

export const AvecIcones: Story = {
  name: 'Avec icônes',
  render: () => {
    const [value, setValue] = useState('postal');
    return (
      <RichRadioGroup
        label="Comment souhaitez-vous recevoir le document ?"
        value={value}
        onChange={setValue}
      >
        <RichRadio
          value="postal"
          label="Voie postale"
          description="Envoi à votre adresse de domicile"
          trailing={<Truck size={32} aria-hidden="true" />}
        />
        <RichRadio
          value="email"
          label="Email"
          description="PDF transmis sur votre messagerie sécurisée"
          trailing={<Mail size={32} aria-hidden="true" />}
        />
        <RichRadio
          value="agence"
          label="Retrait en agence"
          description="Sur présentation d'une pièce d'identité"
          trailing={<Building2 size={32} aria-hidden="true" />}
        />
      </RichRadioGroup>
    );
  },
};

export const Horizontal: Story = {
  name: 'Disposition horizontale',
  render: () => {
    const [value, setValue] = useState('particulier');
    return (
      <RichRadioGroup
        label="Vous êtes..."
        orientation="horizontal"
        value={value}
        onChange={setValue}
      >
        <RichRadio
          value="particulier"
          label="Un particulier"
          description="Démarches personnelles, état civil, fiscalité..."
        />
        <RichRadio
          value="entreprise"
          label="Une entreprise"
          description="Création, immatriculation, déclarations..."
        />
      </RichRadioGroup>
    );
  },
};

export const AvecErreur: Story = {
  name: 'Avec erreur',
  render: () => (
    <RichRadioGroup
      label="Type de demande"
      required
      error="Veuillez sélectionner un type de demande pour continuer."
    >
      <RichRadio value="creation" label="Création" description="Première demande" />
      <RichRadio
        value="renouvellement"
        label="Renouvellement"
        description="Document expiré ou en fin de validité"
      />
      <RichRadio
        value="duplicata"
        label="Duplicata"
        description="Perte ou vol du document précédent"
      />
    </RichRadioGroup>
  ),
};

export const Desactive: Story = {
  name: 'Désactivé',
  render: () => (
    <RichRadioGroup label="Mode de livraison (figé)" disabled value="standard">
      <RichRadio value="standard" label="Standard" description="3 à 5 jours ouvrés" />
      <RichRadio value="express" label="Express" description="24h, +9 €" />
    </RichRadioGroup>
  ),
};
