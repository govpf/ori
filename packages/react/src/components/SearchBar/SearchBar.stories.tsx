import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SearchBar } from './SearchBar.js';

const meta = {
  title: 'Primitives/Saisie/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Champ de recherche autonome posé sur un `<form role="search">`. La touche Entrée et le bouton primaire déclenchent `onSearch(value)`. Mode contrôlé via `value`+`onChange` ou non contrôlé.',
      },
    },
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Par défaut',
  args: {
    placeholder: 'Rechercher une démarche...',
  },
};

export const AvecLibelle: Story = {
  name: 'Avec libellé visible',
  args: {
    label: 'Recherche dans le catalogue',
    hideLabel: false,
    placeholder: 'Mot-clé, référence, mots-clés...',
  },
};

export const IconeSeule: Story = {
  name: 'Bouton icône seule',
  args: {
    placeholder: 'Rechercher...',
    iconOnlyButton: true,
    buttonAriaLabel: 'Lancer la recherche',
  },
};

export const Petit: Story = {
  name: 'Taille réduite',
  args: {
    placeholder: 'Rechercher...',
    size: 'sm',
  },
};

export const Controle: Story = {
  name: 'Mode contrôlé',
  render: () => {
    const [value, setValue] = useState('');
    const [submitted, setSubmitted] = useState<string | null>(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
        <SearchBar
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onSearch={(v) => setSubmitted(v)}
          placeholder="Tapez puis appuyez sur Entrée..."
        />
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
          Saisie courante : <code>{value || '(vide)'}</code>
          {submitted !== null && (
            <>
              {' '}
              · Dernière soumission : <code>{submitted || '(vide)'}</code>
            </>
          )}
        </span>
      </div>
    );
  },
};

export const LibellesPersonnalises: Story = {
  name: 'Libellés personnalisés',
  args: {
    label: 'Trouver une démarche',
    hideLabel: false,
    buttonLabel: 'Lancer la recherche',
    placeholder: 'Carte grise, état civil...',
  },
};
