/**
 * Génère le modèle Word du fascicule et l'exemple « Prendre en main
 * votre nouveau PC » dans apps/ori-site/public/telechargements/.
 *
 *   node apps/example-fascicule/word/build-word.mjs
 *
 * Puis, sous Windows avec Word installé, finalize-word.ps1 met à jour
 * le sommaire et les numéros de figure, et exporte les PDF de contrôle.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Fascicule } from './document.mjs';
import { SP, TEXT_W } from './charte.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.argv[2] ?? join(here, '../../ori-site/public/telechargements');
const imagesDir = join(here, 'images');
const ISSUER = "Direction du système d'information";
mkdirSync(outDir, { recursive: true });

const LEGEND = [
  ['Astuce', 'Un conseil pour gagner du temps.'],
  ['Savoir', 'Une information utile pour comprendre.'],
  ['Attention', 'Une erreur fréquente à éviter.'],
  ['Important', 'Une règle à respecter impérativement.'],
];

/* ── 1. Modèle (.dotx) ───────────────────────────────────────────── */
function modele() {
  const d = new Fascicule({ issuer: ISSUER, title: 'Modèle de fascicule', imagesDir });
  d.cover({
    eyebrow: 'Guide de prise en main',
    title: 'Titre du fascicule, sur deux lignes au plus',
    subtitle: 'Ce que le lecteur saura faire après lecture, en une ou deux lignes.',
    panelText: "Emplacement de l'illustration : supprimez ce texte puis Insertion > Images.",
    metaLeft: 'Édition [mois année] · version 1.0',
    metaRight: 'Public : [à préciser]',
    metaGap: 1100,
  });

  d.toc();
  d.h2('Comment lire ce guide');
  d.p("Étapes numérotées et quatre types d'encadrés :");
  d.calloutGrid(LEGEND);
  d.mention("Livret : imprimez en A5 avec l'option « Livret » du pilote, sur A4 recto verso.");

  d.chapter(
    'Utiliser ce modèle',
    "Écrivez, puis choisissez le bon style dans la galerie (Accueil > Styles) : la mise en page suit d'elle-même.",
  );
  d.h2('Commencer un fascicule');
  d.steps([
    "**Remplacez les textes de la couverture.**\nTitre, sous-titre, édition et public, puis l'illustration.",
    "**Adaptez l'en-tête.**\nDouble-cliquez en haut d'une page paire, puis d'une page impaire, pour changer l'entité émettrice.",
    '**Rédigez chapitre par chapitre.**\nStyle « Numéro de chapitre » puis « Titre de chapitre » : nouvelle page, numéro, sommaire et pied de page suivent.',
    '**Mettez à jour le sommaire.**\nClic droit dans le sommaire puis « Mettre à jour les champs », ou [[Ctrl]] + [[A]] puis [[F9]].',
  ]);
  d.callout(
    'Important',
    'Ne modifiez pas polices, couleurs ou marges à la main : changez de style.',
  );

  d.chapter('Les styles de la charte', 'Chaque élément du fascicule correspond à un style nommé.');
  d.h2('Titres');
  d.bullets([
    '**Numéro de chapitre** : « Chapitre N », calculé seul, ouvre une nouvelle page ;',
    '**Titre de chapitre** : repris dans le sommaire et dans le pied de page ;',
    '**Titre de section** et **Sous-titre** : découpent le chapitre ;',
    '**Chapeau** : une phrase qui annonce le chapitre.',
  ]);
  d.h2('Listes');
  d.steps([
    '**Étape numérotée** : une action par étape.\nDétail après un saut de ligne ([[Maj]] + [[Entrée]]). Pour repartir de 1 : clic droit sur le numéro, « Recommencer à 1 ».',
  ]);
  d.bullets([
    '**Liste à puces** pour une énumération sans ordre ;',
    '**Repère numéroté** pour légender une capture annotée.',
  ]);
  d.h2('Encadrés');
  d.callout(
    'Savoir',
    'Copiez un encadré existant, puis changez son style de tableau (Astuce, À savoir, Attention, Important). Deux par page au plus.',
  );

  d.chapter('Captures et tableaux');
  d.figure(
    'bureau.png',
    'Exemple de capture annotée',
    'Légende : style « Légende de capture », numéro automatique.',
  );
  d.reperes(["Repère numéroté : un numéro par élément, dans l'ordre de lecture."]);
  d.h2('Tableaux');
  d.table(
    ['Style', 'Usage'],
    [2900, 4411],
    [
      ['Tableau fascicule', 'En-tête teinté, filets fins.'],
      ['Touche', 'Chaque touche : [[Ctrl]] + [[S]].'],
      ['Mention', 'Précision discrète, en petit.'],
    ],
    { firstCol: true },
  );

  d.annex('Mémo', 'À compléter au crayon lors de la remise.');
  d.table(
    null,
    [3300, 4011],
    [
      ['Information 1', ''],
      ['Information 2', ''],
      ['Information 3', ''],
      ['Information 4', ''],
    ],
    { firstCol: true, rowHeight: SP[10] },
  );
  d.annex('Notes');
  d.notes(17);
  d.endBody();

  d.push(
    `<w:p><w:pPr><w:pStyle w:val="FascSurtitre"/></w:pPr><w:r><w:t>Besoin d’aide ?</w:t></w:r></w:p>`.replace(
      'aide ?',
      'aide ?',
    ),
  );
  d.push(
    `<w:p><w:pPr><w:pStyle w:val="FascTitreHors"/></w:pPr><w:r><w:t>Titre de la quatrième de couverture</w:t></w:r></w:p>`,
  );
  d.p('Horaires du support : [jours et heures].', 'FascChapeau');
  d.contacts([
    ['Téléphone', '[numéro]'],
    ['Courriel', '[adresse]'],
    ['Portail', '[lien ou emplacement]'],
  ]);
  d.h3('Pour être aidé plus vite');
  d.bullets(['[information à préparer] ;', '[information à préparer].']);
  d.backFooter({ gap: 2600, credit: 'Mis en page avec le design system' });
  return d;
}

