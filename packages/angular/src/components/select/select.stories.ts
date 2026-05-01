import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriSelectComponent } from './select.component';

const meta: Meta<OriSelectComponent> = {
  title: 'Primitives/Saisie/Select',
  component: OriSelectComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Liste déroulante simple basée sur `<select>` natif. Conçu pour l'a11y native, l'UX mobile (picker système) et un bundle minimal.",
      },
    },
  },
  decorators: [
    moduleMetadata({ imports: [OriSelectComponent] }),
    (storyFn) => {
      const story = storyFn();
      return { ...story, template: `<div style="width: 320px;">${story.template}</div>` };
    },
  ],
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
  render: (args: Args) => ({
    props: args,
    template: `<ori-select
      [label]="label"
      [hint]="hint"
      [error]="error"
      [placeholder]="placeholder"
      [size]="size"
      [options]="options"
      [required]="required"
      [disabled]="disabled"
      [value]="value"
      (valueChange)="value = $event"
    ></ori-select>`,
  }),
};

export default meta;
type Story = StoryObj<OriSelectComponent>;

export const Default: Story = { name: 'Par défaut' };

export const WithHint: Story = {
  name: 'Avec indication',
  args: { hint: "Telle que figurant sur votre pièce d'identité." },
};

export const Required: Story = { args: { required: true } };

export const WithError: Story = {
  name: 'Avec erreur',
  args: { error: 'Ce champ est obligatoire.', required: true },
};

export const Disabled: Story = {
  name: 'Désactivé',
  args: { disabled: true, value: 'mme' },
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
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <ori-select
          label="Petit"
          size="sm"
          [options]="[{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]"
        ></ori-select>
        <ori-select
          label="Moyen"
          size="md"
          [options]="[{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]"
        ></ori-select>
        <ori-select
          label="Grand"
          size="lg"
          [options]="[{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]"
        ></ori-select>
      </div>
    `,
  }),
  // Tag `skip-visual` : les options Angular utilisent des libellés
  // inline « Option A / Option B », alors que la version React fait
  // hériter les options du meta (« Madame / Monsieur / Autre ») -
  // divergence pédagogique volontaire.
  tags: ['skip-visual'],
};
