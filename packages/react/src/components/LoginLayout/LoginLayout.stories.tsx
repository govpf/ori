import type { Meta, StoryObj } from '@storybook/react';
import { LoginLayout } from './LoginLayout.js';
import { Form, FormSection, FormField, FormActions } from '../Form/Form.js';
import { Input } from '../Input/Input.js';
import { Button } from '../Button/Button.js';
import { Link } from '../Link/Link.js';
import { Logo } from '../Logo/Logo.js';

const meta = {
  title: 'Composants/Layout/LoginLayout',
  component: LoginLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof LoginLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

const sharedFooter = (
  <>
    <Link href="#" variant="quiet">
      Mentions légales
    </Link>
    <Link href="#" variant="quiet">
      Accessibilité
    </Link>
    <Link href="#" variant="quiet">
      Aide
    </Link>
    <span>© 2026 Polynésie française</span>
  </>
);

/** Cas standard : login email + mot de passe + lien d'aide. */
export const Default: Story = {
  render: () => (
    <LoginLayout
      logo={<Logo />}
      title="Se connecter"
      description="Accédez à votre espace personnel."
      cardFooter={
        <>
          <Link href="#">Mot de passe oublié ?</Link>
          <span>
            Pas encore de compte ? <Link href="#">Créer un compte</Link>
          </span>
        </>
      }
      footer={sharedFooter}
    >
      <Form>
        <FormSection>
          <FormField label="Adresse électronique" required>
            {(p) => <Input {...p} type="email" placeholder="exemple@administration.gov.pf" />}
          </FormField>
          <FormField label="Mot de passe" required>
            {(p) => <Input {...p} type="password" />}
          </FormField>
        </FormSection>
        <FormActions align="end">
          <Button type="submit">Se connecter</Button>
        </FormActions>
      </Form>
    </LoginLayout>
  ),
};

/** Avec AuthButton (GOV Connect / Rumia / Microsoft) : pas de formulaire local. */
export const WithAuthProvider: Story = {
  render: () => (
    <LoginLayout
      logo={<Logo />}
      title="Connexion administration"
      description="Cette application est réservée aux agents de la fonction publique. Authentifiez-vous via GOV Connect."
      footer={sharedFooter}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Button>Se connecter avec GOV Connect</Button>
        <Button variant="secondary">Connexion alternative (Microsoft)</Button>
      </div>
    </LoginLayout>
  ),
};

/** Sans cardFooter ni footer : login minimal. */
export const Minimal: Story = {
  render: () => (
    <LoginLayout title="Se connecter">
      <Form>
        <FormSection>
          <FormField label="Identifiant" required>
            {(p) => <Input {...p} />}
          </FormField>
          <FormField label="Mot de passe" required>
            {(p) => <Input {...p} type="password" />}
          </FormField>
        </FormSection>
        <FormActions>
          <Button type="submit">Connexion</Button>
        </FormActions>
      </Form>
    </LoginLayout>
  ),
};
