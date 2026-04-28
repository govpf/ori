import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriTagComponent } from './tag.component';

const meta: Meta<OriTagComponent> = {
  title: 'Composants/Affichage/Tag',
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

export const Default: Story = {};

export const Variants: Story = {
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
};
