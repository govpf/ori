import { useMemo, useState } from 'react';
import {
  Breadcrumb,
  Button,
  Card,
  CardBody,
  Link,
  Select,
  Tabs,
  Tag,
  Tooltip,
  useToast,
} from '@govpf/ori-react';
import {
  Archive,
  ArchiveRestore,
  Bell,
  BellOff,
  Check,
  CheckCheck,
  CircleAlert,
  CircleCheck,
  CircleX,
  Info,
  Trash2,
} from 'lucide-react';
import {
  notificationsInitiales,
  NOTIF_CATEGORIE_LABEL,
  type NotificationItem,
  type NotifCategorie,
  type NotifVariant,
} from '../data/mock.js';
import type { Route } from '../App.js';

interface NotificationsPageProps {
  onNavigate: (route: Route) => void;
}

type FiltreOnglet = 'all' | 'unread' | 'archived';

const TAB_ORDER: { value: FiltreOnglet; label: string }[] = [
  { value: 'all', label: 'Toutes' },
  { value: 'unread', label: 'Non lues' },
  { value: 'archived', label: 'Archivées' },
];

const VARIANT_ICON: Record<NotifVariant, typeof Info> = {
  info: Info,
  success: CircleCheck,
  warning: CircleAlert,
  danger: CircleX,
};

const VARIANT_TAG: Record<NotifVariant, 'info' | 'success' | 'warning' | 'danger'> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
};

