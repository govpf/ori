---
'@govpf/ori-react': minor
'@govpf/ori-angular': minor
'@govpf/ori-tailwind-preset': minor
'@govpf/ori-css': minor
---

Renommage des classes `.ori-btn*` en `.ori-button*` pour aligner sur la convention de nommage du DS (PascalCase React → kebab-case CSS).

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
