---
'@govpf/ori-react': patch
'@govpf/ori-angular': patch
'@govpf/ori-tailwind-preset': patch
'@govpf/ori-css': patch
---

AppShell : bouton de toggle intégré sur le bord droit de la sidebar.

Le composant rend désormais lui-même un bouton chevron sur la frontière sidebar/main, qui pilote `sidebarOpen` via `onSidebarOpenChange`. Plus besoin de greffer un bouton hamburger dans le header projeté.

- Quand la sidebar est visible (`sidebarOpen=true`) : chevron vers la gauche, posé sur le bord droit de la sidebar
- Quand elle est masquée (`sidebarOpen=false`) : chevron vers la droite, glissé au début du main
- Caché sur mobile (le drawer ferme via le scrim cliquable et la touche Escape, comportement inchangé)

Le bouton n'est rendu que si `onSidebarOpenChange` est fourni : sans callback, le toggle ne pourrait rien faire. Aucun changement breaking : les apps qui ne passent pas `onSidebarOpenChange` ne voient pas le bouton.

Nouvelles props (toutes optionnelles) :

- `collapseSidebarLabel?: string` (défaut : « Masquer la navigation latérale »)
- `expandSidebarLabel?: string` (défaut : « Afficher la navigation latérale »)
