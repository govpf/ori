# @govpf/ori-css

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
