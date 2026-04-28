import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriHeroComponent } from './hero.component';
import { OriButtonComponent } from '../../src/components/button/button.component';

const meta: Meta<OriHeroComponent> = {
  title: 'Patterns/Marketing/Hero',
  component: OriHeroComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "Bloc d'accroche pour landing page institutionnelle. Optionnel : eyebrow (catégorie), subtitle (sous-titre), actions projetées via ng-content.",
      },
    },
  },
  argTypes: {
    muted: { control: 'boolean' },
    eyebrow: { control: 'text' },
    subtitle: { control: 'text' },
  },
  args: {
    eyebrow: 'Démarches en ligne',
    title: 'Une expérience numérique cohérente pour les services publics',
    subtitle:
      "Ori fournit les tokens, composants et patterns pour bâtir des portails et espaces agents conformes aux standards d'accessibilité.",
    muted: false,
  },
  render: (args: Args) => ({
    props: args,
    template: `<ori-hero [title]="title" [eyebrow]="eyebrow" [subtitle]="subtitle" [muted]="muted"></ori-hero>`,
  }),
};

export default meta;
type Story = StoryObj<OriHeroComponent>;

export const Default: Story = {};

export const WithActions: Story = {
  decorators: [moduleMetadata({ imports: [OriButtonComponent] })],
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-hero [title]="title" [eyebrow]="eyebrow" [subtitle]="subtitle" [muted]="muted">
        <ori-button variant="primary">Commencer</ori-button>
        <ori-button variant="ghost">En savoir plus</ori-button>
      </ori-hero>
    `,
  }),
};

export const Muted: Story = {
  args: { muted: true },
};

export const TitleOnly: Story = {
  args: { eyebrow: undefined, subtitle: undefined },
};
