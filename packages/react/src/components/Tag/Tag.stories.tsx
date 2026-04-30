import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tag } from './Tag.js';

const meta = {
  title: 'Primitives/Affichage/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Badge de statut, catégorie ou filtre actif. 5 variantes sémantiques. Optionnellement supprimable.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger'] },
  },
  args: {
    variant: 'neutral',
    children: 'En cours',
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: 'Par défaut' };

export const Variants: Story = {
  name: 'Variantes',
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Tag variant="neutral">Brouillon</Tag>
      <Tag variant="info">En cours</Tag>
      <Tag variant="success">Validé</Tag>
      <Tag variant="warning">À compléter</Tag>
      <Tag variant="danger">Refusé</Tag>
    </div>
  ),
};

export const Removable: Story = {
  render: () => {
    const [tags, setTags] = useState(['Maritime', 'Pêche', 'Transport', 'Plaisance']);
    return (
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {tags.map((t) => (
          <Tag
            key={t}
            variant="info"
            onRemove={() => setTags(tags.filter((x) => x !== t))}
            removeLabel={`Retirer ${t}`}
          >
            {t}
          </Tag>
        ))}
        {tags.length === 0 && (
          <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
            Tous les filtres ont été retirés.
          </p>
        )}
      </div>
    );
  },
};
