import type { Meta, StoryObj } from '@storybook/react';
import { ErrorPage } from './ErrorPage.js';
import { Button } from '../Button/Button.js';

const meta = {
  title: 'Composants graphiques/ErrorPage',
  component: ErrorPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "Pattern de page d'erreur ou de maintenance pleine hauteur. Variantes : `default`, `maintenance` (badge orange), `danger` (badge rouge). Le contenu textuel est libre, en français usager.",
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'maintenance', 'danger'] },
    code: { control: 'text' },
    title: { control: 'text' },
    description: { control: 'text' },
  },
} satisfies Meta<typeof ErrorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotFound: Story = {
  args: {
    code: '404',
    title: 'Cette page est introuvable',
    description:
      "Le lien que vous avez suivi est peut-être obsolète ou la page a été déplacée. Vous pouvez retourner à l'accueil ou contacter le service concerné.",
    actions: (
      <>
        <Button variant="primary">Retour à l'accueil</Button>
        <Button variant="ghost">Contacter le service</Button>
      </>
    ),
  },
};

export const Forbidden: Story = {
  args: {
    code: '403',
    title: 'Accès refusé',
    description:
      "Vous n'avez pas les droits nécessaires pour consulter cette page. Si vous pensez qu'il s'agit d'une erreur, contactez votre administrateur.",
    actions: <Button variant="primary">Retour à l'accueil</Button>,
  },
};

export const ServerError: Story = {
  args: {
    variant: 'danger',
    code: '500',
    title: 'Une erreur inattendue est survenue',
    description:
      'Notre équipe technique a été notifiée. Réessayer dans quelques instants ou revenir plus tard.',
    actions: (
      <>
        <Button variant="primary">Réessayer</Button>
        <Button variant="ghost">Retour à l'accueil</Button>
      </>
    ),
    detail: (
      <>
        Référence d'incident : <code>INC-2026-04-28-0042</code>
      </>
    ),
  },
};

export const Maintenance: Story = {
  args: {
    variant: 'maintenance',
    code: 'Maintenance',
    title: 'Le service est temporairement indisponible',
    description:
      'Une maintenance technique est en cours pour améliorer le service. Le portail sera de nouveau accessible vers 23 h, heure locale.',
    detail: 'Pour les démarches urgentes, contacter le standard du service au (689) 40 47 20 20.',
  },
};
