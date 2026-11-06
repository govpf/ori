# @govpf/ori-example-fascicule

Exemple de **fascicule imprimable** (livret de prise en main) bâti sur les
design tokens Ori, en HTML/CSS pur : _Prendre en main votre nouveau PC_,
12 pages, formats **A5** (livret, format de référence) et **A4**.

La charte complète est documentée sur le site :
[`/supports/fascicule/`](../ori-site/src/pages/supports/fascicule.mdx).

## Lancer

```bash
pnpm build:tokens && pnpm build:css   # une fois, si packages/css/dist n'existe pas
pnpm example:fascicule                # http://localhost:4175
```

Dans l'aperçu : boutons **A5 / A4** (ou `?format=a4`), puis **Imprimer / PDF**.
Dans la boîte d'impression, laisser le format proposé, marges « Aucune » ou
« Par défaut », et cocher « Graphiques d'arrière-plan » si le navigateur le
demande. Pour un livret plié : imprimer le PDF A5 avec l'option « Livret »
du pilote, sur A4 recto verso.

## Fichiers

| Fichier           | Rôle                                                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `index.html`      | Le fascicule : une `<section class="sheet">` par page imprimée.                                                                      |
| `fascicule.css`   | La charte : alias `--fasc-*` vers les tokens Ori, mise en page A5/A4, composants (sommaire, étapes, figures, touches, pied de page). |
| `fascicule.js`    | Aides d'aperçu, non indispensables : bascule A5/A4, numéros de page du sommaire, signalement des pages qui débordent.                |
| `copy-assets.mjs` | Copie `ori.min.css` dans `css/`, les polices Inter dans `assets/fonts/` et le crest dans `assets/` (fichiers ignorés par git).       |
| `build.mjs`       | Produit `dist/`, publié sous `/exemples/fascicule/`.                                                                                 |

## Réutiliser la charte pour un autre fascicule

1. Copier `fascicule.css` et `fascicule.js`, charger `@govpf/ori-css` avant.
2. Écrire une `<section class="sheet">` par page ; un chapitre commence
   toujours sur une nouvelle feuille.
3. Viser un nombre de pages multiple de 4 pour un livret A5.
4. Vérifier qu'aucune page n'est encadrée de rouge dans l'aperçu, en A5
   **et** en A4.

## Tokens Ori utilisés

- Police : `--font-family-sans`
- Tailles : `--font-size-xs`, `-sm`, `-base`, `-lg`, `-xl`, `-2xl`, `-3xl`, `-4xl`
- Graisses : `--font-weight-regular`, `-semibold`, `-bold`
- Interlignes : `--font-line-height-tight`, `-normal`, `-relaxed`
- Texte : `--color-text-primary`, `-secondary`, `-muted`, `-inverse`
- Marque : `--color-brand-primary`, `-primary-active`, `-primary-subtle`, `-on-primary`, `--color-primary-400` (illustrations)
- Surfaces : `--color-surface-base`, `-muted`, `-subtle`
- Bordures : `--color-border-subtle`, `-default`
- Retours : `--color-feedback-danger` (signalement de débordement) ; `success`, `warning`, `danger` et leurs `-bg` via `.ori-callout`
- Espacements : `--spacing-1`, `-2`, `-3`, `-4`, `-5`, `-6`, `-8`, `-10`, `-12`, `-16`
- Rayons : `--radius-sm`, `-lg`, `-xl`, `-full`
- Ombres : `--shadow-sm`, `-md`, `-lg` (aperçu écran)

Composants Ori réutilisés : `.ori-callout` (encadrés), `.ori-logo`,
`.ori-button` (barre d'aperçu), `.ori-demo-banner`.

Valeurs littérales restantes (aucun token équivalent) : dimensions papier
en mm, épaisseurs de trait (1, 2 et 4px) et ajustements optiques en `em`.
