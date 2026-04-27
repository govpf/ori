#!/usr/bin/env bash
# Wrapper qui exécute `act` dans un conteneur Docker, sans rien installer
# sur le poste hôte. Build l'image au premier lancement, la réutilise
# ensuite.
#
# Usage :
#   ./tools/act/run.sh push                  # joue le workflow CI complet
#   ./tools/act/run.sh push -j format        # joue uniquement le job "format"
#   ./tools/act/run.sh pull_request          # simule une PR
#   ./tools/act/run.sh -l                    # liste les jobs
#   ./tools/act/run.sh --help                # aide native de act
#
# Variables d'environnement utiles :
#   ACT_IMAGE           image runner utilisée par act (défaut: medium)
#                       valeurs : 'micro' | 'medium' | 'large'
#                       cf. https://nektosact.com/usage/runners.html

set -euo pipefail

# Aller à la racine du repo (parent de tools/).
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

# Build l'image act locale si elle n'existe pas.
if ! docker image inspect ori-act >/dev/null 2>&1; then
  echo "→ Build de l'image ori-act (première utilisation)..."
  docker build -t ori-act tools/act/
fi

# Image de runner que act utilisera. medium = ubuntu-22.04 + outils
# courants (node, python, etc.). Suffisant pour ce monorepo.
ACT_IMAGE="${ACT_IMAGE:-medium}"
case "$ACT_IMAGE" in
  micro)  RUNNER_IMAGE="ghcr.io/catthehacker/ubuntu:act-22.04" ;;
  medium) RUNNER_IMAGE="ghcr.io/catthehacker/ubuntu:act-22.04" ;;
  large)  RUNNER_IMAGE="ghcr.io/catthehacker/ubuntu:full-22.04" ;;
  *)      RUNNER_IMAGE="$ACT_IMAGE" ;;
esac

# Détection du chemin du socket Docker selon l'OS hôte.
if [[ -S "/var/run/docker.sock" ]]; then
  DOCKER_SOCK="/var/run/docker.sock"
elif [[ -S "$HOME/.docker/run/docker.sock" ]]; then
  # Docker Desktop sur macOS récent.
  DOCKER_SOCK="$HOME/.docker/run/docker.sock"
else
  # Sur Windows avec Docker Desktop, le socket est exposé en TCP par
  # défaut ; on retombe sur le socket nommé Linux que le container utilise.
  DOCKER_SOCK="/var/run/docker.sock"
fi

# `act` lui-même tourne dans un conteneur, mais il a besoin d'orchestrer
# d'autres conteneurs (les runners). On monte le socket Docker du host.
#
# `-it` requiert un TTY ; sur Git Bash / mintty il faut utiliser
# winpty pour que ce soit alloué. On détecte automatiquement et on
# retombe en mode non-interactif si pas de TTY (utile en CI sur CI).
TTY_FLAGS=""
if [[ -t 0 && -t 1 ]]; then
  TTY_FLAGS="-it"
fi

# Sur Git Bash (MSYS / mintty), les chemins type /var/run/docker.sock
# sont automatiquement convertis en chemins Windows ; on désactive cette
# conversion pour les arguments Docker. Sans effet sur Linux/macOS.
export MSYS_NO_PATHCONV=1

exec docker run --rm $TTY_FLAGS \
  -v "$DOCKER_SOCK":/var/run/docker.sock \
  -v "$REPO_ROOT":/repo \
  -w /repo \
  ori-act \
  --container-architecture linux/amd64 \
  -P "ubuntu-latest=$RUNNER_IMAGE" \
  --pull=false \
  "$@"
