import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriSwitchComponent } from './switch.component';

const meta: Meta<OriSwitchComponent> = {
  title: 'Primitives/Saisie/Switch',
  component: OriSwitchComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Bascule on/off pour un réglage qui s'applique immédiatement (préférences, mode sombre, notifications…). Pour un choix qui doit être validé en soumettant un formulaire, préférer `<ori-checkbox>`.",
      },
    },
  },
  decorators: [moduleMetadata({ imports: [OriSwitchComponent] })],
  argTypes: {
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
  },
  args: {
    label: 'Recevoir les notifications par email',
    checked: false,
    disabled: false,
  },
  render: (args: Args) => ({
    props: args,
    template: `<ori-switch
      [label]="label"
      [hint]="hint"
      [checked]="checked"
      [disabled]="disabled"
      (checkedChange)="checked = $event"
    ></ori-switch>`,
  }),
};

export default meta;
type Story = StoryObj<OriSwitchComponent>;

export const Default: Story = {};

export const On: Story = { args: { checked: true } };

export const WithHint: Story = {
  args: {
    hint: "L'envoi est immédiat dès activation.",
    checked: true,
  },
};

export const Disabled: Story = {
  args: { disabled: true, checked: true, label: 'Réglage verrouillé' },
};

export const Group: Story = {
  render: () => ({
    template: `
      <fieldset class="ori-choice-group" style="border: 0; padding: 0; margin: 0;">
        <legend class="ori-field__label">Préférences de confidentialité</legend>
        <ori-switch [checked]="true" label="Partager mes statistiques d'utilisation"></ori-switch>
        <ori-switch label="Recevoir des recommandations personnalisées"></ori-switch>
        <ori-switch [checked]="true" label="Activer la sauvegarde automatique"></ori-switch>
      </fieldset>
    `,
  }),
};
