import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriNotificationComponent } from './notification.component';

const meta: Meta<OriNotificationComponent> = {
  title: 'Composants/Feedback/Notification',
  component: OriNotificationComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Bandeau d'information système plein-largeur. Persiste jusqu'à fermeture explicite (différent de Toast qui est éphémère).",
      },
    },
    layout: 'fullscreen',
  },
  decorators: [moduleMetadata({ imports: [OriNotificationComponent] })],
  argTypes: {
    variant: { control: 'inline-radio', options: ['info', 'success', 'warning', 'danger'] },
    dismissible: { control: 'boolean' },
  },
  args: { variant: 'info', dismissible: true },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-notification
        [variant]="variant"
        [dismissible]="dismissible"
        [actionLabel]="actionLabel || ''"
        [actionHref]="actionHref || ''"
      >Maintenance programmée demain de 22h à 23h.</ori-notification>
    `,
  }),
};

export default meta;
type Story = StoryObj<OriNotificationComponent>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    variant: 'warning',
    dismissible: true,
    actionLabel: 'Compléter mon profil',
    actionHref: '/profil',
  },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-notification
        [variant]="variant"
        [dismissible]="dismissible"
        [actionLabel]="actionLabel"
        [actionHref]="actionHref"
      >Votre profil n'est pas complet.</ori-notification>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <ori-notification variant="info">Le service sera indisponible dimanche entre 2h et 4h.</ori-notification>
        <ori-notification variant="success">Votre dossier a été transmis avec succès.</ori-notification>
        <ori-notification variant="warning" actionLabel="En savoir plus" actionHref="/cookies">
          Cette page utilise des cookies pour améliorer votre expérience.
        </ori-notification>
        <ori-notification variant="danger" [dismissible]="true">
          Une panne réseau affecte actuellement le service.
        </ori-notification>
      </div>
    `,
  }),
};

export const NonDismissible: Story = {
  args: { variant: 'danger', dismissible: false },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-notification [variant]="variant" [dismissible]="dismissible">
        Ce message persiste tant que la situation est active.
      </ori-notification>
    `,
  }),
};