/* ── 2. Exemple « Prendre en main votre nouveau PC » (.docx) ─────── */
function exemple() {
  const d = new Fascicule({ issuer: ISSUER, title: 'Prendre en main votre nouveau PC', imagesDir });
  d.cover({
    eyebrow: 'Guide de prise en main',
    title: 'Prendre en main votre nouveau PC',
    subtitle:
      'Les premiers pas avec votre poste de travail : connexion, bureau, fichiers, raccourcis et bons réflexes de sécurité.',
    illustration: {
      file: 'couverture.png',
      alt: 'Ordinateur portable affichant un écran de connexion',
      crop: 26500,
    },
    metaLeft: 'Édition novembre 2026 · version 1.0',
    metaRight: 'Public : tous les agents',
    metaGap: 1700,
  });

  d.toc();
  d.h2('Comment lire ce guide');
  d.p("Étapes numérotées et quatre types d'encadrés :");
  d.calloutGrid(LEGEND);

  d.chapter(
    'Avant de commencer',
    'Vérifiez votre matériel et installez votre poste en quelques minutes.',
  );
  d.h2('Ce qui vous a été remis');
  d.bullets([
    "l'ordinateur portable et son chargeur ;",
    "une station d'accueil (si votre bureau en est équipé) ;",
    'un casque avec micro pour les visioconférences ;',
    'votre identifiant de connexion, remis sous pli fermé.',
  ]);
  d.h2('Installer votre poste');
  d.steps([
    '**Branchez le chargeur.**\nLa première mise en route peut être longue : ne débranchez pas le PC.',
    "**Raccordez la station d'accueil.**\nUn seul câble suffit pour l'écran, le clavier, la souris et le réseau.",
    "**Appuyez sur le bouton d'alimentation.**\nIl se trouve au-dessus du clavier, à droite.",
  ]);
  d.callout('Astuce', 'Gardez le carton quelques jours : il sert en cas de retour du matériel.');

  d.chapter('Première connexion');
  d.steps([
    "**Déverrouillez l'écran.**\nAppuyez sur [[Ctrl]] + [[Alt]] + [[Suppr]].",
    '**Saisissez votre identifiant** puis le mot de passe provisoire, et validez avec [[Entrée]].',
    "**Confirmez sur votre téléphone** avec l'application d'authentification, si elle vous est demandée.",
  ]);
  d.figure(
    'connexion.png',
    'Écran de connexion : champ identifiant (1) et champ mot de passe (2)',
    'Écran de connexion : identifiant (1) et mot de passe (2).',
  );
  d.callout('Attention', 'Après cinq essais erronés, le compte est bloqué quinze minutes.');
  d.h2('Choisir votre mot de passe', { newPage: true });
  d.p('Le mot de passe provisoire doit être remplacé dès la première connexion.');
  d.steps([
    "**Ouvrez l'écran de sécurité** avec [[Ctrl]] + [[Alt]] + [[Suppr]].",
    '**Choisissez « Modifier un mot de passe ».**',
    "**Saisissez l'ancien puis deux fois le nouveau.**\nValidez avec [[Entrée]].",
  ]);
  d.h3('Un bon mot de passe');
  d.bullets([
    'compte au moins 12 caractères ;',
    'mélange majuscules, minuscules, chiffres et symboles ;',
    "n'est utilisé pour aucun autre site ou service.",
  ]);
  d.callout('Astuce', [
    'Une phrase de passe est plus facile à retenir :',
    '**Mon-chat-dort-sur-3-coussins !**',
  ]);
  d.callout(
    'Important',
    'Ne communiquez jamais votre mot de passe, même au support informatique : il ne vous le demandera jamais.',
  );

  d.chapter('Découvrir le bureau', 'Repérez les éléments que vous utiliserez tous les jours.');
  d.figure('bureau.png', 'Bureau Windows annoté de 1 à 5', 'Le bureau et la barre des tâches.', {
    // Un peu plus étroite pour que l'encadré du chapitre tienne sur la page.
    width: Math.round(TEXT_W * 0.9),
  });
  d.reperes([
    '**Raccourcis** : Corbeille et applications du service.',
    "**Menu Démarrer** : toutes vos applications, et l'arrêt du PC.",
    '**Applications épinglées** : messagerie, navigateur, explorateur.',
    '**Fenêtre** : glissez sa barre de titre pour la déplacer.',
    '**Zone de notification** : heure, réseau, son, mises à jour.',
  ]);
  d.callout(
    'Savoir',
    'Pour épingler une application, faites un clic droit sur son icône puis « Épingler à la barre des tâches ».',
  );

  d.chapter('Enregistrer vos fichiers');
  d.h2('Où enregistrer ?');
  d.table(
    ['Emplacement', 'Pour quoi faire'],
    [2900, 4411],
    [
      ['Mes documents (cloud)', 'Vos brouillons et fichiers personnels de travail.'],
      ["Espace d'équipe", 'Les documents partagés avec votre service.'],
      ['Bureau, Téléchargements', 'Jamais durablement : ces dossiers ne sont pas sauvegardés.'],
    ],
    { firstCol: true },
  );
  d.callout('Important', "Panne ou vol : seuls le cloud et l'espace d'équipe sont récupérables.");
  d.h2('Retrouver un fichier');
  d.steps([
    "**Ouvrez l'explorateur** avec [[⊞ Win]] + [[E]].",
    '**Tapez une partie du nom** dans « Rechercher ».',
  ]);
  d.callout('Astuce', 'Commencez le nom par la date : 2026-11-05_compte-rendu.');

  d.chapter('Raccourcis clavier utiles', 'Gardez cette page à portée de main les premiers jours.');
  d.table(
    ['Touches', 'Action'],
    [3070, 4241],
    [
      ['[[⊞ Win]] + [[L]]', 'Verrouiller la session'],
      ['[[⊞ Win]] + [[E]]', "Ouvrir l'explorateur de fichiers"],
      ['[[⊞ Win]] + [[D]]', 'Afficher le bureau'],
      ['[[Alt]] + [[Tab]]', "Passer d'une fenêtre à l'autre"],
      ['[[Ctrl]] + [[C]]', 'Copier'],
      ['[[Ctrl]] + [[V]]', 'Coller'],
      ['[[Ctrl]] + [[Z]]', 'Annuler la dernière action'],
      ['[[⊞ Win]] + [[V]]', 'Historique du presse-papiers'],
      ['[[⊞ Win]] + [[Maj]] + [[S]]', "Capturer une partie de l'écran"],
      ['[[⊞ Win]] + [[←]] / [[→]]', 'Ancrer la fenêtre à gauche ou à droite'],
    ],
  );
  d.callout('Savoir', 'La touche [[⊞ Win]] porte le logo Windows, entre [[Ctrl]] et [[Alt]].');

  d.chapter(
    'Sécurité au quotidien',
    'Trois réflexes protègent votre poste et les données du service.',
  );
  d.h3('Verrouillez dès que vous vous levez');
  d.p('Même pour deux minutes : [[⊞ Win]] + [[L]]. Vos applications restent ouvertes.');
  d.h3("Laissez les mises à jour s'installer");
  d.p(
    'Quand le PC vous propose de redémarrer, faites-le le jour même. Les mises à jour corrigent des failles de sécurité.',
  );
  d.h3('Méfiez-vous des messages inattendus');
  d.p(
    'Un message urgent, une pièce jointe imprévue, un lien vers une page de connexion : au moindre doute, ne cliquez pas.',
  );
  d.callout(
    'Attention',
    'Ne branchez pas de clé USB trouvée ou offerte : elle peut contenir un logiciel malveillant.',
  );
  d.callout(
    'Important',
    'Vous avez cliqué sur un lien suspect ? Débranchez le réseau et appelez immédiatement le support.',
  );

  d.annex('Mémo : mes informations', 'À compléter au crayon lors de la remise du poste.');
  d.table(
    null,
    [3300, 4011],
    [
      ['Mon identifiant', ''],
      ['Nom du PC (étiquette)', ''],
      ['Date de remise', ''],
      ['Mon référent informatique', ''],
      ['Imprimante du service', ''],
    ],
    { firstCol: true, rowHeight: SP[10] },
  );
  d.callout(
    'Important',
    "N'écrivez jamais votre mot de passe dans ce guide ni sur un papier collé au PC.",
  );
  d.annex('Notes');
  d.notes(17);
  d.endBody();

  d.push(
    '<w:p><w:pPr><w:pStyle w:val="FascSurtitre"/></w:pPr><w:r><w:t>Besoin d’aide ?</w:t></w:r></w:p>',
  );
  d.push(
    '<w:p><w:pPr><w:pStyle w:val="FascTitreHors"/></w:pPr><w:r><w:t>Le support informatique vous répond</w:t></w:r></w:p>',
  );
  d.p("Du lundi au jeudi de 7 h 30 à 15 h 30, le vendredi jusqu'à 14 h 30.", 'FascChapeau');
  d.contacts([
    ['Téléphone', '40 00 00 00 (fictif)'],
    ['Courriel', 'assistance@example.org'],
    ['Portail', 'Icône « Assistance » sur votre bureau'],
  ]);
  d.h3('Pour être aidé plus vite');
  d.bullets([
    "le nom du PC, inscrit sur l'étiquette au dos ;",
    "le message d'erreur exact, ou une capture d'écran : [[⊞ Win]] + [[Maj]] + [[S]].",
  ]);
  d.backFooter({ gap: 2200, credit: 'Mis en page avec le design system' });
  return d;
}

const files = [
  ['modele-fascicule.dotx', modele().build({ template: true })],
  ['exemple-fascicule-nouveau-pc.docx', exemple().build({ template: false })],
];
for (const [name, buf] of files) {
  writeFileSync(join(outDir, name), buf);
  console.log(`${name} : ${(buf.length / 1024).toFixed(0)} Ko`);
}
