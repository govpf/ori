import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriDatePickerComponent } from './date-picker.component';

const meta: Meta<OriDatePickerComponent> = {
  title: 'Composants graphiques/DatePicker',
  component: OriDatePickerComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Sélecteur de date basé sur `<input type="date">` natif. Format d\'affichage selon la locale du navigateur, valeur stockée au format ISO `yyyy-mm-dd`.',
      },
    },
  },
  decorators: [
    moduleMetadata({ imports: [OriDatePickerComponent] }),
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
    label: 'Date de naissance',
    size: 'md',
  },
  render: (args: Args) => ({
    props: args,
    template: `<ori-date-picker
      [label]="label"
      [hint]="hint"
      [error]="error"
      [size]="size"
      [value]="value"
      [min]="min"
      [max]="max"
      [required]="required"
      [disabled]="disabled"
      (valueChange)="value = $event"
    ></ori-date-picker>`,
  }),
};

export default meta;
type Story = StoryObj<OriDatePickerComponent>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: "Telle qu'elle figure sur votre pièce d'identité." },
};

export const WithDefaultValue: Story = {
  args: { value: '1985-06-15' },
};

export const WithBounds: Story = {
  args: {
    label: 'Date de la demande',
    hint: "Doit être comprise entre aujourd'hui et dans 6 mois.",
    min: '2026-04-25',
    max: '2026-10-25',
  },
};

export const Required: Story = { args: { required: true } };

export const WithError: Story = {
  args: {
    error: "Cette date doit être antérieure à aujourd'hui.",
    value: '2030-01-01',
  },
};

export const Disabled: Story = {
  args: { disabled: true, value: '2026-04-25' },
};
