import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriCardComponent, OriCardBodyComponent } from '../card/card.component';
import { OriStatisticComponent } from './statistic.component';

const meta: Meta<OriStatisticComponent> = {
  title: 'Primitives/Affichage/Statistic',
  component: OriStatisticComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Affiche une métrique chiffrée (KPI) : valeur principale, libellé court, tendance optionnelle. Pas de conteneur intégré : l'app choisit (Card, plain div, etc.). [→ Description complète & bonnes pratiques](?path=/docs/documentation-générale-composants-graphiques-statistic--docs)",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [OriStatisticComponent, OriCardComponent, OriCardBodyComponent],
    }),
  ],
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'lg', 'inline'] },
    loading: { control: 'boolean' },
  },
  args: {
    label: 'Démarches en cours',
    value: 12,
    variant: 'default',
    loading: false,
  },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-statistic
        [label]="label"
        [value]="value"
        [variant]="variant || 'default'"
        [loading]="loading || false"
        [prefix]="prefix"
        [suffix]="suffix"
        [trend]="trend"
      ></ori-statistic>
    `,
  }),
};

export default meta;
type Story = StoryObj<OriStatisticComponent>;

export const Default: Story = { name: 'Par défaut' };

export const AvecTendance: Story = {
  name: 'Avec tendance',
  args: {
    label: 'Démarches en cours',
    value: 24,
    trend: { direction: 'up', label: '+3 cette semaine' },
  },
};

export const TendanceNegative: Story = {
  name: 'Tendance négative',
  args: {
    label: 'Délai moyen de traitement',
    value: 8,
    suffix: 'j',
    trend: { direction: 'down', label: '-1,2 j vs M-1', positive: 'down' },
  },
};

export const AvecSuffixe: Story = {
  name: 'Avec suffixe',
  args: {
    label: 'Taux de complétude',
    value: 87,
    suffix: '%',
    trend: { direction: 'up', label: '+4 pts' },
  },
};

export const VariantLarge: Story = {
  name: 'Variante large',
  args: {
    label: 'Démarches en cours',
    value: 24,
    variant: 'lg',
    trend: { direction: 'up', label: '+3 cette semaine' },
  },
};

export const VariantInline: Story = {
  name: 'Variante en ligne',
  args: {
    label: 'Total des demandes',
    value: 154,
    variant: 'inline',
  },
};

export const Loading: Story = {
  name: 'Chargement',
  args: { loading: true },
  // Tag `skip-visual` : la story Angular hérite des args par défaut du
  // meta (« Démarches en cours » + 12), alors que la version React
  // surcharge `label` et `value` (« Calcul en cours… » + 0) -
  // divergence de contenu volontaire.
  tags: ['skip-visual'],
};

export const DansUneCard: Story = {
  name: 'Dans une carte',
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 720px;">
        <ori-card>
          <ori-card-body>
            <ori-statistic
              label="Démarches en cours"
              [value]="2"
              [trend]="{ direction: 'up', label: '+1 cette semaine' }"
            ></ori-statistic>
          </ori-card-body>
        </ori-card>
        <ori-card>
          <ori-card-body>
            <ori-statistic label="À compléter" [value]="1"></ori-statistic>
          </ori-card-body>
        </ori-card>
        <ori-card>
          <ori-card-body>
            <ori-statistic label="Validées" [value]="2"></ori-statistic>
          </ori-card-body>
        </ori-card>
      </div>
    `,
  }),
};

export const Inline: Story = {
  name: 'En ligne',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px; max-width: 320px;">
        <ori-statistic variant="inline" label="Démarches en cours" [value]="2"></ori-statistic>
        <ori-statistic variant="inline" label="À compléter" [value]="1"></ori-statistic>
        <ori-statistic variant="inline" label="Validées" [value]="2"></ori-statistic>
        <ori-statistic variant="inline" label="Refusées" [value]="0"></ori-statistic>
      </div>
    `,
  }),
};
