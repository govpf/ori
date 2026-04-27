import { useState } from 'react';
import { Download, Eye, Moon, Sun, Trash2 } from 'lucide-react';
import {
  // Layout
  Header,
  Footer,
  MainNavigation,
  LanguageSwitcher,
  Logo,
  // Forms
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
  DatePicker,
  FileUpload,
  // Display
  Tag,
  Avatar,
  Tooltip,
  Link,
  FileCard,
  Highlight,
  Progress,
  Skeleton,
  Statistic,
  // Navigation
  Tabs,
  Accordion,
  Breadcrumb,
  Pagination,
  Steps,
  // Feedback
  Alert,
  Notification,
  ToastProvider,
  ToastViewport,
  useToast,
  // Surfaces
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Dialog,
  DialogContent,
  // Data
  Table,
} from '@govpf/ori-react';

/**
 * Playground React - vitrine end-to-end de @govpf/ori-react.
 *
 * Objectif : prouver que la chaîne `package -> consommateur` fonctionne
 * sur une vraie app Vite + React 18, et permettre de tester visuellement
 * les composants sans passer par Storybook (utile pour vérifier les
 * compositions et le thème global).
 *
 * Pas exhaustif : on montre 1-2 variantes par composant. Pour les états
 * détaillés, voir le Storybook React.
 */
export function App() {
  return (
    <ToastProvider>
      <div className="app-shell">
        <AppHeader />
        <main className="app-main">
          <FormsSection />
          <DisplaySection />
          <NavigationSection />
          <FeedbackSection />
          <SurfacesSection />
          <DataSection />
        </main>
        <AppFooter />
      </div>
      <ToastViewport position="top-right" />
    </ToastProvider>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────

function AppHeader() {
  const [lang, setLang] = useState('fr');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <Header>
      <Header.Brand>
        <Logo href="#" title="Polynésie française" subtitle="Playground React" />
      </Header.Brand>
      <Header.Nav>
        <MainNavigation
          items={[
            { label: 'Accueil', href: '#', current: true },
            { label: 'Démarches', href: '#demarches' },
            { label: 'Aide', href: '#aide' },
          ]}
        />
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
        <Button variant="ghost" size="sm" onClick={toggleTheme}>
          {theme === 'light' ? (
            <Moon size={16} aria-hidden="true" />
          ) : (
            <Sun size={16} aria-hidden="true" />
          )}
          {theme === 'light' ? 'Sombre' : 'Clair'}
        </Button>
      </Header.Actions>
    </Header>
  );
}

// ─── Forms ───────────────────────────────────────────────────────────────

function FormsSection() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [civility, setCivility] = useState('');
  const [agree, setAgree] = useState(false);
  const [delivery, setDelivery] = useState('standard');
  const [notifs, setNotifs] = useState(true);
  const [date, setDate] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  return (
    <section className="app-section" id="forms">
      <h2>Formulaires</h2>

      <div className="app-grid-2">
        <Input
          label="Nom"
          placeholder="Saisir votre nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Select
          label="Civilité"
          placeholder="Sélectionnez"
          options={[
            { value: 'mme', label: 'Madame' },
            { value: 'm', label: 'Monsieur' },
            { value: 'autre', label: 'Autre' },
          ]}
          value={civility}
          onChange={(e) => setCivility(e.target.value)}
        />
        <DatePicker
          label="Date de naissance"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Textarea
          label="Présentation"
          placeholder="Quelques mots…"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <h3>Choix</h3>
      <div className="app-row">
        <Checkbox
          label="J'accepte les conditions générales"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
        />
        <Switch
          label="Recevoir les notifications"
          checked={notifs}
          onChange={(e) => setNotifs(e.target.checked)}
        />
      </div>
      <RadioGroup
        label="Mode de livraison"
        value={delivery}
        onChange={setDelivery}
        orientation="inline"
      >
        <Radio value="standard" label="Standard" />
        <Radio value="express" label="Express" />
        <Radio value="pickup" label="Retrait en agence" />
      </RadioGroup>

      <h3>Téléversement</h3>
      <FileUpload
        label="Pièces justificatives"
        multiple
        accept=".pdf,image/*"
        files={files}
        onFilesChange={setFiles}
        dropzoneHint="PDF ou image"
      />

      <h3>Boutons</h3>
      <div className="app-row">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="primary" disabled>
          Disabled
        </Button>
      </div>
    </section>
  );
}

// ─── Display ─────────────────────────────────────────────────────────────

