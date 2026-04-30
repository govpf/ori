import { useState, type MouseEvent, type ReactNode } from 'react';
import {
  AppShell as OriAppShell,
  Header,
  Footer,
  MainNavigation,
  SideMenu,
  LanguageSwitcher,
  Logo,
  Avatar,
  Button,
  Notification,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@govpf/ori-react';
import { Moon, Sun, User, Settings, Shield, LogOut } from 'lucide-react';
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
 * Shell d'app du portail démo : utilise <AppShell> du DS pour la structure
 * (header sticky + sidebar drawer responsive + main avec skip link + footer)
 * et y greffe les éléments spécifiques à la démo : banner d'avertissement,
 * Notification de maintenance, toggle thème sombre, menu utilisateur.
 *
 * Avant la migration, le layout était entièrement custom (.app-root /
 * .app-body / .app-aside / .app-content). Tout ce CSS a été retiré au
 * profit du composant DS qui pose les mêmes règles, plus propres et
 * maintenues une seule fois.
 */
export function AppShell({ route, onNavigate, children }: AppShellProps) {
  const [lang, setLang] = useState('fr');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showBanner, setShowBanner] = useState(true);
  // Sidebar visible par défaut sur desktop. La même prop pilote aussi le
  // drawer en mobile : passer `false` la cache sur desktop / ferme le drawer
  // sur mobile.
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      // En mobile, fermer le drawer après navigation pour laisser voir le contenu cible.
      setSidebarOpen(false);
    }
  };

  const handleUserMenu = (action: string) => {
    switch (action) {
      case 'profil':
        onNavigate({ name: 'profil' });
        break;
      case 'securite':
        onNavigate({ name: 'securite' });
        break;
      case 'preferences':
        onNavigate({ name: 'preferences' });
        break;
      case 'logout':
        onNavigate({ name: 'connexion' });
        break;
    }
  };

  const headerNode = (
    <>
      <div className="demo-banner" role="region" aria-label="Avertissement de démonstration">
        <strong>DÉMO</strong>
        <span>
          Cette page illustre le design system Ori avec des données fictives. Aucune information
          saisie ici n'est transmise à un service réel.
        </span>
        <a className="demo-banner__link" href="https://ori.gov.pf" target="_blank" rel="noreferrer">
          Voir la documentation Ori →
        </a>
      </div>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="user-menu-trigger" aria-label="Menu utilisateur">
                <Avatar alt="Heitiare TUHEIAVA" size="sm" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Connectée en tant que Heitiare T.</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem icon={<User size={16} />} onSelect={() => handleUserMenu('profil')}>
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem
                icon={<Shield size={16} />}
                onSelect={() => handleUserMenu('securite')}
              >
                Sécurité
              </DropdownMenuItem>
              <DropdownMenuItem
                icon={<Settings size={16} />}
                onSelect={() => handleUserMenu('preferences')}
              >
                Préférences
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                icon={<LogOut size={16} />}
                destructive
                onSelect={() => handleUserMenu('logout')}
              >
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
    </>
  );

  const sidebarNode = (
    <div onClick={handleNavClick} style={{ display: 'contents' }}>
      <SideMenu
        sections={[
          {
            title: 'Mon espace',
            items: [
              { label: 'Tableau de bord', href: '#dashboard', current: route.name === 'dashboard' },
              {
                label: 'Mes démarches',
                href: '#mes-demarches',
                current: route.name === 'mes-demarches' || route.name === 'demande',
              },
              { label: 'Mes documents', href: '#documents', current: route.name === 'documents' },
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
              { label: 'Profil', href: '#profil', current: route.name === 'profil' },
              { label: 'Sécurité', href: '#securite', current: route.name === 'securite' },
              { label: 'Préférences', href: '#prefs', current: route.name === 'preferences' },
            ],
          },
        ]}
      />
    </div>
  );

  const footerNode = (
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
  );

  return (
    <OriAppShell
      header={headerNode}
      sidebar={sidebarNode}
      footer={footerNode}
      sidebarOpen={sidebarOpen}
      onSidebarOpenChange={setSidebarOpen}
    >
      <div className="app-content">{children}</div>
    </OriAppShell>
  );
}
