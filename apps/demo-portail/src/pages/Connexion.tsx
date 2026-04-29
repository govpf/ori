import { AuthButton, Button, LoginLayout } from '@govpf/ori-react';
import type { Route } from '../App.js';

interface Props {
  onNavigate: (route: Route) => void;
}

/**
 * Mire de connexion d'un portail usager. Affiche un bouton Rumia
 * (IdP usager pour le peuple polynésien). Les variantes GOV Connect /
 * Microsoft ne sont volontairement pas exposées ici : elles sont
 * réservées aux espaces agent.
 *
 * Page rendue plein écran sans AppShell, comme une vraie mire pré-auth.
 * Utilise <LoginLayout> du DS pour la structure.
 */
export function ConnexionPage({ onNavigate }: Props) {
  return (
    <LoginLayout
      logo={
        <div className="connexion-page__logo-block">
          <img
            src="/assets/logo-pf.svg"
            alt=""
            className="connexion-page__logo"
            aria-hidden="true"
          />
          <div>
            <strong className="connexion-page__brand">Polynésie française</strong>
            <p className="connexion-page__tagline">Démarches en ligne</p>
          </div>
        </div>
      }
      title="Se connecter"
      description="Accédez à votre espace personnel pour suivre vos démarches, consulter vos documents et recevoir vos notifications."
      cardFooter={
        <p className="connexion-page__help">
          Pas encore de compte Rumia ?{' '}
          <a href="https://rumia.gov.pf" target="_blank" rel="noreferrer">
            Créer un compte
          </a>
        </p>
      }
      footer={
        <Button variant="ghost" size="sm" onClick={() => onNavigate({ name: 'dashboard' })}>
          Retour au portail démo
        </Button>
      }
    >
      <AuthButton
        variant="rumia"
        logo={
          <img
            src="https://connect.cps.pf/auth/resources/s3deo/login/rumia/images/rumia_logo.png"
            alt=""
          />
        }
      />
    </LoginLayout>
  );
}
