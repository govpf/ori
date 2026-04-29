import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Form, FormSection, FormField, FormActions } from './Form.js';
import { Input } from '../Input/Input.js';
import { Textarea } from '../Textarea/Textarea.js';
import { Button } from '../Button/Button.js';

const meta = {
  title: 'Composants/Layout/Form',
  component: Form,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Formulaire simple : une section, deux champs, deux actions. */
export const Default: Story = {
  render: () => (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        alert('Soumis');
      }}
      style={{ maxWidth: 480 }}
    >
      <FormSection title="Identité" description="Renseignez votre identité administrative.">
        <FormField label="Nom" required>
          {(p) => <Input {...p} placeholder="TAVAE" />}
        </FormField>
        <FormField label="Prénom" required>
          {(p) => <Input {...p} placeholder="Léonard" />}
        </FormField>
      </FormSection>
      <FormActions>
        <Button variant="secondary" type="button">
          Annuler
        </Button>
        <Button type="submit">Enregistrer</Button>
      </FormActions>
    </Form>
  ),
};

/** Plusieurs sections : démontre la séparation visuelle entre groupes de champs. */
export const MultipleSections: Story = {
  render: () => (
    <Form style={{ maxWidth: 560 }}>
      <FormSection title="Identité" description="Informations administratives.">
        <FormField label="Nom de famille" required>
          {(p) => <Input {...p} />}
        </FormField>
        <FormField label="Prénom usuel" required>
          {(p) => <Input {...p} />}
        </FormField>
      </FormSection>
      <FormSection title="Coordonnées">
        <FormField
          label="Adresse électronique"
          required
          hint="Utilisée pour les notifications administratives uniquement."
        >
          {(p) => <Input {...p} type="email" placeholder="exemple@administration.gov.pf" />}
        </FormField>
        <FormField label="Téléphone">
          {(p) => <Input {...p} type="tel" placeholder="+689 40 00 00 00" />}
        </FormField>
      </FormSection>
      <FormSection title="Demande" description="Décrivez votre demande de manière concise.">
        <FormField label="Objet" required>
          {(p) => <Input {...p} />}
        </FormField>
        <FormField label="Détails" hint="500 caractères maximum.">
          {(p) => <Textarea {...p} rows={4} />}
        </FormField>
      </FormSection>
      <FormActions>
        <Button variant="secondary" type="button">
          Enregistrer comme brouillon
        </Button>
        <Button type="submit">Envoyer la demande</Button>
      </FormActions>
    </Form>
  ),
};

/** Validation : démontre l'affichage d'erreur en rouge sous le champ. */
export const WithErrors: Story = {
  render: () => {
    const [submitted, setSubmitted] = useState(false);
    return (
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        style={{ maxWidth: 480 }}
      >
        <FormSection title="Identité">
          <FormField label="Nom" required error={submitted ? 'Le nom est obligatoire.' : undefined}>
            {(p) => <Input {...p} />}
          </FormField>
          <FormField
            label="Adresse électronique"
            required
            error={submitted ? "Le format de l'adresse n'est pas valide." : undefined}
            hint="Exemple : prenom.nom@administration.gov.pf"
          >
            {(p) => <Input {...p} type="email" defaultValue="pas-une-adresse" />}
          </FormField>
        </FormSection>
        <FormActions>
          <Button type="submit">Soumettre pour voir les erreurs</Button>
        </FormActions>
      </Form>
    );
  },
};

/** Aligned start : actions à gauche au lieu de droite. */
export const ActionsAlignedStart: Story = {
  render: () => (
    <Form style={{ maxWidth: 480 }}>
      <FormSection>
        <FormField label="Recherche">{(p) => <Input {...p} placeholder="Mot-clé" />}</FormField>
      </FormSection>
      <FormActions align="start">
        <Button type="submit">Rechercher</Button>
      </FormActions>
    </Form>
  ),
};
