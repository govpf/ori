import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriTagComponent } from './tag.component';

const meta: Meta<OriTagComponent> = {
  title: 'Primitives/Affichage/Tag',
  component: OriTagComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Badge de statut, catégorie ou filtre actif. 5 variantes sémantiques. Optionnellement supprimable.',
      },
    },
  },
  decorators: [moduleMetadata({ imports: [OriTagComponent] })],
  argTypes: {
    variant: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger'] },
    removable: { control: 'boolean' },
  },
  args: { variant: 'neutral' },
  render: (args: Args) => ({
    props: args,
    template: `<ori-tag [variant]="variant" [removable]="removable || false">En cours</ori-tag>`,
  }),
};

export default meta;
type Story = StoryObj<OriTagComponent>;

export const Default: Story = { name: 'Par défaut' };

export const Variants: Story = {
  name: 'Variantes',
  render: () => ({
    template: `
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <ori-tag variant="neutral">Brouillon</ori-tag>
        <ori-tag variant="info">En cours</ori-tag>
        <ori-tag variant="success">Validé</ori-tag>
        <ori-tag variant="warning">À compléter</ori-tag>
        <ori-tag variant="danger">Refusé</ori-tag>
      </div>
    `,
  }),
};

export const Removable: Story = {
  args: { removable: true },
  // Tag `skip-visual` : la story Angular n'affiche qu'un seul tag
  // « En cours » avec le flag `removable` ; la version React liste 4 tags
  // (`Maritime`, `Pêche`, `Transport`, `Plaisance`) avec gestion d'état
  // `onRemove`.
  tags: ['skip-visual'],
};
