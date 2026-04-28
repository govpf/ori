import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Highlight } from './Highlight.js';
import { Input } from '../Input/index.js';

const meta = {
  title: 'Composants/Affichage/Highlight',
  component: Highlight,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Surlignage basé sur l'élément `<mark>` natif HTML5. Deux modes : direct (tout est surligné) ou via une query (seules les occurrences sont surlignées, utile pour des résultats de recherche).",
      },
    },
  },
} satisfies Meta<typeof Highlight>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Direct: Story = {
  render: () => (
    <p>
      Le mot <Highlight>important</Highlight> est mis en évidence dans cette phrase.
    </p>
  ),
};

export const WithQuery: Story = {
  render: () => (
    <p>
      <Highlight query="maritime">
        Direction des affaires maritimes - Service de la navigation maritime côtière
      </Highlight>
    </p>
  ),
};

export const SearchResults: Story = {
  render: () => {
    const [query, setQuery] = useState('permis');
    const results = [
      'Permis bateau côtier',
      'Demande de permis hauturier',
      "Renouvellement d'un permis fluvial",
      "Inscription d'un navire",
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480 }}>
        <Input
          label="Rechercher"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Saisir une recherche…"
        />
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {results.map((r) => (
            <li key={r}>
              <Highlight query={query}>{r}</Highlight>
            </li>
          ))}
        </ul>
      </div>
    );
  },
};
