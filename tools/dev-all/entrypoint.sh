#!/bin/sh
# Entrypoint du conteneur dev Ori.
#
# 1. Installe les dépendances via pnpm si node_modules est absent ou vide
#    (premier boot après création du volume nommé).
# 2. Lance l'orchestrateur dev (cf. tools/dev-all/dev.mjs).
#
# Le script est exec en remplaçant le processus shell pour que SIGTERM
# de Docker arrive directement à Node, qui propage à concurrently.

set -e

cd /workspace

if [ ! -d node_modules ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
  echo "[entrypoint] Installation initiale des dépendances pnpm…"
  pnpm install --frozen-lockfile
else
  echo "[entrypoint] node_modules présent, on skip pnpm install"
fi

# Les packages publishables (@govpf/ori-react, @govpf/ori-angular, etc.)
# doivent être buildés au moins une fois pour que les apps puissent
# résoudre leurs imports. On vérifie la présence d'un dist côté Angular
# qui est le plus long à compiler ; si absent, on build tout le scope
# packages/*. À chaque boot ultérieur sur le même volume, ce check est
# rapide (le dist persiste avec le volume node_modules).
if [ ! -d packages/angular/dist ] || [ ! -d packages/react/dist ] || [ ! -d packages/css/dist ]; then
  echo "[entrypoint] Build initial des packages publishables…"
  pnpm -r --filter "./packages/*" build
else
  echo "[entrypoint] dist des packages présents, on skip le build initial"
fi

echo "[entrypoint] Démarrage de l'orchestrateur dev:all…"
exec pnpm dev:all
