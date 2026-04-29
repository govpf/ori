# @govpf/ori-css

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
