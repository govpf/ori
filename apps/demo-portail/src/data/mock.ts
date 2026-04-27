/**
 * Données mockées pour la démo. Volontairement génériques (pas de
 * domaine métier d'un service spécifique - cf. décision transverse).
 */

export type StatutDemande = 'brouillon' | 'en_cours' | 'a_completer' | 'valide' | 'refuse';

export interface Demande {
  id: string;
  numero: string;
  type: string;
  service: string;
  statut: StatutDemande;
  dateCreation: string;
  dateMaj: string;
  etapeActuelle: number;
  etapesTotal: number;
}

export interface Document {
  id: string;
  nom: string;
  type: 'pdf' | 'image' | 'doc';
  taille: string;
  dateAjout: string;
  demandeNumero?: string;
}

export interface HistoriqueEntry {
  id: string;
  date: string;
  action: string;
  acteur: string;
  detail?: string;
}

export const STATUT_VARIANT: Record<
  StatutDemande,
  'neutral' | 'info' | 'success' | 'warning' | 'danger'
> = {
  brouillon: 'neutral',
  en_cours: 'info',
  a_completer: 'warning',
  valide: 'success',
  refuse: 'danger',
};

export const STATUT_LABEL: Record<StatutDemande, string> = {
  brouillon: 'Brouillon',
  en_cours: 'En cours',
  a_completer: 'À compléter',
  valide: 'Validé',
  refuse: 'Refusé',
};

export const demandes: Demande[] = [
  {
    id: 'd1',
    numero: '2026-0042',
    type: 'Demande de licence',
    service: 'Service A',
    statut: 'en_cours',
    dateCreation: '2026-04-22',
    dateMaj: '2026-04-23',
    etapeActuelle: 2,
    etapesTotal: 4,
  },
  {
    id: 'd2',
    numero: '2026-0041',
    type: "Renouvellement d'autorisation",
    service: 'Service B',
    statut: 'a_completer',
    dateCreation: '2026-04-20',
    dateMaj: '2026-04-22',
    etapeActuelle: 1,
    etapesTotal: 4,
  },
  {
    id: 'd3',
    numero: '2026-0038',
    type: 'Inscription au registre',
    service: 'Service C',
    statut: 'valide',
    dateCreation: '2026-04-15',
    dateMaj: '2026-04-19',
    etapeActuelle: 4,
    etapesTotal: 4,
  },
  {
    id: 'd4',
    numero: '2026-0037',
    type: 'Modification de coordonnées',
    service: 'Service A',
    statut: 'valide',
    dateCreation: '2026-04-12',
    dateMaj: '2026-04-14',
    etapeActuelle: 4,
    etapesTotal: 4,
  },
  {
    id: 'd5',
    numero: '2026-0033',
    type: 'Demande de licence',
    service: 'Service A',
    statut: 'refuse',
    dateCreation: '2026-04-08',
    dateMaj: '2026-04-11',
    etapeActuelle: 4,
    etapesTotal: 4,
  },
  {
    id: 'd6',
    numero: '2026-0029',
    type: 'Brouillon non envoyé',
    service: 'Service B',
    statut: 'brouillon',
    dateCreation: '2026-04-05',
    dateMaj: '2026-04-05',
    etapeActuelle: 0,
    etapesTotal: 4,
  },
];

export const documents: Document[] = [
  {
    id: 'doc1',
    nom: 'Pièce identité.pdf',
    type: 'pdf',
    taille: '1.2 Mo',
    dateAjout: '2026-04-22',
    demandeNumero: '2026-0042',
  },
  {
    id: 'doc2',
    nom: 'Justificatif domicile.pdf',
    type: 'pdf',
    taille: '850 Ko',
    dateAjout: '2026-04-22',
    demandeNumero: '2026-0042',
  },
  {
    id: 'doc3',
    nom: 'Photo identité.jpg',
    type: 'image',
    taille: '2.3 Mo',
    dateAjout: '2026-04-20',
    demandeNumero: '2026-0041',
  },
  {
    id: 'doc4',
    nom: 'Attestation employeur.pdf',
    type: 'pdf',
    taille: '430 Ko',
    dateAjout: '2026-04-15',
  },
  {
    id: 'doc5',
    nom: 'Récépissé 2026-0042.pdf',
    type: 'pdf',
    taille: '120 Ko',
    dateAjout: '2026-04-22',
    demandeNumero: '2026-0042',
  },
  {
    id: 'doc6',
    nom: 'Statuts.docx',
    type: 'doc',
    taille: '180 Ko',
    dateAjout: '2026-04-15',
    demandeNumero: '2026-0038',
  },
  {
    id: 'doc7',
    nom: 'Plan de situation.jpg',
    type: 'image',
    taille: '3.1 Mo',
    dateAjout: '2026-04-10',
  },
  {
    id: 'doc8',
    nom: 'Avis instruction.pdf',
    type: 'pdf',
    taille: '95 Ko',
    dateAjout: '2026-04-08',
    demandeNumero: '2026-0033',
  },
];

