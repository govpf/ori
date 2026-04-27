import { Alert, Breadcrumb, Card, CardBody, Link, Tag } from '@govpf/ori-react';
import type { Route } from '../App.js';

interface AccessibilitePageProps {
  onNavigate: (route: Route) => void;
}

export function AccessibilitePage({ onNavigate }: AccessibilitePageProps) {
  return (
    <article className="legal-page">
      <div className="page-header">
        <Breadcrumb
          items={[
            { label: 'Accueil', href: '#', onClick: () => onNavigate({ name: 'dashboard' }) },
            { label: 'Accessibilité' },
          ]}
        />
        <h1 className="page-title">Déclaration d'accessibilité</h1>
        <p className="page-subtitle">
          Le Gouvernement de la Polynésie française s'engage à rendre ses services numériques
          accessibles à toutes et à tous, conformément au RGAA.
        </p>
      </div>

      <Card>
        <CardBody>
          <h2>État de conformité</h2>
          <p>
            Ce service est <strong>partiellement conforme</strong> au Référentiel Général
            d'Amélioration de l'Accessibilité (
            <abbr
              title="Référentiel Général
            d'Amélioration de l'Accessibilité"
            >
              RGAA
            </abbr>
            ) version 4.1, niveau <Tag variant="success">AA</Tag>.
          </p>
          <p>
            Le RGAA est le référentiel français qui définit les règles permettant aux sites web et
            aux applications mobiles d'être utilisables par les personnes en situation de handicap.
            Il est aligné sur le standard international{' '}
            <abbr title="Web Content Accessibility Guidelines">WCAG</abbr> 2.1 niveau AA.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2>Résultat de l'audit</h2>
          <dl className="legal-dl">
            <dt>Date du dernier audit</dt>
            <dd>20 mars 2026</dd>
            <dt>Auditeur</dt>
            <dd>Audit interne, équipe accessibilité du Service de l'informatique</dd>
            <dt>Méthodologie</dt>
            <dd>RGAA 4.1 - méthode officielle DINUM</dd>
            <dt>Échantillon testé</dt>
            <dd>15 pages représentatives du parcours usager</dd>
            <dt>Taux de conformité global</dt>
            <dd>
              <strong>87 %</strong> des critères applicables respectés
            </dd>
          </dl>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2>Contenus non accessibles</h2>
          <p>
            Malgré nos efforts, certains contenus présentent encore des défauts d'accessibilité.
            Nous travaillons activement à leur correction.
          </p>
          <h3>Non-conformités connues</h3>
          <ul className="legal-list">
            <li>
              Certaines anciennes pièces jointes au format PDF ne respectent pas intégralement les
              règles de balisage. Une refonte progressive est en cours.
            </li>
            <li>
              Quelques tableaux de données complexes ne disposent pas encore de résumés ou de
              descriptions d'en-têtes complètes.
            </li>
            <li>
              Une partie des vidéos mises en ligne avant 2025 ne sont pas encore sous-titrées ; un
              programme de sous-titrage rétroactif est planifié sur l'année 2026.
            </li>
          </ul>
          <h3>Dérogations</h3>
          <p>
            Aucune dérogation pour <em>charge disproportionnée</em> n'a été déclarée. Les contenus
            tiers (cartes interactives, modules embarqués) qui ne relèveraient pas de la
            responsabilité directe de l'éditeur sont signalés au cas par cas.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2>Améliorations en cours</h2>
          <ul className="legal-list">
            <li>Refonte du composant de téléversement avec retour vocal de progression</li>
            <li>Audit complet du parcours d'authentification Keycloak</li>
            <li>Sous-titrage des vidéos antérieures à 2025</li>
            <li>Amélioration du contraste dans les graphiques de tableaux de bord</li>
            <li>Mise en place d'un mode "haut contraste" dans les préférences</li>
          </ul>
        </CardBody>
      </Card>

      <Alert variant="info" title="Voies de recours">
        Si vous constatez un défaut d'accessibilité vous empêchant d'accéder à un contenu ou à une
        fonctionnalité, vous pouvez nous contacter pour être orienté vers une alternative ou obtenir
        le contenu sous une autre forme.
      </Alert>

      <Card>
        <CardBody>
          <h2>Nous contacter</h2>
          <p>Pour signaler un problème d'accessibilité ou demander une assistance :</p>
          <dl className="legal-dl">
            <dt>Courriel dédié</dt>
            <dd>
              <Link href="mailto:accessibilite@administration.gov.pf">
                accessibilite@administration.gov.pf
              </Link>
            </dd>
            <dt>Téléphone</dt>
            <dd>+689 40 47 20 00 (du lundi au vendredi, 7h30 - 14h30)</dd>
            <dt>Voie postale</dt>
            <dd>Avenue Pouvanaa a Oopa, BP 2551, 98713 Papeete</dd>
          </dl>
          <p>
            Nous nous engageons à vous répondre sous <strong>10 jours ouvrés</strong> maximum, en
            proposant le cas échéant un mode alternatif d'accès au service demandé.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2>Recours</h2>
          <p>
            Cette procédure de réclamation est à utiliser dans le cas où vous n'avez pas obtenu de
            réponse satisfaisante après nous avoir contactés. Vous pouvez :
          </p>
          <ul className="legal-list">
            <li>
              Adresser un courrier au <strong>Médiateur de la Polynésie française</strong>
            </li>
            <li>
              Saisir la <strong>Défenseure des droits</strong> via le formulaire en ligne ou par
              courrier
            </li>
          </ul>
        </CardBody>
      </Card>

      <Card variant="flat">
        <CardBody>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Déclaration établie le 20 mars 2026, mise à jour le 25 avril 2026.
          </p>
        </CardBody>
      </Card>
    </article>
  );
}