export function NotificationsPage({ onNavigate }: NotificationsPageProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<NotificationItem[]>(notificationsInitiales);
  const [onglet, setOnglet] = useState<FiltreOnglet>('all');
  const [categorie, setCategorie] = useState<NotifCategorie | ''>('');

  const counters = useMemo(() => {
    const out: Record<FiltreOnglet, number> = { all: 0, unread: 0, archived: 0 };
    for (const n of items) {
      if (n.archive) out.archived += 1;
      else {
        out.all += 1;
        if (!n.lu) out.unread += 1;
      }
    }
    return out;
  }, [items]);

  const filtered = useMemo(() => {
    let rows = items;
    if (onglet === 'archived') rows = rows.filter((n) => n.archive);
    else if (onglet === 'unread') rows = rows.filter((n) => !n.archive && !n.lu);
    else rows = rows.filter((n) => !n.archive);
    if (categorie) rows = rows.filter((n) => n.categorie === categorie);
    return rows;
  }, [items, onglet, categorie]);

  const updateOne = (id: string, patch: Partial<NotificationItem>) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  };

  const handleToggleRead = (n: NotificationItem) => {
    updateOne(n.id, { lu: !n.lu });
  };

  const handleArchive = (n: NotificationItem) => {
    updateOne(n.id, { archive: true, lu: true });
    toast({ variant: 'info', description: 'Notification archivée.' });
  };

  const handleRestore = (n: NotificationItem) => {
    updateOne(n.id, { archive: false });
    toast({ variant: 'info', description: 'Notification restaurée.' });
  };

  const handleDelete = (n: NotificationItem) => {
    setItems((prev) => prev.filter((x) => x.id !== n.id));
    toast({ variant: 'info', description: 'Notification supprimée.' });
  };

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((n) => (n.archive ? n : { ...n, lu: true })));
    toast({
      variant: 'success',
      description: 'Toutes les notifications ont été marquées comme lues.',
    });
  };

  const handleOpenLink = (n: NotificationItem) => {
    if (n.demandeNumero) {
      const id = mapNumeroToId(n.demandeNumero);
      if (id) onNavigate({ name: 'demande', id });
    }
    if (!n.lu) updateOne(n.id, { lu: true });
  };

  return (
    <>
      <div className="page-header">
        <Breadcrumb
          items={[
            { label: 'Accueil', href: '#', onClick: () => onNavigate({ name: 'dashboard' }) },
            { label: 'Mes notifications' },
          ]}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h1 className="page-title">Mes notifications</h1>
            <p className="page-subtitle">
              Suivez les évènements liés à vos démarches, vos documents et votre compte.
            </p>
          </div>
          <Button variant="secondary" onClick={handleMarkAllRead} disabled={counters.unread === 0}>
            <CheckCheck size={16} aria-hidden="true" />
            Tout marquer comme lu
          </Button>
        </div>
      </div>

      <Tabs value={onglet} onValueChange={(v) => setOnglet(v as FiltreOnglet)}>
        <Tabs.List aria-label="Filtrer les notifications">
          {TAB_ORDER.map((t) => (
            <Tabs.Tab key={t.value} value={t.value}>
              {t.label}
              <span className="tab-count" aria-hidden="true">
                {counters[t.value]}
              </span>
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>

      <div className="filters-row">
        <div className="filters-row__field" style={{ flex: '0 1 220px' }}>
          <Select
            value={categorie}
            onChange={(e) => setCategorie(e.target.value as NotifCategorie | '')}
            aria-label="Filtrer par catégorie"
          >
            <option value="">Toutes les catégories</option>
            {(Object.keys(NOTIF_CATEGORIE_LABEL) as NotifCategorie[]).map((c) => (
              <option key={c} value={c}>
                {NOTIF_CATEGORIE_LABEL[c]}
              </option>
            ))}
          </Select>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setOnglet('all');
            setCategorie('');
          }}
        >
          Réinitialiser
        </Button>
      </div>

      {filtered.length === 0 ? (
        <Card variant="flat">
          <CardBody>
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              {onglet === 'unread' ? (
                <Bell
                  size={32}
                  aria-hidden="true"
                  style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}
                />
              ) : (
                <BellOff
                  size={32}
                  aria-hidden="true"
                  style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}
                />
              )}
              <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                {onglet === 'unread'
                  ? 'Toutes vos notifications sont à jour.'
                  : onglet === 'archived'
                    ? 'Aucune notification archivée.'
                    : 'Aucune notification.'}
              </p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <ul className="notif-list" role="list">
          {filtered.map((n) => {
            const Icon = VARIANT_ICON[n.variant];
            return (
              <li
                key={n.id}
                className={`notif-item notif-item--${n.variant}${n.lu ? '' : ' notif-item--unread'}`}
              >
                <div
                  className={`notif-item__icon notif-item__icon--${n.variant}`}
                  aria-hidden="true"
                >
                  <Icon size={18} />
                </div>
                <div className="notif-item__main">
                  <div className="notif-item__head">
                    <h3 className="notif-item__title">
                      {!n.lu && (
                        <span className="notif-item__dot" aria-label="Non lue" title="Non lue" />
                      )}
                      {n.titre}
                    </h3>
                    <Tag variant={VARIANT_TAG[n.variant]}>{NOTIF_CATEGORIE_LABEL[n.categorie]}</Tag>
                  </div>
                  <p className="notif-item__message">{n.message}</p>
                  <div className="notif-item__foot">
                    <span className="notif-item__date">{n.date}</span>
                    {n.demandeNumero && (
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenLink(n);
                        }}
                      >
                        Voir la demande {n.demandeNumero}
                      </Link>
                    )}
                  </div>
                </div>
                <div className="notif-item__actions">
                  {!n.archive && (
                    <Tooltip content={n.lu ? 'Marquer comme non lue' : 'Marquer comme lue'}>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={n.lu ? 'Marquer comme non lue' : 'Marquer comme lue'}
                        onClick={() => handleToggleRead(n)}
                      >
                        <Check size={16} aria-hidden="true" />
                      </Button>
                    </Tooltip>
                  )}
                  {n.archive ? (
                    <Tooltip content="Restaurer">
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Restaurer la notification"
                        onClick={() => handleRestore(n)}
                      >
                        <ArchiveRestore size={16} aria-hidden="true" />
                      </Button>
                    </Tooltip>
                  ) : (
                    <Tooltip content="Archiver">
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Archiver la notification"
                        onClick={() => handleArchive(n)}
                      >
                        <Archive size={16} aria-hidden="true" />
                      </Button>
                    </Tooltip>
                  )}
                  <Tooltip content="Supprimer">
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Supprimer la notification"
                      onClick={() => handleDelete(n)}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </Button>
                  </Tooltip>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

function mapNumeroToId(numero: string): string | null {
  // Mapping minimal pour la démo : chaque numéro 2026-XXXX correspond à un mock dXXX
  const map: Record<string, string> = {
    '2026-0042': 'd1',
    '2026-0041': 'd2',
    '2026-0038': 'd3',
    '2026-0037': 'd4',
    '2026-0033': 'd5',
    '2026-0029': 'd6',
  };
  return map[numero] ?? null;
}
