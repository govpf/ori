import { AuthButton, Button, LoginLayout, Logo } from '@govpf/ori-react';
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
 * Utilise <LoginLayout> du DS pour la structure (logo dans la carte +
 * titre centré, aligné sur AuthLogin Keycloak).
 */
export function ConnexionPage({ onNavigate }: Props) {
  return (
    <LoginLayout
      logo={<Logo subtitle="Démarches en ligne" />}
      title="Connexion"
      cardFooter={
        <p>
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
