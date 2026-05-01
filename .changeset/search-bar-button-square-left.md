---
'@govpf/ori-tailwind-preset': patch
'@govpf/ori-css': patch
---

SearchBar : coller le trait à la base du bouton et carré le coin gauche du bouton.

Le wrapper `__field` avait un `gap: spacing.2` qui laissait un espace entre l'input et le bouton. Du coup la border-bottom de l'input s'arrêtait avant le bouton, et le bouton avait son radius normal à gauche - on voyait un petit creux disgracieux à la jonction.

Désormais :

- `gap: 0` : input et bouton sont collés.
- Le bouton perd son rayon à gauche (`border-top-left-radius` et `border-bottom-left-radius` à `0`), seul le côté droit reste arrondi.

Visuellement, le trait sous l'input rejoint le bord gauche du bouton sans interruption, et la coupure verticale entre l'input et le bouton est nette.
