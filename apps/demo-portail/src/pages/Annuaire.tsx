import { useMemo, useState } from 'react';
import {
  Breadcrumb,
  Button,
  Card,
  CardBody,
  Highlight,
  Pagination,
  SearchBar,
  Select,
  Tag,
  useToast,
} from '@govpf/ori-react';
import { Building2, Clock, ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import {
  servicesAdministratifs,
  SERVICE_SECTEUR_LABEL,
  type ServiceAdministratif,
  type ServiceSecteur,
} from '../data/mock.js';
import type { Route } from '../App.js';

interface AnnuairePageProps {
  onNavigate: (route: Route) => void;
}

const PAGE_SIZE = 9;

export function AnnuairePage({ onNavigate }: AnnuairePageProps) {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [secteur, setSecteur] = useState<ServiceSecteur | ''>('');
  const [ile, setIle] = useState('');
  const [page, setPage] = useState(1);

  const ilesDisponibles = useMemo(() => {
    const set = new Set<string>();
    for (const s of servicesAdministratifs) set.add(s.ile);
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    let rows = servicesAdministratifs;
    if (secteur) rows = rows.filter((s) => s.secteur === secteur);
    if (ile) rows = rows.filter((s) => s.ile === ile);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (s) =>
          s.nom.toLowerCase().includes(q) ||
          s.adresse.toLowerCase().includes(q) ||
          SERVICE_SECTEUR_LABEL[s.secteur].toLowerCase().includes(q),
      );
    }
    return rows;
  }, [search, secteur, ile]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCopy = (label: string, value: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(value).catch(() => {});
    }
    toast({ variant: 'info', description: `${label} copié dans le presse-papier.` });
  };

  return (
    <>
      <div className="page-header">
        <Breadcrumb
          items={[
            { label: 'Accueil', href: '#', onClick: () => onNavigate({ name: 'dashboard' }) },
            { label: 'Annuaire' },
          ]}
        />
        <h1 className="page-title">Annuaire des services</h1>
        <p className="page-subtitle">
          Coordonnées, horaires et site web des {servicesAdministratifs.length} services
          administratifs de la Polynésie française.
        </p>
      </div>

      <Card variant="flat" className="annuaire-search">
        <CardBody>
          <div className="annuaire-search__row">
            <div className="annuaire-search__input">
              <SearchBar
                label="Rechercher dans l'annuaire"
                placeholder="Rechercher un service, une adresse, un secteur…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                buttonLabel="Rechercher"
              />
            </div>
            <Select
              value={secteur}
              onChange={(e) => {
                setSecteur(e.target.value as ServiceSecteur | '');
                setPage(1);
              }}
              aria-label="Filtrer par secteur"
            >
              <option value="">Tous les secteurs</option>
              {(Object.keys(SERVICE_SECTEUR_LABEL) as ServiceSecteur[]).map((s) => (
                <option key={s} value={s}>
                  {SERVICE_SECTEUR_LABEL[s]}
                </option>
              ))}
            </Select>
            <Select
              value={ile}
              onChange={(e) => {
                setIle(e.target.value);
                setPage(1);
              }}
              aria-label="Filtrer par île"
            >
              <option value="">Toutes les îles</option>
              {ilesDisponibles.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('');
                setSecteur('');
                setIle('');
                setPage(1);
              }}
            >
              Réinitialiser
            </Button>
          </div>
        </CardBody>
      </Card>

      {filtered.length === 0 ? (
        <Card variant="flat">
          <CardBody>
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <Building2
                size={32}
                aria-hidden="true"
                style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}
              />
              <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                Aucun service ne correspond à votre recherche.
              </p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="annuaire-grid">
          {visible.map((s) => (
            <ServiceFiche key={s.id} service={s} search={search} onCopy={handleCopy} />
          ))}
        </div>
      )}

      {filtered.length > PAGE_SIZE && (
        <div className="table-footer">
          <span className="table-footer__count">
            {filtered.length} service{filtered.length > 1 ? 's' : ''}
          </span>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </>
  );
}

interface ServiceFicheProps {
  service: ServiceAdministratif;
  search: string;
  onCopy: (label: string, value: string) => void;
}

function ServiceFiche({ service, search, onCopy }: ServiceFicheProps) {
  return (
    <Card variant="elevated">
      <CardBody>
        <div className="service-fiche">
          <div className="service-fiche__head">
            <div className="service-fiche__icon" aria-hidden="true">
              <Building2 size={20} />
            </div>
            <div className="service-fiche__heading">
              <h3 className="service-fiche__name">
                <Highlight query={search}>{service.nom}</Highlight>
              </h3>
              <Tag variant="info">{SERVICE_SECTEUR_LABEL[service.secteur]}</Tag>
            </div>
          </div>
          <ul className="service-fiche__contacts">
            <li>
              <MapPin size={14} aria-hidden="true" />
              <span>
                <Highlight query={search}>{service.adresse}</Highlight>
              </span>
            </li>
            <li>
              <Phone size={14} aria-hidden="true" />
              <a
                href={`tel:${service.telephone.replace(/\s+/g, '')}`}
                className="service-fiche__contact-link"
                onClick={(e) => {
                  e.preventDefault();
                  onCopy('Numéro', service.telephone);
                }}
              >
                {service.telephone}
              </a>
            </li>
            <li>
              <Mail size={14} aria-hidden="true" />
              <a
                href={`mailto:${service.email}`}
                className="service-fiche__contact-link"
                onClick={(e) => {
                  e.preventDefault();
                  onCopy('Email', service.email);
                }}
              >
                {service.email}
              </a>
            </li>
            <li>
              <Clock size={14} aria-hidden="true" />
              <span>{service.horaires}</span>
            </li>
          </ul>
          {service.siteWeb && (
            <div className="service-fiche__footer">
              <a
                href={service.siteWeb}
                target="_blank"
                rel="noreferrer"
                className="service-fiche__website"
              >
                Site web
                <ExternalLink size={12} aria-hidden="true" />
              </a>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
