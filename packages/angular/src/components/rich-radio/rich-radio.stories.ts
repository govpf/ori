import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { LucideAngularModule, Truck, Mail, Building2 } from 'lucide-angular';
import { OriRichRadioComponent } from './rich-radio.component';
import { OriRichRadioGroupComponent } from './rich-radio-group.component';

const meta: Meta<OriRichRadioGroupComponent> = {
  title: 'Primitives/Saisie/RichRadio',
  component: OriRichRadioGroupComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Choix exclusif rendu sous forme de cartes. Chaque option propose un titre, une description et un slot `[slot=trailing]` pour une icône ou une image décorative.',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [OriRichRadioComponent, OriRichRadioGroupComponent, LucideAngularModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<OriRichRadioGroupComponent>;

export const Default: Story = {
  name: 'Par défaut',
  args: { label: 'Mode de livraison', value: 'standard' },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-rich-radio-group [label]="label" [value]="value" (valueChange)="value = $event">
        <ori-rich-radio
          value="standard"
          label="Livraison standard"
          description="3 à 5 jours ouvrés - gratuit"
        ></ori-rich-radio>
        <ori-rich-radio
          value="express"
          label="Livraison express"
          description="24h, +9 €"
        ></ori-rich-radio>
        <ori-rich-radio
          value="pickup"
          label="Retrait en agence"
          description="Disponible sous 1h dans 12 points de retrait"
        ></ori-rich-radio>
      </ori-rich-radio-group>
    `,
  }),
};

export const AvecIcones: Story = {
  name: 'Avec icônes',
  args: { label: 'Comment souhaitez-vous recevoir le document ?', value: 'postal' },
  render: (args: Args) => ({
    props: { ...args, TruckIcon: Truck, MailIcon: Mail, BuildingIcon: Building2 },
    template: `
      <ori-rich-radio-group [label]="label" [value]="value" (valueChange)="value = $event">
        <ori-rich-radio
          value="postal"
          label="Voie postale"
          description="Envoi à votre adresse de domicile"
        >
          <lucide-icon slot="trailing" [img]="TruckIcon" [size]="32" aria-hidden="true"></lucide-icon>
        </ori-rich-radio>
        <ori-rich-radio
          value="email"
          label="Email"
          description="PDF transmis sur votre messagerie sécurisée"
        >
          <lucide-icon slot="trailing" [img]="MailIcon" [size]="32" aria-hidden="true"></lucide-icon>
        </ori-rich-radio>
        <ori-rich-radio
          value="agence"
          label="Retrait en agence"
          description="Sur présentation d'une pièce d'identité"
        >
          <lucide-icon slot="trailing" [img]="BuildingIcon" [size]="32" aria-hidden="true"></lucide-icon>
        </ori-rich-radio>
      </ori-rich-radio-group>
    `,
  }),
};

export const Horizontal: Story = {
  name: 'Disposition horizontale',
  args: { label: 'Vous êtes...', orientation: 'horizontal', value: 'particulier' },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-rich-radio-group
        [label]="label"
        [orientation]="orientation"
        [value]="value"
        (valueChange)="value = $event"
      >
        <ori-rich-radio
          value="particulier"
          label="Un particulier"
          description="Démarches personnelles, état civil, fiscalité..."
        ></ori-rich-radio>
        <ori-rich-radio
          value="entreprise"
          label="Une entreprise"
          description="Création, immatriculation, déclarations..."
        ></ori-rich-radio>
      </ori-rich-radio-group>
    `,
  }),
};

export const AvecErreur: Story = {
  name: 'Avec erreur',
  args: {
    label: 'Type de demande',
    required: true,
    error: 'Veuillez sélectionner un type de demande pour continuer.',
  },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-rich-radio-group [label]="label" [required]="required" [error]="error">
        <ori-rich-radio
          value="creation"
          label="Création"
          description="Première demande"
        ></ori-rich-radio>
        <ori-rich-radio
          value="renouvellement"
          label="Renouvellement"
          description="Document expiré ou en fin de validité"
        ></ori-rich-radio>
        <ori-rich-radio
          value="duplicata"
          label="Duplicata"
          description="Perte ou vol du document précédent"
        ></ori-rich-radio>
      </ori-rich-radio-group>
    `,
  }),
};

export const Desactive: Story = {
  name: 'Désactivé',
  args: { label: 'Mode de livraison (figé)', disabled: true, value: 'standard' },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-rich-radio-group [label]="label" [disabled]="disabled" [value]="value">
        <ori-rich-radio
          value="standard"
          label="Standard"
          description="3 à 5 jours ouvrés"
        ></ori-rich-radio>
        <ori-rich-radio
          value="express"
          label="Express"
          description="24h, +9 €"
        ></ori-rich-radio>
      </ori-rich-radio-group>
    `,
  }),
};
