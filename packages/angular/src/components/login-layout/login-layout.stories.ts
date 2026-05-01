import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriLoginLayoutComponent } from './login-layout.component';
import {
  OriFormComponent,
  OriFormSectionComponent,
  OriFormFieldComponent,
  OriFormActionsComponent,
} from '../form/form.component';
import { OriInputComponent } from '../input/input.component';
import { OriButtonComponent } from '../button/button.component';
import { OriLogoComponent } from '../logo/logo.component';
import { OriLinkComponent } from '../link/link.component';

const meta: Meta<OriLoginLayoutComponent> = {
  title: 'Compositions/Layout/LoginLayout',
  component: OriLoginLayoutComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        OriLoginLayoutComponent,
        OriFormComponent,
        OriFormSectionComponent,
        OriFormFieldComponent,
        OriFormActionsComponent,
        OriInputComponent,
        OriButtonComponent,
        OriLogoComponent,
        OriLinkComponent,
      ],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "Page d'authentification : logo + carte centrée + slots pour le contenu de connexion (formulaire, AuthButton GOV Connect, …) et le footer.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<OriLoginLayoutComponent>;

export const Default: Story = {
  name: 'Par défaut',
  // Tag `skip-visual` : title (« Se connecter » Angular vs « Connexion »
  // React), description (présente côté Angular, absente côté React),
  // labels des inputs (Adresse électronique Angular vs Identifiant React)
  // et cardFooter divergent intentionnellement entre les deux frameworks.
  tags: ['skip-visual'],
  render: () => ({
    template: `
      <ori-login-layout
        title="Se connecter"
        description="Accédez à votre espace personnel."
        [hasLogo]="true"
        [hasCardFooter]="true"
        [hasFooter]="true"
      >
        <ori-logo slot="logo"></ori-logo>
        <ori-form>
          <ori-form-section>
            <ori-form-field #email label="Adresse électronique" [required]="true">
              <ori-input [id]="email.controlId" [attr.aria-describedby]="email.describedById" type="email" placeholder="exemple@administration.gov.pf"></ori-input>
            </ori-form-field>
            <ori-form-field #pwd label="Mot de passe" [required]="true">
              <ori-input [id]="pwd.controlId" [attr.aria-describedby]="pwd.describedById" type="password"></ori-input>
            </ori-form-field>
          </ori-form-section>
          <ori-form-actions align="end">
            <ori-button type="submit">Se connecter</ori-button>
          </ori-form-actions>
        </ori-form>
        <ng-container slot="cardFooter">
          <ori-link href="#">Mot de passe oublié ?</ori-link>
          <span>Pas encore de compte ? <ori-link href="#">Créer un compte</ori-link></span>
        </ng-container>
        <ng-container slot="footer">
          <ori-link href="#" variant="quiet">Mentions légales</ori-link>
          <ori-link href="#" variant="quiet">Accessibilité</ori-link>
          <ori-link href="#" variant="quiet">Aide</ori-link>
          <span>© 2026 Polynésie française</span>
        </ng-container>
      </ori-login-layout>
    `,
  }),
};

export const WithAuthProvider: Story = {
  name: 'Avec fournisseur d’identité',
  // Tag `skip-visual` : les boutons Angular n'appliquent pas la prop
  // `block` (pleine largeur) que la version React utilise ; le footer
  // diffère également (simple « © 2026 Polynésie française » côté
  // Angular vs footer riche côté React).
  tags: ['skip-visual'],
  render: () => ({
    template: `
      <ori-login-layout
        title="Connexion administration"
        description="Cette application est réservée aux agents de la fonction publique. Authentifiez-vous via GOV Connect."
        [hasLogo]="true"
        [hasFooter]="true"
      >
        <ori-logo slot="logo"></ori-logo>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <ori-button>Se connecter avec GOV Connect</ori-button>
          <ori-button variant="secondary">Connexion alternative (Microsoft)</ori-button>
        </div>
        <ng-container slot="footer">
          <span>© 2026 Polynésie française</span>
        </ng-container>
      </ori-login-layout>
    `,
  }),
};

export const Minimal: Story = {
  name: 'Minimal',
  // Tag `skip-visual` : title (« Se connecter » Angular vs « Connexion »
  // React) et libellé du bouton (« Connexion » Angular vs
  // « Se connecter » React) divergent volontairement.
  tags: ['skip-visual'],
  render: () => ({
    template: `
      <ori-login-layout title="Se connecter">
        <ori-form>
          <ori-form-section>
            <ori-form-field #id label="Identifiant" [required]="true">
              <ori-input [id]="id.controlId" [attr.aria-describedby]="id.describedById"></ori-input>
            </ori-form-field>
            <ori-form-field #pwd label="Mot de passe" [required]="true">
              <ori-input [id]="pwd.controlId" [attr.aria-describedby]="pwd.describedById" type="password"></ori-input>
            </ori-form-field>
          </ori-form-section>
          <ori-form-actions>
            <ori-button type="submit">Connexion</ori-button>
          </ori-form-actions>
        </ori-form>
      </ori-login-layout>
    `,
  }),
};
