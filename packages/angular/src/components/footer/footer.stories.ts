import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriFooterComponent } from './footer.component';

const meta: Meta<OriFooterComponent> = {
  title: 'Composants/Navigation/Footer',
  component: OriFooterComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Footer app-level. Brand + colonnes de liens en haut, mention légale + liens utilitaires en bas.',
      },
    },
    layout: 'fullscreen',
  },
  decorators: [moduleMetadata({ imports: [OriFooterComponent] })],
  render: (args: Args) => ({
    props: args,
    template: `<ori-footer
      [brand]="brand"
      [description]="description || ''"
      [columns]="columns || []"
      [legal]="legal || ''"
      [utilityLinks]="utilityLinks || []"
    ></ori-footer>`,
  }),
};

export default meta;
type Story = StoryObj<OriFooterComponent>;

export const Default: Story = {
  args: {
    brand: 'Polynésie française',
    description: 'Service en ligne officiel',
    legal: '© 2026 Gouvernement de la Polynésie française',
    utilityLinks: [
      { label: 'Mentions légales', href: '/mentions-legales' },
      { label: 'Accessibilité', href: '/accessibilite' },
      { label: 'Plan du site', href: '/plan' },
    ],
  },
};

export const WithColumns: Story = {
  args: {
    brand: 'Polynésie française',
    description: 'Démarches en ligne pour tous',
    columns: [
      {
        title: 'Démarches',
        links: [
          { label: 'Toutes les démarches', href: '/demarches' },
          { label: 'Mon compte', href: '/compte' },
          { label: 'Suivi de dossier', href: '/suivi' },
        ],
      },
      {
        title: 'Aide',
        links: [
          { label: 'FAQ', href: '/faq' },
          { label: 'Contact', href: '/contact' },
          { label: "Centre d'aide", href: '/aide' },
        ],
      },
      {
        title: 'À propos',
        links: [
          { label: 'Le service', href: '/about' },
          { label: 'Actualités', href: '/actu' },
        ],
      },
    ],
    legal: '© 2026 Gouvernement de la Polynésie française',
    utilityLinks: [
      { label: 'Mentions légales', href: '/mentions-legales' },
      { label: 'Accessibilité', href: '/accessibilite' },
      { label: 'Données personnelles', href: '/rgpd' },
    ],
  },
};

export const Minimal: Story = {
  args: { brand: 'Polynésie française', legal: '© 2026' },
};
