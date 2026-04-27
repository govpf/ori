import type { Meta, StoryObj } from '@storybook/react';
import { Logo } from './Logo.js';

const meta = {
  title: 'Composants graphiques/Logo',
  component: Logo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Logo institutionnel : écusson PF officiel + titre/sous-titre. SVG inline, fonctionne dès le SSR. Cf. décision J.4 : asset embarqué dans le DS pour garantir la cohérence et permettre les mises à jour centralisées.',
      },
    },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSubtitle: Story = {
  args: {
    title: 'Polynésie française',
    subtitle: 'Direction des affaires maritimes',
  },
};

export const AsLink: Story = {
  args: {
    href: '/',
    title: 'Polynésie française',
    subtitle: 'Service en ligne',
  },
};

export const TitleOnly: Story = {
  args: { hideCrest: true, title: 'Polynésie française', subtitle: 'Service en ligne' },
};
