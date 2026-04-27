import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriLinkComponent } from './link.component';

const meta: Meta<OriLinkComponent> = {
  title: 'Composants graphiques/Link',
  component: OriLinkComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Lien stylé avec détection automatique des URLs externes.',
      },
    },
  },
  decorators: [moduleMetadata({ imports: [OriLinkComponent] })],
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'quiet'] },
  },
  args: { href: '/demarches', variant: 'default' },
  render: (args: Args) => ({
    props: args,
    template: `<ori-link [href]="href" [variant]="variant">Voir mes démarches en cours</ori-link>`,
  }),
};

export default meta;
type Story = StoryObj<OriLinkComponent>;

export const Default: Story = {};

export const Quiet: Story = {
  args: { variant: 'quiet' },
  render: (args: Args) => ({
    props: args,
    template: `<ori-link [href]="href" [variant]="variant">Modifier mon adresse</ori-link>`,
  }),
};

export const External: Story = {
  args: { href: 'https://www.service-public.fr/' },
  render: (args: Args) => ({
    props: args,
    template: `<ori-link [href]="href">Documentation officielle</ori-link>`,
  }),
};

export const Inline: Story = {
  render: () => ({
    template: `
      <p style="max-width: 480px;">
        Vous pouvez consulter <ori-link href="/cgu">les conditions générales</ori-link>,
        ou en savoir plus sur le <ori-link href="https://www.legifrance.gouv.fr/">cadre juridique applicable</ori-link>.
      </p>
    `,
  }),
};
