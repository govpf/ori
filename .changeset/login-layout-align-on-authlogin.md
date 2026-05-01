---
'@govpf/ori-react': minor
'@govpf/ori-angular': minor
'@govpf/ori-tailwind-preset': minor
'@govpf/ori-css': minor
---

LoginLayout : aligner le pattern visuel sur la mire Keycloak `AuthLogin.mdx`.

Cohérence d'expérience entre la mire SSO Keycloak (HTML+CSS pur, hors composant DS, cf. décision K.1) et les pages de connexion d'apps internes (composant LoginLayout) : les deux écrans affichent désormais le même pattern.

Changements visuels :

- Le `logo` est rendu **dans** la carte (en haut, centré), plus au-dessus.
- Le titre et la description sont **centrés**.
- Le `cardFooter` n'a plus de séparateur `border-top` : c'est juste un paragraphe centré dans le bas de la carte (l'espacement vient du `gap` du parent).

Aucun changement d'API : les props `logo`, `title`, `description`, `children`, `cardFooter`, `footer` sont inchangées. Les apps qui passaient déjà ces slots verront leur layout se réorganiser visuellement, sans casser le code.

**Breaking pré-1.0 (minor)** : les apps qui dépendaient de la position du logo hors carte verront un nouveau rendu. Pour conserver l'ancien layout, il faut désormais wrapper le logo en dehors de `<LoginLayout>` (mais ce pattern n'était plus aligné sur la spec Keycloak, donc à éviter).
