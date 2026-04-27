import { useState } from 'react';
import {
  Breadcrumb,
  Button,
  Card,
  CardBody,
  CardHeader,
  Radio,
  RadioGroup,
  Select,
  Switch,
  useToast,
} from '@govpf/ori-react';
import { Save } from 'lucide-react';
import type { Route } from '../App.js';

interface PreferencesPageProps {
  onNavigate: (route: Route) => void;
}

interface NotifChannels {
  email: boolean;
  sms: boolean;
  push: boolean;
}

interface NotifSettings {
  demarches: NotifChannels;
  documents: NotifChannels;
  compte: NotifChannels;
}

const DEFAULT_NOTIFS: NotifSettings = {
  demarches: { email: true, sms: true, push: true },
  documents: { email: true, sms: false, push: true },
  compte: { email: true, sms: false, push: false },
};

const NOTIF_CATEGORIES: { key: keyof NotifSettings; label: string; desc: string }[] = [
  {
    key: 'demarches',
    label: 'Démarches',
    desc: 'Validation, refus, demande de pièces complémentaires.',
  },
  {
    key: 'documents',
    label: 'Documents',
    desc: 'Nouveau document disponible, signature requise.',
  },
  {
    key: 'compte',
    label: 'Compte',
    desc: 'Connexions, modifications de profil, alertes de sécurité.',
  },
];

