import type { Meta, StoryObj } from '@storybook/react';
import { AuthButton } from './AuthButton.js';

const meta = {
  title: 'Templates/AuthButton',
  component: AuthButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "Bouton d'authentification fédérée. Trois variantes selon le fournisseur d'identité : `rumia` (IdP usager), `gov-connect` (IdP agent, broker vers Entra ID), `microsoft` (Entra ID direct, Microsoft Identity Branding Guidelines). Ne pas mélanger usager et agent sur un même écran.",
      },
    },
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['rumia', 'gov-connect', 'microsoft'],
    },
    label: { control: 'text' },
  },
} satisfies Meta<typeof AuthButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rumia: Story = {
  args: {
    variant: 'rumia',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Bouton à utiliser sur les espaces **usager** (portails de démarches en ligne, parcours public). Pour afficher le picto officiel Rumia, fournir l\'asset via la prop `logo` : `<img src="/assets/rumia-logo.png" alt="" />`. Le PNG officiel est disponible dans `packages/css/assets/rumia-logo.png`.',
      },
    },
  },
};

export const RumiaWithLogo: Story = {
  args: {
    variant: 'rumia',
    logo: (
      <img
        src="https://connect.cps.pf/auth/resources/s3deo/login/rumia/images/rumia_logo.png"
        alt=""
      />
    ),
  },
};

export const GovConnect: Story = {
  args: {
    variant: 'gov-connect',
    logo: <img src="/assets/logo-pf.svg" alt="" />,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Bouton à utiliser sur les espaces **agent** (back-office, intranet). GOV Connect est un broker qui redirige vers Entra ID (Office 365 du Pays). Le logo officiel est celui de la Polynésie française, fourni via la prop `logo`.',
      },
    },
  },
};

export const Microsoft: Story = {
  args: {
    variant: 'microsoft',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Bouton optionnel pour les espaces agent qui veulent skipper la page broker GOV Connect et aller direct à Entra ID. Respecte strictement les **Microsoft Identity Branding Guidelines** (logo 4 carrés, bouton blanc, bordure #8C8C8C, police Segoe UI).',
      },
    },
  },
};

export const PortailUsager: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '20rem' }}>
      <AuthButton
        variant="rumia"
        logo={
          <img
            src="https://connect.cps.pf/auth/resources/s3deo/login/rumia/images/rumia_logo.png"
            alt=""
          />
        }
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Pattern usager : un seul bouton Rumia. Pas de GOV Connect ni Microsoft sur un portail public.',
      },
    },
  },
};

export const PortailAgent: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '20rem' }}>
      <AuthButton variant="gov-connect" logo={<img src="/assets/logo-pf.svg" alt="" />} />
      <AuthButton variant="microsoft" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Pattern agent : GOV Connect en principal (broker vers Entra ID), Microsoft en raccourci direct si l'agent veut skipper la page broker.",
      },
    },
  },
};
