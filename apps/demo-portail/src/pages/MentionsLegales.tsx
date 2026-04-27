import { Breadcrumb, Card, CardBody, Link } from '@govpf/ori-react';
import type { Route } from '../App.js';

interface MentionsLegalesPageProps {
  onNavigate: (route: Route) => void;
}

export function MentionsLegalesPage({ onNavigate }: MentionsLegalesPageProps) {
  return (
    <article className="legal-page">
      <div className="page-header">
        <Breadcrumb
          items={[
            { label: 'Accueil', href: '#', onClick: () => onNavigate({ name: 'dashboard' }) },
            { label: 'Mentions légales' },
          ]}
        />
        <h1 className="page-title">Mentions légales</h1>
        <p className="page-subtitle">
          Informations légales relatives à l'éditeur, à l'hébergement et à l'exploitation de ce
          service en ligne.
        </p>
      </div>

      <Card>
        <CardBody>
          <h2>Éditeur du site</h2>
          <p>
            Le présent service en ligne est édité par le{' '}
            <strong>Gouvernement de la Polynésie française</strong>, autorité administrative
            agissant au nom des services administratifs polynésiens.
          </p>
          <dl className="legal-dl">
            <dt>Adresse</dt>
            <dd>Avenue Pouvanaa a Oopa, BP 2551, 98713 Papeete, Polynésie française</dd>
            <dt>Téléphone</dt>
            <dd>+689 40 47 20 00</dd>
            <dt>Courriel</dt>
            <dd>contact@administration.gov.pf</dd>
            <dt>Numéro Tahiti</dt>
            <dd>123 456 - 001</dd>
          </dl>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2>Directeur de publication</h2>
          <p>
            Le directeur de la publication est le secrétaire général du Gouvernement de la Polynésie
            française, ou toute personne désignée par délégation pour la mise en ligne de ce
            service.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2>Hébergement</h2>
          <p>
            Le service est hébergé sur l'infrastructure d'État de la Polynésie française, opérée par
            le <strong>Service de l'informatique</strong>.
          </p>
          <dl className="legal-dl">
            <dt>Infogérant</dt>
            <dd>Service de l'informatique - Direction des systèmes d'information</dd>
            <dt>Localisation des données</dt>
            <dd>Datacenter situé à Papeete, Polynésie française</dd>
          </dl>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2>Conception et réalisation</h2>
          <p>
            La conception graphique et le développement de ce service sont assurés en interne par
            les équipes du Service de l'informatique, sur la base du design system{' '}
            <strong>Ori</strong> mutualisé entre les services administratifs polynésiens.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2>Propriété intellectuelle</h2>
          <p>
            Sauf mention contraire, les contenus mis à disposition sur ce site (textes, images,
            logos, graphismes, structures, code source) sont la propriété de l'éditeur ou de ses
            partenaires. Toute reproduction, représentation, adaptation ou diffusion totale ou
            partielle, par quelque procédé que ce soit, sans autorisation préalable écrite, est
            strictement interdite.
          </p>
          <p>
            Les marques et logos figurant sur ce site sont des marques déposées. Toute reproduction
            sans accord exprès des propriétaires est constitutive d'un acte de contrefaçon passible
            de sanctions civiles et pénales.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2>Liens hypertextes</h2>
          <p>
            Le site peut contenir des liens vers d'autres sites publics ou privés. L'éditeur
            n'exerce aucun contrôle sur le contenu de ces sites tiers et ne saurait être tenu
            responsable de leur contenu, de leur disponibilité ou des pratiques de leurs éditeurs.
          </p>
          <p>
            La mise en place de liens vers le présent site est libre, à l'exclusion de ceux
            susceptibles de porter atteinte aux intérêts du Gouvernement ou de laisser entendre une
            caution ou un partenariat qui n'existerait pas.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2>Limitation de responsabilité</h2>
          <p>
            L'éditeur s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées.
            Cependant, il ne peut garantir l'absence d'erreurs ou d'omissions et décline toute
            responsabilité pour les dommages directs ou indirects résultant de l'utilisation des
            informations contenues sur ce site.
          </p>
          <p>
            En cas de constat d'une erreur ou d'une omission, vous pouvez signaler le problème à
            l'adresse{' '}
            <Link href="mailto:contact@administration.gov.pf">contact@administration.gov.pf</Link>.
          </p>
        </CardBody>
      </Card>

      <Card variant="flat">
        <CardBody>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Dernière mise à jour : 25 avril 2026.
          </p>
        </CardBody>
      </Card>
    </article>
  );
}
