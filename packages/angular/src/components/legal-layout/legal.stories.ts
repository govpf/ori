import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriLegalLayoutComponent } from './legal-layout.component';
import { OriLegalSectionComponent } from '../legal-section/legal-section.component';
import {
  OriLegalDefinitionListComponent,
  type OriLegalDefinitionListItem,
} from '../legal-definition-list/legal-definition-list.component';
import { OriBreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

const meta: Meta<OriLegalLayoutComponent> = {
  title: 'Composants/Mise en page/Legal',
  component: OriLegalLayoutComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Pattern de page éditoriale longue : mentions légales, RGPD, accessibilité, plan du site, CGU. Le DS fournit la structure (`ori-legal-layout`, `ori-legal-section`, `ori-legal-definition-list`) ; le contenu est rédigé par chaque service consommateur.',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [OriLegalSectionComponent, OriLegalDefinitionListComponent, OriBreadcrumbComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<OriLegalLayoutComponent>;

const editeurItems: OriLegalDefinitionListItem[] = [
  { term: 'Adresse', description: 'Avenue Pouvanaa a Oopa, BP 2551, 98713 Papeete' },
  { term: 'Téléphone', description: '+689 40 47 20 00' },
  { term: 'Courriel', description: 'contact@administration.gov.pf' },
  { term: 'Numéro Tahiti', description: '123 456 - 001' },
];

export const MentionsLegales: Story = {
  args: {
    title: 'Mentions légales',
    subtitle:
      "Informations légales relatives à l'éditeur, à l'hébergement et à l'exploitation de ce service en ligne.",
  },
  render: (args: Args) => ({
    props: { ...args, editeurItems },
    template: `
      <ori-legal-layout [title]="title" [subtitle]="subtitle">
        <ori-breadcrumb oriLegalBreadcrumb [items]="[
          { label: 'Accueil', href: '#' },
          { label: 'Mentions légales' }
        ]"></ori-breadcrumb>

        <ori-legal-section title="Éditeur du site">
          <p>Le présent service est édité par le <strong>Gouvernement de la Polynésie française</strong>, autorité administrative agissant au nom des services administratifs polynésiens.</p>
          <ori-legal-definition-list [items]="editeurItems"></ori-legal-definition-list>
        </ori-legal-section>

        <ori-legal-section title="Directeur de publication">
          <p>Le directeur de la publication est le secrétaire général du Gouvernement de la Polynésie française, ou toute personne désignée par délégation pour la mise en ligne de ce service.</p>
        </ori-legal-section>

        <ori-legal-section title="Hébergement">
          <p>Le service est hébergé sur l'infrastructure d'État de la Polynésie française, opérée par le <strong>Service de l'informatique</strong>.</p>
        </ori-legal-section>

        <ori-legal-section variant="flat">
          <p>Dernière mise à jour : 25 avril 2026.</p>
        </ori-legal-section>
      </ori-legal-layout>
    `,
  }),
};

export const Accessibilite: Story = {
  args: {
    title: "Déclaration d'accessibilité",
    subtitle:
      "Engagement du service à rendre ses contenus numériques accessibles, conformément au Référentiel Général d'Amélioration de l'Accessibilité (RGAA).",
  },
  render: (args: Args) => ({
    props: {
      ...args,
      auditItems: [
        { term: "Date de l'audit", description: '15 mars 2026' },
        { term: 'Auditeur', description: "Service de l'informatique - cellule a11y" },
        { term: 'Taux de conformité', description: '87 %' },
        { term: 'Méthodologie', description: 'RGAA 4.1, échantillon de 25 pages' },
      ],
    },
    template: `
      <ori-legal-layout [title]="title" [subtitle]="subtitle">
        <ori-legal-section title="État de conformité">
          <p>Le service public en ligne est partiellement conforme avec le RGAA version 4.1. Les non-conformités et dérogations sont listées ci-dessous.</p>
        </ori-legal-section>

        <ori-legal-section title="Résultat de l'audit">
          <ori-legal-definition-list [items]="auditItems"></ori-legal-definition-list>
        </ori-legal-section>
      </ori-legal-layout>
    `,
  }),
};
