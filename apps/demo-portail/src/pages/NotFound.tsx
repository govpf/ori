import { Button, ErrorPage } from '@govpf/ori-react';
import type { Route } from '../App.js';

interface Props {
  onNavigate: (route: Route) => void;
}

export function NotFoundPage({ onNavigate }: Props) {
  return (
    <ErrorPage
      code="404"
      title="Cette page est introuvable"
      description="Le lien que vous avez suivi est peut-être obsolète ou la page a été déplacée. Vous pouvez retourner à l'accueil ou consulter le plan du site."
      actions={
        <>
          <Button variant="primary" onClick={() => onNavigate({ name: 'dashboard' })}>
            Retour à l'accueil
          </Button>
          <Button variant="ghost" onClick={() => onNavigate({ name: 'plan-du-site' })}>
            Plan du site
          </Button>
        </>
      }
    />
  );
}
