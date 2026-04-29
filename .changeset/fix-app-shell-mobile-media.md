---
'@govpf/ori-tailwind-preset': patch
'@govpf/ori-css': patch
---

Fix AppShell : la sidebar reste correctement dans le flow (côte à côte avec le main) sur desktop.

Avant ce fix, la règle media `(max-width: 767px)` du plugin était définie au niveau racine d'`addComponents` et contenait des sélecteurs composés (`.ori-app-shell--with-sidebar .ori-app-shell__sidebar`). PostCSS/Tailwind aplatissait ces sélecteurs en perdant à la fois le wrapping `@media` et le parent composé, transformant la règle « drawer mobile fixed » en règle desktop. Résultat visible : sur la démo, la sidebar était `position: fixed` sur tous les viewports, ce qui la sortait du flow et faisait remonter le main sous le header.

Refactor : chaque sélecteur garde sa forme `.parent .child` et porte son propre `@media (max-width: 767px)` imbriqué. La sortie CSS conserve désormais correctement les media queries.
