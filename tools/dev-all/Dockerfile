# Image dev pour lancer toutes les apps Ori en parallèle dans un
# conteneur jetable. Permet un kill global propre via `docker compose down`,
# évite les zombies pnpm/node récurrents sur Windows quand le SIGINT
# n'est pas correctement propagé aux process enfants.
#
# Image basée sur Node 24 LTS (même version que la CI). pnpm est activé
# via corepack pour rester aligné avec la version pinée du repo.

FROM node:24-slim

ARG PNPM_VERSION=10.29.3

# Outils utiles : curl pour les health-check, git pour résoudre les
# infos repo dans certains scripts.
RUN apt-get update \
  && apt-get install -y --no-install-recommends curl git procps \
  && rm -rf /var/lib/apt/lists/*

# pnpm via npm install global (plus fiable que corepack qui dépend du
# registry npmjs et tend à timeout sur le pull). Version pinée pour
# rester aligné avec packageManager du package.json racine.
RUN npm install -g pnpm@${PNPM_VERSION}

WORKDIR /workspace

# Watchers en mode polling : indispensable quand le code source vit en
# bind mount depuis l'host Windows. Les notifications inotify natives
# ne traversent pas le pont WSL2 / Hyper-V correctement.
ENV CHOKIDAR_USEPOLLING=true \
    CHOKIDAR_INTERVAL=1000 \
    WATCHPACK_POLLING=true

# Ports exposés (cf. tools/dev-all/dev.mjs pour le mapping).
EXPOSE 3000 4173 4200 4321 5173 5174 6006 6008

# Le script d'entrée installe les dépendances au premier boot puis
# lance l'orchestrateur. Kept en /usr/local/bin pour rester accessible
# depuis le PATH par défaut.
COPY tools/dev-all/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
