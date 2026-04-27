import { useState } from 'react';
import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dialog,
  DialogContent,
  Input,
  Switch,
  Table,
  Tag,
  Tooltip,
  useToast,
} from '@govpf/ori-react';
import { Globe, KeyRound, Laptop, Smartphone, Tablet, Trash2 } from 'lucide-react';
import type { Route } from '../App.js';

interface SecuritePageProps {
  onNavigate: (route: Route) => void;
}

interface Session {
  id: string;
  appareil: string;
  type: 'desktop' | 'mobile' | 'tablet';
  navigateur: string;
  lieu: string;
  derniereActivite: string;
  current: boolean;
}

interface Connexion {
  id: string;
  date: string;
  ip: string;
  appareil: string;
  statut: 'success' | 'failed';
}

const SESSIONS_INIT: Session[] = [
  {
    id: 's1',
    appareil: 'Chrome sur Windows',
    type: 'desktop',
    navigateur: 'Chrome 124',
    lieu: 'Papeete (PF)',
    derniereActivite: "À l'instant",
    current: true,
  },
  {
    id: 's2',
    appareil: 'Safari sur iPhone',
    type: 'mobile',
    navigateur: 'Safari 17',
    lieu: 'Papeete (PF)',
    derniereActivite: 'Il y a 2 jours',
    current: false,
  },
  {
    id: 's3',
    appareil: 'Firefox sur iPad',
    type: 'tablet',
    navigateur: 'Firefox 125',
    lieu: 'Moorea (PF)',
    derniereActivite: 'Il y a 12 jours',
    current: false,
  },
];

const CONNEXIONS: Connexion[] = [
  {
    id: 'c1',
    date: '2026-04-25 09:14',
    ip: '203.0.113.42',
    appareil: 'Chrome / Windows',
    statut: 'success',
  },
  {
    id: 'c2',
    date: '2026-04-23 18:22',
    ip: '203.0.113.42',
    appareil: 'Safari / iPhone',
    statut: 'success',
  },
  { id: 'c3', date: '2026-04-21 07:48', ip: '198.51.100.7', appareil: 'Inconnu', statut: 'failed' },
  {
    id: 'c4',
    date: '2026-04-19 22:05',
    ip: '203.0.113.42',
    appareil: 'Firefox / iPad',
    statut: 'success',
  },
];