export function PreferencesPage({ onNavigate }: PreferencesPageProps) {
  const { toast } = useToast();

  const [langue, setLangue] = useState('fr');
  const [fuseau, setFuseau] = useState('Pacific/Tahiti');
  const [theme, setTheme] = useState<'auto' | 'light' | 'dark'>('light');
  const [densite, setDensite] = useState<'comfortable' | 'compact'>('comfortable');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [notifs, setNotifs] = useState<NotifSettings>(DEFAULT_NOTIFS);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  const toggleNotif = (cat: keyof NotifSettings, channel: keyof NotifChannels) => {
    setNotifs((prev) => ({
      ...prev,
      [cat]: { ...prev[cat], [channel]: !prev[cat][channel] },
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      variant: 'success',
      title: 'Préférences enregistrées',
      description: "Vos choix s'appliqueront à la prochaine connexion.",
    });
  };

  const handleReset = () => {
    setLangue('fr');
    setFuseau('Pacific/Tahiti');
    setTheme('light');
    setDensite('comfortable');
    setReduceMotion(false);
    setHighContrast(false);
    setLargeText(false);
    setNotifs(DEFAULT_NOTIFS);
    setAnalytics(true);
    setMarketing(false);
    toast({ variant: 'info', description: 'Préférences réinitialisées (non enregistrées).' });
  };

  return (
    <form onSubmit={handleSave}>
      <div className="page-header">
        <Breadcrumb
          items={[
            { label: 'Accueil', href: '#', onClick: () => onNavigate({ name: 'dashboard' }) },
            { label: 'Préférences' },
          ]}
        />
        <h1 className="page-title">Préférences</h1>
        <p className="page-subtitle">
          Personnalisez l'apparence, la langue, les notifications et l'accessibilité de votre
          espace.
        </p>
      </div>

      <Card>
        <CardHeader title="Langue et fuseau horaire" />
        <CardBody>
          <div className="form-grid">
            <Select
              label="Langue de l'interface"
              value={langue}
              onChange={(e) => setLangue(e.target.value)}
              hint="Cette langue est utilisée dans toute l'application et dans les emails."
            >
              <option value="fr">Français</option>
              <option value="ty">Reo Tahiti</option>
              <option value="en">English</option>
            </Select>
            <Select
              label="Fuseau horaire"
              value={fuseau}
              onChange={(e) => setFuseau(e.target.value)}
            >
              <option value="Pacific/Tahiti">Tahiti (UTC-10)</option>
              <option value="Pacific/Marquesas">Marquises (UTC-9:30)</option>
              <option value="Pacific/Gambier">Gambier (UTC-9)</option>
              <option value="Europe/Paris">Paris (UTC+1)</option>
            </Select>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Apparence" />
        <CardBody>
          <RadioGroup
            label="Thème"
            value={theme}
            onChange={(v) => setTheme(v as typeof theme)}
            hint="Le thème automatique suit le réglage de votre système d'exploitation."
          >
            <Radio value="auto" label="Automatique" />
            <Radio value="light" label="Clair" />
            <Radio value="dark" label="Sombre" />
          </RadioGroup>

          <RadioGroup
            label="Densité d'affichage"
            value={densite}
            onChange={(v) => setDensite(v as typeof densite)}
            orientation="inline"
          >
            <Radio value="comfortable" label="Confortable" />
            <Radio value="compact" label="Compact" />
          </RadioGroup>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Notifications"
          subtitle="Choisissez les canaux par catégorie d'évènement"
        />
        <CardBody>
          <div className="notif-matrix" role="table" aria-label="Préférences de notification">
            <div className="notif-matrix__head" role="row">
              <span role="columnheader">Catégorie</span>
              <span role="columnheader">Email</span>
              <span role="columnheader">SMS</span>
              <span role="columnheader">Push</span>
            </div>
            {NOTIF_CATEGORIES.map((cat) => (
              <div key={cat.key} className="notif-matrix__row" role="row">
                <div role="cell">
                  <div className="notif-matrix__title">{cat.label}</div>
                  <div className="notif-matrix__desc">{cat.desc}</div>
                </div>
                <div role="cell">
                  <Switch
                    checked={notifs[cat.key].email}
                    onChange={() => toggleNotif(cat.key, 'email')}
                    aria-label={`${cat.label} par email`}
                  />
                </div>
                <div role="cell">
                  <Switch
                    checked={notifs[cat.key].sms}
                    onChange={() => toggleNotif(cat.key, 'sms')}
                    aria-label={`${cat.label} par SMS`}
                  />
                </div>
                <div role="cell">
                  <Switch
                    checked={notifs[cat.key].push}
                    onChange={() => toggleNotif(cat.key, 'push')}
                    aria-label={`${cat.label} en push`}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Accessibilité" subtitle="Adaptez l'interface à vos besoins" />
        <CardBody>
          <div className="security-row">
            <div>
              <div className="security-row__title">Réduire les animations</div>
              <div className="security-row__desc">
                Désactive les transitions et effets de mouvement de l'interface.
              </div>
            </div>
            <Switch
              checked={reduceMotion}
              onChange={(e) => setReduceMotion(e.target.checked)}
              aria-label="Réduire les animations"
            />
          </div>
          <div className="security-row">
            <div>
              <div className="security-row__title">Contraste élevé</div>
              <div className="security-row__desc">
                Augmente le contraste des textes et des bordures pour une meilleure lisibilité.
              </div>
            </div>
            <Switch
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              aria-label="Contraste élevé"
            />
          </div>
          <div className="security-row">
            <div>
              <div className="security-row__title">Taille de texte agrandie</div>
              <div className="security-row__desc">
                Augmente la taille de base des textes de l'interface.
              </div>
            </div>
            <Switch
              checked={largeText}
              onChange={(e) => setLargeText(e.target.checked)}
              aria-label="Taille de texte agrandie"
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Confidentialité" subtitle="Données collectées avec votre consentement" />
        <CardBody>
          <div className="security-row">
            <div>
              <div className="security-row__title">Statistiques d'usage anonymes</div>
              <div className="security-row__desc">
                Aide à améliorer l'application. Aucune donnée personnelle n'est collectée.
              </div>
            </div>
            <Switch
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              aria-label="Statistiques d'usage anonymes"
            />
          </div>
          <div className="security-row">
            <div>
              <div className="security-row__title">Communications institutionnelles</div>
              <div className="security-row__desc">
                Recevoir occasionnellement des informations sur les services publics PF.
              </div>
            </div>
            <Switch
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              aria-label="Communications institutionnelles"
            />
          </div>
        </CardBody>
      </Card>

      <div className="form-actions">
        <Button variant="ghost" type="button" onClick={handleReset}>
          Réinitialiser
        </Button>
        <Button variant="primary" type="submit">
          <Save size={16} aria-hidden="true" />
          Enregistrer les préférences
        </Button>
      </div>
    </form>
  );
}
