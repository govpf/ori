import type { Meta, StoryObj } from '@storybook/react';
import { Toc } from './Toc.js';

const meta = {
  title: 'Patterns/Documentation/Toc',
  component: Toc,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Table des matières latérale avec scroll-spy. Les `headings` sont en général fournis par le compilateur MDX du framework (Astro, Next.js, Docusaurus, etc.).',
      },
    },
  },
  args: {
    headings: [
      { depth: 2, slug: 'pourquoi-ori', text: 'Pourquoi Ori' },
      { depth: 2, slug: 'fondations', text: 'Fondations' },
      { depth: 3, slug: 'palette', text: 'Palette' },
      { depth: 3, slug: 'typographie', text: 'Typographie' },
      { depth: 2, slug: 'composants', text: 'Composants' },
      { depth: 2, slug: 'integration', text: 'Intégration' },
    ],
    title: 'Sur cette page',
  },
} satisfies Meta<typeof Toc>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '14rem' }}>
        <Story />
      </div>
    ),
  ],
};

export const NoSubLevels: Story = {
  args: { depths: [2] },
  decorators: [
    (Story) => (
      <div style={{ width: '14rem' }}>
        <Story />
      </div>
    ),
  ],
};

export const Empty: Story = {
  args: { headings: [] },
};
