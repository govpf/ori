---
'@govpf/ori-react': patch
'@govpf/ori-angular': patch
'@govpf/ori-tailwind-preset': patch
'@govpf/ori-css': patch
---

Accessibilité (WCAG 2.5.3, règle axe `label-content-name-mismatch`) : le nom accessible des contrôles contient désormais leur texte visible.

- **Steps** (`clickable`) : l'`aria-label` « Revenir à l'étape N » est remplacé par un préfixe masqué visuellement (nouvelle classe `.ori-steps__sr-only`). Le bouton est annoncé « Revenir à l'étape N : Titre Description ».
- **LanguageSwitcher** : le nom accessible du déclencheur combine la langue courante et `triggerAriaLabel`, par exemple « fr, Changer la langue ». La prop/l'input `triggerAriaLabel` reste inchangé.
