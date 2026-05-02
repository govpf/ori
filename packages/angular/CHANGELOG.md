# @govpf/ori-angular

## 0.2.0

### Minor Changes

- d0c8853: AppShell : la prop `sidebarOpen` pilote désormais l'affichage de la sidebar **sur tous les viewports**, pas uniquement le drawer mobile.
  - Desktop ≥ 768px : `sidebarOpen=true` (défaut) la sidebar reste visible in-flow ; `sidebarOpen=false` la masque et le main reprend toute la largeur.
  - Mobile < 768px : comportement inchangé, la même prop ouvre / ferme le drawer.

  Permet aux apps de greffer un bouton de toggle « ☰ » dans le header projeté pour cacher la navigation latérale et gagner de la place sur grand écran. La démo portail le démontre : bouton hamburger à gauche du logo qui pilote `sidebarOpen` en `useState`.

  **Breaking pré-1.0 (minor)** : le défaut de `sidebarOpen` passe de `false` à `true`. Impact :
  - Desktop : aucun changement, la sidebar était déjà toujours visible.
  - Mobile : les apps qui ne pilotaient pas `sidebarOpen` voyaient le drawer fermé au load (la classe `--sidebar-open` n'était jamais appliquée). Avec le nouveau défaut, le drawer s'ouvre au load. Pour conserver l'ancien comportement, passer explicitement `sidebarOpen={false}` au mount, idéalement en récupérant la valeur depuis un `useState`.

  Aucun changement d'API : props existantes inchangées, ajout uniquement d'une règle CSS desktop conditionnée par la classe `.ori-app-shell--sidebar-open` déjà présente.

- d96b9a3: Vague 1 d'enrichissement Ori : 4 nouveaux composants saisie/feedback inspirés des manques identifiés dans le DS distant.

  Tous classés comme **Primitives** dans la taxonomie Storybook, avec parité React + Angular et a11y RGAA.
  - **SearchBar** (`Primitives/Saisie/SearchBar`) : champ de recherche autonome posé sur un `<form role="search">`, avec input borderless underlined et bouton primaire. Supporte mode contrôlé et non contrôlé, taille `sm`, bouton icône seule.
  - **PhoneInput** (`Primitives/Saisie/PhoneInput`) : saisie d'un numéro de téléphone avec sélecteur d'indicatif. Par défaut configuré sur Polynésie française (+689) en lecture seule ; fournir `countries` pour activer le dropdown. Couvre les états Normal/Rempli/Erreur/Désactivé/Lecture seule/Avec aide.
  - **RichRadio** (`Primitives/Saisie/RichRadio`) : choix exclusif rendu sous forme de cartes (titre + description + slot trailing pour icône/image). Pattern Context React et injection Angular identique au `Radio` classique. Disposition verticale ou horizontale.
  - **DownloadButton** (`Primitives/Actions/DownloadButton`) : lien de téléchargement avec icône et métadonnées de fichier (type + taille). Utilise l'attribut natif HTML `download`.

  Aucune dépendance ajoutée : tout passe par `lucide-react` / `lucide-angular` déjà embarqués. Les classes CSS `.ori-search-bar*`, `.ori-phone-input*`, `.ori-rich-radio*`, `.ori-download-button*` vivent dans `@govpf/ori-tailwind-preset` et sont automatiquement présentes dans le bundle `@govpf/ori-css/dist/ds.css`.

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

## 0.1.1

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
