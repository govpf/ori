import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { LucideAngularModule, Package, Code2, Shield, Moon } from 'lucide-angular';
import { OriFeatureGridComponent } from './feature-grid.component';
import { OriFeatureCardComponent } from './feature-card.component';

const meta: Meta<OriFeatureGridComponent> = {
  title: 'Publishing/Marketing/FeatureGrid',
  component: OriFeatureGridComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Grille auto-fit de cartes de fonctionnalité. Chaque carte (`<ori-feature-card>`) accepte un titre, une description et une icône projetée via `[oriFeatureIcon]`.',
      },
    },
  },
  decorators: [moduleMetadata({ imports: [OriFeatureCardComponent, LucideAngularModule] })],
};

export default meta;
type Story = StoryObj<OriFeatureGridComponent>;

export const Default: Story = {
  render: () => ({
    props: { PackageIcon: Package, CodeIcon: Code2, ShieldIcon: Shield, MoonIcon: Moon },
    template: `
      <ori-feature-grid>
        <ori-feature-card title="Bundle minimal" description="Les classes utilitaires Tailwind ne sont conservées que si elles sont utilisées.">
          <lucide-icon oriFeatureIcon [img]="PackageIcon" [size]="20"></lucide-icon>
        </ori-feature-card>
        <ori-feature-card title="Cross-framework" description="Une modification de design est répliquée à l'identique sur React et Angular.">
          <lucide-icon oriFeatureIcon [img]="CodeIcon" [size]="20"></lucide-icon>
        </ori-feature-card>
        <ori-feature-card title="RGAA niveau AA" description="Tous les composants sont conformes au Référentiel d'Amélioration de l'Accessibilité.">
          <lucide-icon oriFeatureIcon [img]="ShieldIcon" [size]="20"></lucide-icon>
        </ori-feature-card>
        <ori-feature-card title="Mode sombre natif" description="Tous les tokens disposent d'une variante dark via data-theme=dark.">
          <lucide-icon oriFeatureIcon [img]="MoonIcon" [size]="20"></lucide-icon>
        </ori-feature-card>
      </ori-feature-grid>
    `,
  }),
};
