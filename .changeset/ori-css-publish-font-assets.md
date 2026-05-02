---
'@govpf/ori-css': patch
---

Fix : packager les polices Inter dans le bundle `@govpf/ori-css`.

Le `dist/ori.css` publié contenait des `@font-face` avec
`url('../assets/fonts/Inter-VariableFont.ttf')`, chemin qui ne résolvait
nulle part une fois le package publié sur npm (le dossier `assets/`
n'existait pas côté `packages/css/`). Conséquence : tout consommateur
passant par un bundler qui résout les URLs (Angular CLI, Vite, webpack)
sortait `Could not resolve "../assets/fonts/..."`.

Le build de `packages/css` copie désormais les TTF depuis
`packages/tokens/assets/fonts/` vers `packages/css/assets/fonts/` et
publie ce dossier avec le package, pour que `url('../assets/fonts/...')`
résolve correctement depuis `node_modules/@govpf/ori-css/dist/`.

Pas de breaking : seul le packaging change, le contenu de `dist/ori.css`
est identique.
