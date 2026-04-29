---
'@govpf/ori-tailwind-preset': patch
'@govpf/ori-css': patch
---

Fix AppShell : la sidebar s'étire désormais correctement sur toute la hauteur du body de l'AppShell, et son contenu projeté (typiquement un `<nav>` portant une `border-right`) descend jusqu'au footer.

Avant ce fix, le contenu projeté ne prenait que la hauteur de ses items, ce qui laissait un espace blanc en bas de la sidebar quand le contenu n'occupait pas toute la zone, et la bordure de séparation s'arrêtait au niveau du dernier item au lieu de descendre jusqu'au footer.

La sidebar Ori (`.ori-app-shell__sidebar`) est désormais un container flex column qui force son enfant direct à `flex: 1 1 auto`. Aucun changement d'API : c'est uniquement un correctif CSS dans le plugin Tailwind partagé.