export const historique: HistoriqueEntry[] = [
  {
    id: 'h1',
    date: '2026-04-23 14:30',
    action: 'Pièce justificative ajoutée',
    acteur: 'Vous',
    detail: 'Justificatif domicile.pdf',
  },
  {
    id: 'h2',
    date: '2026-04-23 09:12',
    action: 'Demande validée par le service instructeur',
    acteur: 'Service A',
    detail: 'Identité vérifiée',
  },
  {
    id: 'h3',
    date: '2026-04-22 16:45',
    action: 'Demande déposée',
    acteur: 'Vous',
  },
  {
    id: 'h4',
    date: '2026-04-22 16:30',
    action: 'Brouillon créé',
    acteur: 'Vous',
  },
];

export type NotifVariant = 'info' | 'success' | 'warning' | 'danger';
export type NotifCategorie = 'demarche' | 'document' | 'compte' | 'systeme';

export interface NotificationItem {
  id: string;
  variant: NotifVariant;
  categorie: NotifCategorie;
  titre: string;
  message: string;
  date: string;
  lu: boolean;
  archive?: boolean;
  demandeNumero?: string;
}

export const NOTIF_CATEGORIE_LABEL: Record<NotifCategorie, string> = {
  demarche: 'Démarche',
  document: 'Document',
  compte: 'Compte',
  systeme: 'Système',
};

export const notificationsInitiales: NotificationItem[] = [
  {
    id: 'n1',
    variant: 'warning',
    categorie: 'demarche',
    titre: 'Pièce justificative manquante',
    message: 'Votre demande 2026-0041 nécessite un justificatif de domicile pour être instruite.',
    date: '2026-04-24 09:12',
    lu: false,
    demandeNumero: '2026-0041',
  },
  {
    id: 'n2',
    variant: 'success',
    categorie: 'demarche',
    titre: 'Demande validée',
    message: 'Votre demande 2026-0038 a été validée par le Service C.',
    date: '2026-04-19 16:42',
    lu: false,
    demandeNumero: '2026-0038',
  },
  {
    id: 'n3',
    variant: 'info',
    categorie: 'document',
    titre: 'Nouveau document disponible',
    message: 'Un récépissé est disponible dans Mes documents.',
    date: '2026-04-22 11:05',
    lu: false,
    demandeNumero: '2026-0042',
  },
  {
    id: 'n4',
    variant: 'info',
    categorie: 'compte',
    titre: 'Connexion depuis un nouvel appareil',
    message: 'Connexion détectée depuis Chrome sur Windows à Papeete.',
    date: '2026-04-22 08:30',
    lu: true,
  },
  {
    id: 'n5',
    variant: 'danger',
    categorie: 'demarche',
    titre: 'Demande refusée',
    message:
      "Votre demande 2026-0033 n'a pas pu être validée. Consultez le motif dans le détail de la demande.",
    date: '2026-04-11 14:18',
    lu: true,
    demandeNumero: '2026-0033',
  },
  {
    id: 'n6',
    variant: 'info',
    categorie: 'systeme',
    titre: 'Maintenance programmée',
    message: 'Une maintenance technique est prévue dimanche 28 avril de 22h à 23h.',
    date: '2026-04-20 10:00',
    lu: true,
  },
  {
    id: 'n7',
    variant: 'success',
    categorie: 'document',
    titre: 'Document signé',
    message: 'Le document Attestation employeur.pdf a bien été signé.',
    date: '2026-04-15 17:22',
    lu: true,
    archive: true,
  },
];

// ─── Annuaire des services administratifs (mock) ──────────────────────

