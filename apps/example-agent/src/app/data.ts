/**
 * Données mockées pour l'espace agent.
 * Représentent une file de dossiers à instruire dans un service
 * administratif PF (ex. demandes de subvention patrimoine). Tous les
 * montants sont libellés en F CFP, monnaie ayant cours en Polynésie
 * française.
 */

export type DossierStatut = 'a_instruire' | 'en_cours' | 'a_completer' | 'valide' | 'rejete';

export interface Dossier {
  id: string;
  numero: string;
  demandeur: string;
  type: string;
  commune: string;
  montant: string;
  dateDepot: string;
  statut: DossierStatut;
  agent: string | null;
  priorite: 'haute' | 'normale' | 'basse';
}

export const STATUT_LABEL: Record<DossierStatut, string> = {
  a_instruire: 'À instruire',
  en_cours: "En cours d'instruction",
  a_completer: 'À compléter',
  valide: 'Validé',
  rejete: 'Rejeté',
};

export const STATUT_VARIANT: Record<
  DossierStatut,
  'info' | 'warning' | 'success' | 'danger' | 'neutral'
> = {
  a_instruire: 'info',
  en_cours: 'warning',
  a_completer: 'warning',
  valide: 'success',
  rejete: 'danger',
};

export const dossiers: Dossier[] = [
  {
    id: 'd-001',
    numero: 'PAT-2026-0142',
    demandeur: 'Commune de Papeete',
    type: 'Restauration de marae',
    commune: 'Papeete',
    montant: '14 920 000 F CFP',
    dateDepot: '2026-04-12',
    statut: 'a_instruire',
    agent: null,
    priorite: 'haute',
  },
  {
    id: 'd-002',
    numero: 'PAT-2026-0141',
    demandeur: 'Association Heiva i Tahiti',
    type: 'Sauvegarde immatérielle',
    commune: "Faa'a",
    montant: '4 595 000 F CFP',
    dateDepot: '2026-04-11',
    statut: 'en_cours',
    agent: 'Heitiare T.',
    priorite: 'normale',
  },
  {
    id: 'd-003',
    numero: 'PAT-2026-0140',
    demandeur: 'M. Tetuanui A.',
    type: 'Classement bâtiment',
    commune: 'Pirae',
    montant: '0 F CFP',
    dateDepot: '2026-04-09',
    statut: 'a_completer',
    agent: 'Manuarii P.',
    priorite: 'normale',
  },
  {
    id: 'd-004',
    numero: 'PAT-2026-0139',
    demandeur: 'Commune de Tubuai',
    type: 'Inventaire archéologique',
    commune: 'Tubuai',
    montant: '8 020 000 F CFP',
    dateDepot: '2026-04-08',
    statut: 'en_cours',
    agent: 'Heitiare T.',
    priorite: 'basse',
  },
  {
    id: 'd-005',
    numero: 'PAT-2026-0138',
    demandeur: 'Mme Vaihere R.',
    type: 'Subvention restauration',
    commune: 'Bora-Bora',
    montant: '1 770 000 F CFP',
    dateDepot: '2026-04-05',
    statut: 'valide',
    agent: 'Heitiare T.',
    priorite: 'normale',
  },
  {
    id: 'd-006',
    numero: 'PAT-2026-0137',
    demandeur: 'Association Tama Nō Te Ora',
    type: 'Numérisation archives',
    commune: 'Papeete',
    montant: '2 625 000 F CFP',
    dateDepot: '2026-04-03',
    statut: 'a_instruire',
    agent: null,
    priorite: 'haute',
  },
  {
    id: 'd-007',
    numero: 'PAT-2026-0136',
    demandeur: 'Commune de Hiva Oa',
    type: 'Site patrimonial remarquable',
    commune: 'Hiva Oa',
    montant: '11 280 000 F CFP',
    dateDepot: '2026-04-02',
    statut: 'rejete',
    agent: 'Manuarii P.',
    priorite: 'normale',
  },
  {
    id: 'd-008',
    numero: 'PAT-2026-0135',
    demandeur: "Comité d'organisation Heiva",
    type: 'Festival traditions',
    commune: 'Papeete',
    montant: '21 480 000 F CFP',
    dateDepot: '2026-03-28',
    statut: 'en_cours',
    agent: 'Heitiare T.',
    priorite: 'haute',
  },
];
