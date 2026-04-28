import { AuthButton, Button } from '@govpf/ori-react';
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
 */
export function ConnexionPage({ onNavigate }: Props) {
  return (
    <main className="connexion-page">
      <div className="connexion-page__inner">
        <header className="connexion-page__header">
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
        </header>

        <h1 className="connexion-page__title">Se connecter</h1>
        <p className="connexion-page__subtitle">
          Accédez à votre espace personnel pour suivre vos démarches, consulter vos documents
          et recevoir vos notifications.
        </p>

        <div className="connexion-page__actions">
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

        <p className="connexion-page__help">
          Pas encore de compte Rumia ?{' '}
          <a href="https://rumia.gov.pf" target="_blank" rel="noreferrer">
            Créer un compte
          </a>
        </p>

        <footer className="connexion-page__footer">
          <Button variant="ghost" size="sm" onClick={() => onNavigate({ name: 'dashboard' })}>
            Retour au portail démo
          </Button>
        </footer>
      </div>
    </main>
  );
}
