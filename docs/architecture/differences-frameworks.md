
# Différences fonctionnelles React ↔ Angular

Cette page documente les **divergences entre les implémentations React et
Angular** des composants Ori. Certaines sont volontaires (différences
inhérentes aux deux frameworks), les autres ont été harmonisées le 2026-04-25.

L'objectif n'est pas une parité 100% identique - React et Angular ont des
philosophies API différentes. C'est de connaître précisément les points de
divergence pour ne pas avoir de surprises côté apps consommatrices.

## État actuel

🟢 **Tous les écarts d'API et d'accessibilité identifiés ont été harmonisés.**

| Catégorie | Statut |
|---|---|
| Naming d'events / d'API (volontaire framework) | ✓ Acté, pas alignable |
| Pass-through DOM attrs (philosophie framework) | ✓ Documenté + pragmatisme côté Angular |
| Composants où Angular était moins riche que React | 🟢 Harmonisé |
| Composants où React était moins riche qu'Angular | 🟢 Harmonisé |
| Différences a11y majeures (Dialog focus-trap) | 🟢 Résolu via @angular/cdk |

## Différences acceptées (volontaires)

Liées à la philosophie de chaque framework. **Ne pas chercher à aligner**.

### Naming des événements

| Concept | React | Angular |
|---|---|---|
| Callback de fermeture | `onDismiss?: () => void` | `(dismiss)="..."` (`@Output dismiss`) |
| Changement de valeur | `onChange` (event natif) | `(valueChange)="..."` (`@Output valueChange`) |
| Click | `onClick={...}` | `(click)="..."` |

C'est la convention de chaque framework. Aligner serait artificiel.

### Pass-through des attributs DOM

| Approche | React | Angular |
|---|---|---|
| Attributs natifs sur l'élément racine | `...rest` spread (transparent) | Liste explicite via `@Input` |
| Exemple Button | `<Button autoFocus form="myForm" data-test="ok">` marche | `<ori-button>` n'a que les inputs déclarés |

Côté React, on hérite de `ButtonHTMLAttributes`/`HTMLAttributes` et on spread.
Côté Angular, le pattern courant est de déclarer explicitement les Inputs.

**Compromis pragmatique côté Angular** : sur Input, on a ajouté les attrs
natifs les plus utiles (`name`, `autocomplete`, `inputMode`, `pattern`) en
Inputs explicites. Pour des cas plus avancés (`data-*`, `form`, `autofocus`),
le consommateur Angular wrappe ou accède au DOM via ViewChild.

### Génération d'ID auto

| | React | Angular |
|---|---|---|
| Mécanisme | `useId()` (React 18+) | Compteur UID interne (`nextUid++`) |
| Stable côté SSR | ✓ | ⚠️ Pas de SSR géré officiellement (à vérifier si Angular SSR utilisé) |

Équivalent fonctionnel pour le cas d'usage standard (CSR).

## Différences harmonisées (historique)

Les écarts qui existaient et qu'on a résolus pour traçabilité.

### Button

| Sujet | Avant | Après (2026-04-25) |
|---|---|---|
| Slots d'icônes React | `leadingIcon` + `trailingIcon` props | Retirées. Composition via children uniquement, parité Angular |

### Input

| Sujet | Avant | Après |
|---|---|---|
| `wrapperClass` Angular | absent | Input `wrapperClass` ajouté, concaténé à `.ori-field` |
| Attrs natifs Angular | seulement les inputs déclarés explicites | + `name`, `autocomplete`, `inputMode`, `pattern` |
| Type `value` Angular | `string \| number \| null` | aligné sur le standard HTML : `string \| number \| readonly string[] \| null` |

### Card

| Sujet | Avant | Après |
|---|---|---|
| `wrapperClass` Angular | absent | Input `wrapperClass` ajouté, concaténé à `.ori-card` |

### Alert

| Sujet | Avant | Après |
|---|---|---|
| **Role ARIA** | React toujours `role="alert"`, Angular conditionnel | React ALIGNÉ : `role="alert"` pour danger, `role="status"` pour les autres (a11y) |
| `dismissible` React | implicite (déduit de la présence de `onDismiss`) | Boolean explicite (default `false`), parité Angular |
| Icône custom Angular | absente | Directive marker `[pfAlertIcon]` + `<ng-template>`, parité conceptuelle React (`icon` prop) |

### Dialog ⭐

| Capacité | React (Radix UI) | Angular (avant) | Angular (après) |
|---|---|---|---|
| Focus trap | ✅ | ❌ | ✅ via @angular/cdk/a11y `ConfigurableFocusTrap` |
| Restauration du focus | ✅ | ❌ | ✅ |
| Scroll lock du body | ✅ | ❌ | ✅ |
| Portal (rendu dans `document.body`) | ✅ | ❌ | ❌ (rendu in-place, suffisant pour la majorité des cas) |
| ESC pour fermer | ✅ | ✅ | ✅ |
| Backdrop click pour fermer | ✅ | ✅ | ✅ |
| API | Compound components Radix | `[open]` simple | `[open]` simple |

**Limitation acceptée côté Angular** : pas de portal. Le dialog est rendu
dans le DOM in-place. Si une app a besoin (stacking-context, overflow:hidden
parent), elle peut wrapper avec `@angular/cdk/overlay` côté applicatif.

### Forms 1 (Checkbox / Radio / Switch / Textarea)

Composants livrés en parité dans la phase 2a (2026-04-25).

| Composant | React | Angular | Notes |
|---|---|---|---|
| Checkbox | `<Checkbox label hint error indeterminate />` | `<ori-checkbox [label] [hint] [error] [indeterminate] />` | `indeterminate` est une property DOM (gérée via ref / ViewChild) |
| Radio | `<Radio value label />` (dans `<RadioGroup>`) | `<ori-radio [value] [label]>` (dans `<ori-radio-group>`) | React utilise un Context, Angular utilise `inject(OriRadioGroupComponent, { host: true, optional: true })` |
| RadioGroup | `<RadioGroup label value onChange>` (controlled) | `<ori-radio-group [label] [value] (valueChange)>` | Pose le `<fieldset>`/`<legend>` + `role="radiogroup"` |
| Switch | `<Switch label />` (`<input type="checkbox" role="switch">`) | `<ori-switch [label]>` (idem) | Sémantique HTML identique des deux côtés |
| Textarea | `<Textarea rows label hint error />` | `<ori-textarea [rows] [label] [hint] [error]>` | Hérite des patterns Input + `rows`, resize vertical natif |

**Choix de design partagés** :

- Tous utilisent les classes CSS `.ori-choice` (case + label) et `.ori-choice-group` (empilement)
- Mêmes patterns ARIA que `Input` (`aria-invalid`, `aria-describedby`, hint/error sous le champ)
- `RadioGroup` pose un vrai `<fieldset>` avec `<legend>` (a11y native), pas un `<div>` avec `aria-labelledby`

## Conclusion

À ce jour, **les écarts restants entre React et Angular sont uniquement
d'ordre philosophique** (naming d'events, pass-through DOM, génération d'IDs).
Les apps consommatrices doivent les connaître mais elles ne traduisent plus
de dette technique : c'est juste deux frameworks qui ont leur grammaire.
