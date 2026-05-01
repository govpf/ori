import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriAlertComponent } from './alert.component';

const meta: Meta<OriAlertComponent> = {
  title: 'Primitives/Feedback/Alert',
  component: OriAlertComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Message contextuel inline. 4 sévérités (info, success, warning, danger), optionnellement fermable, ARIA approprié. [→ Description complète & bonnes pratiques](?path=/docs/documentation-générale-composants-graphiques-alert--docs)',
      },
    },
  },
  decorators: [
    moduleMetadata({ imports: [OriAlertComponent] }),
    (storyFn) => {
      const story = storyFn();
      return { ...story, template: `<div style="width: 480px;">${story.template}</div>` };
    },
  ],
  argTypes: {
    severity: { control: 'inline-radio', options: ['info', 'success', 'warning', 'danger'] },
    dismissible: { control: 'boolean' },
  },
  args: {
    severity: 'info',
    title: 'Information',
    dismissible: false,
  },
  render: (args: Args) => ({
    props: args,
    template: `<ori-alert [severity]="severity" [title]="title" [dismissible]="dismissible">
      Un message contextuel pour accompagner l'utilisateur.
    </ori-alert>`,
  }),
};

export default meta;
type Story = StoryObj<OriAlertComponent>;

export const Info: Story = { name: 'Variante information' };

export const Success: Story = {
  name: 'Variante succès',
  args: { severity: 'success', title: 'Action réalisée' },
  // Tag `skip-visual` : la story Angular hérite du body par défaut du
  // meta (« Un message contextuel… »), alors que la version React
  // surcharge `children` avec « Votre demande a été enregistrée… » -
  // divergence pédagogique volontaire.
  tags: ['skip-visual'],
};

export const Warning: Story = {
  name: 'Variante avertissement',
  args: { severity: 'warning', title: 'Attention' },
  // Tag `skip-visual` : la story Angular hérite du body par défaut du
  // meta, alors que la version React surcharge `children` avec
  // « Certaines informations sont manquantes… » - divergence
  // pédagogique volontaire.
  tags: ['skip-visual'],
};

export const Danger: Story = {
  name: 'Variante danger',
  args: { severity: 'danger', title: 'Erreur' },
  // Tag `skip-visual` : la story Angular hérite du body par défaut du
  // meta, alors que la version React surcharge `children` avec
  // « Impossible de traiter votre demande… » - divergence pédagogique
  // volontaire.
  tags: ['skip-visual'],
};

export const Dismissible: Story = {
  args: { dismissible: true },
};

export const NoTitle: Story = {
  name: 'Sans titre',
  args: { title: '' },
  // Tag `skip-visual` : la story Angular hérite du body par défaut du
  // meta, alors que la version React surcharge `children` avec « Un
  // message simple, sans titre. » - divergence pédagogique volontaire.
  tags: ['skip-visual'],
};

export const AllSeverities: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <ori-alert severity="info" title="Info">Texte explicatif.</ori-alert>
        <ori-alert severity="success" title="Succès">Tout s'est bien passé.</ori-alert>
        <ori-alert severity="warning" title="Attention">Point à vérifier.</ori-alert>
        <ori-alert severity="danger" title="Erreur">Quelque chose a échoué.</ori-alert>
      </div>
    `,
  }),
};
