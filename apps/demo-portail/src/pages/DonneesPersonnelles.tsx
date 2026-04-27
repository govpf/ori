import { Alert, Breadcrumb, Card, CardBody, Link, Tag } from '@govpf/ori-react';
import type { Route } from '../App.js';

interface DonneesPersonnellesPageProps {
  onNavigate: (route: Route) => void;
}

export function DonneesPersonnellesPage({ onNavigate }: DonneesPersonnellesPageProps) {
  return (
    <article className="legal-page">
      <div className="page-header">
        <Breadcrumb
          items={[
            { label: 'Accueil', href: '#', onClick: () => onNavigate({ name: 'dashboard' }) },
            { label: 'Données personnelles' },
          ]}
        />
        <h1 className="page-title">Politique de protection des données</h1>
        <p className="page-subtitle">
          Cette politique décrit comment vos données personnelles sont collectées, utilisées et
          protégées dans le cadre de votre utilisation du service.
        </p>
      </div>

      <Alert variant="info" title="En résumé">
        Vos données ne sont utilisées que pour traiter vos démarches administratives. Elles ne sont
        jamais cédées à des tiers à des fins commerciales et vous disposez à tout moment d'un droit
        d'accès, de rectification et de suppression.
      </Alert>

      <Card>
        <CardBody>
          <h2>Responsable du traitement</h2>
          <p>
            Le responsable du traitement de vos données personnelles est le{' '}
            <strong>Gouvernement de la Polynésie française</strong>, représenté par le secrétaire
            général ou son délégué.
          </p>
          <dl className="legal-dl">
            <dt>Adresse postale</dt>
            <dd>Avenue Pouvanaa a Oopa, BP 2551, 98713 Papeete, Polynésie française</dd>
            <dt>Délégué à la protection des données (DPO)</dt>
            <dd>
              <Link href="mailto:dpo@administration.gov.pf">dpo@administration.gov.pf</Link>
            </dd>
          </dl>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2>Finalités du traitement</h2>
          <p>Vos données sont collectées pour les finalités suivantes :</p>
          <ul className="legal-list">
            <li>
              <strong>Identification et authentification</strong> de l'usager via le système
              Keycloak du Gouvernement
            </li>
            <li>
              <strong>Instruction des démarches</strong> demandées par l'usager auprès des services
              administratifs
            </li>
            <li>
              <strong>Notification</strong> de l'avancement des démarches et des évènements
              importants liés au compte
            </li>
            <li>
              <strong>Traçabilité et contrôle</strong> à des fins de sécurité et de prévention des
              fraudes
            </li>
            <li>
              <strong>Statistiques anonymes</strong> d'usage permettant d'améliorer le service (avec
              votre consentement explicite, retiré à tout moment dans vos préférences)
            </li>
          </ul>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2>Base légale</h2>
          <p>Le traitement de vos données s'appuie sur les bases légales suivantes :</p>
          <ul className="legal-list">
            <li>
              <strong>Mission d'intérêt public</strong> : pour les traitements nécessaires à
              l'exécution d'une mission de service public dont est investi le responsable du
              traitement
            </li>
            <li>
              <strong>Obligation légale</strong> : pour les traitements imposés par les textes en
              vigueur en Polynésie française
            </li>
            <li>
              <strong>Consentement</strong> : pour les traitements optionnels comme la collecte de
              statistiques d'usage anonymes
            </li>
          </ul>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2>Catégories de données collectées</h2>
          <p>
            Les catégories de données traitées varient selon la nature de la démarche. Elles peuvent
            comprendre :
          </p>
          <ul className="legal-list">
            <li>Données d'identité : civilité, nom, prénom, date de naissance, nationalité</li>
            <li>Données de contact : adresse postale, adresse électronique, numéro de téléphone</li>
            <li>
              Données de connexion : adresse IP, date et heure de connexion, type de navigateur
              (limitées à des fins de sécurité)
            </li>
            <li>Pièces justificatives téléversées dans le cadre des démarches</li>
            <li>Historique de vos démarches et de vos échanges avec les services</li>
          </ul>
          <p>
            Aucune donnée dite "<strong>sensible</strong>" au sens de l'article 9 du{' '}
            <abbr title="Règlement Général sur la Protection des Données">RGPD</abbr> (origine
            raciale, opinions politiques, données de santé, etc.) n'est collectée à l'exception des
            cas où une démarche spécifique l'exige explicitement.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2>Destinataires</h2>
          <p>Vos données sont uniquement accessibles aux destinataires suivants :</p>
          <ul className="legal-list">
            <li>
              Les <strong>agents instructeurs</strong> du service administratif concerné par la
              démarche, dans la stricte limite de ce qu'ils ont besoin pour traiter votre dossier
            </li>
            <li>
              Le <strong>Service de l'informatique</strong> pour les opérations de maintenance
              technique et de sécurité
            </li>
            <li>
              Les <strong>autorités habilitées</strong> sur réquisition légale (justice, contrôle
              administratif)
            </li>
          </ul>
          <p>
            Vos données <strong>ne sont jamais cédées</strong> à des tiers à des fins commerciales.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2>Durée de conservation</h2>
          <dl className="legal-dl">
            <dt>Compte usager</dt>
            <dd>
              Tant que le compte est actif. Suppression possible à tout moment depuis la page
              Sécurité.
            </dd>
            <dt>Démarches</dt>
            <dd>
              Conservées pendant la durée nécessaire à leur traitement, puis archivées selon les
              obligations légales (généralement 5 à 10 ans selon le type de démarche).
            </dd>
            <dt>Pièces justificatives</dt>
            <dd>
              Conservées pendant la durée d'instruction de la démarche, puis archivées ou supprimées
              selon les règles applicables au type de pièce.
            </dd>
            <dt>Logs de connexion</dt>
            <dd>
              Conservés <strong>12 mois</strong> à des fins de sécurité, puis supprimés
              automatiquement.
            </dd>
            <dt>Compte supprimé</dt>
            <dd>
              30 jours avant suppression définitive (délai de rétractation). Conservation de
              l'historique des démarches selon les obligations légales applicables.
            </dd>
          </dl>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2>Vos droits</h2>
          <p>
            Conformément à la réglementation applicable en Polynésie française, vous disposez des
            droits suivants sur vos données :
          </p>
          <ul className="legal-list">
            <li>
              <Tag variant="info">Accès</Tag> Obtenir la copie des données vous concernant
            </li>
            <li>
              <Tag variant="info">Rectification</Tag> Corriger les données inexactes ou incomplètes
            </li>
            <li>
              <Tag variant="info">Effacement</Tag> Demander la suppression de vos données dans les
              conditions prévues par la loi
            </li>
            <li>
              <Tag variant="info">Limitation</Tag> Limiter le traitement de vos données dans
              certaines situations
            </li>
            <li>
              <Tag variant="info">Opposition</Tag> Vous opposer au traitement pour motif légitime
            </li>
            <li>
              <Tag variant="info">Portabilité</Tag> Récupérer vos données dans un format structuré
              et lisible
            </li>
            <li>
              <Tag variant="info">Retrait du consentement</Tag> Retirer à tout moment votre
              consentement aux traitements optionnels
            </li>
          </ul>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2>Comment exercer vos droits</h2>
          <p>
            Pour exercer ces droits, vous pouvez contacter notre Délégué à la protection des données
            :
          </p>
          <dl className="legal-dl">
            <dt>Courriel</dt>
            <dd>
              <Link href="mailto:dpo@administration.gov.pf">dpo@administration.gov.pf</Link>
            </dd>
            <dt>Voie postale</dt>
            <dd>
              Délégué à la protection des données - Avenue Pouvanaa a Oopa, BP 2551, 98713 Papeete
            </dd>
          </dl>
          <p>
            Une réponse vous sera apportée dans un délai maximal d'<strong>1 mois</strong> à compter
            de la réception de votre demande, prorogeable de deux mois en cas de complexité
            particulière.
          </p>
          <p>
            Vous pouvez également formuler une <strong>réclamation</strong> auprès de l'autorité de
            contrôle compétente si vous estimez que vos droits ne sont pas respectés.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2>Cookies et traceurs</h2>
          <p>
            Ce service utilise un nombre minimal de cookies, exclusivement à des fins techniques :
          </p>
          <ul className="legal-list">
            <li>
              <strong>Cookies de session</strong> : nécessaires au fonctionnement de
              l'authentification, supprimés à la déconnexion
            </li>
            <li>
              <strong>Cookies de préférences</strong> : conservent vos choix (thème, langue) sur
              votre navigateur, durée de vie 12 mois
            </li>
            <li>
              <strong>Statistiques anonymes</strong> : uniquement avec votre consentement explicite,
              désactivable dans vos préférences. Outil interne ne transmettant aucune donnée à un
              tiers.
            </li>
          </ul>
          <p>
            <strong>Aucun cookie publicitaire</strong> ou de pistage tiers n'est déposé sur votre
            navigateur.
          </p>
        </CardBody>
      </Card>

      <Card variant="flat">
        <CardBody>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Politique mise à jour le 25 avril 2026.
          </p>
        </CardBody>
      </Card>
    </article>
  );
}
