# @govpf/ori-css

## 0.2.0

### Minor Changes

- d96b9a3: Vague 1 d'enrichissement Ori : 4 nouveaux composants saisie/feedback inspirés des manques identifiés dans le DS distant.

  Tous classés comme **Primitives** dans la taxonomie Storybook, avec parité React + Angular et a11y RGAA.
  - **SearchBar** (`Primitives/Saisie/SearchBar`) : champ de recherche autonome posé sur un `<form role="search">`, avec input borderless underlined et bouton primaire. Supporte mode contrôlé et non contrôlé, taille `sm`, bouton icône seule.
  - **PhoneInput** (`Primitives/Saisie/PhoneInput`) : saisie d'un numéro de téléphone avec sélecteur d'indicatif. Par défaut configuré sur Polynésie française (+689) en lecture seule ; fournir `countries` pour activer le dropdown. Couvre les états Normal/Rempli/Erreur/Désactivé/Lecture seule/Avec aide.
  - **RichRadio** (`Primitives/Saisie/RichRadio`) : choix exclusif rendu sous forme de cartes (titre + description + slot trailing pour icône/image). Pattern Context React et injection Angular identique au `Radio` classique. Disposition verticale ou horizontale.
  - **DownloadButton** (`Primitives/Actions/DownloadButton`) : lien de téléchargement avec icône et métadonnées de fichier (type + taille). Utilise l'attribut natif HTML `download`.

  Aucune dépendance ajoutée : tout passe par `lucide-react` / `lucide-angular` déjà embarqués. Les classes CSS `.ori-search-bar*`, `.ori-phone-input*`, `.ori-rich-radio*`, `.ori-download-button*` vivent dans `@govpf/ori-tailwind-preset` et sont automatiquement présentes dans le bundle `@govpf/ori-css/dist/ds.css`.

- 4d089a3: Formalisation de la dichotomie **interfaces applicatives vs interfaces
  d'information** dans Ori, et ajout de 2 utilitaires CSS transverses
  issus des exemples publics.

  **Nouvelles classes CSS publiques :**
  - `.ori-skip-link` : utilitaire d'accessibilité pour les liens
    d'évitement (« Aller au contenu principal »). Masqué par défaut,
    visible et focusable au clavier. Équivalent du pattern
    `visually-hidden-focusable` standard, conforme WCAG 2.4.1.
  - `.ori-demo-banner` + `.ori-demo-banner__link` : bandeau jaune fixé
    en haut de page pour signaler une démo non-prod, à utiliser
    uniquement sur les apps de démonstration pour éviter qu'un usager
    confonde la démo avec un vrai service public.

  Migration appliquée sur les 3 exemples publics (`example-landing`,
  `example-keycloak`, `example-agent`) qui dupliquaient ces 2 patterns
  en CSS local. ~150 lignes de CSS local supprimées au total.

  Pas de breaking change : ces classes sont nouvelles, l'ajout est
  non-régressant.

- 82a2e8e: LoginLayout : aligner le pattern visuel sur la mire Keycloak `AuthLogin.mdx`.

  Cohérence d'expérience entre la mire SSO Keycloak (HTML+CSS pur, hors composant DS, cf. décision K.1) et les pages de connexion d'apps internes (composant LoginLayout) : les deux écrans affichent désormais le même pattern.

  Changements visuels :
  - Le `logo` est rendu **dans** la carte (en haut, centré), plus au-dessus.
  - Le titre et la description sont **centrés**.
  - Le `cardFooter` n'a plus de séparateur `border-top` : c'est juste un paragraphe centré dans le bas de la carte (l'espacement vient du `gap` du parent).

  Aucun changement d'API : les props `logo`, `title`, `description`, `children`, `cardFooter`, `footer` sont inchangées. Les apps qui passaient déjà ces slots verront leur layout se réorganiser visuellement, sans casser le code.

  **Breaking pré-1.0 (minor)** : les apps qui dépendaient de la position du logo hors carte verront un nouveau rendu. Pour conserver l'ancien layout, il faut désormais wrapper le logo en dehors de `<LoginLayout>` (mais ce pattern n'était plus aligné sur la spec Keycloak, donc à éviter).

