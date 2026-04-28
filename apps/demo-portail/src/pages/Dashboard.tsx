import { useMemo, useState } from 'react';
import {
  Breadcrumb,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Tag,
  Pagination,
  Statistic,
  Table,
  Button,
  Avatar,
  Tooltip,
  Input,
  Highlight,
  type TableSort,
} from '@govpf/ori-react';
import { FileText, Image as ImageIcon, FileType, Plus } from 'lucide-react';
import {
  demandes,
  documents,
  kpis,
  STATUT_LABEL,
  STATUT_VARIANT,
  type Demande,
} from '../data/mock.js';
import type { Route } from '../App.js';

interface DashboardPageProps {
  onNavigate: (route: Route) => void;
}

const PAGE_SIZE = 4;

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<TableSort | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  // Filtrage + tri server-driven (mocké côté client pour la démo)
  const filteredRows = useMemo(() => {
    let rows = demandes;
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
  }, [search, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const visibleRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div className="page-header">
        <Breadcrumb items={[{ label: 'Accueil', href: '#' }, { label: 'Tableau de bord' }]} />
        <h1 className="page-title">Bienvenue, Heitiare</h1>
        <p className="page-subtitle">Voici un aperçu de vos démarches et documents en cours.</p>
      </div>

      {/* KPIs */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h2 className="section-title">Vue d'ensemble</h2>
        <div className="kpi-grid">
          {kpis.map((kpi) => (
            <Card key={kpi.label}>
              <CardBody>
                <Statistic
                  label={kpi.label}
                  value={kpi.value}
                  trend={kpi.trend ? { direction: 'up', label: kpi.trend } : undefined}
                />
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Démarches récentes */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <h2 className="section-title">Mes démarches</h2>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
            <Button variant="ghost" size="sm" onClick={() => onNavigate({ name: 'mes-demarches' })}>
              Voir toutes
            </Button>
            <Tooltip content="Parcourir le catalogue des démarches">
              <Button variant="primary" size="sm" onClick={() => onNavigate({ name: 'catalogue' })}>
                <Plus size={16} aria-hidden="true" />
                Nouvelle démarche
              </Button>
            </Tooltip>
          </div>
        </div>

        <div style={{ maxWidth: 360 }}>
          <Input
            placeholder="Rechercher par numéro, type, service…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

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
            { key: 'service', label: 'Service', sortable: true },
            {
              key: 'statut',
              label: 'Statut',
              width: '140px',
              render: (row) => (
                <Tag variant={STATUT_VARIANT[row.statut]}>{STATUT_LABEL[row.statut]}</Tag>
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
              width: '100px',
              align: 'end',
              render: (row) => (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate({ name: 'demande', id: row.id })}
                >
                  Voir
                </Button>
              ),
            },
          ]}
          rows={visibleRows}
          emptyMessage={
            search ? `Aucun résultat pour "${search}".` : 'Aucune démarche pour le moment.'
          }
        />

        <div className="table-footer">
          <span className="table-footer__count">
            {filteredRows.length} résultat{filteredRows.length > 1 ? 's' : ''}
            {selected.length > 0 &&
              ` · ${selected.length} sélectionné${selected.length > 1 ? 's' : ''}`}
          </span>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </section>

      {/* Documents récents */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h2 className="section-title">Documents récents</h2>
        <div className="doc-grid">
          {documents.map((doc) => (
            <Card key={doc.id} variant="elevated">
              <CardHeader
                title={doc.nom}
                subtitle={doc.demandeNumero ? `Lié à ${doc.demandeNumero}` : 'Document personnel'}
              />
              <CardBody>
                <div className="doc-card-meta">
                  <DocIcon type={doc.type} />
                  <span>{doc.taille}</span>
                  <span>·</span>
                  <span>Ajouté le {doc.dateAjout}</span>
                </div>
              </CardBody>
              <CardFooter>
                <Button variant="ghost" size="sm">
                  Télécharger
                </Button>
                <Button variant="ghost" size="sm">
                  Voir
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Bloc info "Besoin d'aide" */}
      <section>
        <Card variant="flat">
          <CardBody>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Avatar alt="Support" size="lg" initials="?" />
              <div style={{ flex: 1, minWidth: 240 }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Besoin d'aide ?</h3>
                <p
                  style={{
                    margin: '0.25rem 0 0',
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Notre équipe d'assistance répond du lundi au vendredi, de 7h30 à 15h30.
                </p>
              </div>
              <Button variant="secondary">Contacter le support</Button>
            </div>
          </CardBody>
        </Card>
      </section>
    </>
  );
}

function DocIcon({ type }: { type: 'pdf' | 'image' | 'doc' }) {
  if (type === 'image') return <ImageIcon size={16} aria-hidden="true" />;
  if (type === 'doc') return <FileType size={16} aria-hidden="true" />;
  return <FileText size={16} aria-hidden="true" />;
}
