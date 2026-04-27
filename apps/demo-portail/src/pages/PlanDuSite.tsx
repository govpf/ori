import { Breadcrumb, Card, CardBody, Link } from '@govpf/ori-react';
import type { Route } from '../App.js';

interface PlanDuSitePageProps {
  onNavigate: (route: Route) => void;
}

interface SitemapNode {
  label: string;
  description?: string;
  route?: Route;
  external?: { href: string };
  children?: SitemapNode[];
}

const SITEMAP: { titre: string; nodes: SitemapNode[] }[] = [
  {
    titre: 'Espace personnel',
    nodes: [
      {
        label: 'Tableau de bord',
        description: "Vue d'ensemble de votre activité",
        route: { name: 'dashboard' },
      },
      {
        label: 'Mes démarches',
        description: 'Liste de vos démarches en cours, validées et archivées',
        route: { name: 'mes-demarches' },
      },
      {
        label: 'Mes documents',
        description: 'Vos pièces jointes et documents personnels',
        route: { name: 'documents' },
      },
      {
        label: 'Mes notifications',
        description: 'Évènements liés à vos démarches et à votre compte',
        route: { name: 'notifications' },
      },
    ],
  },
  {
    titre: 'Démarches',
    nodes: [
      {
        label: 'Catalogue des démarches',
        description: 'Toutes les démarches réalisables en ligne',
        route: { name: 'catalogue' },
      },
    ],
  },
  {
    titre: 'Annuaire',
    nodes: [
      {
        label: 'Annuaire des services',
        description: 'Coordonnées des 54 services administratifs',
        route: { name: 'annuaire' },
      },
    ],
  },
  {
    titre: 'Aide',
    nodes: [
      {
        label: 'Aide et support',
        description: 'FAQ, articles et tickets de support',
        route: { name: 'aide' },
      },
    ],
  },
  {
    titre: 'Compte',
    nodes: [
      {
        label: 'Profil',
        description: 'Vos informations personnelles et coordonnées',
        route: { name: 'profil' },
      },
      {
        label: 'Sécurité',
        description: 'Mot de passe, double authentification, sessions',
        route: { name: 'securite' },
      },
      {
        label: 'Préférences',
        description: 'Langue, thème, notifications, accessibilité',
        route: { name: 'preferences' },
      },
    ],
  },
  {
    titre: 'Pages institutionnelles',
    nodes: [
      {
        label: 'Mentions légales',
        description: 'Éditeur, hébergement, propriété intellectuelle',
        route: { name: 'mentions-legales' },
      },
      {
        label: 'Accessibilité',
        description: 'Déclaration de conformité RGAA AA',
        route: { name: 'accessibilite' },
      },
      {
        label: 'Données personnelles',
        description: 'Politique RGPD et exercice de vos droits',
        route: { name: 'donnees-personnelles' },
      },
      {
        label: 'Plan du site',
        description: 'Vous êtes ici',
      },
    ],
  },
];

export function PlanDuSitePage({ onNavigate }: PlanDuSitePageProps) {
  return (
    <article className="legal-page">
      <div className="page-header">
        <Breadcrumb
          items={[
            { label: 'Accueil', href: '#', onClick: () => onNavigate({ name: 'dashboard' }) },
            { label: 'Plan du site' },
          ]}
        />
        <h1 className="page-title">Plan du site</h1>
        <p className="page-subtitle">
          Toutes les pages du service en ligne, regroupées par section. Cette page peut servir de
          point d'entrée alternatif si vous avez du mal à naviguer dans le menu principal.
        </p>
      </div>

      <div className="sitemap-grid">
        {SITEMAP.map((section) => (
          <Card key={section.titre}>
            <CardBody>
              <h2 className="sitemap-section__title">{section.titre}</h2>
              <ul className="sitemap-list">
                {section.nodes.map((n) => (
                  <li key={n.label} className="sitemap-list__item">
                    {n.route ? (
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigate(n.route!);
                        }}
                      >
                        {n.label}
                      </Link>
                    ) : n.external ? (
                      <Link href={n.external.href} target="_blank" rel="noreferrer">
                        {n.label}
                      </Link>
                    ) : (
                      <span aria-current="page" className="sitemap-list__current">
                        {n.label}
                      </span>
                    )}
                    {n.description && <p className="sitemap-list__desc">{n.description}</p>}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        ))}
      </div>
    </article>
  );
}
