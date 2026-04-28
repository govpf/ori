# Stubs de réservation npm - @govpf/ori-*

Ce dossier contient des packages **vides** dont l'unique but est de
réserver les noms de packages sur npm avant la publication réelle, pour
empêcher le squatting du scope `@govpf`.

## Comment publier les stubs

Préreq :
- Tu es loggé sur npm avec ton compte nominatif : `npm whoami` doit
  retourner ton username.
- Tu es admin de l'org `@govpf`.
- Ton 2FA est actif (l'OTP te sera demandé à chaque publish).

Pour publier **un seul** stub :

```bash
cd tmp-npm-stubs/ori-tokens
npm publish --access public
```

Pour publier **tous les stubs** d'un coup (plus efficace) :

```bash
cd tmp-npm-stubs
for d in ori ori-tokens ori-css ori-tailwind-preset ori-react ori-angular ori-icons ori-themes; do
  echo "Publishing @govpf/$d..."
  (cd "$d" && npm publish --access public)
done
```

Tu seras invité à entrer ton OTP plusieurs fois (une par publish).

## Vérifier après coup

```bash
npm view @govpf/ori-tokens
```

Devrait afficher la version 0.0.0 et la description "Reserved".

## Important

- npm garde les noms réservés **24 mois** même après suppression. Si tu
  changes d'avis sur un nom, c'est bloqué pour 2 ans. Donc ne publie ces
  stubs que si tu es **certain** des noms.
- À la 1re vraie publication (V1), tu remplaceras la version 0.0.0 par
  une version 1.0.0 du package réel via les pipelines de release. Pas
  besoin de "supprimer" le stub - un `npm publish` avec une version
  supérieure le remplace naturellement.
- Une fois les stubs publiés, ce dossier `tmp-npm-stubs/` peut être
  supprimé du repo. Il n'a aucune utilité fonctionnelle.