export function SecuritePage({ onNavigate }: SecuritePageProps) {
  const { toast } = useToast();

  const [pwdCurrent, setPwdCurrent] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');
  const [pwdError, setPwdError] = useState<string | null>(null);

  const [twoFactor, setTwoFactor] = useState(false);
  const [emailLogin, setEmailLogin] = useState(true);
  const [unknownDeviceAlert, setUnknownDeviceAlert] = useState(true);

  const [sessions, setSessions] = useState<Session[]>(SESSIONS_INIT);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handlePwdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdNew.length < 12) {
      setPwdError('Le nouveau mot de passe doit contenir au moins 12 caractères.');
      return;
    }
    if (pwdNew !== pwdConfirm) {
      setPwdError('La confirmation ne correspond pas au nouveau mot de passe.');
      return;
    }
    setPwdError(null);
    setPwdCurrent('');
    setPwdNew('');
    setPwdConfirm('');
    toast({
      variant: 'success',
      title: 'Mot de passe modifié',
      description: 'Votre nouveau mot de passe sera demandé à la prochaine connexion.',
    });
  };

  const handleRevokeSession = (s: Session) => {
    setSessions((prev) => prev.filter((x) => x.id !== s.id));
    toast({
      variant: 'info',
      description: `Session sur ${s.appareil} déconnectée.`,
    });
  };

  const handleRevokeAll = () => {
    setSessions((prev) => prev.filter((s) => s.current));
    toast({
      variant: 'success',
      description: 'Toutes les autres sessions ont été déconnectées.',
    });
  };

  const handleDeleteAccount = () => {
    setConfirmDelete(false);
    toast({
      variant: 'warning',
      title: 'Demande envoyée',
      description: 'Votre demande de suppression sera traitée sous 30 jours.',
    });
  };

  return (
    <>
      <div className="page-header">
        <Breadcrumb
          items={[
            { label: 'Accueil', href: '#', onClick: () => onNavigate({ name: 'dashboard' }) },
            { label: 'Sécurité' },
          ]}
        />
        <h1 className="page-title">Sécurité</h1>
        <p className="page-subtitle">
          Gérez votre mot de passe, l'authentification à deux facteurs et vos sessions actives.
        </p>
      </div>

      <Card>
        <CardHeader title="Mot de passe" subtitle="Dernière modification le 12/03/2026" />
        <CardBody>
          <form onSubmit={handlePwdSubmit} id="pwd-form" className="form-grid">
            <Input
              label="Mot de passe actuel"
              type="password"
              autoComplete="current-password"
              value={pwdCurrent}
              onChange={(e) => setPwdCurrent(e.target.value)}
              wrapperClassName="form-grid__full"
              required
            />
            <Input
              label="Nouveau mot de passe"
              type="password"
              autoComplete="new-password"
              value={pwdNew}
              onChange={(e) => setPwdNew(e.target.value)}
              hint="12 caractères minimum, dont un chiffre et un caractère spécial."
              error={pwdError && pwdNew.length < 12 ? pwdError : undefined}
              required
            />
            <Input
              label="Confirmation"
              type="password"
              autoComplete="new-password"
              value={pwdConfirm}
              onChange={(e) => setPwdConfirm(e.target.value)}
              error={pwdError && pwdNew === pwdConfirm ? undefined : (pwdError ?? undefined)}
              required
            />
          </form>
        </CardBody>
        <CardFooter>
          <Button variant="primary" type="submit" form="pwd-form">
            <KeyRound size={16} aria-hidden="true" />
            Mettre à jour
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader
          title="Authentification à deux facteurs"
          subtitle="Renforce la sécurité de votre compte avec un code à usage unique"
        />
        <CardBody>
          <div className="security-row">
            <div>
              <div className="security-row__title">Application d'authentification</div>
              <div className="security-row__desc">
                Un code à 6 chiffres généré par votre application (Google Authenticator, Authy, …)
                vous sera demandé à chaque connexion.
              </div>
            </div>
            <Switch
              checked={twoFactor}
              onChange={(e) => setTwoFactor(e.target.checked)}
              aria-label="Activer la double authentification"
            />
          </div>
          {twoFactor && (
            <Alert variant="info">
              La configuration sera proposée à la prochaine connexion. Conservez vos
              <strong> codes de récupération</strong> dans un endroit sûr.
            </Alert>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Notifications de sécurité"
          subtitle="Soyez alerté en cas d'activité inhabituelle"
        />
        <CardBody>
          <div className="security-row">
            <div>
              <div className="security-row__title">Email à chaque connexion</div>
              <div className="security-row__desc">
                Recevoir un email récapitulatif après chaque connexion réussie.
              </div>
            </div>
            <Switch
              checked={emailLogin}
              onChange={(e) => setEmailLogin(e.target.checked)}
              aria-label="Email à chaque connexion"
            />
          </div>
          <div className="security-row">
            <div>
              <div className="security-row__title">Alerte appareil inconnu</div>
              <div className="security-row__desc">
                Être notifié immédiatement en cas de connexion depuis un appareil non reconnu.
              </div>
            </div>
            <Switch
              checked={unknownDeviceAlert}
              onChange={(e) => setUnknownDeviceAlert(e.target.checked)}
              aria-label="Alerte appareil inconnu"
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Sessions actives"
          subtitle={`${sessions.length} session${sessions.length > 1 ? 's' : ''} en cours`}
        />
        <CardBody>
          <ul className="session-list" role="list">
            {sessions.map((s) => (
              <li key={s.id} className="session-item">
                <div className="session-item__icon" aria-hidden="true">
                  <DeviceIcon type={s.type} />
                </div>
                <div className="session-item__main">
                  <div className="session-item__title">
                    {s.appareil}
                    {s.current && <Tag variant="success">Session actuelle</Tag>}
                  </div>
                  <div className="session-item__meta">
                    <Globe size={12} aria-hidden="true" />
                    {s.lieu}
                    <span>·</span>
                    <span>{s.derniereActivite}</span>
                  </div>
                </div>
                {!s.current && (
                  <Tooltip content="Déconnecter cette session">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevokeSession(s)}
                      aria-label={`Déconnecter ${s.appareil}`}
                    >
                      Déconnecter
                    </Button>
                  </Tooltip>
                )}
              </li>
            ))}
          </ul>
        </CardBody>
        {sessions.length > 1 && (
          <CardFooter>
            <Button variant="secondary" size="sm" onClick={handleRevokeAll}>
              Déconnecter toutes les autres sessions
            </Button>
          </CardFooter>
        )}
      </Card>

      <Card>
        <CardHeader title="Connexions récentes" subtitle="Historique des 30 derniers jours" />
        <CardBody>
          <Table<Connexion>
            rowKey={(c) => c.id}
            columns={[
              { key: 'date', label: 'Date', width: '160px' },
              { key: 'appareil', label: 'Appareil' },
              { key: 'ip', label: 'Adresse IP', width: '140px' },
              {
                key: 'statut',
                label: 'Statut',
                width: '120px',
                render: (row) =>
                  row.statut === 'success' ? (
                    <Tag variant="success">Réussie</Tag>
                  ) : (
                    <Tag variant="danger">Échec</Tag>
                  ),
              },
            ]}
            rows={CONNEXIONS}
          />
        </CardBody>
      </Card>

      <Card variant="elevated" className="danger-zone">
        <CardHeader title="Zone de danger" />
        <CardBody>
          <div className="security-row">
            <div>
              <div className="security-row__title">Supprimer mon compte</div>
              <div className="security-row__desc">
                Toutes vos données seront effacées sous 30 jours, conformément au RGPD. Vos
                démarches en cours d'instruction seront archivées.
              </div>
            </div>
            <Button variant="danger" onClick={() => setConfirmDelete(true)}>
              <Trash2 size={16} aria-hidden="true" />
              Supprimer
            </Button>
          </div>
        </CardBody>
      </Card>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent
          title="Supprimer mon compte ?"
          footer={
            <>
              <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
                Annuler
              </Button>
              <Button variant="danger" onClick={handleDeleteAccount}>
                Confirmer la suppression
              </Button>
            </>
          }
        >
          <p style={{ margin: 0 }}>
            Cette action est <strong>irréversible</strong>. Une fois la demande validée, vous
            disposez de 30 jours pour vous reconnecter et l'annuler.
          </p>
          <p
            style={{
              margin: '0.75rem 0 0',
              color: 'var(--color-text-secondary)',
              fontSize: '0.875rem',
            }}
          >
            Un email de confirmation sera envoyé à <strong>marie.dupont@example.pf</strong>.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}

function DeviceIcon({ type }: { type: Session['type'] }) {
  if (type === 'mobile') return <Smartphone size={20} aria-hidden="true" />;
  if (type === 'tablet') return <Tablet size={20} aria-hidden="true" />;
  return <Laptop size={20} aria-hidden="true" />;
}