export type ServiceSecteur =
  | 'etat-civil'
  | 'economie'
  | 'logement'
  | 'famille'
  | 'social'
  | 'fiscalite'
  | 'mobilite'
  | 'environnement'
  | 'culture'
  | 'sante'
  | 'education'
  | 'emploi';

export interface ServiceAdministratif {
  id: string;
  nom: string;
  secteur: ServiceSecteur;
  ile: string;
  adresse: string;
  telephone: string;
  email: string;
  horaires: string;
  siteWeb?: string;
}

export const SERVICE_SECTEUR_LABEL: Record<ServiceSecteur, string> = {
  'etat-civil': 'État civil & identité',
  economie: 'Activité économique',
  logement: 'Logement & urbanisme',
  famille: 'Famille & enfance',
  social: 'Solidarité & aides sociales',
  fiscalite: 'Fiscalité',
  mobilite: 'Mobilité & transport',
  environnement: 'Environnement',
  culture: 'Culture & sport',
  sante: 'Santé',
  education: 'Éducation',
  emploi: 'Emploi & formation',
};

const SERVICE_TEMPLATES: { name: string; secteur: ServiceSecteur }[] = [
  { name: "Direction de l'état civil", secteur: 'etat-civil' },
  { name: "Bureau des cartes d'identité", secteur: 'etat-civil' },
  { name: 'Service des passeports', secteur: 'etat-civil' },
  { name: 'Bureau de la nationalité', secteur: 'etat-civil' },
  { name: 'Service des actes notariés', secteur: 'etat-civil' },
  { name: 'Direction des activités économiques', secteur: 'economie' },
  { name: 'Registre du commerce', secteur: 'economie' },
  { name: 'Bureau des licences professionnelles', secteur: 'economie' },
  { name: "Service des autorisations d'exercice", secteur: 'economie' },
  { name: 'Cellule développement entrepreneurial', secteur: 'economie' },
  { name: "Direction de l'urbanisme", secteur: 'logement' },
  { name: 'Bureau des permis de construire', secteur: 'logement' },
  { name: 'Service du logement social', secteur: 'logement' },
  { name: 'Cadastre et foncier', secteur: 'logement' },
  { name: "Bureau de l'aménagement du territoire", secteur: 'logement' },
  { name: 'Direction de la famille', secteur: 'famille' },
  { name: "Bureau de la protection de l'enfance", secteur: 'famille' },
  { name: "Service d'accueil des jeunes enfants", secteur: 'famille' },
  { name: 'Cellule médiation familiale', secteur: 'famille' },
  { name: 'Direction de la solidarité', secteur: 'social' },
  { name: 'Bureau des aides sociales', secteur: 'social' },
  { name: 'Service des allocations familiales', secteur: 'social' },
  { name: "Bureau d'accompagnement des seniors", secteur: 'social' },
  { name: "Service du handicap et de l'autonomie", secteur: 'social' },
  { name: 'Direction des contributions', secteur: 'fiscalite' },
  { name: 'Bureau de la déclaration des revenus', secteur: 'fiscalite' },
  { name: 'Service du recouvrement', secteur: 'fiscalite' },
  { name: 'Cellule fiscalité des entreprises', secteur: 'fiscalite' },
  { name: 'Direction des transports terrestres', secteur: 'mobilite' },
  { name: 'Bureau du permis de conduire', secteur: 'mobilite' },
  { name: 'Service des immatriculations', secteur: 'mobilite' },
  { name: 'Affaires maritimes', secteur: 'mobilite' },
  { name: 'Aviation civile', secteur: 'mobilite' },
  { name: "Direction de l'environnement", secteur: 'environnement' },
  { name: 'Bureau de la protection des espaces naturels', secteur: 'environnement' },
  { name: "Service des déchets et de l'assainissement", secteur: 'environnement' },
  { name: 'Cellule transition énergétique', secteur: 'environnement' },
  { name: 'Direction de la culture et du patrimoine', secteur: 'culture' },
  { name: 'Bureau des archives', secteur: 'culture' },
  { name: 'Service du sport et de la jeunesse', secteur: 'culture' },
  { name: 'Cellule événementiel culturel', secteur: 'culture' },
  { name: 'Direction de la santé publique', secteur: 'sante' },
  { name: 'Bureau de la protection sanitaire', secteur: 'sante' },
  { name: 'Service de la prévention santé', secteur: 'sante' },
  { name: 'Cellule veille épidémiologique', secteur: 'sante' },
  { name: "Direction générale de l'éducation", secteur: 'education' },
  { name: 'Bureau de la scolarité', secteur: 'education' },
  { name: "Service de l'orientation", secteur: 'education' },
  { name: 'Cellule enseignement supérieur', secteur: 'education' },
  { name: "Direction du travail et de l'emploi", secteur: 'emploi' },
  { name: 'Bureau de la formation professionnelle', secteur: 'emploi' },
  { name: "Service de l'apprentissage", secteur: 'emploi' },
  { name: 'Cellule insertion professionnelle', secteur: 'emploi' },
  { name: "Bureau d'accueil unique des entreprises", secteur: 'economie' },
];

