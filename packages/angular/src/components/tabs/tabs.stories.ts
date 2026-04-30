import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriTabsComponent, OriTabComponent } from './tabs.component';

const meta: Meta<OriTabsComponent> = {
  title: 'Primitives/Navigation/Tabs',
  component: OriTabsComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Onglets avec activation manuelle au clavier (ArrowLeft / ArrowRight pour le focus, Enter / Space pour activer).',
      },
    },
  },
  decorators: [
    moduleMetadata({ imports: [OriTabsComponent, OriTabComponent] }),
    (storyFn) => {
      const story = storyFn();
      return { ...story, template: `<div style="width: 480px;">${story.template}</div>` };
    },
  ],
};

export default meta;
type Story = StoryObj<OriTabsComponent>;

export const Default: Story = {
  name: 'Par défaut',
  render: () => ({
    props: { active: 'profile' },
    template: `
      <ori-tabs ariaLabel="Réglages utilisateur" [value]="active" (valueChange)="active = $event">
        <ori-tab value="profile" label="Profil">
          <p>Modifiez vos informations personnelles, votre photo et vos coordonnées.</p>
        </ori-tab>
        <ori-tab value="notifications" label="Notifications">
          <p>Choisissez les emails et notifications que vous souhaitez recevoir.</p>
        </ori-tab>
        <ori-tab value="security" label="Sécurité">
          <p>Mot de passe, authentification à deux facteurs et sessions actives.</p>
        </ori-tab>
      </ori-tabs>
    `,
  }),
};

export const WithDisabled: Story = {
  render: () => ({
    props: { active: 'general' },
    template: `
      <ori-tabs ariaLabel="Configuration" [value]="active" (valueChange)="active = $event">
        <ori-tab value="general" label="Général"><p>Réglages de base.</p></ori-tab>
        <ori-tab value="advanced" label="Avancé"><p>Réglages avancés.</p></ori-tab>
        <ori-tab value="experimental" label="Expérimental (verrouillé)" [disabled]="true">
          <p>Réservé aux administrateurs.</p>
        </ori-tab>
      </ori-tabs>
    `,
  }),
};
