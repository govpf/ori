import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriTooltipDirective } from './tooltip.directive';
import { OriButtonComponent } from '../button/button.component';

const meta: Meta = {
  title: 'Primitives/Feedback/Tooltip',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Tooltip minimaliste appliqué via la directive `[oriTooltip]`. Apparition au hover + focus, disparition au mouseleave + blur + Escape. Délai par défaut 700ms.',
      },
    },
  },
  decorators: [
    moduleMetadata({ imports: [OriTooltipDirective, OriButtonComponent] }),
    (storyFn) => {
      const story = storyFn();
      return {
        ...story,
        template: `<div style="padding: 80px; display: flex; justify-content: center;">${story.template}</div>`,
      };
    },
  ],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: 'Par défaut',
  render: () => ({
    template: `<ori-button variant="danger" pfTooltip="Action de suppression définitive">Supprimer</ori-button>`,
  }),
};

export const Sides: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap; justify-content: center;">
        <ori-button variant="secondary" pfTooltip="Tooltip en haut" oriTooltipSide="top">Top</ori-button>
        <ori-button variant="secondary" pfTooltip="Tooltip à droite" oriTooltipSide="right">Right</ori-button>
        <ori-button variant="secondary" pfTooltip="Tooltip en bas" oriTooltipSide="bottom">Bottom</ori-button>
        <ori-button variant="secondary" pfTooltip="Tooltip à gauche" oriTooltipSide="left">Left</ori-button>
      </div>
    `,
  }),
};

export const FastDelay: Story = {
  render: () => ({
    template: `<ori-button pfTooltip="Apparition rapide" [oriTooltipDelay]="100">Survoler</ori-button>`,
  }),
};
