import type { Meta, StoryObj, Args } from '@storybook/angular';
import { OriTocComponent, type OriTocItem } from './toc.component';

const SAMPLE_HEADINGS: OriTocItem[] = [
  { depth: 2, slug: 'pourquoi-ori', text: 'Pourquoi Ori' },
  { depth: 2, slug: 'fondations', text: 'Fondations' },
  { depth: 3, slug: 'palette', text: 'Palette' },
  { depth: 3, slug: 'typographie', text: 'Typographie' },
  { depth: 2, slug: 'composants', text: 'Composants' },
  { depth: 2, slug: 'integration', text: 'Intégration' },
];

const meta: Meta<OriTocComponent> = {
  title: 'Patterns/Documentation/Toc',
  component: OriTocComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Table des matières latérale avec scroll-spy. Les `headings` sont en général fournis par le compilateur MDX du framework.',
      },
    },
  },
  args: {
    headings: SAMPLE_HEADINGS,
    title: 'Sur cette page',
    depths: [2, 3],
  },
  render: (args: Args) => ({
    props: args,
    template: `<div style="width: 14rem;"><ori-toc [headings]="headings" [title]="title" [depths]="depths"></ori-toc></div>`,
  }),
};

export default meta;
type Story = StoryObj<OriTocComponent>;

export const Default: Story = {};

export const NoSubLevels: Story = {
  args: { depths: [2] },
};

export const Empty: Story = {
  args: { headings: [] },
  // Tag `skip-visual` : la story ne rend rien (pas de heading), donc le
  // `#storybook-root` reste hidden et le test de parité visuelle plante
  // sur le timeout du `waitForSelector`. Pas pertinent à comparer puisque
  // par construction il n'y a rien à voir.
  tags: ['skip-visual'],
};
