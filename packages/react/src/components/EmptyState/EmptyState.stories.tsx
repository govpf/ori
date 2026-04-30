import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState.js';
import { Button } from '../Button/Button.js';
import { Inbox, Search, FilePlus, Users } from 'lucide-react';

const meta = {
  title: 'Compositions/État/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Cas standard : taille md, une action principale. */
export const Default: Story = {
  args: {
    icon: <Inbox size={48} />,
    title: 'Aucune demande en cours',
    description:
      'Les demandes que vous déposerez apparaîtront ici. Vous pouvez en créer une dès maintenant.',
    actions: <Button>Nouvelle demande</Button>,
  },
};

/** Filtre vide : taille sm, ton plus discret. */
export const SearchNoResults: Story = {
  args: {
    icon: <Search size={32} />,
    title: 'Aucun résultat',
    description:
      "Aucun service administratif ne correspond à vos critères. Essayez d'élargir votre recherche.",
    actions: <Button variant="secondary">Réinitialiser les filtres</Button>,
    size: 'sm',
  },
};

/** Onboarding : taille lg pour une page entière, deux actions. */
export const OnboardingLarge: Story = {
  args: {
    icon: <Users size={64} />,
    title: 'Bienvenue dans votre espace',
    description:
      "Vous n'avez pas encore d'agents associés à votre service. Importez la liste depuis l'annuaire ou créez les comptes manuellement.",
    actions: (
      <>
        <Button>Importer depuis l'annuaire</Button>
        <Button variant="secondary">Créer un compte</Button>
      </>
    ),
    size: 'lg',
  },
};

/** Sans description : titre seul + action. */
export const Minimal: Story = {
  args: {
    icon: <FilePlus size={48} />,
    title: 'Aucun document',
    actions: <Button>Téléverser un document</Button>,
  },
};

/** Sans icône ni action : juste le texte d'absence. */
export const TextOnly: Story = {
  args: {
    title: 'Aucune notification',
    description: 'Vous serez prévenu ici de toute nouvelle activité concernant vos dossiers.',
  },
};
