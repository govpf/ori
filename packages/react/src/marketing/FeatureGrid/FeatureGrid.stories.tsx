import type { Meta, StoryObj } from '@storybook/react';
import { Package, Code2, Shield, Moon } from 'lucide-react';
import { FeatureGrid } from './FeatureGrid.js';
import { FeatureCard } from './FeatureCard.js';

const meta = {
  title: 'Publishing/Marketing/FeatureGrid',
  component: FeatureGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "Grille auto-fit de cartes de fonctionnalité. Chaque carte (`FeatureCard`) accepte une icône, un titre et une description.",
      },
    },
  },
} satisfies Meta<typeof FeatureGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <FeatureGrid>
      <FeatureCard
        icon={<Package size={20} />}
        title="Bundle minimal"
        description="Les classes utilitaires Tailwind ne sont conservées que si elles sont utilisées."
      />
      <FeatureCard
        icon={<Code2 size={20} />}
        title="Cross-framework"
        description="Une modification de design est répliquée à l'identique sur React et Angular."
      />
      <FeatureCard
        icon={<Shield size={20} />}
        title="RGAA niveau AA"
        description="Tous les composants sont conformes au Référentiel Général d'Amélioration de l'Accessibilité."
      />
      <FeatureCard
        icon={<Moon size={20} />}
        title="Mode sombre natif"
        description={'Tous les tokens disposent d\'une variante dark via data-theme="dark".'}
      />
    </FeatureGrid>
  ),
};

export const SingleCard: Story = {
  render: () => (
    <FeatureGrid>
      <FeatureCard
        title="Carte sans icône"
        description="Quand l'icône n'apporte rien, on peut l'omettre."
      />
    </FeatureGrid>
  ),
};