- 41b813a: Nouveau composant `MobileTabBar` (React) / `<ori-mobile-tab-bar>` (Angular).

  Barre de navigation fixée en bas d'écran sur mobile, pattern UX standard
  (Material BottomNavigation, iOS TabBar). 3 à 5 items, chacun = icône
  au-dessus d'un label court. Items rendus en `<a>` ou `<button>` selon
  qu'un `href` est fourni.

  API React :

  ```tsx
  <MobileTabBar
    items={[
      { id: 'home', label: 'Accueil', icon: <Home size={20} />, current: true },
      { id: 'demarches', label: 'Démarches', icon: <FileText size={20} />, badge: 2 },
      { id: 'profil', label: 'Profil', icon: <User size={20} /> },
    ]}
    onSelect={(item) => router.push(`/${item.id}`)}
  />
  ```

  API Angular :

  ```html
  <ori-mobile-tab-bar
    [items]="[
      { id: 'home', label: 'Accueil', icon: HomeIcon, current: true },
      { id: 'demarches', label: 'Démarches', icon: FileTextIcon, badge: 2 },
      { id: 'profil', label: 'Profil', icon: UserIcon }
    ]"
    (select)="onSelect($event)"
  ></ori-mobile-tab-bar>
  ```

  Caractéristiques :
  - Masquée par défaut au-dessus du breakpoint `md` (768px) ; `alwaysVisible`
    pour forcer l'affichage sur desktop.
  - Touch target 56px sur chaque item (au-delà du minimum WCAG 2.5.5).
  - Respecte `env(safe-area-inset-bottom)` pour l'iPhone home indicator.
  - Support des pastilles de notification (`badge`).
  - Items désactivables (`disabled`).
  - ARIA : `<nav aria-label>`, `aria-current="page"` sur l'item courant,
    `aria-disabled` sur les items désactivés.

  Acquis fonctionnel repris de PF-UI, première action structurelle de la
  roadmap mobile (issue #94).

- c9672a5: Renommage des classes `.ori-btn*` en `.ori-button*` pour aligner sur la convention de nommage du DS (PascalCase React → kebab-case CSS).

  **Pourquoi** : `.ori-btn` était l'unique exception dans le DS où le nom de classe ne dérivait pas directement du nom du composant. Sur les 52 autres composants, `Button/` est le seul cas où la conversion lowercase ne donnait pas la bonne classe (toutes les autres divergences naïves sont des PascalCase multi-mots, où la convention `kebab-case` est correctement suivie).

  **Migrations effectuées** :
  - `.ori-btn` → `.ori-button`
  - `.ori-btn--primary` → `.ori-button--primary`
  - `.ori-btn--secondary` → `.ori-button--secondary`
  - `.ori-btn--ghost` → `.ori-button--ghost`
  - `.ori-btn--danger` → `.ori-button--danger`
  - `.ori-btn--sm` → `.ori-button--sm`
  - `.ori-btn--lg` → `.ori-button--lg`
  - `.ori-btn--block` → `.ori-button--block`

  **Aucun changement d'API publique** côté composants : `<Button>` React et `<ori-button>` Angular acceptent les mêmes props. Les classes générées dans le DOM passent de `ori-btn*` à `ori-button*` automatiquement.

  **Breaking change pour les consommateurs en HTML/CSS pur** (Keycloak themes, GLPI plugin, emails, intégrations directes via `@govpf/ori-css`) qui codaient les classes en dur. Migration : remplacer `ori-btn` par `ori-button` partout (un seul find/replace).

  Nouvelle fiche **Fondations / Convention de nommage** dans le Storybook qui documente la convention complète React ↔ CSS et un tableau de correspondance pour les 53 composants.

- 50cf783: Ajout du token `size.touchTarget` (valeur `44px`) et application
  automatique sur les composants interactifs principaux en contexte
  tactile.

  Concrètement :
  - Nouveau token DTCG `size.touchTarget`. Disponible côté CSS via
    `var(--size-touch-target)`, côté JS via `SizeTouchTarget`, côté
    SCSS via `$size-touch-target`.
  - Nouveau bloc `@media (pointer: coarse)` dans le preset Tailwind qui
    applique `min-block-size: var(--size-touch-target)` à `.ori-button`,
    `.ori-input`, `.ori-select`, `.ori-tabs__tab`, et `.ori-choice`
    (wrapper checkbox / radio / switch).

  L'objectif : conformité WCAG 2.5.5 niveau AAA (cibles tactiles ≥
  44×44 CSS pixels) sans dégrader la densité desktop. Sur souris /
  trackpad (`pointer: fine`), les composants conservent leur dimension
  actuelle. Sur mobile et tablette tactile, ils s'étendent au minimum
  de 44px en hauteur.

  Non breaking : le défaut desktop est inchangé. Les apps qui forcent
  déjà des tailles supérieures à 44px voient la règle absorbée sans
  effet (le `min-block-size` ne diminue jamais une hauteur déjà plus
  grande).

### Patch Changes

