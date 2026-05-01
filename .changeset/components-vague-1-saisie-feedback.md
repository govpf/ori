---
'@govpf/ori-react': minor
'@govpf/ori-angular': minor
'@govpf/ori-tailwind-preset': minor
'@govpf/ori-css': minor
---

Vague 1 d'enrichissement Ori : 4 nouveaux composants saisie/feedback inspirés des manques identifiés dans le DS distant.

Tous classés comme **Primitives** dans la taxonomie Storybook, avec parité React + Angular et a11y RGAA.

- **SearchBar** (`Primitives/Saisie/SearchBar`) : champ de recherche autonome posé sur un `<form role="search">`, avec input borderless underlined et bouton primaire. Supporte mode contrôlé et non contrôlé, taille `sm`, bouton icône seule.
- **PhoneInput** (`Primitives/Saisie/PhoneInput`) : saisie d'un numéro de téléphone avec sélecteur d'indicatif. Par défaut configuré sur Polynésie française (+689) en lecture seule ; fournir `countries` pour activer le dropdown. Couvre les états Normal/Rempli/Erreur/Désactivé/Lecture seule/Avec aide.
- **RichRadio** (`Primitives/Saisie/RichRadio`) : choix exclusif rendu sous forme de cartes (titre + description + slot trailing pour icône/image). Pattern Context React et injection Angular identique au `Radio` classique. Disposition verticale ou horizontale.
- **DownloadButton** (`Primitives/Actions/DownloadButton`) : lien de téléchargement avec icône et métadonnées de fichier (type + taille). Utilise l'attribut natif HTML `download`.

Aucune dépendance ajoutée : tout passe par `lucide-react` / `lucide-angular` déjà embarqués. Les classes CSS `.ori-search-bar*`, `.ori-phone-input*`, `.ori-rich-radio*`, `.ori-download-button*` vivent dans `@govpf/ori-tailwind-preset` et sont automatiquement présentes dans le bundle `@govpf/ori-css/dist/ds.css`.
