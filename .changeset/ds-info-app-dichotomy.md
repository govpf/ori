---
'@govpf/ori-css': minor
'@govpf/ori-tailwind-preset': minor
---

Formalisation de la dichotomie **interfaces applicatives vs interfaces
d'information** dans Ori, et ajout de 2 utilitaires CSS transverses
issus des exemples publics.

**Nouvelles classes CSS publiques :**

- `.ori-skip-link` : utilitaire d'accessibilité pour les liens
  d'évitement (« Aller au contenu principal »). Masqué par défaut,
  visible et focusable au clavier. Équivalent du pattern
  `visually-hidden-focusable` standard, conforme WCAG 2.4.1.
- `.ori-demo-banner` + `.ori-demo-banner__link` : bandeau jaune fixé
  en haut de page pour signaler une démo non-prod, à utiliser
  uniquement sur les apps de démonstration pour éviter qu'un usager
  confonde la démo avec un vrai service public.

Migration appliquée sur les 3 exemples publics (`example-landing`,
`example-keycloak`, `example-agent`) qui dupliquaient ces 2 patterns
en CSS local. ~150 lignes de CSS local supprimées au total.

Pas de breaking change : ces classes sont nouvelles, l'ajout est
non-régressant.
