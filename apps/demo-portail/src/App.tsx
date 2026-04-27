import { useState } from 'react';
import { ToastProvider, ToastViewport } from '@govpf/ori-react';
import { AppShell } from './layout/AppShell.js';
import { DashboardPage } from './pages/Dashboard.js';
import { CatalogueDemarchesPage } from './pages/CatalogueDemarches.js';
import { DemarchesPage } from './pages/Demarches.js';
import { DemandeDetailPage } from './pages/DemandeDetail.js';
import { DocumentsPage } from './pages/Documents.js';
import { NotificationsPage } from './pages/Notifications.js';
import { ProfilPage } from './pages/Profil.js';
import { SecuritePage } from './pages/Securite.js';
import { PreferencesPage } from './pages/Preferences.js';
import { AidePage } from './pages/Aide.js';
import { AnnuairePage } from './pages/Annuaire.js';
import { MentionsLegalesPage } from './pages/MentionsLegales.js';
import { AccessibilitePage } from './pages/Accessibilite.js';
import { DonneesPersonnellesPage } from './pages/DonneesPersonnelles.js';
import { PlanDuSitePage } from './pages/PlanDuSite.js';

export type Route =
  | { name: 'dashboard' }
  | { name: 'catalogue' }
  | { name: 'mes-demarches' }
  | { name: 'demande'; id: string }
  | { name: 'documents' }
  | { name: 'notifications' }
  | { name: 'profil' }
  | { name: 'securite' }
  | { name: 'preferences' }
  | { name: 'annuaire' }
  | { name: 'aide' }
  | { name: 'mentions-legales' }
  | { name: 'accessibilite' }
  | { name: 'donnees-personnelles' }
  | { name: 'plan-du-site' };

export function App() {
  const [route, setRoute] = useState<Route>({ name: 'dashboard' });

  return (
    <ToastProvider>
      <AppShell route={route} onNavigate={setRoute}>
        {route.name === 'dashboard' && <DashboardPage onNavigate={setRoute} />}
        {route.name === 'catalogue' && <CatalogueDemarchesPage onNavigate={setRoute} />}
        {route.name === 'mes-demarches' && <DemarchesPage onNavigate={setRoute} />}
        {route.name === 'demande' && (
          <DemandeDetailPage demandeId={route.id} onNavigate={setRoute} />
        )}
        {route.name === 'documents' && <DocumentsPage onNavigate={setRoute} />}
        {route.name === 'notifications' && <NotificationsPage onNavigate={setRoute} />}
        {route.name === 'profil' && <ProfilPage onNavigate={setRoute} />}
        {route.name === 'securite' && <SecuritePage onNavigate={setRoute} />}
        {route.name === 'preferences' && <PreferencesPage onNavigate={setRoute} />}
        {route.name === 'annuaire' && <AnnuairePage onNavigate={setRoute} />}
        {route.name === 'aide' && <AidePage onNavigate={setRoute} />}
        {route.name === 'mentions-legales' && <MentionsLegalesPage onNavigate={setRoute} />}
        {route.name === 'accessibilite' && <AccessibilitePage onNavigate={setRoute} />}
        {route.name === 'donnees-personnelles' && <DonneesPersonnellesPage onNavigate={setRoute} />}
        {route.name === 'plan-du-site' && <PlanDuSitePage onNavigate={setRoute} />}
      </AppShell>
      <ToastViewport position="top-right" />
    </ToastProvider>
  );
}