const ILES = ['Tahiti', 'Moorea', 'Raiatea', 'Bora-Bora', 'Huahine', 'Nuku Hiva'];
const QUARTIERS_TAHITI = ['Papeete - centre', 'Pirae', 'Faaa', 'Punaauia', 'Mahina', 'Arue'];

function pad(n: number, size = 2): string {
  return String(n).padStart(size, '0');
}

export const servicesAdministratifs: ServiceAdministratif[] = SERVICE_TEMPLATES.map(
  (t, i): ServiceAdministratif => {
    const ile = i < 42 ? 'Tahiti' : (ILES[(i - 42) % ILES.length] ?? 'Tahiti');
    const adresseLocale =
      ile === 'Tahiti' ? QUARTIERS_TAHITI[i % QUARTIERS_TAHITI.length] : `${ile} - centre`;
    const tel = `+689 40 ${pad(40 + (i % 60))} ${pad(10 + (i % 90))}`;
    const slug = t.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 32);
    const horaires =
      i % 4 === 0
        ? 'Lun-Ven : 7h30 - 14h30'
        : i % 4 === 1
          ? 'Lun-Jeu : 7h30 - 15h30, Ven : 7h30 - 13h30'
          : i % 4 === 2
            ? 'Lun-Ven : 8h - 12h, 13h30 - 16h30'
            : 'Lun, Mer, Ven : 8h - 12h (sur rendez-vous)';
    return {
      id: `srv-${pad(i + 1, 3)}`,
      nom: t.name,
      secteur: t.secteur,
      ile,
      adresse: `${adresseLocale}, ${ile}`,
      telephone: tel,
      email: `${slug}@administration.gov.pf`,
      horaires,
      siteWeb: i % 3 === 0 ? `https://${slug}.gov.pf` : undefined,
    };
  },
);

export type ServiceCategorie =
  | 'identite'
  | 'famille'
  | 'logement'
  | 'activite'
  | 'mobilite'
  | 'aides'
  | 'fiscalite';

export interface ServiceCatalogue {
  id: string;
  titre: string;
  description: string;
  categorie: ServiceCategorie;
  dureeMoyenne: string;
  enLigne: boolean;
  populaire?: boolean;
  nouveau?: boolean;
}

export const SERVICE_CATEGORIE_LABEL: Record<ServiceCategorie, string> = {
  identite: 'Identité & état civil',
  famille: 'Famille',
  logement: 'Logement',
  activite: 'Activité économique',
  mobilite: 'Mobilité & transport',
  aides: 'Aides & subventions',
  fiscalite: 'Fiscalité',
};

