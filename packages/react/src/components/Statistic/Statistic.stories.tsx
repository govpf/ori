import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { Card, CardBody } from '../Card/Card.js';
import { Statistic } from './Statistic.js';

const meta = {
  title: 'Primitives/Affichage/Statistic',
  component: Statistic,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Affiche une métrique chiffrée (KPI) : valeur principale, libellé court, tendance optionnelle. Pas de conteneur intégré : l'app choisit (Card, plain div, etc.). [→ Description complète & bonnes pratiques](?path=/docs/documentation-générale-composants-graphiques-statistic--docs)",
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'lg', 'inline'] },
    loading: { control: 'boolean' },
  },
  args: {
    label: 'Démarches en cours',
    value: 12,
    variant: 'default',
  },
} satisfies Meta<typeof Statistic>;

export default meta;
type Story = StoryObj<typeof meta>;

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

export const TendancePlate: Story = {
  name: 'Tendance plate',
  args: {
    label: 'Documents archivés',
    value: 47,
    trend: { direction: 'flat', label: 'Stable' },
  },
};

export const AvecPrefixSuffix: Story = {
  name: 'Avec préfixe et suffixe',
  args: {
    label: 'Montant des aides versées',
    value: 1240000,
    suffix: 'XPF',
  },
};

export const Pourcentage: Story = {
  name: 'Pourcentage',
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
  args: {
    label: 'Calcul en cours…',
    value: 0,
    loading: true,
  },
  // Tag `skip-visual` : la story React surcharge `label` et `value`
  // (« Calcul en cours… » + 0), alors que la version Angular hérite des
  // args par défaut du meta (« Démarches en cours » + 12) - divergence
  // de contenu volontaire.
  tags: ['skip-visual'],
};

export const ChargementProgressif: Story = {
  name: 'Chargement progressif',
  render: () => {
    const [v, setV] = useState<number | null>(null);
    useEffect(() => {
      const t = window.setTimeout(() => setV(42), 1500);
      return () => window.clearTimeout(t);
    }, []);
    return (
      <Statistic
        label="Démarches reçues aujourd'hui"
        value={v ?? 0}
        loading={v === null}
        trend={v !== null ? { direction: 'up', label: '+12 vs hier' } : undefined}
      />
    );
  },
};

export const DansUneCard: Story = {
  name: 'Dans une carte',
  render: () => (
    <div
      style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', maxWidth: 720 }}
    >
      <Card>
        <CardBody>
          <Statistic
            label="Démarches en cours"
            value={2}
            trend={{ direction: 'up', label: '+1 cette semaine' }}
          />
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <Statistic label="À compléter" value={1} />
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <Statistic label="Validées" value={2} />
        </CardBody>
      </Card>
    </div>
  ),
};

export const Inline: Story = {
  name: 'En ligne',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 320 }}>
      <Statistic variant="inline" label="Démarches en cours" value={2} />
      <Statistic variant="inline" label="À compléter" value={1} />
      <Statistic variant="inline" label="Validées" value={2} />
      <Statistic variant="inline" label="Refusées" value={0} />
    </div>
  ),
};

export const FormatageNombre: Story = {
  name: 'Formatage du nombre',
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1.5rem',
        maxWidth: 600,
      }}
    >
      <Statistic label="Sans formatage" value={1234567} formatNumber={false} />
      <Statistic label="Avec formatage (fr-FR)" value={1234567} />
      <Statistic
        label="Décimales fixes"
        value={3.14159}
        numberFormatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
      />
      <Statistic label="Compact" value={12500} numberFormatOptions={{ notation: 'compact' }} />
    </div>
  ),
};
