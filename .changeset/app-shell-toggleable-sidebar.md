---
'@govpf/ori-react': minor
'@govpf/ori-angular': minor
'@govpf/ori-tailwind-preset': patch
'@govpf/ori-css': patch
---

AppShell : la prop `sidebarOpen` pilote désormais l'affichage de la sidebar **sur tous les viewports**, pas uniquement le drawer mobile.

- Desktop ≥ 768px : `sidebarOpen=true` (défaut) la sidebar reste visible in-flow ; `sidebarOpen=false` la masque et le main reprend toute la largeur.
- Mobile < 768px : comportement inchangé, la même prop ouvre / ferme le drawer.

Permet aux apps de greffer un bouton de toggle « ☰ » dans le header projeté pour cacher la navigation latérale et gagner de la place sur grand écran. La démo portail le démontre : bouton hamburger à gauche du logo qui pilote `sidebarOpen` en `useState`.

**Breaking pré-1.0 (minor)** : le défaut de `sidebarOpen` passe de `false` à `true`. Impact :

- Desktop : aucun changement, la sidebar était déjà toujours visible.
- Mobile : les apps qui ne pilotaient pas `sidebarOpen` voyaient le drawer fermé au load (la classe `--sidebar-open` n'était jamais appliquée). Avec le nouveau défaut, le drawer s'ouvre au load. Pour conserver l'ancien comportement, passer explicitement `sidebarOpen={false}` au mount, idéalement en récupérant la valeur depuis un `useState`.

Aucun changement d'API : props existantes inchangées, ajout uniquement d'une règle CSS desktop conditionnée par la classe `.ori-app-shell--sidebar-open` déjà présente.
