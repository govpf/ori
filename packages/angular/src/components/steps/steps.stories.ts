import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriStepsComponent } from './steps.component';

const meta: Meta<OriStepsComponent> = {
  title: 'Primitives/Navigation/Steps',
  component: OriStepsComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Indicateur de progression d\'un workflow. Read-only par défaut ; opt-in `[clickable]="true"` pour permettre le retour aux étapes complétées.',
      },
    },
  },
  decorators: [
    moduleMetadata({ imports: [OriStepsComponent] }),
    (storyFn) => {
      const story = storyFn();
      return { ...story, template: `<div style="width: 720px;">${story.template}</div>` };
    },
  ],
  render: (args: Args) => ({
    props: args,
    template: `<ori-steps
      [steps]="steps"
      [current]="current"
      [clickable]="clickable || false"
      (stepClick)="current = $event"
    ></ori-steps>`,
  }),
};

export default meta;
type Story = StoryObj<OriStepsComponent>;

const steps = [
  { title: 'Identité', description: 'Vos informations' },
  { title: 'Adresse', description: 'Justificatif de domicile' },
  { title: 'Pièces', description: 'Documents requis' },
  { title: 'Validation', description: 'Récapitulatif' },
];

export const Default: Story = { args: { steps, current: 1 } };

export const FirstStep: Story = { args: { steps, current: 0 } };

export const LastStep: Story = { args: { steps, current: 3 } };

export const Clickable: Story = {
  args: { steps, current: 2, clickable: true },
};

export const SimpleTitlesOnly: Story = {
  args: {
    current: 1,
    steps: [{ title: 'Étape 1' }, { title: 'Étape 2' }, { title: 'Étape 3' }],
  },
};
