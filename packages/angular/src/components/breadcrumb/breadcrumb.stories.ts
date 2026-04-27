import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriBreadcrumbComponent } from './breadcrumb.component';

const meta: Meta<OriBreadcrumbComponent> = {
  title: 'Composants graphiques/Breadcrumb',
  component: OriBreadcrumbComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Fil d\'Ariane sémantique : `<nav aria-label>` + `<ol>` + `aria-current="page"` sur l\'item courant.',
      },
    },
  },
  decorators: [moduleMetadata({ imports: [OriBreadcrumbComponent] })],
  render: (args: Args) => ({
    props: args,
    template: `<ori-breadcrumb [items]="items" [separator]="separator || ''"></ori-breadcrumb>`,
  }),
};

export default meta;
type Story = StoryObj<OriBreadcrumbComponent>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Accueil', href: '/' },
      { label: 'Mes démarches', href: '/demarches' },
      { label: 'Demande de licence' },
    ],
  },
};

export const Long: Story = {
  args: {
    items: [
      { label: 'Accueil', href: '/' },
      { label: 'Services', href: '/services' },
      { label: 'Affaires maritimes', href: '/services/maritime' },
      { label: 'Permis bateau', href: '/services/maritime/permis' },
      { label: 'Demande en cours' },
    ],
  },
};

export const CustomSeparator: Story = {
  args: {
    separator: '/',
    items: [
      { label: 'Accueil', href: '/' },
      { label: 'Profil', href: '/profil' },
      { label: 'Modifier' },
    ],
  },
};
