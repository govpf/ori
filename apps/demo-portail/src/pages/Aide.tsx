import { useMemo, useState } from 'react';
import {
  Accordion,
  Breadcrumb,
  Button,
  Card,
  CardBody,
  Dialog,
  DialogContent,
  Highlight,
  Input,
  Select,
  Tabs,
  Tag,
  Textarea,
  Tooltip,
  useToast,
} from '@govpf/ori-react';
import { BookOpen, Clock, Eye, HelpCircle, MessageCircle, Plus, Search, User } from 'lucide-react';
import {
  articlesAide,
  tickets as ticketsInitiaux,
  TICKET_CATEGORIE_LABEL,
  TICKET_PRIORITE_LABEL,
  TICKET_PRIORITE_VARIANT,
  TICKET_STATUT_LABEL,
  TICKET_STATUT_VARIANT,
  type Ticket,
  type TicketCategorie,
  type TicketPriorite,
  type TicketStatut,
} from '../data/mock.js';
import type { Route } from '../App.js';

interface AidePageProps {
  onNavigate: (route: Route) => void;
}

type FiltreStatut = 'all' | TicketStatut;

const TAB_TICKET_ORDER: { value: FiltreStatut; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'ouvert', label: 'Ouverts' },
  { value: 'en_attente', label: 'En attente' },
  { value: 'resolu', label: 'Résolus' },
  { value: 'ferme', label: 'Fermés' },
];

const FAQ = [
  {
    q: "Comment suivre l'avancement de ma demande ?",
    a: "Depuis votre espace personnel, ouvrez la page Mes démarches. L'avancement est affiché sous forme d'étapes (Déposée → En instruction → À compléter → Validée). Une notification vous est envoyée à chaque changement d'état.",
  },
  {
    q: 'Quels formats de fichiers sont acceptés ?',
    a: 'Les fichiers doivent être au format PDF, JPG, PNG ou DOCX. Taille maximale : 10 Mo par fichier. Si votre document est plus volumineux, scannez-le en résolution 200 dpi en niveaux de gris.',
  },
  {
    q: 'Comment réinitialiser mon mot de passe ?',
    a: "Sur la page de connexion, cliquez sur « Mot de passe oublié ». Vous recevrez un email avec un lien valable 30 minutes. Si vous ne recevez pas l'email, vérifiez vos courriers indésirables ou contactez le support.",
  },
  {
    q: 'Combien de temps mes données sont-elles conservées ?',
    a: 'Conformément à la réglementation, vos données sont conservées pendant la durée nécessaire au traitement de vos démarches, puis archivées pour une durée variable selon le type de démarche (5 à 10 ans). Vous pouvez demander la suppression de votre compte depuis la page Sécurité.',
  },
];

