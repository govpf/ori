import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriCheckboxComponent } from './checkbox.component';

const meta: Meta<OriCheckboxComponent> = {
  title: 'Primitives/Saisie/Checkbox',
  component: OriCheckboxComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Case à cocher binaire avec état indéterminé optionnel. Hérite des patterns ori-field (label, hint, error, ARIA).',
      },
    },
  },
  decorators: [moduleMetadata({ imports: [OriCheckboxComponent] })],
  argTypes: {
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    checked: { control: 'boolean' },
  },
  args: {
    label: "J'accepte les conditions générales",
    checked: false,
    disabled: false,
    indeterminate: false,
  },
  render: (args: Args) => ({
    props: args,
    template: `<ori-checkbox
      [label]="label"
      [hint]="hint"
      [error]="error"
      [checked]="checked"
      [indeterminate]="indeterminate"
      [disabled]="disabled"
    ></ori-checkbox>`,
  }),
};

export default meta;
type Story = StoryObj<OriCheckboxComponent>;

export const Default: Story = { name: 'Par défaut' };

export const Checked: Story = { args: { checked: true } };

export const WithHint: Story = {
  name: 'Avec indication',
  args: {
    hint: 'Vous pouvez retirer votre consentement à tout moment depuis vos préférences.',
  },
};

export const WithError: Story = {
  name: 'Avec erreur',
  args: { error: 'Vous devez accepter les conditions pour continuer.' },
};

export const Indeterminate: Story = {
  name: 'Indéterminé',
  args: { indeterminate: true, label: 'Sélectionner toutes les lignes' },
};

export const Disabled: Story = {
  name: 'Désactivé',
  args: { disabled: true, checked: true, label: 'Option verrouillée' },
};

export const Group: Story = {
  name: 'Groupe',
  render: () => ({
    template: `
      <fieldset class="ori-choice-group" style="border: 0; padding: 0; margin: 0;">
        <legend class="ori-field__label">Notifications par email</legend>
        <ori-checkbox [checked]="true" label="Rappels de rendez-vous"></ori-checkbox>
        <ori-checkbox label="Lettre d'information mensuelle"></ori-checkbox>
        <ori-checkbox label="Mises à jour produit"></ori-checkbox>
      </fieldset>
    `,
  }),
};
