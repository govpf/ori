# Image minimale qui contient `act` pour exécuter les workflows GitHub
# Actions localement, sans installer act sur le poste hôte.
#
# act lui-même utilise Docker pour faire tourner les jobs : on monte le
# socket Docker du host (/var/run/docker.sock) dans ce conteneur pour
# que `act` puisse spawn les containers de runner depuis l'intérieur.
#
# Build :
#   docker build -t ori-act tools/act/
#
# Usage : voir tools/act/run.sh

FROM debian:bookworm-slim

# CA + curl pour télécharger act ; docker-cli pour parler au socket monté.
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
       ca-certificates \
       curl \
       docker.io \
  && rm -rf /var/lib/apt/lists/*

# Installation de la dernière release de act dans /usr/local/bin.
RUN curl -fsSL https://raw.githubusercontent.com/nektos/act/master/install.sh \
    | bash -s -- -b /usr/local/bin

WORKDIR /repo

ENTRYPOINT ["act"]
CMD ["--help"]
