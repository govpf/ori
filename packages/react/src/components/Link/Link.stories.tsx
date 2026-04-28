import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './Link.js';

const meta = {
  title: 'Composants/Actions/Link',
  component: Link,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Lien stylé avec détection automatique des URLs externes (`target=_blank`, `rel=noreferrer noopener`, icône, libellé caché « nouvel onglet » pour les lecteurs d'écran).",
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'quiet'] },
  },
  args: {
    href: '/demarches',
    children: 'Voir mes démarches en cours',
    variant: 'default',
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Quiet: Story = {
  args: { variant: 'quiet', children: 'Modifier mon adresse' },
};

export const External: Story = {
  args: {
    href: 'https://www.service-public.fr/',
    children: 'Documentation officielle',
  },
};

export const Inline: Story = {
  render: () => (
    <p style={{ maxWidth: 480 }}>
      Vous pouvez consulter <Link href="/cgu">les conditions générales</Link>, ou en savoir plus sur
      le <Link href="https://www.legifrance.gouv.fr/">cadre juridique applicable</Link>.
    </p>
  ),
};
