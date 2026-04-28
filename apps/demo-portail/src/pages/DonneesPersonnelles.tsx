import {
  Alert,
  Breadcrumb,
  LegalDefinitionList,
  LegalLayout,
  LegalSection,
  Link,
  Tag,
} from '@govpf/ori-react';
import type { Route } from '../App.js';

interface DonneesPersonnellesPageProps {
  onNavigate: (route: Route) => void;
}

export function DonneesPersonnellesPage({ onNavigate }: DonneesPersonnellesPageProps) {
  return (
    <LegalLayout
      title="Politique de protection des données"
      subtitle="Cette politique décrit comment vos données personnelles sont collectées, utilisées et protégées dans le cadre de votre utilisation du service."
      breadcrumb={
        <Breadcrumb
          items={[
            { label: 'Accueil', href: '#', onClick: () => onNavigate({ name: 'dashboard' }) },
            { label: 'Données personnelles' },
          ]}
        />
      }
    >
      <Alert severity="info" title="En résumé">
        Vos données ne sont utilisées que pour traiter vos démarches administratives. Elles
        ne sont jamais cédées à des tiers à des fins commerciales et vous disposez à tout
        moment d'un droit d'accès, de rectification et de suppression.
      </Alert>

      <LegalSection title="Responsable du traitement">
        <p>
          Le responsable du traitement de vos données personnelles est le{' '}
          <strong>Gouvernement de la Polynésie française</strong>, représenté par le
          secrétaire général ou son délégué.
        </p>
        <LegalDefinitionList
          items={[
            {
              term: 'Adresse postale',
              description: 'Avenue Pouvanaa a Oopa, BP 2551, 98713 Papeete, Polynésie française',
            },
            {
              term: 'Délégué à la protection des données (DPO)',
              description: <Link href="mailto:dpo@administration.gov.pf">dpo@administration.gov.pf</Link>,
            },
          ]}
        />
      </LegalSection>

      <LegalSection title="Finalités du traitement">
        <p>Vos données sont collectées pour les finalités suivantes :</p>
        <ul className="legal-list">
          <li>
            <strong>Identification et authentification</strong> de l'usager via le système
            Keycloak du Gouvernement
          </li>
          <li>
            <strong>Instruction des démarches</strong> demandées par l'usager auprès des
            services administratifs
          </li>
          <li>
            <strong>Notification</strong> de l'avancement des démarches et des évènements
            importants liés au compte
          </li>
          <li>
            <strong>Traçabilité et contrôle</strong> à des fins de sécurité et de
            prévention des fraudes
          </li>
          <li>
            <strong>Statistiques anonymes</strong> d'usage permettant d'améliorer le service
            (avec votre consentement explicite, retiré à tout moment dans vos préférences)
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Base légale">
        <p>Le traitement de vos données s'appuie sur les bases légales suivantes :</p>
        <ul className="legal-list">
          <li>
            <strong>Mission d'intérêt public</strong> : pour les traitements nécessaires à
            l'exécution d'une mission de service public dont est investi le responsable du
            traitement
          </li>
          <li>
            <strong>Obligation légale</strong> : pour les traitements imposés par les textes
            en vigueur en Polynésie française
          </li>
          <li>
            <strong>Consentement</strong> : pour les traitements optionnels comme la
            collecte de statistiques d'usage anonymes
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Catégories de données collectées">
        <p>
          Les catégories de données traitées varient selon la nature de la démarche. Elles
          peuvent comprendre :
        </p>
        <ul className="legal-list">
          <li>Données d'identité : civilité, nom, prénom, date de naissance, nationalité</li>
          <li>Données de contact : adresse postale, adresse électronique, numéro de téléphone</li>
          <li>
            Données de connexion : adresse IP, date et heure de connexion, type de
            navigateur (limitées à des fins de sécurité)
          </li>
          <li>Pièces justificatives téléversées dans le cadre des démarches</li>
          <li>Historique de vos démarches et de vos échanges avec les services</li>
        </ul>
        <p>
          Aucune donnée dite "<strong>sensible</strong>" au sens de l'article 9 du{' '}
          <abbr title="Règlement Général sur la Protection des Données">RGPD</abbr> (origine
          raciale, opinions politiques, données de santé, etc.) n'est collectée à
          l'exception des cas où une démarche spécifique l'exige explicitement.
        </p>
      </LegalSection>

      <LegalSection title="Destinataires">
        <p>Vos données sont uniquement accessibles aux destinataires suivants :</p>
        <ul className="legal-list">
          <li>
            Les <strong>agents instructeurs</strong> du service administratif concerné par
            la démarche, dans la stricte limite de ce qu'ils ont besoin pour traiter votre
            dossier
          </li>
          <li>
            Le <strong>Service de l'informatique</strong> pour les opérations de
            maintenance technique et de sécurité
          </li>
          <li>
            Les <strong>autorités habilitées</strong> sur réquisition légale (justice,
            contrôle administratif)
          </li>
        </ul>
        <p>
          Vos données <strong>ne sont jamais cédées</strong> à des tiers à des fins
          commerciales.
        </p>
      </LegalSection>

      <LegalSection title="Durée de conservation">
        <LegalDefinitionList
          items={[
            {
              term: 'Compte usager',
              description: 'Tant que le compte est actif. Suppression possible à tout moment depuis la page Sécurité.',
            },
            {
              term: 'Démarches',
              description: 'Conservées pendant la durée nécessaire à leur traitement, puis archivées selon les obligations légales (généralement 5 à 10 ans selon le type de démarche).',
            },
            {
              term: 'Pièces justificatives',
              description: "Conservées pendant la durée d'instruction de la démarche, puis archivées ou supprimées selon les règles applicables au type de pièce.",
            },
            {
              term: 'Logs de connexion',
              description: <>Conservés <strong>12 mois</strong> à des fins de sécurité, puis supprimés automatiquement.</>,
            },
            {
              term: 'Compte supprimé',
              description: "30 jours avant suppression définitive (délai de rétractation). Conservation de l'historique des démarches selon les obligations légales applicables.",
            },
          ]}
        />
      </LegalSection>

      <LegalSection title="Vos droits">
        <p>
          Conformément à la réglementation applicable en Polynésie française, vous disposez
          des droits suivants sur vos données :
        </p>
        <ul className="legal-list">
          <li><Tag variant="info">Accès</Tag> Obtenir la copie des données vous concernant</li>
          <li><Tag variant="info">Rectification</Tag> Corriger les données inexactes ou incomplètes</li>
          <li><Tag variant="info">Effacement</Tag> Demander la suppression de vos données dans les conditions prévues par la loi</li>
          <li><Tag variant="info">Limitation</Tag> Limiter le traitement de vos données dans certaines situations</li>
          <li><Tag variant="info">Opposition</Tag> Vous opposer au traitement pour motif légitime</li>
          <li><Tag variant="info">Portabilité</Tag> Récupérer vos données dans un format structuré et lisible</li>
          <li><Tag variant="info">Retrait du consentement</Tag> Retirer à tout moment votre consentement aux traitements optionnels</li>
        </ul>
      </LegalSection>

      <LegalSection title="Comment exercer vos droits">
        <p>
          Pour exercer ces droits, vous pouvez contacter notre Délégué à la protection des
          données :
        </p>
        <LegalDefinitionList
          items={[
            {
              term: 'Courriel',
              description: <Link href="mailto:dpo@administration.gov.pf">dpo@administration.gov.pf</Link>,
            },
            {
              term: 'Voie postale',
              description: 'Délégué à la protection des données - Avenue Pouvanaa a Oopa, BP 2551, 98713 Papeete',
            },
          ]}
        />
        <p>
          Une réponse vous sera apportée dans un délai maximal d'<strong>1 mois</strong> à
          compter de la réception de votre demande, prorogeable de deux mois en cas de
          complexité particulière.
        </p>
        <p>
          Vous pouvez également formuler une <strong>réclamation</strong> auprès de
          l'autorité de contrôle compétente si vous estimez que vos droits ne sont pas
          respectés.
        </p>
      </LegalSection>

      <LegalSection title="Cookies et traceurs">
        <p>
          Ce service utilise un nombre minimal de cookies, exclusivement à des fins
          techniques :
        </p>
        <ul className="legal-list">
          <li>
            <strong>Cookies de session</strong> : nécessaires au fonctionnement de
            l'authentification, supprimés à la déconnexion
          </li>
          <li>
            <strong>Cookies de préférences</strong> : conservent vos choix (thème, langue)
            sur votre navigateur, durée de vie 12 mois
          </li>
          <li>
            <strong>Statistiques anonymes</strong> : uniquement avec votre consentement
            explicite, désactivable dans vos préférences. Outil interne ne transmettant
            aucune donnée à un tiers.
          </li>
        </ul>
        <p>
          <strong>Aucun cookie publicitaire</strong> ou de pistage tiers n'est déposé sur
          votre navigateur.
        </p>
      </LegalSection>

      <LegalSection variant="flat">
        <p>Politique mise à jour le 25 avril 2026.</p>
      </LegalSection>
    </LegalLayout>
  );
}
