# pf-ds - recettes de développement.
#
# Fonctionne sur Windows, macOS et Linux via `just` (https://just.systems/).
# Installation :
#   Windows : winget install Casey.Just    (ou : scoop install just)
#   macOS   : brew install just
#   Linux   : cargo install just           (ou paquet système : apt, pacman…)
#
# Usage : `just <recette>`  |  `just --list` pour tout voir.

# Shell cross-platform :
#   - Windows  : PowerShell (natif, toujours présent sur Win 10+)
#   - macOS/Linux : /bin/sh (défaut)
set windows-shell := ["powershell.exe", "-NoLogo", "-NoProfile", "-Command"]

# Recette par défaut : afficher la liste
default:
    @just --list --unsorted

# ─── Installation ────────────────────────────────────────────────────────────

# Installer toutes les dépendances du monorepo
install:
    pnpm install

# Nettoyer les node_modules, dist, build (⚠️ force un réinstall)
clean:
    pnpm clean

# Purger uniquement les caches Vite/Webpack/Angular (rapide, sans réinstall).
# À lancer quand le rendu Storybook / playground ne reflète plus les derniers tokens.
clean-cache:
    pnpm clean:cache

# Réinstallation complète depuis zéro
fresh: clean install

# ─── Builds ──────────────────────────────────────────────────────────────────

# Tout compiler (tokens → preset → css → react → angular)
build:
    pnpm build

# Générer les tokens (JSON DTCG → CSS, SCSS, JS, preset Tailwind)
build-tokens:
    pnpm build:tokens

# Compiler le bundle CSS statique (ds.css + ds.min.css + tokens.css)
build-css:
    pnpm build:css

# Compiler les composants React
build-react:
    pnpm build:react

# Compiler la lib Angular (ng-packagr)
build-angular:
    pnpm build:angular

# Chaîne de régénération après modif des tokens.
# Purge aussi les caches Vite/Webpack pour que Storybook / les playgrounds
# relisent le preset Tailwind à jour au prochain démarrage (évite les rendus stale).
rebuild-tokens: build-tokens build-css clean-cache

# ─── Storybook ───────────────────────────────────────────────────────────────

# Storybook React (http://localhost:6006)
storybook-react:
    pnpm storybook:react

# Storybook Angular (http://localhost:6008)
storybook-angular:
    pnpm storybook:angular

# Compiler Storybook React en site statique
build-storybook-react:
    pnpm build:storybook:react

# Compiler Storybook Angular en site statique
build-storybook-angular:
    pnpm build:storybook:angular

# ─── Playgrounds ─────────────────────────────────────────────────────────────

# Démo HTML pure consommant ds.css (http://localhost:4173)
playground-static:
    pnpm playground:static

# Démo Angular SPA consommant @pf-ds/angular (http://localhost:4200)
playground-angular:
    pnpm playground:angular

# ─── Modes watch ─────────────────────────────────────────────────────────────

# Mode watch : rebuild CSS à la volée pendant le dev
watch-css:
    pnpm --filter @pf-ds/css run watch

# Mode watch : rebuild React à la volée
watch-react:
    pnpm --filter @pf-ds/react run dev

# ─── Qualité ─────────────────────────────────────────────────────────────────

# Formater tout le code (prettier)
format:
    pnpm format

# Linter tous les packages
lint:
    pnpm lint

# ─── Raccourcis composés ─────────────────────────────────────────────────────

# Setup initial d'une nouvelle machine
setup: install build
    @echo ""
    @echo "✓ pf-ds prêt. Lance 'just storybook-react' ou 'just storybook-angular'."

# Cycle complet (fresh install + build + storybook React)
all: fresh build storybook-react
