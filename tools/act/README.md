# Tester la CI localement avec act

Ce dossier contient un environnement Docker minimal pour exécuter
[act](https://github.com/nektos/act) **sans rien installer sur ton poste**.
`act` permet de jouer les workflows GitHub Actions localement, ce qui
évite d'attendre un push pour découvrir qu'un job casse.

## Prérequis

- Docker installé et démarré (`docker --version` doit répondre)
- Bash disponible (Git Bash sur Windows, ou WSL)

Aucune autre installation. Le binaire `act` est dans le conteneur, pas
sur ton poste.

## Premier lancement

```bash
./tools/act/run.sh push
```

Le script build l'image `ori-act` la première fois (~30 s). Il pull
ensuite l'image runner `ghcr.io/catthehacker/ubuntu:act-22.04`
(~1.5 Go, une seule fois). Les exécutions suivantes sont rapides :
les images sont en cache.

## Cas courants

| Commande | Effet |
|---|---|
| `./tools/act/run.sh push` | Joue tous les jobs du workflow `ci.yml` comme si on poussait sur main |
| `./tools/act/run.sh push -j format` | Joue uniquement le job `format` |
| `./tools/act/run.sh push -j build-packages` | Joue uniquement le build des packages |
| `./tools/act/run.sh pull_request` | Simule une PR contre main |
| `./tools/act/run.sh -l` | Liste les jobs et leurs dépendances |
| `./tools/act/run.sh --graph` | Affiche le graphe des dépendances |

## Choix de l'image runner

`act` utilise une image Docker pour simuler le runner Ubuntu de GitHub.
Trois variantes sont supportées :

| Variante | Taille | Inclus | Quand l'utiliser |
|---|---|---|---|
| `micro` | ~200 Mo | Outils minimaux | Pour des jobs très simples |
| `medium` (défaut) | ~1.5 Go | Node, Python, Java, etc. | **Recommandé pour Ori** |
| `large` | ~17 Go | Tout (parité GitHub) | Si un job échoue avec medium |

Pour changer la variante :

```bash
ACT_IMAGE=large ./tools/act/run.sh push
```

## Limitations connues

- **Cache des actions** : `actions/cache` ne fonctionne pas en local
  (l'API GitHub n'est pas accessible). Le cache pnpm est ignoré, les
  jobs sont donc plus lents qu'en CI réelle.
- **Secrets** : aucun secret GitHub n'est disponible. Les jobs qui en
  dépendent (publication npm, deploy GH Pages) ne sont pas testables
  ainsi.
- **Différences d'environnement mineures** : l'image `catthehacker/ubuntu`
  est très proche du runner GitHub mais pas identique au bit près.

## Si quelque chose casse

1. Vérifie que Docker tourne : `docker info`
2. Reconstruis l'image act locale : `docker rmi ori-act && ./tools/act/run.sh push`
3. Force le pull de l'image runner : retire `--pull=false` dans `run.sh`
4. Passe en variante `large` : `ACT_IMAGE=large ./tools/act/run.sh push`
