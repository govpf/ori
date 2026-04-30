import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriProgressComponent } from './progress.component';

const meta: Meta<OriProgressComponent> = {
  title: 'Primitives/Feedback/Progress',
  component: OriProgressComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: "Barre de progression basée sur l'élément `<progress>` natif HTML.",
      },
    },
  },
  decorators: [
    moduleMetadata({ imports: [OriProgressComponent] }),
    (storyFn) => {
      const story = storyFn();
      return { ...story, template: `<div style="width: 360px;">${story.template}</div>` };
    },
  ],
  args: { value: 60, max: 100 },
  render: (args: Args) => ({
    props: args,
    template: `<ori-progress [value]="value" [max]="max" [label]="label || ''"></ori-progress>`,
  }),
};

export default meta;
type Story = StoryObj<OriProgressComponent>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: { value: 35, label: 'Téléversement en cours' },
};

export const Indeterminate: Story = {
  args: { value: null, label: 'Traitement en cours' },
};