export const servicesCatalogue: ServiceCatalogue[] = [
  {
    id: 'sv1',
    titre: 'Demande de licence professionnelle',
    description:
      'Déposer une demande de licence pour exercer une activité réglementée (commerce, transport, artisanat).',
    categorie: 'activite',
    dureeMoyenne: '15 jours',
    enLigne: true,
    populaire: true,
  },
  {
    id: 'sv2',
    titre: "Renouvellement d'autorisation",
    description:
      'Renouveler une autorisation administrative arrivée à échéance (permis, licence, agrément).',
    categorie: 'activite',
    dureeMoyenne: '7 jours',
    enLigne: true,
  },
  {
    id: 'sv3',
    titre: "Demande d'attestation de domicile",
    description: 'Obtenir une attestation officielle de domicile à présenter à un organisme tiers.',
    categorie: 'identite',
    dureeMoyenne: '2 jours',
    enLigne: true,
    populaire: true,
  },
  {
    id: 'sv4',
    titre: 'Inscription au registre du commerce',
    description: 'Enregistrer une nouvelle entreprise, un commerce ou une activité indépendante.',
    categorie: 'activite',
    dureeMoyenne: '10 jours',
    enLigne: true,
  },
  {
    id: 'sv5',
    titre: 'Aide au logement social',
    description:
      "Demander une allocation logement, étudier l'éligibilité et déposer un dossier complet.",
    categorie: 'aides',
    dureeMoyenne: '30 jours',
    enLigne: true,
  },
  {
    id: 'sv6',
    titre: 'Demande de permis de construire',
    description:
      'Déposer un permis de construire pour une construction neuve, agrandissement ou rénovation lourde.',
    categorie: 'logement',
    dureeMoyenne: '60 jours',
    enLigne: false,
  },
  {
    id: 'sv7',
    titre: 'Carte de transport étudiant',
    description:
      'Demander ou renouveler la carte de transport à tarif préférentiel pour les étudiants.',
    categorie: 'mobilite',
    dureeMoyenne: '5 jours',
    enLigne: true,
    nouveau: true,
  },
  {
    id: 'sv8',
    titre: "Reconnaissance d'enfant",
    description:
      "Effectuer une reconnaissance auprès des services d'état civil avant ou après la naissance.",
    categorie: 'famille',
    dureeMoyenne: '1 jour',
    enLigne: false,
  },
  {
    id: 'sv9',
    titre: "Aide à la garde d'enfants",
    description:
      "Demander l'aide à la garde d'enfants pour les familles éligibles selon les revenus.",
    categorie: 'aides',
    dureeMoyenne: '21 jours',
    enLigne: true,
  },
  {
    id: 'sv10',
    titre: 'Déclaration de revenus',
    description:
      'Déclarer ses revenus annuels en ligne avec pré-remplissage automatique des données connues.',
    categorie: 'fiscalite',
    dureeMoyenne: '30 minutes',
    enLigne: true,
    populaire: true,
  },
  {
    id: 'sv11',
    titre: 'Modification de coordonnées',
    description:
      'Mettre à jour ses coordonnées (adresse, téléphone, email) auprès des services administratifs.',
    categorie: 'identite',
    dureeMoyenne: '1 jour',
    enLigne: true,
  },
  {
    id: 'sv12',
    titre: "Subvention création d'entreprise",
    description:
      "Solliciter une aide financière pour la création ou la reprise d'une activité économique.",
    categorie: 'aides',
    dureeMoyenne: '45 jours',
    enLigne: true,
    nouveau: true,
  },
];

export type TicketStatut = 'ouvert' | 'en_attente' | 'resolu' | 'ferme';
export type TicketPriorite = 'faible' | 'normale' | 'haute' | 'critique';
export type TicketCategorie = 'connexion' | 'demarche' | 'document' | 'paiement' | 'autre';

export interface Ticket {
  id: string;
  numero: string;
  sujet: string;
  description: string;
  statut: TicketStatut;
  priorite: TicketPriorite;
  categorie: TicketCategorie;
  agent?: string;
  dateCreation: string;
  dateMaj: string;
  reponses: number;
}

export const TICKET_STATUT_LABEL: Record<TicketStatut, string> = {
  ouvert: 'Ouvert',
  en_attente: 'En attente',
  resolu: 'Résolu',
  ferme: 'Fermé',
};

export const TICKET_STATUT_VARIANT: Record<
  TicketStatut,
  'info' | 'warning' | 'success' | 'neutral'
> = {
  ouvert: 'info',
  en_attente: 'warning',
  resolu: 'success',
  ferme: 'neutral',
};

export const TICKET_PRIORITE_LABEL: Record<TicketPriorite, string> = {
  faible: 'Faible',
  normale: 'Normale',
  haute: 'Haute',
  critique: 'Critique',
};

export const TICKET_PRIORITE_VARIANT: Record<
  TicketPriorite,
  'neutral' | 'info' | 'warning' | 'danger'
> = {
  faible: 'neutral',
  normale: 'info',
  haute: 'warning',
  critique: 'danger',
};

export const TICKET_CATEGORIE_LABEL: Record<TicketCategorie, string> = {
  connexion: 'Connexion',
  demarche: 'Démarche',
  document: 'Document',
  paiement: 'Paiement',
  autre: 'Autre',
};