- 63cc50e: AppShell : bouton de toggle intégré sur le bord droit de la sidebar.

  Le composant rend désormais lui-même un bouton chevron sur la frontière sidebar/main, qui pilote `sidebarOpen` via `onSidebarOpenChange`. Plus besoin de greffer un bouton hamburger dans le header projeté.
  - Quand la sidebar est visible (`sidebarOpen=true`) : chevron vers la gauche, posé sur le bord droit de la sidebar
  - Quand elle est masquée (`sidebarOpen=false`) : chevron vers la droite, glissé au début du main
  - Caché sur mobile (le drawer ferme via le scrim cliquable et la touche Escape, comportement inchangé)

  Le bouton n'est rendu que si `onSidebarOpenChange` est fourni : sans callback, le toggle ne pourrait rien faire. Aucun changement breaking : les apps qui ne passent pas `onSidebarOpenChange` ne voient pas le bouton.

  Nouvelles props (toutes optionnelles) :
  - `collapseSidebarLabel?: string` (défaut : « Masquer la navigation latérale »)
  - `expandSidebarLabel?: string` (défaut : « Afficher la navigation latérale »)

- d0c8853: AppShell : la prop `sidebarOpen` pilote désormais l'affichage de la sidebar **sur tous les viewports**, pas uniquement le drawer mobile.
  - Desktop ≥ 768px : `sidebarOpen=true` (défaut) la sidebar reste visible in-flow ; `sidebarOpen=false` la masque et le main reprend toute la largeur.
  - Mobile < 768px : comportement inchangé, la même prop ouvre / ferme le drawer.

  Permet aux apps de greffer un bouton de toggle « ☰ » dans le header projeté pour cacher la navigation latérale et gagner de la place sur grand écran. La démo portail le démontre : bouton hamburger à gauche du logo qui pilote `sidebarOpen` en `useState`.

  **Breaking pré-1.0 (minor)** : le défaut de `sidebarOpen` passe de `false` à `true`. Impact :
  - Desktop : aucun changement, la sidebar était déjà toujours visible.
  - Mobile : les apps qui ne pilotaient pas `sidebarOpen` voyaient le drawer fermé au load (la classe `--sidebar-open` n'était jamais appliquée). Avec le nouveau défaut, le drawer s'ouvre au load. Pour conserver l'ancien comportement, passer explicitement `sidebarOpen={false}` au mount, idéalement en récupérant la valeur depuis un `useState`.

  Aucun changement d'API : props existantes inchangées, ajout uniquement d'une règle CSS desktop conditionnée par la classe `.ori-app-shell--sidebar-open` déjà présente.

- edcc206: Fix : packager les polices Inter dans le bundle `@govpf/ori-css`.

  Le `dist/ori.css` publié contenait des `@font-face` avec
  `url('../assets/fonts/Inter-VariableFont.ttf')`, chemin qui ne résolvait
  nulle part une fois le package publié sur npm (le dossier `assets/`
  n'existait pas côté `packages/css/`). Conséquence : tout consommateur
  passant par un bundler qui résout les URLs (Angular CLI, Vite, webpack)
  sortait `Could not resolve "../assets/fonts/..."`.

  Le build de `packages/css` copie désormais les TTF depuis
  `packages/tokens/assets/fonts/` vers `packages/css/assets/fonts/` et
  publie ce dossier avec le package, pour que `url('../assets/fonts/...')`
  résolve correctement depuis `node_modules/@govpf/ori-css/dist/`.

  Pas de breaking : seul le packaging change, le contenu de `dist/ori.css`
  est identique.

- 5861192: PhoneInput : coller le pill indicatif et l'input numéro en un seul combo visuel.

  Avant, un `gap: spacing.2` séparait le pill `+689` de l'input du numéro - ils ressemblaient à deux contrôles distincts plutôt qu'à un champ unifié.

  Désormais le `gap` passe à `0` et les rayons sont asymétriques : le pill garde son rayon à gauche, l'input son rayon à droite. Visuellement les deux moitiés forment un seul rectangle scindé, ce qui rend mieux l'idée que la valeur saisie est composée des deux parties (`dialCode + value`).

- 5861192: SearchBar : corriger le « pico » disgracieux sous le coin bas-droit du bouton.

  La `border-bottom` de l'underline était posée sur le wrapper `__field` qui englobe input + bouton. Comme le bouton a un `border-radius`, son coin bas-droit ne touchait pas la ligne et laissait apparaître un petit triangle disgracieux au point où la ligne quittait le radius du bouton.

  On migre la `border-bottom` sur l'input lui-même : elle s'arrête net au bord droit de l'input et le bouton vit librement à côté avec son radius. Comportement de focus inchangé : le `:focus-visible` de l'input bascule la couleur sur `border-focus`.

- 8aa8c81: SearchBar : coller le trait à la base du bouton et carré le coin gauche du bouton.

  Le wrapper `__field` avait un `gap: spacing.2` qui laissait un espace entre l'input et le bouton. Du coup la border-bottom de l'input s'arrêtait avant le bouton, et le bouton avait son radius normal à gauche - on voyait un petit creux disgracieux à la jonction.

  Désormais :
  - `gap: 0` : input et bouton sont collés.
  - Le bouton perd son rayon à gauche (`border-top-left-radius` et `border-bottom-left-radius` à `0`), seul le côté droit reste arrondi.

  Visuellement, le trait sous l'input rejoint le bord gauche du bouton sans interruption, et la coupure verticale entre l'input et le bouton est nette.

- Updated dependencies [63cc50e]
- Updated dependencies [d0c8853]
- Updated dependencies [d96b9a3]
- Updated dependencies [4d089a3]
- Updated dependencies [82a2e8e]
- Updated dependencies [41b813a]
- Updated dependencies [5861192]
- Updated dependencies [c9672a5]
- Updated dependencies [5861192]
- Updated dependencies [8aa8c81]
- Updated dependencies [50cf783]
  - @govpf/ori-tailwind-preset@0.2.0
  - @govpf/ori-tokens@0.2.0

## 0.1.4

### Patch Changes

- b236f93: Fix AppShell : la sidebar reste correctement dans le flow (côte à côte avec le main) sur desktop.

  Avant ce fix, la règle media `(max-width: 767px)` du plugin était définie au niveau racine d'`addComponents` et contenait des sélecteurs composés (`.ori-app-shell--with-sidebar .ori-app-shell__sidebar`). PostCSS/Tailwind aplatissait ces sélecteurs en perdant à la fois le wrapping `@media` et le parent composé, transformant la règle « drawer mobile fixed » en règle desktop. Résultat visible : sur la démo, la sidebar était `position: fixed` sur tous les viewports, ce qui la sortait du flow et faisait remonter le main sous le header.

  Refactor : chaque sélecteur garde sa forme `.parent .child` et porte son propre `@media (max-width: 767px)` imbriqué. La sortie CSS conserve désormais correctement les media queries.

- Updated dependencies [b236f93]
  - @govpf/ori-tailwind-preset@0.1.5

## 0.1.3

### Patch Changes

- 6953eb7: Fix AppShell : la sidebar s'étire désormais correctement sur toute la hauteur du body de l'AppShell, et son contenu projeté (typiquement un `<nav>` portant une `border-right`) descend jusqu'au footer.

  Avant ce fix, le contenu projeté ne prenait que la hauteur de ses items, ce qui laissait un espace blanc en bas de la sidebar quand le contenu n'occupait pas toute la zone, et la bordure de séparation s'arrêtait au niveau du dernier item au lieu de descendre jusqu'au footer.

  La sidebar Ori (`.ori-app-shell__sidebar`) est désormais un container flex column qui force son enfant direct à `flex: 1 1 auto`. Aucun changement d'API : c'est uniquement un correctif CSS dans le plugin Tailwind partagé.

- Updated dependencies [6953eb7]
  - @govpf/ori-tailwind-preset@0.1.4

## 0.1.2

### Patch Changes

- 1d1cbcd: Ajout de 11 composants (5 Primitives + 6 Compositions), tous backwards-compatible.

  **Primitives** :
  - `DropdownMenu` (PR #45) - menu déroulant accessible avec navigation clavier complète
  - `AlertDialog` (PR #46) - modale de confirmation critique (`role="alertdialog"`)
  - `Spinner` (PR #47) - indicateur de chargement compact, hérite de `currentColor`
  - `Combobox` (PR #48) - input texte + listbox filtrable (pattern WAI-ARIA combobox v1.2)
  - `MultiSelect` (PR #49) - multi-sélection virtualisée jusqu'à plusieurs milliers d'options

  **Compositions** :
  - `EmptyState` (PR #50) - bloc d'absence de données avec icône + titre + description + actions
  - `AppShell` (PR #51) - layout d'application avec skip link, sidebar drawer responsive
  - `Form` + `FormSection` + `FormField` + `FormActions` (PR #52) - layout de formulaire standardisé
  - `LoginLayout` (PR #53) - page d'authentification générique
  - `Wizard` + `WizardStep` (PR #54) - workflow multi-étapes avec validation pilotée par l'app
  - `DataTable` (PR #55) - Table + Pagination + filtre global + actions de ligne

  Toutes les classes CSS associées sont ajoutées au plugin Tailwind (et donc au bundle `ori.css`). Aucun composant ni classe existant n'est modifié.

- Updated dependencies [1d1cbcd]
  - @govpf/ori-tailwind-preset@0.1.3