export function AidePage({ onNavigate }: AidePageProps) {
  const { toast } = useToast();

  const [tab, setTab] = useState<'tickets' | 'articles' | 'faq'>('tickets');
  const [search, setSearch] = useState('');
  const [filtreStatut, setFiltreStatut] = useState<FiltreStatut>('all');
  const [tickets, setTickets] = useState<Ticket[]>(ticketsInitiaux);

  const [createOpen, setCreateOpen] = useState(false);
  const [newSujet, setNewSujet] = useState('');
  const [newCategorie, setNewCategorie] = useState<TicketCategorie>('demarche');
  const [newPriorite, setNewPriorite] = useState<TicketPriorite>('normale');
  const [newDescription, setNewDescription] = useState('');

  const counters = useMemo(() => {
    const out: Record<FiltreStatut, number> = {
      all: tickets.length,
      ouvert: 0,
      en_attente: 0,
      resolu: 0,
      ferme: 0,
    };
    for (const t of tickets) out[t.statut] += 1;
    return out;
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    let rows = tickets;
    if (filtreStatut !== 'all') rows = rows.filter((t) => t.statut === filtreStatut);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (t) =>
          t.sujet.toLowerCase().includes(q) ||
          t.numero.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q),
      );
    }
    return rows;
  }, [tickets, filtreStatut, search]);

  const filteredArticles = useMemo(() => {
    if (!search.trim()) return articlesAide;
    const q = search.toLowerCase();
    return articlesAide.filter(
      (a) => a.titre.toLowerCase().includes(q) || a.resume.toLowerCase().includes(q),
    );
  }, [search]);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `local-${Date.now()}`;
    const numero = `HD-2026-${String(120 + tickets.length).padStart(4, '0')}`;
    setTickets((prev) => [
      {
        id,
        numero,
        sujet: newSujet,
        description: newDescription,
        statut: 'ouvert',
        priorite: newPriorite,
        categorie: newCategorie,
        dateCreation: '2026-04-25 16:00',
        dateMaj: '2026-04-25 16:00',
        reponses: 0,
      },
      ...prev,
    ]);
    setCreateOpen(false);
    setNewSujet('');
    setNewDescription('');
    setNewCategorie('demarche');
    setNewPriorite('normale');
    setTab('tickets');
    setFiltreStatut('all');
    toast({
      variant: 'success',
      title: 'Ticket créé',
      description: `Votre demande ${numero} a bien été enregistrée. Un agent vous répondra sous 24h.`,
    });
  };

  return (
    <>
      <div className="page-header">
        <Breadcrumb
          items={[
            { label: 'Accueil', href: '#', onClick: () => onNavigate({ name: 'dashboard' }) },
            { label: 'Aide' },
          ]}
        />
      </div>

      <Card variant="flat" className="help-hero">
        <CardBody>
          <div className="help-hero__content">
            <h1 className="help-hero__title">Comment pouvons-nous vous aider&nbsp;?</h1>
            <p className="help-hero__subtitle">
              Cherchez dans vos tickets, dans la base de connaissance ou créez une nouvelle demande.
            </p>
            <div className="help-hero__search">
              <div className="help-hero__search-input">
                <Search
                  size={18}
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)',
                    pointerEvents: 'none',
                  }}
                />
                <Input
                  size="lg"
                  placeholder="Mot-clé, numéro de ticket ou question…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  aria-label="Rechercher dans l'aide"
                />
              </div>
              <Button variant="primary" size="lg" onClick={() => setCreateOpen(true)}>
                <Plus size={18} aria-hidden="true" />
                Nouveau ticket
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <Tabs.List aria-label="Sections de l'aide">
          <Tabs.Tab value="tickets">
            <MessageCircle size={14} aria-hidden="true" style={{ marginRight: 6 }} />
            Mes tickets
            <span className="tab-count" aria-hidden="true">
              {tickets.length}
            </span>
          </Tabs.Tab>
          <Tabs.Tab value="articles">
            <BookOpen size={14} aria-hidden="true" style={{ marginRight: 6 }} />
            Articles populaires
          </Tabs.Tab>
          <Tabs.Tab value="faq">
            <HelpCircle size={14} aria-hidden="true" style={{ marginRight: 6 }} />
            FAQ
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {tab === 'tickets' && (
        <>
          <div className="filters-row">
            {TAB_TICKET_ORDER.map((s) => (
              <Button
                key={s.value}
                variant={filtreStatut === s.value ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFiltreStatut(s.value)}
                aria-pressed={filtreStatut === s.value}
              >
                {s.label}
                <span className="ticket-filter-count" aria-hidden="true">
                  {counters[s.value]}
                </span>
              </Button>
            ))}
          </div>

          {filteredTickets.length === 0 ? (
            <Card variant="flat">
              <CardBody>
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <MessageCircle
                    size={32}
                    aria-hidden="true"
                    style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}
                  />
                  <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                    {search
                      ? 'Aucun ticket ne correspond à votre recherche.'
                      : "Vous n'avez aucun ticket pour le moment."}
                  </p>
                </div>
              </CardBody>
            </Card>
          ) : (
            <ul className="ticket-list" role="list">
              {filteredTickets.map((t) => (
                <li key={t.id} className="ticket-item">
                  <div className="ticket-item__head">
                    <div className="ticket-item__heading">
                      <span className="ticket-item__numero">{t.numero}</span>
                      <h3 className="ticket-item__sujet">
                        <Highlight query={search}>{t.sujet}</Highlight>
                      </h3>
                    </div>
                    <div className="ticket-item__tags">
                      <Tag variant={TICKET_STATUT_VARIANT[t.statut]}>
                        {TICKET_STATUT_LABEL[t.statut]}
                      </Tag>
                      <Tag variant={TICKET_PRIORITE_VARIANT[t.priorite]}>
                        Priorité&nbsp;: {TICKET_PRIORITE_LABEL[t.priorite]}
                      </Tag>
                    </div>
                  </div>
                  <p className="ticket-item__desc">
                    <Highlight query={search}>{t.description}</Highlight>
                  </p>
                  <div className="ticket-item__foot">
                    <span className="ticket-item__meta">
                      <Tag variant="neutral">{TICKET_CATEGORIE_LABEL[t.categorie]}</Tag>
                    </span>
                    {t.agent && (
                      <span className="ticket-item__meta">
                        <User size={12} aria-hidden="true" />
                        {t.agent}
                      </span>
                    )}
                    <span className="ticket-item__meta">
                      <Clock size={12} aria-hidden="true" />
                      Mise à jour&nbsp;: {t.dateMaj}
                    </span>
                    <span className="ticket-item__meta">
                      <MessageCircle size={12} aria-hidden="true" />
                      {t.reponses} réponse{t.reponses > 1 ? 's' : ''}
                    </span>
                    <Tooltip content="Ouvrir le ticket (démo)">
                      <Button
                        variant="ghost"
                        size="sm"
                        style={{ marginLeft: 'auto' }}
                        onClick={() =>
                          toast({
                            variant: 'info',
                            description: `Ticket ${t.numero} ouvert (vue détail à brancher).`,
                          })
                        }
                      >
                        Voir le détail
                      </Button>
                    </Tooltip>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {tab === 'articles' && (
        <div className="article-grid">
          {filteredArticles.map((a) => (
            <Card key={a.id} variant="elevated">
              <CardBody>
                <div className="article-card">
                  <Tag variant="neutral">{TICKET_CATEGORIE_LABEL[a.categorie]}</Tag>
                  <h3 className="article-card__title">
                    <Highlight query={search}>{a.titre}</Highlight>
                  </h3>
                  <p className="article-card__resume">
                    <Highlight query={search}>{a.resume}</Highlight>
                  </p>
                  <div className="article-card__meta">
                    <span>
                      <Clock size={12} aria-hidden="true" /> {a.dureeLecture} min
                    </span>
                    <span>
                      <Eye size={12} aria-hidden="true" /> {a.vues} vues
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
          {filteredArticles.length === 0 && (
            <Card variant="flat">
              <CardBody>
                <p style={{ margin: 0, color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                  Aucun article ne correspond à votre recherche.
                </p>
              </CardBody>
            </Card>
          )}
        </div>
      )}

      {tab === 'faq' && (
        <Accordion type="single">
          {FAQ.map((f, i) => (
            <Accordion.Item key={i} title={f.q}>
              {f.a}
            </Accordion.Item>
          ))}
        </Accordion>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent
          title="Nouveau ticket de support"
          footer={
            <>
              <Button variant="secondary" onClick={() => setCreateOpen(false)}>
                Annuler
              </Button>
              <Button variant="primary" type="submit" form="new-ticket-form">
                Envoyer
              </Button>
            </>
          }
        >
          <form
            id="new-ticket-form"
            onSubmit={handleCreateTicket}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <Input
              label="Sujet"
              value={newSujet}
              onChange={(e) => setNewSujet(e.target.value)}
              required
              placeholder="Décrivez votre problème en quelques mots"
            />
            <div className="form-grid">
              <Select
                label="Catégorie"
                value={newCategorie}
                onChange={(e) => setNewCategorie(e.target.value as TicketCategorie)}
              >
                {(Object.keys(TICKET_CATEGORIE_LABEL) as TicketCategorie[]).map((c) => (
                  <option key={c} value={c}>
                    {TICKET_CATEGORIE_LABEL[c]}
                  </option>
                ))}
              </Select>
              <Select
                label="Priorité"
                value={newPriorite}
                onChange={(e) => setNewPriorite(e.target.value as TicketPriorite)}
              >
                {(Object.keys(TICKET_PRIORITE_LABEL) as TicketPriorite[]).map((p) => (
                  <option key={p} value={p}>
                    {TICKET_PRIORITE_LABEL[p]}
                  </option>
                ))}
              </Select>
            </div>
            <Textarea
              label="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={5}
              required
              placeholder="Détaillez le contexte, les étapes pour reproduire, les messages d'erreur…"
              hint="Plus votre description est précise, plus l'agent pourra vous répondre rapidement."
            />
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