export const tickets: Ticket[] = [
  {
    id: 't1',
    numero: 'HD-2026-0118',
    sujet: 'Impossible de téléverser un justificatif',
    description:
      'Le téléversement de mon justificatif de domicile échoue avec un message « format non reconnu » alors que le fichier est bien un PDF.',
    statut: 'en_attente',
    priorite: 'haute',
    categorie: 'document',
    agent: 'Tehei (support N1)',
    dateCreation: '2026-04-23 10:42',
    dateMaj: '2026-04-24 09:15',
    reponses: 3,
  },
  {
    id: 't2',
    numero: 'HD-2026-0114',
    sujet: 'Demande de réinitialisation du mot de passe',
    description:
      "Je n'ai pas reçu l'email de réinitialisation après plusieurs tentatives. Pouvez-vous vérifier ?",
    statut: 'ouvert',
    priorite: 'normale',
    categorie: 'connexion',
    dateCreation: '2026-04-22 16:08',
    dateMaj: '2026-04-22 16:08',
    reponses: 0,
  },
  {
    id: 't3',
    numero: 'HD-2026-0102',
    sujet: 'Question sur les pièces à fournir pour une demande de licence',
    description:
      "Bonjour, est-ce que la photocopie de la carte d'identité doit être certifiée conforme ?",
    statut: 'resolu',
    priorite: 'faible',
    categorie: 'demarche',
    agent: 'Manea (support N2)',
    dateCreation: '2026-04-18 11:30',
    dateMaj: '2026-04-19 14:22',
    reponses: 4,
  },
  {
    id: 't4',
    numero: 'HD-2026-0089',
    sujet: 'Facturation incorrecte sur ma dernière démarche',
    description: "J'ai été débité de 5 000 XPF au lieu de 3 500 XPF pour une demande standard.",
    statut: 'en_attente',
    priorite: 'critique',
    categorie: 'paiement',
    agent: 'Vaiana (support N2)',
    dateCreation: '2026-04-12 08:55',
    dateMaj: '2026-04-23 17:40',
    reponses: 6,
  },
  {
    id: 't5',
    numero: 'HD-2026-0075',
    sujet: 'Suggestion : ajouter le téléphone dans les notifications SMS',
    description: 'Il serait pratique de pouvoir recevoir le récap par SMS court.',
    statut: 'ferme',
    priorite: 'faible',
    categorie: 'autre',
    agent: 'Service produit',
    dateCreation: '2026-04-05 09:00',
    dateMaj: '2026-04-09 12:11',
    reponses: 2,
  },
];

export interface ArticleAide {
  id: string;
  titre: string;
  resume: string;
  categorie: TicketCategorie;
  dureeLecture: number;
  vues: number;
}

export const articlesAide: ArticleAide[] = [
  {
    id: 'a1',
    titre: 'Comment réinitialiser mon mot de passe ?',
    resume:
      "Procédure pas-à-pas pour récupérer l'accès à votre compte si vous avez oublié votre mot de passe.",
    categorie: 'connexion',
    dureeLecture: 2,
    vues: 1240,
  },
  {
    id: 'a2',
    titre: 'Quels formats de fichiers sont acceptés ?',
    resume:
      'Liste des extensions et des tailles maximales pour les pièces justificatives téléversées.',
    categorie: 'document',
    dureeLecture: 1,
    vues: 980,
  },
  {
    id: 'a3',
    titre: "Suivre l'avancement de ma démarche",
    resume:
      'Comprendre les étapes (déposée, en instruction, à compléter, validée) et les délais associés.',
    categorie: 'demarche',
    dureeLecture: 3,
    vues: 854,
  },
  {
    id: 'a4',
    titre: 'Modes de paiement disponibles',
    resume:
      'Carte bancaire, prélèvement, virement : avantages et délais de validation pour chaque mode.',
    categorie: 'paiement',
    dureeLecture: 2,
    vues: 612,
  },
];

export interface KpiData {
  label: string;
  value: number;
  trend?: string;
}

export const kpis: KpiData[] = [
  { label: 'Démarches en cours', value: 2, trend: '+1 cette semaine' },
  { label: 'À compléter', value: 1 },
  { label: 'Validées', value: 2 },
  { label: 'Documents stockés', value: 12, trend: '+3 ce mois-ci' },
];
