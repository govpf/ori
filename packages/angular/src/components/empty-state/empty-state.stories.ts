import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { LucideAngularModule, Inbox, Search, FilePlus, Users } from 'lucide-angular';
import { OriEmptyStateComponent } from './empty-state.component';
import { OriButtonComponent } from '../button/button.component';

const meta: Meta<OriEmptyStateComponent> = {
  title: 'Composants/Status/EmptyState',
  component: OriEmptyStateComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [OriEmptyStateComponent, OriButtonComponent, LucideAngularModule],
    }),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "Bloc d'absence de données : zone vide, recherche sans résultat, onboarding. Trois tailles (sm, md, lg) selon l'emprise visuelle souhaitée.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<OriEmptyStateComponent>;

export const Default: Story = {
  render: () => ({
    props: { Inbox },
    template: `
      <ori-empty-state
        title="Aucune demande en cours"
        description="Les demandes que vous déposerez apparaîtront ici. Vous pouvez en créer une dès maintenant."
      >
        <lucide-icon slot="icon" [img]="Inbox" [size]="48"></lucide-icon>
        <ori-button slot="actions">Nouvelle demande</ori-button>
      </ori-empty-state>
    `,
  }),
};

export const SearchNoResults: Story = {
  render: () => ({
    props: { Search },
    template: `
      <ori-empty-state
        size="sm"
        title="Aucun résultat"
        description="Aucun service administratif ne correspond à vos critères. Essayez d'élargir votre recherche."
      >
        <lucide-icon slot="icon" [img]="Search" [size]="32"></lucide-icon>
        <ori-button slot="actions" variant="secondary">Réinitialiser les filtres</ori-button>
      </ori-empty-state>
    `,
  }),
};

export const OnboardingLarge: Story = {
  render: () => ({
    props: { Users },
    template: `
      <ori-empty-state
        size="lg"
        title="Bienvenue dans votre espace"
        description="Vous n'avez pas encore d'agents associés à votre service. Importez la liste depuis l'annuaire ou créez les comptes manuellement."
      >
        <lucide-icon slot="icon" [img]="Users" [size]="64"></lucide-icon>
        <ng-container slot="actions">
          <ori-button>Importer depuis l'annuaire</ori-button>
          <ori-button variant="secondary">Créer un compte</ori-button>
        </ng-container>
      </ori-empty-state>
    `,
  }),
};

export const Minimal: Story = {
  render: () => ({
    props: { FilePlus },
    template: `
      <ori-empty-state title="Aucun document">
        <lucide-icon slot="icon" [img]="FilePlus" [size]="48"></lucide-icon>
        <ori-button slot="actions">Téléverser un document</ori-button>
      </ori-empty-state>
    `,
  }),
};

export const TextOnly: Story = {
  render: () => ({
    template: `
      <ori-empty-state
        title="Aucune notification"
        description="Vous serez prévenu ici de toute nouvelle activité concernant vos dossiers."
      ></ori-empty-state>
    `,
  }),
};
