import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {
  OriFormComponent,
  OriFormSectionComponent,
  OriFormFieldComponent,
  OriFormActionsComponent,
} from './form.component';
import { OriInputComponent } from '../input/input.component';
import { OriTextareaComponent } from '../textarea/textarea.component';
import { OriButtonComponent } from '../button/button.component';

const meta: Meta<OriFormComponent> = {
  title: 'Compositions/Layout/Form',
  component: OriFormComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        OriFormComponent,
        OriFormSectionComponent,
        OriFormFieldComponent,
        OriFormActionsComponent,
        OriInputComponent,
        OriTextareaComponent,
        OriButtonComponent,
      ],
    }),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "Formulaire standardisé : structure visuelle et a11y, sans validation ni gestion d'état (chaque app branche ses propres tools : Reactive Forms, signals, react-hook-form…).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<OriFormComponent>;

export const Default: Story = {
  name: 'Par défaut',
  render: () => ({
    template: `
      <ori-form style="max-width: 480px;">
        <ori-form-section title="Identité" description="Renseignez votre identité administrative.">
          <ori-form-field #nomField label="Nom" [required]="true">
            <ori-input
              [id]="nomField.controlId"
              [attr.aria-describedby]="nomField.describedById"
              placeholder="TAVAE"
            ></ori-input>
          </ori-form-field>
          <ori-form-field #prenomField label="Prénom" [required]="true">
            <ori-input
              [id]="prenomField.controlId"
              [attr.aria-describedby]="prenomField.describedById"
              placeholder="Léonard"
            ></ori-input>
          </ori-form-field>
        </ori-form-section>
        <ori-form-actions>
          <ori-button variant="secondary" type="button">Annuler</ori-button>
          <ori-button type="submit">Enregistrer</ori-button>
        </ori-form-actions>
      </ori-form>
    `,
  }),
};

export const MultipleSections: Story = {
  name: 'Plusieurs sections',
  render: () => ({
    template: `
      <ori-form style="max-width: 560px;">
        <ori-form-section title="Identité" description="Informations administratives.">
          <ori-form-field #nom label="Nom de famille" [required]="true">
            <ori-input [id]="nom.controlId" [attr.aria-describedby]="nom.describedById"></ori-input>
          </ori-form-field>
          <ori-form-field #prenom label="Prénom usuel" [required]="true">
            <ori-input [id]="prenom.controlId" [attr.aria-describedby]="prenom.describedById"></ori-input>
          </ori-form-field>
        </ori-form-section>
        <ori-form-section title="Coordonnées">
          <ori-form-field
            #email
            label="Adresse électronique"
            [required]="true"
            hint="Utilisée pour les notifications administratives uniquement."
          >
            <ori-input
              [id]="email.controlId"
              [attr.aria-describedby]="email.describedById"
              type="email"
              placeholder="exemple@administration.gov.pf"
            ></ori-input>
          </ori-form-field>
          <ori-form-field #tel label="Téléphone">
            <ori-input
              [id]="tel.controlId"
              [attr.aria-describedby]="tel.describedById"
              type="tel"
              placeholder="+689 40 00 00 00"
            ></ori-input>
          </ori-form-field>
        </ori-form-section>
        <ori-form-section title="Demande" description="Décrivez votre demande de manière concise.">
          <ori-form-field #objet label="Objet" [required]="true">
            <ori-input [id]="objet.controlId" [attr.aria-describedby]="objet.describedById"></ori-input>
          </ori-form-field>
          <ori-form-field #details label="Détails" hint="500 caractères maximum.">
            <ori-textarea
              [id]="details.controlId"
              [attr.aria-describedby]="details.describedById"
              [rows]="4"
            ></ori-textarea>
          </ori-form-field>
        </ori-form-section>
        <ori-form-actions>
          <ori-button variant="secondary" type="button">Enregistrer comme brouillon</ori-button>
          <ori-button type="submit">Envoyer la demande</ori-button>
        </ori-form-actions>
      </ori-form>
    `,
  }),
};

export const WithErrors: Story = {
  name: 'Avec erreurs',
  // Tag `skip-visual` : la story Angular pré-affiche les erreurs
  // directement et le bouton de soumission a un libellé différent ; la
  // version React n'affiche les erreurs qu'après submit (état
  // `submitted`) - divergence pédagogique volontaire.
  tags: ['skip-visual'],
  render: () => ({
    template: `
      <ori-form style="max-width: 480px;">
        <ori-form-section title="Identité">
          <ori-form-field #nom label="Nom" [required]="true" error="Le nom est obligatoire.">
            <ori-input
              [id]="nom.controlId"
              [attr.aria-describedby]="nom.describedById"
              [attr.aria-invalid]="true"
            ></ori-input>
          </ori-form-field>
          <ori-form-field
            #email
            label="Adresse électronique"
            [required]="true"
            error="Le format de l'adresse n'est pas valide."
            hint="Exemple : prenom.nom@administration.gov.pf"
          >
            <ori-input
              [id]="email.controlId"
              [attr.aria-describedby]="email.describedById"
              [attr.aria-invalid]="true"
              type="email"
              value="pas-une-adresse"
            ></ori-input>
          </ori-form-field>
        </ori-form-section>
        <ori-form-actions>
          <ori-button type="submit">Soumettre</ori-button>
        </ori-form-actions>
      </ori-form>
    `,
  }),
};
