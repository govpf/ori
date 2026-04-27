import { useMemo, useState } from 'react';
import {
  Breadcrumb,
  Button,
  Card,
  CardBody,
  Highlight,
  Input,
  Tabs,
  Tag,
  Tooltip,
  useToast,
} from '@govpf/ori-react';
import { ArrowRight, Clock, Globe, Search, Sparkles, Star } from 'lucide-react';
import { servicesCatalogue, SERVICE_CATEGORIE_LABEL, type ServiceCategorie } from '../data/mock.js';
import type { Route } from '../App.js';

interface CatalogueDemarchesPageProps {
  onNavigate: (route: Route) => void;
}

type FiltreCategorie = 'all' | 'populaires' | ServiceCategorie;

const TAB_ORDER: { value: FiltreCategorie; label: string }[] = [
  { value: 'all', label: 'Tout' },
  { value: 'populaires', label: 'Populaires' },
  { value: 'identite', label: SERVICE_CATEGORIE_LABEL.identite },
  { value: 'famille', label: SERVICE_CATEGORIE_LABEL.famille },
  { value: 'logement', label: SERVICE_CATEGORIE_LABEL.logement },
  { value: 'activite', label: SERVICE_CATEGORIE_LABEL.activite },
  { value: 'mobilite', label: SERVICE_CATEGORIE_LABEL.mobilite },
  { value: 'aides', label: SERVICE_CATEGORIE_LABEL.aides },
  { value: 'fiscalite', label: SERVICE_CATEGORIE_LABEL.fiscalite },
];

export function CatalogueDemarchesPage({ onNavigate }: CatalogueDemarchesPageProps) {
  const { toast } = useToast();

  const [filtre, setFiltre] = useState<FiltreCategorie>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let rows = servicesCatalogue;
    if (filtre === 'populaires') rows = rows.filter((s) => s.populaire);
    else if (filtre !== 'all') rows = rows.filter((s) => s.categorie === filtre);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (s) => s.titre.toLowerCase().includes(q) || s.description.toLowerCase().includes(q),
      );
    }
    return rows;
  }, [filtre, search]);

  const counters = useMemo(() => {
    const out: Partial<Record<FiltreCategorie, number>> = {
      all: servicesCatalogue.length,
      populaires: servicesCatalogue.filter((s) => s.populaire).length,
    };
    for (const s of servicesCatalogue) {
      out[s.categorie] = (out[s.categorie] ?? 0) + 1;
    }
    return out;
  }, []);

  const handleStart = (titre: string) => {
    toast({
      variant: 'info',
      title: 'Démarche démarrée',
      description: `Vous avez démarré « ${titre} ». Le formulaire serait ouvert ici.`,
    });
  };

  return (
    <>
      <div className="page-header">
        <Breadcrumb
          items={[
            { label: 'Accueil', href: '#', onClick: () => onNavigate({ name: 'dashboard' }) },
            { label: 'Démarches' },
          ]}
        />
        <h1 className="page-title">Catalogue des démarches</h1>
        <p className="page-subtitle">
          Découvrez l'ensemble des démarches que vous pouvez réaliser en ligne auprès des services
          administratifs de la Polynésie française.
        </p>
      </div>

      <Card variant="flat" className="catalogue-search">
        <CardBody>
          <div className="catalogue-search__input">
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
              placeholder="Rechercher une démarche (licence, attestation, aide…)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
              aria-label="Rechercher dans le catalogue"
            />
          </div>
        </CardBody>
      </Card>

      <Tabs value={filtre} onValueChange={(v) => setFiltre(v as FiltreCategorie)}>
        <Tabs.List aria-label="Filtrer par catégorie">
          {TAB_ORDER.map((t) => (
            <Tabs.Tab key={t.value} value={t.value}>
              {t.label}
              <span className="tab-count" aria-hidden="true">
                {counters[t.value] ?? 0}
              </span>
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>

      {filtered.length === 0 ? (
        <Card variant="flat">
          <CardBody>
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <Search
                size={32}
                aria-hidden="true"
                style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}
              />
              <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                Aucune démarche ne correspond à votre recherche.
              </p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="catalogue-grid">
          {filtered.map((s) => (
            <Card key={s.id} variant="elevated">
              <CardBody>
                <div className="service-card">
                  <div className="service-card__head">
                    <Tag variant="info">{SERVICE_CATEGORIE_LABEL[s.categorie]}</Tag>
                    <div className="service-card__badges">
                      {s.populaire && (
                        <Tooltip content="Démarche fréquemment effectuée">
                          <span
                            className="service-card__badge service-card__badge--popular"
                            aria-label="Populaire"
                          >
                            <Star size={12} aria-hidden="true" />
                            Populaire
                          </span>
                        </Tooltip>
                      )}
                      {s.nouveau && (
                        <Tooltip content="Démarche récemment ajoutée">
                          <span
                            className="service-card__badge service-card__badge--new"
                            aria-label="Nouveau"
                          >
                            <Sparkles size={12} aria-hidden="true" />
                            Nouveau
                          </span>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                  <h3 className="service-card__title">
                    <Highlight query={search}>{s.titre}</Highlight>
                  </h3>
                  <p className="service-card__desc">
                    <Highlight query={search}>{s.description}</Highlight>
                  </p>
                  <div className="service-card__meta">
                    <span className="service-card__meta-item">
                      <Clock size={12} aria-hidden="true" />
                      Délai moyen&nbsp;: {s.dureeMoyenne}
                    </span>
                    <span className="service-card__meta-item">
                      <Globe size={12} aria-hidden="true" />
                      {s.enLigne ? 'Réalisable en ligne' : 'En guichet uniquement'}
                    </span>
                  </div>
                  <div className="service-card__actions">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStart(s.titre)}
                      disabled={!s.enLigne}
                    >
                      {s.enLigne ? 'Démarrer' : 'Voir les modalités'}
                      <ArrowRight size={14} aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Card variant="flat">
        <CardBody>
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ flex: 1, minWidth: 240 }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
                La démarche que vous cherchez n'est pas listée ?
              </h3>
              <p
                style={{
                  margin: '0.25rem 0 0',
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Toutes les démarches ne sont pas encore dématérialisées. Contactez le support pour
                être orienté vers le bon service.
              </p>
            </div>
            <Button variant="secondary" onClick={() => onNavigate({ name: 'aide' })}>
              Contacter l'aide
            </Button>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
