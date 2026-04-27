import { useMemo, useState } from 'react';
import {
  Breadcrumb,
  Button,
  Highlight,
  Input,
  Pagination,
  Progress,
  Select,
  Table,
  Tabs,
  Tag,
  Tooltip,
  useToast,
  type TableSort,
} from '@govpf/ori-react';
import { Download, Plus, Trash2 } from 'lucide-react';
import {
  demandes,
  STATUT_LABEL,
  STATUT_VARIANT,
  type Demande,
  type StatutDemande,
} from '../data/mock.js';
import type { Route } from '../App.js';

interface DemarchesPageProps {
  onNavigate: (route: Route) => void;
}

type FiltreStatut = 'all' | StatutDemande;

const PAGE_SIZE = 5;

const SERVICES = ['Service A', 'Service B', 'Service C'];

const TAB_ORDER: { value: FiltreStatut; label: string }[] = [
  { value: 'all', label: 'Toutes' },
  { value: 'brouillon', label: 'Brouillons' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'a_completer', label: 'À compléter' },
  { value: 'valide', label: 'Validées' },
  { value: 'refuse', label: 'Refusées' },
];

export function DemarchesPage({ onNavigate }: DemarchesPageProps) {
  const { toast } = useToast();

  const [filtre, setFiltre] = useState<FiltreStatut>('all');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [service, setService] = useState('');
  const [periode, setPeriode] = useState('30j');
  const [sort, setSort] = useState<TableSort | null>({
    column: 'dateMaj',
    direction: 'desc',
  });
  const [selected, setSelected] = useState<string[]>([]);

  const counters = useMemo(() => {
    const out: Record<FiltreStatut, number> = {
      all: demandes.length,
      brouillon: 0,
      en_cours: 0,
      a_completer: 0,
      valide: 0,
      refuse: 0,
    };
    for (const d of demandes) out[d.statut] += 1;
    return out;
  }, []);

  const filteredRows = useMemo(() => {
    let rows = demandes;
    if (filtre !== 'all') rows = rows.filter((d) => d.statut === filtre);
    if (service) rows = rows.filter((d) => d.service === service);
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (d) =>
          d.numero.toLowerCase().includes(q) ||
          d.type.toLowerCase().includes(q) ||
          d.service.toLowerCase().includes(q),
      );
    }
    if (sort) {
      const key = sort.column as keyof Demande;
      rows = [...rows].sort((a, b) => {
        const av = String(a[key] ?? '');
        const bv = String(b[key] ?? '');
        const cmp = av.localeCompare(bv, 'fr');
        return sort.direction === 'asc' ? cmp : -cmp;
      });
    }
    return rows;
  }, [filtre, service, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const visibleRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetFilters = () => {
    setSearch('');
    setService('');
    setPeriode('30j');
    setFiltre('all');
    setPage(1);
  };

  const handleBulkExport = () => {
    toast({
      variant: 'info',
      title: 'Export en cours',
      description: `${selected.length} demande${selected.length > 1 ? 's' : ''} en préparation.`,
    });
  };

  const handleBulkArchive = () => {
    toast({
      variant: 'success',
      title: 'Archivage demandé',
      description: `${selected.length} demande${selected.length > 1 ? 's' : ''} déplacée${selected.length > 1 ? 's' : ''} vers les archives.`,
    });
    setSelected([]);
  };

  return (
    <>
      <div className="page-header">
        <Breadcrumb
          items={[
            { label: 'Accueil', href: '#', onClick: () => onNavigate({ name: 'dashboard' }) },
            { label: 'Mes démarches' },
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
            <h1 className="page-title">Mes démarches</h1>
            <p className="page-subtitle">
              Suivez l'avancement de vos démarches en cours et consultez l'historique.
            </p>
          </div>
          <Button variant="primary" onClick={() => onNavigate({ name: 'catalogue' })}>
            <Plus size={16} aria-hidden="true" />
            Nouvelle démarche
          </Button>
        </div>
      </div>

      <Tabs
        value={filtre}
        onValueChange={(v) => {
          setFiltre(v as FiltreStatut);
          setPage(1);
        }}
      >
        <Tabs.List aria-label="Filtrer par statut">
          {TAB_ORDER.map((tab) => (
            <Tabs.Tab key={tab.value} value={tab.value}>
              {tab.label}
              <span className="tab-count" aria-hidden="true">
                {counters[tab.value]}
              </span>
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>

      <div className="filters-row">
        <div className="filters-row__field" style={{ flex: '1 1 280px' }}>
          <Input
            placeholder="Rechercher par numéro, type, service…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="filters-row__field" style={{ flex: '0 1 220px' }}>
          <Select
            value={service}
            onChange={(e) => {
              setService(e.target.value);
              setPage(1);
            }}
            aria-label="Filtrer par service"
          >
            <option value="">Tous les services</option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>
        <div className="filters-row__field" style={{ flex: '0 1 200px' }}>
          <Select
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
            aria-label="Filtrer par période"
          >
            <option value="7j">7 derniers jours</option>
            <option value="30j">30 derniers jours</option>
            <option value="90j">90 derniers jours</option>
            <option value="all">Toutes les dates</option>
          </Select>
        </div>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Réinitialiser
        </Button>
      </div>

      {selected.length > 0 && (
        <div className="bulk-bar" role="region" aria-label="Actions sur la sélection">
          <span className="bulk-bar__count">
            {selected.length} demande{selected.length > 1 ? 's' : ''} sélectionnée
            {selected.length > 1 ? 's' : ''}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="secondary" size="sm" onClick={handleBulkExport}>
              <Download size={14} aria-hidden="true" />
              Exporter
            </Button>
            <Button variant="ghost" size="sm" onClick={handleBulkArchive}>
              <Trash2 size={14} aria-hidden="true" />
              Archiver
            </Button>
          </div>
        </div>
      )}

      <Table<Demande>
        striped
        selectable="multiple"
        rowKey={(r) => r.id}
        selectedRowIds={selected}
        onSelectionChange={setSelected}
        sort={sort ?? undefined}
        onSortChange={setSort}
        columns={[
          { key: 'numero', label: 'Numéro', width: '120px', sortable: true },
          {
            key: 'type',
            label: 'Type',
            sortable: true,
            render: (row) => <Highlight query={search}>{row.type}</Highlight>,
          },
          { key: 'service', label: 'Service', width: '130px', sortable: true },
          {
            key: 'statut',
            label: 'Statut',
            width: '140px',
            render: (row) => (
              <Tag variant={STATUT_VARIANT[row.statut]}>{STATUT_LABEL[row.statut]}</Tag>
            ),
          },
          {
            key: 'avancement',
            label: 'Avancement',
            width: '160px',
            render: (row) => (
              <div className="row-progress">
                <Progress
                  value={(row.etapeActuelle / row.etapesTotal) * 100}
                  aria-label={`Étape ${row.etapeActuelle} sur ${row.etapesTotal}`}
                />
                <span className="row-progress__text">
                  {row.etapeActuelle}/{row.etapesTotal}
                </span>
              </div>
            ),
          },
          {
            key: 'dateMaj',
            label: 'Mise à jour',
            width: '120px',
            sortable: true,
          },
          {
            key: 'actions',
            label: '',
            width: '90px',
            align: 'end',
            render: (row) => (
              <Tooltip content="Voir le détail">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate({ name: 'demande', id: row.id })}
                >
                  Voir
                </Button>
              </Tooltip>
            ),
          },
        ]}
        rows={visibleRows}
        emptyMessage={
          search || service || filtre !== 'all'
            ? 'Aucune démarche ne correspond aux filtres.'
            : "Vous n'avez aucune démarche pour le moment."
        }
      />

      <div className="table-footer">
        <span className="table-footer__count">
          {filteredRows.length} résultat{filteredRows.length > 1 ? 's' : ''}
        </span>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </>
  );
}
