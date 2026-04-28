import type { Meta, StoryObj } from '@storybook/react';
import { LegalLayout } from './LegalLayout.js';
import { LegalSection } from './LegalSection.js';
import { LegalDefinitionList } from './LegalDefinitionList.js';
import { Breadcrumb } from '../Breadcrumb/Breadcrumb.js';
import { Link } from '../Link/Link.js';

const meta = {
  title: 'Composants/Mise en page/Legal',
  component: LegalLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Pattern de page éditoriale longue : mentions légales, RGPD, accessibilité, plan du site, CGU. Le DS fournit la structure (`LegalLayout`, `LegalSection`, `LegalDefinitionList`) ; le contenu est rédigé par chaque service consommateur.',
      },
    },
  },
} satisfies Meta<typeof LegalLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

const breadcrumb = (
  <Breadcrumb items={[{ label: 'Accueil', href: '#' }, { label: 'Mentions légales' }]} />
);

export const MentionsLegales: Story = {
  args: {
    title: 'Mentions légales',
    subtitle:
      "Informations légales relatives à l'éditeur, à l'hébergement et à l'exploitation de ce service en ligne.",
  },
  render: (args) => (
    <LegalLayout {...args} breadcrumb={breadcrumb}>
      <LegalSection title="Éditeur du site">
        <p>
          Le présent service est édité par le{' '}
          <strong>Gouvernement de la Polynésie française</strong>, autorité administrative agissant
          au nom des services administratifs polynésiens.
        </p>
        <LegalDefinitionList
          items={[
            { term: 'Adresse', description: 'Avenue Pouvanaa a Oopa, BP 2551, 98713 Papeete' },
            { term: 'Téléphone', description: '+689 40 47 20 00' },
            { term: 'Courriel', description: 'contact@administration.gov.pf' },
            { term: 'Numéro Tahiti', description: '123 456 - 001' },
          ]}
        />
      </LegalSection>

      <LegalSection title="Directeur de publication">
        <p>
          Le directeur de la publication est le secrétaire général du Gouvernement de la Polynésie
          française, ou toute personne désignée par délégation pour la mise en ligne de ce service.
        </p>
      </LegalSection>

      <LegalSection title="Hébergement">
        <p>
          Le service est hébergé sur l'infrastructure d'État de la Polynésie française, opérée par
          le <strong>Service de l'informatique</strong>.
        </p>
      </LegalSection>

      <LegalSection title="Limitation de responsabilité">
        <p>
          L'éditeur s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées.
          Cependant, il ne peut garantir l'absence d'erreurs ou d'omissions.
        </p>
        <p>
          En cas de constat d'une erreur, signaler le problème à{' '}
          <Link href="mailto:contact@administration.gov.pf">contact@administration.gov.pf</Link>.
        </p>
      </LegalSection>

      <LegalSection variant="flat">
        <p>Dernière mise à jour : 25 avril 2026.</p>
      </LegalSection>
    </LegalLayout>
  ),
};

export const Accessibilite: Story = {
  args: {
    title: "Déclaration d'accessibilité",
    subtitle:
      "Engagement du service à rendre ses contenus numériques accessibles, conformément au Référentiel Général d'Amélioration de l'Accessibilité (RGAA).",
  },
  render: (args) => (
    <LegalLayout {...args} breadcrumb={breadcrumb}>
      <LegalSection title="État de conformité">
        <p>
          Le service public en ligne est partiellement conforme avec le RGAA version 4.1. Les
          non-conformités et dérogations sont listées ci-dessous.
        </p>
      </LegalSection>

      <LegalSection title="Résultat de l'audit">
        <LegalDefinitionList
          items={[
            { term: "Date de l'audit", description: '15 mars 2026' },
            { term: 'Auditeur', description: "Service de l'informatique - cellule a11y" },
            { term: 'Taux de conformité', description: '87 %' },
            { term: 'Méthodologie', description: 'RGAA 4.1, échantillon de 25 pages' },
          ]}
        />
      </LegalSection>
    </LegalLayout>
  ),
};
