import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriSearchBarComponent } from './search-bar.component';

const meta: Meta<OriSearchBarComponent> = {
  title: 'Primitives/Saisie/SearchBar',
  component: OriSearchBarComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Champ de recherche autonome posé sur un `<form role="search">`. Émet `(search)` lorsque l\'utilisateur valide (Entrée ou clic sur le bouton).',
      },
    },
  },
  decorators: [moduleMetadata({ imports: [OriSearchBarComponent] })],
};

export default meta;
type Story = StoryObj<OriSearchBarComponent>;

export const Default: Story = {
  name: 'Par défaut',
  args: { placeholder: 'Rechercher une démarche...' },
  render: (args: Args) => ({
    props: args,
    template: `<ori-search-bar [placeholder]="placeholder"></ori-search-bar>`,
  }),
};

export const AvecLibelle: Story = {
  name: 'Avec libellé visible',
  args: {
    label: 'Recherche dans le catalogue',
    hideLabel: false,
    placeholder: 'Mot-clé, référence...',
  },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-search-bar [label]="label" [hideLabel]="hideLabel" [placeholder]="placeholder"></ori-search-bar>
    `,
  }),
};

export const IconeSeule: Story = {
  name: 'Bouton icône seule',
  args: {
    placeholder: 'Rechercher...',
    iconOnlyButton: true,
    buttonAriaLabel: 'Lancer la recherche',
  },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-search-bar
        [placeholder]="placeholder"
        [iconOnlyButton]="iconOnlyButton"
        [buttonAriaLabel]="buttonAriaLabel"
      ></ori-search-bar>
    `,
  }),
};

export const Petit: Story = {
  name: 'Taille réduite',
  args: { placeholder: 'Rechercher...', size: 'sm' },
  render: (args: Args) => ({
    props: args,
    template: `<ori-search-bar [placeholder]="placeholder" [size]="size"></ori-search-bar>`,
  }),
};

export const LibellesPersonnalises: Story = {
  name: 'Libellés personnalisés',
  args: {
    label: 'Trouver une démarche',
    hideLabel: false,
    buttonLabel: 'Lancer la recherche',
    placeholder: 'Carte grise, état civil...',
  },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-search-bar
        [label]="label"
        [hideLabel]="hideLabel"
        [buttonLabel]="buttonLabel"
        [placeholder]="placeholder"
      ></ori-search-bar>
    `,
  }),
};
