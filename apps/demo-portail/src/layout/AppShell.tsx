import { useState, type MouseEvent, type ReactNode } from 'react';
import {
  Header,
  Footer,
  MainNavigation,
  SideMenu,
  LanguageSwitcher,
  Logo,
  Avatar,
  Button,
  Notification,
} from '@govpf/ori-react';
import { Moon, Sun } from 'lucide-react';
import type { Route } from '../App.js';

// Route interne mappée sur le href des items de nav. Permet d'intercepter
// les clics avec event delegation sans étendre l'API SideMenu/MainNavigation.
const HREF_TO_ROUTE: Record<string, Route> = {
  '#dashboard': { name: 'dashboard' },
  '#catalogue': { name: 'catalogue' },
  '#mes-demarches': { name: 'mes-demarches' },
  '#documents': { name: 'documents' },
  '#notifs': { name: 'notifications' },
  '#profil': { name: 'profil' },
  '#securite': { name: 'securite' },
  '#prefs': { name: 'preferences' },
  '#annuaire': { name: 'annuaire' },
  '#aide': { name: 'aide' },
  '#mentions-legales': { name: 'mentions-legales' },
  '#accessibilite': { name: 'accessibilite' },
  '#donnees-personnelles': { name: 'donnees-personnelles' },
  '#plan-du-site': { name: 'plan-du-site' },
};

interface AppShellProps {
  route: Route;
  onNavigate: (route: Route) => void;
  children: ReactNode;
}

/**
 * Shell d'app : Header + Notification banner + SideMenu + main + Footer.
 * Fournit la navigation transverse, les enfants sont les pages.
 */
export function AppShell({ route, onNavigate, children }: AppShellProps) {
  const [lang, setLang] = useState('fr');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showBanner, setShowBanner] = useState(true);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const handleNavClick = (e: MouseEvent<HTMLElement>) => {
    const anchor = (e.target as HTMLElement).closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href) return;
    const target = HREF_TO_ROUTE[href];
    if (target) {
      e.preventDefault();
      onNavigate(target);
    }
  };

  return (
    <div className="app-root">
      <Header>
        <Header.Brand>
          <Logo href="#" title="Polynésie française" subtitle="Mon espace usager" />
        </Header.Brand>
        <Header.Nav>
          <div onClick={handleNavClick} style={{ display: 'contents' }}>
            <MainNavigation
              items={[
                { label: 'Accueil', href: '#dashboard', current: route.name === 'dashboard' },
                { label: 'Démarches', href: '#catalogue', current: route.name === 'catalogue' },
                { label: 'Annuaire', href: '#annuaire', current: route.name === 'annuaire' },
                { label: 'Aide', href: '#aide', current: route.name === 'aide' },
              ]}
            />
          </div>
        </Header.Nav>
        <Header.Actions>
          <LanguageSwitcher
            languages={[
              { code: 'fr', label: 'Français' },
              { code: 'ty', label: 'Reo Tahiti' },
              { code: 'en', label: 'English' },
            ]}
            value={lang}
            onChange={setLang}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Passer en thème sombre' : 'Passer en thème clair'}
          >
            {theme === 'light' ? (
              <Moon size={16} aria-hidden="true" />
            ) : (
              <Sun size={16} aria-hidden="true" />
            )}
          </Button>
          <Avatar alt="Marie Dupont" size="sm" />
          <Button variant="ghost" size="sm">
            Déconnexion
          </Button>
        </Header.Actions>
      </Header>

      {showBanner && (
        <Notification
          variant="info"
          dismissible
          onDismiss={() => setShowBanner(false)}
          action={{ label: 'En savoir plus', href: '#' }}
        >
          Maintenance technique programmée dimanche 28 avril de 22h à 23h.
        </Notification>
      )}

      <div className="app-body">
        <aside className="app-aside" onClick={handleNavClick}>
          <SideMenu
            sections={[
              {
                title: 'Mon espace',
                items: [
                  {
                    label: 'Tableau de bord',
                    href: '#dashboard',
                    current: route.name === 'dashboard',
                  },
                  {
                    label: 'Mes démarches',
                    href: '#mes-demarches',
                    current: route.name === 'mes-demarches' || route.name === 'demande',
                  },
                  {
                    label: 'Mes documents',
                    href: '#documents',
                    current: route.name === 'documents',
                  },
                  {
                    label: 'Mes notifications',
                    href: '#notifs',
                    current: route.name === 'notifications',
                  },
                ],
              },
              {
                title: 'Compte',
                items: [
                  {
                    label: 'Profil',
                    href: '#profil',
                    current: route.name === 'profil',
                  },
                  {
                    label: 'Sécurité',
                    href: '#securite',
                    current: route.name === 'securite',
                  },
                  {
                    label: 'Préférences',
                    href: '#prefs',
                    current: route.name === 'preferences',
                  },
                ],
              },
            ]}
          />
        </aside>

        <main className="app-content">{children}</main>
      </div>

      <div onClick={handleNavClick} style={{ display: 'contents' }}>
        <Footer
          brand="Polynésie française"
          description="Service en ligne officiel - démonstration"
          legal="© 2026 Gouvernement de la Polynésie française"
          utilityLinks={[
            { label: 'Mentions légales', href: '#mentions-legales' },
            { label: 'Accessibilité', href: '#accessibilite' },
            { label: 'Données personnelles', href: '#donnees-personnelles' },
            { label: 'Plan du site', href: '#plan-du-site' },
          ]}
        />
      </div>
    </div>
  );
}