function DisplaySection() {
  return (
    <section className="app-section" id="display">
      <h2>Affichage</h2>

      <h3>Tags</h3>
      <div className="app-row">
        <Tag variant="neutral">Brouillon</Tag>
        <Tag variant="info">En cours</Tag>
        <Tag variant="success">Validé</Tag>
        <Tag variant="warning">À compléter</Tag>
        <Tag variant="danger">Refusé</Tag>
      </div>

      <h3>Avatars</h3>
      <div className="app-row">
        <Avatar alt="Marie Dupont" size="sm" />
        <Avatar alt="Marie Dupont" size="md" />
        <Avatar alt="Marie Dupont" size="lg" />
        <Avatar alt="Marie Dupont" size="xl" />
      </div>

      <h3>Tooltip + Link + Highlight</h3>
      <div className="app-row">
        <Tooltip content="Action de suppression définitive">
          <Button variant="danger" size="sm">
            Supprimer
          </Button>
        </Tooltip>
        <Link href="#">Lien interne</Link>
        <Link href="https://www.service-public.fr/">Lien externe</Link>
      </div>
      <p style={{ maxWidth: 480 }}>
        <Highlight query="permis">
          Demande de permis bateau côtier - dossier en cours d'instruction.
        </Highlight>
      </p>

      <h3>Progress + Skeleton</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
        <Progress value={40} max={100} label="Téléversement" />
        <Progress label="Traitement en cours" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Skeleton variant="circle" width={40} height={40} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, maxWidth: 240 }}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="90%" />
        </div>
      </div>

      <h3>Statistic (KPI)</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
        }}
      >
        <Card>
          <CardBody>
            <Statistic
              label="Démarches en cours"
              value={2}
              trend={{ direction: 'up', label: '+1 cette semaine' }}
            />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Statistic label="À compléter" value={1} />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Statistic
              label="Délai moyen"
              value={8}
              suffix="j"
              trend={{ direction: 'down', label: '-1,2 j vs M-1', positive: 'down' }}
            />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Statistic label="Aides versées" value={1240000} suffix="XPF" variant="lg" />
          </CardBody>
        </Card>
      </div>

      <h3>FileCard</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        <FileCard
          name="Pièce identité.pdf"
          type="pdf"
          size="1.2 Mo"
          meta="Ajouté le 2026-04-22"
          link={{ label: 'Lié à 2026-0042', href: '#42' }}
          actions={[
            { label: 'Aperçu', icon: <Eye size={16} aria-hidden="true" /> },
            { label: 'Télécharger', icon: <Download size={16} aria-hidden="true" /> },
            {
              label: 'Supprimer',
              icon: <Trash2 size={16} aria-hidden="true" />,
              variant: 'danger',
            },
          ]}
        />
        <FileCard
          name="Photo identité.jpg"
          type="image"
          size="2.3 Mo"
          meta="Ajouté le 2026-04-20"
        />
        <FileCard name="Statuts.docx" type="doc" size="180 Ko" meta="Ajouté le 2026-04-15" />
      </div>
    </section>
  );
}

// ─── Navigation ──────────────────────────────────────────────────────────

function NavigationSection() {
  const [page, setPage] = useState(3);
  return (
    <section className="app-section" id="navigation">
      <h2>Navigation</h2>

      <Breadcrumb
        items={[
          { label: 'Accueil', href: '#' },
          { label: 'Démarches', href: '#demarches' },
          { label: 'Permis bateau' },
        ]}
      />

      <h3>Onglets</h3>
      <Tabs defaultValue="profile">
        <Tabs.List aria-label="Sections">
          <Tabs.Tab value="profile">Profil</Tabs.Tab>
          <Tabs.Tab value="documents">Documents</Tabs.Tab>
          <Tabs.Tab value="historique">Historique</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="profile">Coordonnées personnelles, photo, civilité.</Tabs.Panel>
        <Tabs.Panel value="documents">Pièces jointes téléversées et leur statut.</Tabs.Panel>
        <Tabs.Panel value="historique">Liste des actions récentes sur le dossier.</Tabs.Panel>
      </Tabs>

      <h3>Accordéon</h3>
      <Accordion type="single">
        <Accordion.Item title="Comment suivre l'état de mon dossier ?" defaultOpen>
          Une notification par email est envoyée à chaque changement d'état. Vous pouvez aussi
          consulter le suivi depuis votre espace personnel.
        </Accordion.Item>
        <Accordion.Item title="Quels sont les délais ?">
          7 à 10 jours ouvrés en moyenne, selon la complétude du dossier.
        </Accordion.Item>
      </Accordion>

      <h3>Pagination</h3>
      <Pagination page={page} totalPages={12} onPageChange={setPage} />

      <h3>Étapes</h3>
      <Steps
        current={1}
        steps={[
          { title: 'Identité', description: 'Vos informations' },
          { title: 'Justificatifs', description: 'Pièces requises' },
          { title: 'Validation', description: 'Récapitulatif' },
          { title: 'Envoi', description: 'Soumission' },
        ]}
      />
    </section>
  );
}

// ─── Feedback ────────────────────────────────────────────────────────────

