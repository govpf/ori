import type { Meta, StoryObj, Args } from '@storybook/angular';
import { OriAuthButtonComponent } from './auth-button.component';

const meta: Meta<OriAuthButtonComponent> = {
  title: 'Templates/AuthButton',
  component: OriAuthButtonComponent,
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
    variant: { control: 'inline-radio', options: ['rumia', 'gov-connect', 'microsoft'] },
    label: { control: 'text' },
    href: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<OriAuthButtonComponent>;

export const Rumia: Story = {
  // Tag `skip-visual` : la story Angular projette le picto Rumia via la
  // directive `oriAuthLogo`, alors que la version React n'inclut pas de
  // logo (prop `logo` non fournie) - divergence de présence du logo.
  tags: ['skip-visual'],
  args: { variant: 'rumia' },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-auth-button [variant]="variant" [label]="label" [href]="href" [disabled]="disabled">
        <img oriAuthLogo src="https://connect.cps.pf/auth/resources/s3deo/login/rumia/images/rumia_logo.png" alt="" />
      </ori-auth-button>
    `,
  }),
};

export const GovConnect: Story = {
  args: { variant: 'gov-connect' },
  render: (args: Args) => ({
    props: args,
    template: `
      <ori-auth-button [variant]="variant" [label]="label" [href]="href" [disabled]="disabled">
        <img oriAuthLogo src="/assets/logo-pf.svg" alt="" />
      </ori-auth-button>
    `,
  }),
};

export const Microsoft: Story = {
  args: { variant: 'microsoft' },
  render: (args: Args) => ({
    props: args,
    template: `<ori-auth-button [variant]="variant" [label]="label" [href]="href" [disabled]="disabled"></ori-auth-button>`,
  }),
};

export const PortailUsager: Story = {
  // Tag `skip-visual` : le logo est projeté côté Angular via la directive
  // `oriAuthLogo`, alors que la version React utilise la prop `logo`
  // contenant un `<img>` JSX inline - divergence du mécanisme de
  // projection du logo.
  tags: ['skip-visual'],
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 20rem;">
        <ori-auth-button variant="rumia">
          <img oriAuthLogo src="https://connect.cps.pf/auth/resources/s3deo/login/rumia/images/rumia_logo.png" alt="" />
        </ori-auth-button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Pattern usager : un seul bouton Rumia.',
      },
    },
  },
};

export const PortailAgent: Story = {
  // Tag `skip-visual` : le logo est projeté côté Angular via la directive
  // `oriAuthLogo`, alors que la version React utilise la prop `logo`
  // contenant un `<img>` JSX inline - divergence du mécanisme de
  // projection du logo.
  tags: ['skip-visual'],
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 20rem;">
        <ori-auth-button variant="gov-connect">
          <img oriAuthLogo src="/assets/logo-pf.svg" alt="" />
        </ori-auth-button>
        <ori-auth-button variant="microsoft"></ori-auth-button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Pattern agent : GOV Connect en principal (broker vers Entra ID), Microsoft en raccourci direct.',
      },
    },
  },
};
