import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriTextareaComponent } from './textarea.component';

const meta: Meta<OriTextareaComponent> = {
  title: 'Composants graphiques/Textarea',
  component: OriTextareaComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Champ de saisie multi-lignes. Mêmes patterns que Input (label, hint, error, ARIA) avec `rows` configurable et resize vertical par défaut.',
      },
    },
  },
  decorators: [
    moduleMetadata({ imports: [OriTextareaComponent] }),
    (storyFn) => {
      const story = storyFn();
      return { ...story, template: `<div style="width: 480px;">${story.template}</div>` };
    },
  ],
  argTypes: {
    rows: { control: { type: 'number', min: 1, max: 20 } },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Description',
    placeholder: 'Décrivez votre demande en quelques lignes…',
    rows: 4,
  },
  render: (args: Args) => ({
    props: args,
    template: `<ori-textarea
      [label]="label"
      [hint]="hint"
      [error]="error"
      [placeholder]="placeholder"
      [rows]="rows"
      [required]="required"
      [disabled]="disabled"
      [value]="value"
      (valueChange)="value = $event"
    ></ori-textarea>`,
  }),
};

export default meta;
type Story = StoryObj<OriTextareaComponent>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: 'Maximum 500 caractères.' },
};

export const Required: Story = { args: { required: true } };

export const WithError: Story = {
  args: { value: '', error: 'La description est obligatoire.', required: true },
};

export const Disabled: Story = {
  args: { disabled: true, value: 'Texte verrouillé qui ne peut pas être modifié.' },
};
