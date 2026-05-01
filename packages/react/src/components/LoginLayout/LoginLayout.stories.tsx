import type { Meta, StoryObj } from '@storybook/react';
import { LoginLayout } from './LoginLayout.js';
import { Form, FormSection, FormField, FormActions } from '../Form/Form.js';
import { Input } from '../Input/Input.js';
import { Button } from '../Button/Button.js';
import { Link } from '../Link/Link.js';
import { Logo } from '../Logo/Logo.js';

const meta = {
  title: 'Compositions/Layout/LoginLayout',
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

/**
 * Cas standard : login identifiant + mot de passe + lien d'aide.
 *
 * Aligné sur la mire Keycloak `AuthLogin` : logo dans la carte, titre
 * centré, bouton de soumission en pleine largeur, lien « mot de passe
 * oublié ? » sous le champ password.
 */
export const Default: Story = {
  name: 'Par défaut',
  render: () => (
    <LoginLayout
      logo={<Logo subtitle="Démarches en ligne" />}
      title="Connexion"
      cardFooter={
        <span>
          Pas encore de compte ? <Link href="#">Créer un compte</Link>
        </span>
      }
      footer={sharedFooter}
    >
      <Form>
        <FormSection>
          <FormField label="Identifiant" required>
            {(p) => <Input {...p} type="text" autoComplete="username" />}
          </FormField>
          <FormField label="Mot de passe" required>
            {(p) => <Input {...p} type="password" autoComplete="current-password" />}
          </FormField>
        </FormSection>
        <div style={{ marginTop: '-0.25rem', textAlign: 'right' }}>
          <Link href="#" variant="quiet">
            Mot de passe oublié ?
          </Link>
        </div>
        <FormActions>
          <Button type="submit" block>
            Se connecter
          </Button>
        </FormActions>
      </Form>
    </LoginLayout>
  ),
};

/** Avec AuthButton (GOV Connect / Rumia / Microsoft) : pas de formulaire local. */
export const WithAuthProvider: Story = {
  name: 'Avec fournisseur d’identité',
  render: () => (
    <LoginLayout
      logo={<Logo subtitle="Démarches en ligne" />}
      title="Connexion administration"
      description="Cette application est réservée aux agents de la fonction publique. Authentifiez-vous via GOV Connect."
      footer={sharedFooter}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Button block>Se connecter avec GOV Connect</Button>
        <Button variant="secondary" block>
          Connexion alternative (Microsoft)
        </Button>
      </div>
    </LoginLayout>
  ),
};

/** Sans cardFooter ni footer : login minimal. */
export const Minimal: Story = {
  name: 'Minimal',
  render: () => (
    <LoginLayout title="Connexion">
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
          <Button type="submit" block>
            Se connecter
          </Button>
        </FormActions>
      </Form>
    </LoginLayout>
  ),
};
