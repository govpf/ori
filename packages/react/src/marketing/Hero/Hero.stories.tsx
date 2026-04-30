import type { Meta, StoryObj } from '@storybook/react';
import { Hero } from './Hero.js';
import { Button } from '../../components/Button/Button.js';

const meta = {
  title: 'Patterns/Marketing/Hero',
  component: Hero,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "Bloc d'accroche pour landing page institutionnelle. Optionnel : eyebrow (catégorie), subtitle (sous-titre), actions (CTAs).",
      },
    },
  },
  argTypes: {
    muted: { control: 'boolean' },
  },
  args: {
    eyebrow: 'Démarches en ligne',
    title: 'Une expérience numérique cohérente pour les services publics',
    subtitle:
      "Ori fournit les tokens, composants et patterns pour bâtir des portails et espaces agents conformes aux standards d'accessibilité et à l'identité visuelle de la Polynésie française.",
    muted: false,
  },
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: 'Par défaut' };

export const WithActions: Story = {
  name: 'Avec actions',
  args: {
    actions: (
      <>
        <Button variant="primary">Commencer</Button>
        <Button variant="ghost">En savoir plus</Button>
      </>
    ),
  },
};

export const Muted: Story = {
  args: { muted: true },
};

export const TitleOnly: Story = {
  name: 'Titre seul',
  args: { eyebrow: undefined, subtitle: undefined },
};
