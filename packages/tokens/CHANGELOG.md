# @govpf/ori-tokens

## 0.2.0

### Minor Changes

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
