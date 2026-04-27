import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriHighlightComponent } from './highlight.component';
import { OriInputComponent } from '../input/input.component';

const meta: Meta<OriHighlightComponent> = {
  title: 'Composants graphiques/Highlight',
  component: OriHighlightComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Surlignage basé sur l'élément `<mark>` natif HTML5. Mode direct (tout est surligné) ou avec `query` (seules les occurrences sont surlignées).",
      },
    },
  },
  decorators: [moduleMetadata({ imports: [OriHighlightComponent, OriInputComponent] })],
};

export default meta;
type Story = StoryObj<OriHighlightComponent>;

export const Direct: Story = {
  args: { text: 'important' },
  render: ({ text }) => ({
    props: { text },
    template: `<p>Le mot <ori-highlight [text]="text"></ori-highlight> est mis en évidence.</p>`,
  }),
};

export const WithQuery: Story = {
  args: {
    text: 'Direction des affaires maritimes - Service de la navigation maritime côtière',
    query: 'maritime',
  },
  render: ({ text, query }) => ({
    props: { text, query },
    template: `<p><ori-highlight [text]="text" [query]="query"></ori-highlight></p>`,
  }),
};

export const SearchResults: Story = {
  render: () => ({
    props: {
      query: 'permis',
      results: [
        'Permis bateau côtier',
        'Demande de permis hauturier',
        "Renouvellement d'un permis fluvial",
        "Inscription d'un navire",
      ],
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 480px;">
        <ori-input label="Rechercher" [value]="query" (valueChange)="query = $event" placeholder="Saisir une recherche…"></ori-input>
        <ul style="margin: 0; padding-left: 20px;">
          @for (r of results; track r) {
            <li><ori-highlight [text]="r" [query]="query"></ori-highlight></li>
          }
        </ul>
      </div>
    `,
  }),
};
