# Description

<!-- Quel problème cette PR résout, ou quelle amélioration elle apporte. -->

## Type de changement

- [ ] Correction de bug
- [ ] Nouveau composant ou nouvelle fonctionnalité
- [ ] Modification d'API existante (breaking change potentiel)
- [ ] Documentation seule
- [ ] Refactor / nettoyage
- [ ] Mise à jour de dépendances

## Cross-framework

Pour toute modification qui touche un composant du DS (`packages/react/`,
`packages/angular/`, `packages/tailwind-preset/`) :

- [ ] La modification a été appliquée **côté React et côté Angular** (sauf
      si volontairement single-framework, dans ce cas justifier)
- [ ] Les classes CSS (`.ori-*`) restent cohérentes entre les deux
      implémentations
- [ ] Les stories ont été mises à jour dans les deux Storybooks
- [ ] Les playgrounds (`apps/playground-*`) consomment correctement la
      nouvelle version

## Accessibilité

- [ ] La modification respecte le RGAA AA (contrastes, navigation
      clavier, étiquetage ARIA explicite)
- [ ] Si un `aria-*` ou un rôle a été ajouté, son comportement a été
      vérifié au lecteur d'écran (NVDA / VoiceOver) ou justifié

## Tests

- [ ] La modification a été testée manuellement dans demo-portail et/ou
      playground concerné
- [ ] Le composant fonctionne en thème clair **et** en thème sombre
- [ ] Le rendu reste correct au-dessus et en dessous du breakpoint mobile

## Documentation

- [ ] MDX du composant mis à jour (`packages/docs/src/components/<Nom>.mdx`)
      si l'API a changé
- [ ] Site Astro mis à jour si la page composant existe dans `apps/ori-site/`
- [ ] CHANGELOG (à venir) à jour

## Risques connus

<!-- Régressions possibles, deps qui grossissent, breaking changes pour
les apps consommatrices. À blanchir si rien à signaler. -->

## Captures d'écran

<!-- Pour les changements visuels : avant / après en clair et en sombre. -->
