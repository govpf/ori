---
'@govpf/ori-tailwind-preset': patch
'@govpf/ori-css': patch
---

PhoneInput : coller le pill indicatif et l'input numéro en un seul combo visuel.

Avant, un `gap: spacing.2` séparait le pill `+689` de l'input du numéro - ils ressemblaient à deux contrôles distincts plutôt qu'à un champ unifié.

Désormais le `gap` passe à `0` et les rayons sont asymétriques : le pill garde son rayon à gauche, l'input son rayon à droite. Visuellement les deux moitiés forment un seul rectangle scindé, ce qui rend mieux l'idée que la valeur saisie est composée des deux parties (`dialCode + value`).
