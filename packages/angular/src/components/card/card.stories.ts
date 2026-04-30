import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {
  OriCardComponent,
  OriCardHeaderComponent,
  OriCardBodyComponent,
  OriCardFooterComponent,
} from './card.component';
import { OriButtonComponent } from '../button/button.component';

const meta: Meta<OriCardComponent> = {
  title: 'Primitives/Affichage/Card',
  component: OriCardComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Conteneur d'aperçu structuré (header, body, footer). 3 variantes : default, elevated, flat. [→ Description complète & bonnes pratiques](?path=/docs/documentation-générale-composants-graphiques-card--docs)",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        OriCardComponent,
        OriCardHeaderComponent,
        OriCardBodyComponent,
        OriCardFooterComponent,
        OriButtonComponent,
      ],
    }),
    (storyFn) => {
      const story = storyFn();
      return { ...story, template: `<div style="width: 420px;">${story.template}</div>` };
    },
  ],
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'elevated', 'flat'] },
  },
  args: { variant: 'default' },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-card [variant]="variant">
        <ori-card-header title="Titre de la card" subtitle="Un sous-titre descriptif"></ori-card-header>
        <ori-card-body>
          <p style="margin: 0">
            Contenu principal de la carte. Les régions sont des sous-composants
            <code>pf-card-header</code>, <code>pf-card-body</code>, <code>pf-card-footer</code>.
          </p>
        </ori-card-body>
        <ori-card-footer>
          <ori-button variant="secondary" size="sm">Annuler</ori-button>
          <ori-button size="sm">Valider</ori-button>
        </ori-card-footer>
      </ori-card>
    `,
  }),
};

export default meta;
type Story = StoryObj<OriCardComponent>;

export const Default: Story = { name: 'Par défaut' };
export const Elevated: Story = { args: { variant: 'elevated' } };
export const Flat: Story = { args: { variant: 'flat' } };

export const BodyOnly: Story = {
  render: () => ({
    template: `
      <ori-card>
        <ori-card-body>Une carte minimale sans header ni footer.</ori-card-body>
      </ori-card>
    `,
  }),
};
