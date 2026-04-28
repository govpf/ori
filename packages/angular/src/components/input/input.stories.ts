import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriInputComponent } from './input.component';

const meta: Meta<OriInputComponent> = {
  title: 'Composants/Saisie/Input',
  component: OriInputComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Champ de saisie textuelle. Gère label, hint, error, 3 tailles, ARIA. [→ Description complète & bonnes pratiques](?path=/docs/documentation-générale-composants-graphiques-input--docs)',
      },
    },
  },
  decorators: [
    moduleMetadata({ imports: [OriInputComponent] }),
    (storyFn) => {
      const story = storyFn();
      return { ...story, template: `<div style="width: 320px;">${story.template}</div>` };
    },
  ],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    type: { control: 'select', options: ['text', 'email', 'password', 'number'] },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Nom',
    placeholder: 'Entrez votre nom',
    size: 'md',
    type: 'text',
  },
  render: (args: Args) => ({
    props: args,
    template: `<ori-input
      [label]="label"
      [hint]="hint"
      [error]="error"
      [placeholder]="placeholder"
      [type]="type"
      [size]="size"
      [required]="required"
      [disabled]="disabled"
      [value]="value"
    ></ori-input>`,
  }),
};

export default meta;
type Story = StoryObj<OriInputComponent>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: "Tel qu'il apparaît sur votre pièce d'identité." },
};

export const Required: Story = { args: { required: true } };

export const WithError: Story = {
  args: { value: '', error: 'Ce champ est obligatoire.', required: true },
};

export const Disabled: Story = {
  args: { disabled: true, value: 'Valeur verrouillée' },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <ori-input label="Petit" size="sm" placeholder="size=sm"></ori-input>
        <ori-input label="Moyen" size="md" placeholder="size=md"></ori-input>
        <ori-input label="Grand" size="lg" placeholder="size=lg"></ori-input>
      </div>
    `,
  }),
};
