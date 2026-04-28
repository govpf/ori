import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriErrorPageComponent } from './error-page.component';
import { OriButtonComponent } from '../button/button.component';

type ErrorPageStoryArgs = OriErrorPageComponent;

const meta: Meta<ErrorPageStoryArgs> = {
  title: 'Composants/Affichage/ErrorPage',
  component: OriErrorPageComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "Pattern de page d'erreur ou de maintenance pleine hauteur. Variantes : `default`, `maintenance` (badge orange), `danger` (badge rouge).",
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'maintenance', 'danger'] },
    code: { control: 'text' },
    title: { control: 'text' },
    description: { control: 'text' },
  },
  decorators: [moduleMetadata({ imports: [OriButtonComponent] })],
};

export default meta;
type Story = StoryObj<ErrorPageStoryArgs>;

export const NotFound: Story = {
  args: {
    code: '404',
    title: 'Cette page est introuvable',
    description:
      "Le lien que vous avez suivi est peut-être obsolète ou la page a été déplacée. Vous pouvez retourner à l'accueil ou contacter le service concerné.",
    variant: 'default',
  },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-error-page [code]="code" [title]="title" [description]="description" [variant]="variant">
        <ori-button oriErrorActions variant="primary">Retour à l'accueil</ori-button>
        <ori-button oriErrorActions variant="ghost">Contacter le service</ori-button>
      </ori-error-page>
    `,
  }),
};

export const Forbidden: Story = {
  args: {
    code: '403',
    title: 'Accès refusé',
    description:
      "Vous n'avez pas les droits nécessaires pour consulter cette page. Si vous pensez qu'il s'agit d'une erreur, contactez votre administrateur.",
    variant: 'default',
  },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-error-page [code]="code" [title]="title" [description]="description" [variant]="variant">
        <ori-button oriErrorActions variant="primary">Retour à l'accueil</ori-button>
      </ori-error-page>
    `,
  }),
};

export const ServerError: Story = {
  args: {
    code: '500',
    title: 'Une erreur inattendue est survenue',
    description:
      'Notre équipe technique a été notifiée. Réessayer dans quelques instants ou revenir plus tard.',
    variant: 'danger',
  },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-error-page [code]="code" [title]="title" [description]="description" [variant]="variant">
        <ori-button oriErrorActions variant="primary">Réessayer</ori-button>
        <ori-button oriErrorActions variant="ghost">Retour à l'accueil</ori-button>
        <span oriErrorDetail>Référence d'incident : <code>INC-2026-04-28-0042</code></span>
      </ori-error-page>
    `,
  }),
};

export const Maintenance: Story = {
  args: {
    code: 'Maintenance',
    title: 'Le service est temporairement indisponible',
    description:
      'Une maintenance technique est en cours pour améliorer le service. Le portail sera de nouveau accessible vers 23 h, heure locale.',
    variant: 'maintenance',
  },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-error-page [code]="code" [title]="title" [description]="description" [variant]="variant">
        <span oriErrorDetail>Pour les démarches urgentes, contacter le standard du service au (689) 40 47 20 20.</span>
      </ori-error-page>
    `,
  }),
};
