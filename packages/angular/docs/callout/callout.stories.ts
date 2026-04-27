import type { Meta, StoryObj, Args } from '@storybook/angular';
import { OriCalloutComponent } from './callout.component';

type CalloutStoryArgs = OriCalloutComponent & { content: string };

const meta: Meta<CalloutStoryArgs> = {
  title: 'Publishing/Documentation/Callout',
  component: OriCalloutComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Bloc éditorial pour mettre en avant une information dans la doc. 4 variantes : note, tip, warning, danger.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['note', 'tip', 'warning', 'danger'] },
    title: { control: 'text' },
    content: { control: 'text', description: 'Contenu projeté via ng-content.' },
  },
  args: {
    variant: 'note',
    title: 'À noter',
    content:
      'Cette page documente les choix structurants faits lors de la création du design system.',
  },
  render: (args: Args) => ({
    props: args,
    template: `<ori-callout [variant]="variant" [title]="title">{{ content }}</ori-callout>`,
  }),
};

export default meta;
type Story = StoryObj<CalloutStoryArgs>;

export const Note: Story = {};
export const Tip: Story = {
  args: { variant: 'tip', title: 'Astuce', content: 'Préférer la composition à la configuration.' },
};
export const Warning: Story = {
  args: { variant: 'warning', title: 'Attention', content: 'Cette API est dépréciée.' },
};
export const Danger: Story = {
  args: {
    variant: 'danger',
    title: 'À ne pas faire',
    content: 'Ne jamais désactiver la sandbox des iframes.',
  },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <ori-callout variant="note" title="Note">Information neutre.</ori-callout>
        <ori-callout variant="tip" title="Astuce">Conseil pratique.</ori-callout>
        <ori-callout variant="warning" title="Attention">Point de vigilance.</ori-callout>
        <ori-callout variant="danger" title="Danger">À éviter absolument.</ori-callout>
      </div>
    `,
  }),
};