function FeedbackSection() {
  const { toast } = useToast();
  return (
    <section className="app-section" id="feedback">
      <h2>Retours utilisateur</h2>

      <h3>Notifications (banner)</h3>
      <Notification variant="info" dismissible action={{ label: 'En savoir plus', href: '#' }}>
        Maintenance programmée demain de 22h à 23h.
      </Notification>

      <h3>Alertes (inline)</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 540 }}>
        <Alert severity="info" title="Information">
          Votre dossier est en cours d'instruction.
        </Alert>
        <Alert severity="success">Modifications enregistrées avec succès.</Alert>
        <Alert severity="warning">Le délai de réponse est dépassé.</Alert>
        <Alert severity="danger">Une erreur est survenue lors de la transmission.</Alert>
      </div>

      <h3>Toasts (overlay)</h3>
      <div className="app-row">
        <Button variant="secondary" onClick={() => toast.info('Information enregistrée.')}>
          Info
        </Button>
        <Button variant="secondary" onClick={() => toast.success('Demande envoyée.')}>
          Success
        </Button>
        <Button variant="secondary" onClick={() => toast.warning('Champ obligatoire manquant.')}>
          Warning
        </Button>
        <Button variant="secondary" onClick={() => toast.danger('Échec de la connexion.')}>
          Danger
        </Button>
      </div>
    </section>
  );
}

// ─── Surfaces ────────────────────────────────────────────────────────────

function SurfacesSection() {
  const [open, setOpen] = useState(false);
  return (
    <section className="app-section" id="surfaces">
      <h2>Surfaces</h2>

      <div className="app-grid-2">
        <Card>
          <CardHeader title="Card par défaut" subtitle="Variant default" />
          <CardBody>
            <p style={{ margin: 0 }}>Conteneur sémantique avec header / body / footer.</p>
          </CardBody>
          <CardFooter>
            <Button variant="primary" size="sm">
              Ouvrir
            </Button>
          </CardFooter>
        </Card>

        <Card variant="elevated">
          <CardHeader title="Card elevated" subtitle="Avec ombre" />
          <CardBody>
            <p style={{ margin: 0 }}>Variante elevated, sans bordure, avec une ombre légère.</p>
          </CardBody>
        </Card>

        <Card variant="flat">
          <CardHeader title="Card flat" />
          <CardBody>
            <p style={{ margin: 0 }}>Variante plate, fond muted.</p>
          </CardBody>
        </Card>
      </div>

      <div className="app-row">
        <Button onClick={() => setOpen(true)}>Ouvrir une modale</Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          title="Confirmer la suppression"
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                Supprimer
              </Button>
            </>
          }
        >
          <p style={{ margin: 0 }}>
            Voulez-vous vraiment supprimer cet élément ? Les données associées seront perdues.
          </p>
        </DialogContent>
      </Dialog>
    </section>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────

interface Demande {
  id: string;
  numero: string;
  demandeur: string;
  type: string;
  statut: 'brouillon' | 'en_cours' | 'valide' | 'refuse';
  date: string;
}

const STATUT_VARIANT = {
  brouillon: 'neutral',
  en_cours: 'info',
  valide: 'success',
  refuse: 'danger',
} as const;

const STATUT_LABEL = {
  brouillon: 'Brouillon',
  en_cours: 'En cours',
  valide: 'Validé',
  refuse: 'Refusé',
} as const;

const demandes: Demande[] = [
  {
    id: '1',
    numero: '2026-0042',
    demandeur: 'Marie Dupont',
    type: 'Permis bateau',
    statut: 'en_cours',
    date: '2026-04-22',
  },
  {
    id: '2',
    numero: '2026-0041',
    demandeur: 'Jean Martin',
    type: 'Renouvellement licence',
    statut: 'valide',
    date: '2026-04-21',
  },
  {
    id: '3',
    numero: '2026-0040',
    demandeur: 'Léa Tehina',
    type: 'Inscription navire',
    statut: 'brouillon',
    date: '2026-04-21',
  },
  {
    id: '4',
    numero: '2026-0039',
    demandeur: 'Pierre Faatau',
    type: 'Permis bateau',
    statut: 'refuse',
    date: '2026-04-20',
  },
];

function DataSection() {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <section className="app-section" id="data">
      <h2>Tableau de données</h2>
      <Table<Demande>
        striped
        selectable="multiple"
        rowKey={(r) => r.id}
        selectedRowIds={selected}
        onSelectionChange={setSelected}
        columns={[
          { key: 'numero', label: 'Numéro', width: '120px' },
          { key: 'demandeur', label: 'Demandeur' },
          { key: 'type', label: 'Type' },
          {
            key: 'statut',
            label: 'Statut',
            render: (row) => (
              <Tag variant={STATUT_VARIANT[row.statut]}>{STATUT_LABEL[row.statut]}</Tag>
            ),
          },
          { key: 'date', label: 'Date', width: '120px' },
        ]}
        rows={demandes}
        caption="Liste des demandes en cours"
      />
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, margin: 0 }}>
        {selected.length} ligne{selected.length > 1 ? 's' : ''} sélectionnée
        {selected.length > 1 ? 's' : ''}
      </p>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────

function AppFooter() {
  return (
    <Footer
      brand="Polynésie française"
      description="Playground React - démonstration end-to-end de @govpf/ori-react"
      legal="© 2026 Gouvernement de la Polynésie française"
      utilityLinks={[
        { label: 'Mentions légales', href: '#' },
        { label: 'Accessibilité', href: '#' },
        { label: 'Plan du site', href: '#' },
      ]}
    />
  );
}
