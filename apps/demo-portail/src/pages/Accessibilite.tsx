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

interface AccessibilitePageProps {
  onNavigate: (route: Route) => void;
}

export function AccessibilitePage({ onNavigate }: AccessibilitePageProps) {
  return (
    <LegalLayout
      title="Déclaration d'accessibilité"
      subtitle="Le Gouvernement de la Polynésie française s'engage à rendre ses services numériques accessibles à toutes et à tous, conformément au RGAA."
      breadcrumb={
        <Breadcrumb
          items={[
            { label: 'Accueil', href: '#', onClick: () => onNavigate({ name: 'dashboard' }) },
            { label: 'Accessibilité' },
          ]}
        />
      }
    >
      <LegalSection title="État de conformité">
        <p>
          Ce service est <strong>partiellement conforme</strong> au Référentiel Général
          d'Amélioration de l'Accessibilité (
          <abbr title="Référentiel Général d'Amélioration de l'Accessibilité">RGAA</abbr>) version
          4.1, niveau <Tag variant="success">AA</Tag>.
        </p>
        <p>
          Le RGAA est le référentiel français qui définit les règles permettant aux sites web et aux
          applications mobiles d'être utilisables par les personnes en situation de handicap. Il est
          aligné sur le standard international{' '}
          <abbr title="Web Content Accessibility Guidelines">WCAG</abbr> 2.1 niveau AA.
        </p>
      </LegalSection>

      <LegalSection title="Résultat de l'audit">
        <LegalDefinitionList
          items={[
            { term: 'Date du dernier audit', description: '20 mars 2026' },
            {
              term: 'Auditeur',
              description: "Audit interne, équipe accessibilité du Service de l'informatique",
            },
            { term: 'Méthodologie', description: 'RGAA 4.1 - méthode officielle DINUM' },
            {
              term: 'Échantillon testé',
              description: '15 pages représentatives du parcours usager',
            },
            {
              term: 'Taux de conformité global',
              description: (
                <>
                  <strong>87 %</strong> des critères applicables respectés
                </>
              ),
            },
          ]}
        />
      </LegalSection>

      <LegalSection title="Contenus non accessibles">
        <p>
          Malgré nos efforts, certains contenus présentent encore des défauts d'accessibilité. Nous
          travaillons activement à leur correction.
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
      </LegalSection>

      <LegalSection title="Améliorations en cours">
        <ul className="legal-list">
          <li>Refonte du composant de téléversement avec retour vocal de progression</li>
          <li>Audit complet du parcours d'authentification Keycloak</li>
          <li>Sous-titrage des vidéos antérieures à 2025</li>
          <li>Amélioration du contraste dans les graphiques de tableaux de bord</li>
          <li>Mise en place d'un mode "haut contraste" dans les préférences</li>
        </ul>
      </LegalSection>

      <Alert severity="info" title="Voies de recours">
        Si vous constatez un défaut d'accessibilité vous empêchant d'accéder à un contenu ou à une
        fonctionnalité, vous pouvez nous contacter pour être orienté vers une alternative ou obtenir
        le contenu sous une autre forme.
      </Alert>

      <LegalSection title="Nous contacter">
        <p>Pour signaler un problème d'accessibilité ou demander une assistance :</p>
        <LegalDefinitionList
          items={[
            {
              term: 'Courriel dédié',
              description: (
                <Link href="mailto:accessibilite@administration.gov.pf">
                  accessibilite@administration.gov.pf
                </Link>
              ),
            },
            {
              term: 'Téléphone',
              description: '+689 40 47 20 00 (du lundi au vendredi, 7h30 - 14h30)',
            },
            { term: 'Voie postale', description: 'Avenue Pouvanaa a Oopa, BP 2551, 98713 Papeete' },
          ]}
        />
        <p>
          Nous nous engageons à vous répondre sous <strong>10 jours ouvrés</strong>
          maximum, en proposant le cas échéant un mode alternatif d'accès au service demandé.
        </p>
      </LegalSection>

      <LegalSection title="Recours">
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
      </LegalSection>

      <LegalSection variant="flat">
        <p>Déclaration établie le 20 mars 2026, mise à jour le 25 avril 2026.</p>
      </LegalSection>
    </LegalLayout>
  );
}
