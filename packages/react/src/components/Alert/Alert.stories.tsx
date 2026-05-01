import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert.js';

const meta = {
  title: 'Primitives/Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Message contextuel inline. 4 sévérités (info, success, warning, danger), optionnellement fermable, ARIA approprié. [→ Description complète & bonnes pratiques](?path=/docs/documentation-générale-composants-graphiques-alert--docs)',
      },
    },
  },
  argTypes: {
    severity: { control: 'inline-radio', options: ['info', 'success', 'warning', 'danger'] },
    dismissible: { control: 'boolean' },
  },
  args: {
    severity: 'info',
    title: 'Information',
    children: "Un message contextuel pour accompagner l'utilisateur.",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = { name: 'Variante information' };

export const Success: Story = {
  name: 'Variante succès',
  args: {
    severity: 'success',
    title: 'Action réalisée',
    children: 'Votre demande a été enregistrée avec succès.',
  },
  // Tag `skip-visual` : la story React surcharge `children` avec un
  // message spécifique (« Votre demande a été enregistrée… »), alors
  // que la version Angular hérite du body par défaut du meta -
  // divergence pédagogique volontaire.
  tags: ['skip-visual'],
};

export const Warning: Story = {
  name: 'Variante avertissement',
  args: {
    severity: 'warning',
    title: 'Attention',
    children: 'Certaines informations sont manquantes avant de poursuivre.',
  },
  // Tag `skip-visual` : la story React surcharge `children` avec un
  // message spécifique (« Certaines informations sont manquantes… »),
  // alors que la version Angular hérite du body par défaut du meta -
  // divergence pédagogique volontaire.
  tags: ['skip-visual'],
};

export const Danger: Story = {
  args: {
    severity: 'danger',
    title: 'Erreur',
    children: 'Impossible de traiter votre demande, réessayez plus tard.',
  },
  name: 'Variante danger',
  // Tag `skip-visual` : la story React surcharge `children` avec un
  // message spécifique (« Impossible de traiter votre demande… »),
  // alors que la version Angular hérite du body par défaut du meta -
  // divergence pédagogique volontaire.
  tags: ['skip-visual'],
};

export const Dismissible: Story = {
  args: {
    dismissible: true,
    onDismiss: () => console.log('dismissed'),
  },
};

export const NoTitle: Story = {
  name: 'Sans titre',
  args: {
    title: undefined,
    children: 'Un message simple, sans titre.',
  },
  // Tag `skip-visual` : la story React surcharge `children` avec
  // « Un message simple, sans titre. », alors que la version Angular
  // hérite du body par défaut du meta - divergence pédagogique
  // volontaire.
  tags: ['skip-visual'],
};

export const AllSeverities: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Alert severity="info" title="Info">
        Texte explicatif.
      </Alert>
      <Alert severity="success" title="Succès">
        Tout s'est bien passé.
      </Alert>
      <Alert severity="warning" title="Attention">
        Point à vérifier.
      </Alert>
      <Alert severity="danger" title="Erreur">
        Quelque chose a échoué.
      </Alert>
    </div>
  ),
};
