import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriRadioComponent } from './radio.component';
import { OriRadioGroupComponent } from './radio-group.component';

const meta: Meta<OriRadioGroupComponent> = {
  title: 'Composants/Saisie/Radio',
  component: OriRadioGroupComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Choix exclusif au sein d'un groupe. Toujours utilisé via `<ori-radio-group>` (qui pose le `<fieldset>`/`<legend>`, gère la sélection et l'ARIA). Un `<ori-radio>` isolé n'est pas recommandé.",
      },
    },
  },
  decorators: [moduleMetadata({ imports: [OriRadioComponent, OriRadioGroupComponent] })],
};

export default meta;
type Story = StoryObj<OriRadioGroupComponent>;

export const Default: Story = {
  args: { label: 'Canal de notification préféré', value: 'email' },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-radio-group [label]="label" [value]="value" (valueChange)="value = $event">
        <ori-radio value="email" label="Par email"></ori-radio>
        <ori-radio value="sms" label="Par SMS"></ori-radio>
        <ori-radio value="none" label="Aucune notification"></ori-radio>
      </ori-radio-group>
    `,
  }),
};

export const WithHints: Story = {
  args: {
    label: 'Mode de livraison',
    hint: 'Le délai dépend de la disponibilité en stock.',
    value: 'standard',
  },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-radio-group [label]="label" [hint]="hint" [value]="value" (valueChange)="value = $event">
        <ori-radio value="standard" label="Standard" hint="3 à 5 jours ouvrés"></ori-radio>
        <ori-radio value="express" label="Express" hint="24h, +9 €"></ori-radio>
        <ori-radio value="pickup" label="Retrait en agence" hint="Disponible sous 1h"></ori-radio>
      </ori-radio-group>
    `,
  }),
};

export const Required: Story = {
  args: { label: 'Civilité', required: true },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-radio-group [label]="label" [required]="required" [value]="value" (valueChange)="value = $event">
        <ori-radio value="mme" label="Madame"></ori-radio>
        <ori-radio value="m" label="Monsieur"></ori-radio>
        <ori-radio value="autre" label="Autre"></ori-radio>
      </ori-radio-group>
    `,
  }),
};

export const WithError: Story = {
  args: {
    label: 'Civilité',
    required: true,
    error: 'Vous devez sélectionner une option.',
  },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-radio-group [label]="label" [required]="required" [error]="error">
        <ori-radio value="mme" label="Madame"></ori-radio>
        <ori-radio value="m" label="Monsieur"></ori-radio>
        <ori-radio value="autre" label="Autre"></ori-radio>
      </ori-radio-group>
    `,
  }),
};

export const Inline: Story = {
  args: { label: 'Êtes-vous résident polynésien ?', orientation: 'inline', value: 'oui' },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-radio-group
        [label]="label"
        [orientation]="orientation"
        [value]="value"
        (valueChange)="value = $event"
      >
        <ori-radio value="oui" label="Oui"></ori-radio>
        <ori-radio value="non" label="Non"></ori-radio>
      </ori-radio-group>
    `,
  }),
};

export const Disabled: Story = {
  args: { label: 'Mode de livraison', disabled: true, value: 'standard' },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-radio-group [label]="label" [disabled]="disabled" [value]="value">
        <ori-radio value="standard" label="Standard"></ori-radio>
        <ori-radio value="express" label="Express"></ori-radio>
      </ori-radio-group>
    `,
  }),
};
