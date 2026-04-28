# Politique de sécurité

Ori est utilisé dans les services administratifs de la Polynésie française.
La sécurité est traitée comme une priorité, et les rapports de
vulnérabilités sont les bienvenus.

## Versions supportées

Ori est en **phase de bootstrap** (versions 0.x). Toutes les versions
publiées reçoivent les correctifs de sécurité jusqu'à la sortie d'une
version stable 1.0, après quoi cette section sera mise à jour pour
refléter une politique de support semver classique.

| Version | Support |
| ------- | ------- |
| 0.x     | ✓       |

## Signaler une vulnérabilité

**Ne pas ouvrir d'issue publique sur GitHub** pour rapporter une faille
de sécurité. Utiliser à la place l'un des canaux ci-dessous :

### 1. GitHub Security Advisories (recommandé)

C'est le canal préféré : il permet une discussion confidentielle avec
les mainteneurs et la création d'un advisory public au moment opportun.

1. Aller sur <https://github.com/govpf/ori/security/advisories/new>
2. Décrire la vulnérabilité, son impact et les conditions de
   reproduction
3. Préciser si une CVE est souhaitée

### 2. Courriel

Pour les rapports qui ne passent pas par GitHub, écrire à
**design@administration.gov.pf** (boîte partagée de l'équipe DS).

Préciser dans l'objet : `[security] Ori - <résumé court>`.

## Délais d'engagement

| Étape                                   | Délai                                      |
| --------------------------------------- | ------------------------------------------ |
| Accusé de réception                     | sous **5 jours ouvrés**                    |
| Premier diagnostic et niveau de gravité | sous **15 jours ouvrés**                   |
| Correctif ou plan d'atténuation         | dépend de la gravité (cf. ci-dessous)      |
| Publication coordonnée de l'advisory    | au plus tard **90 jours** après le rapport |

## Niveaux de gravité

Échelle CVSS 3.1 utilisée comme référence :

- **Critical (9.0 - 10.0)** : correctif visé sous **7 jours**
- **High (7.0 - 8.9)** : correctif visé sous **30 jours**
- **Medium (4.0 - 6.9)** : correctif visé sous **60 jours**
- **Low (0.1 - 3.9)** : intégré dans la prochaine version mineure

## Périmètre

Sont **dans le périmètre** :

- les composants publiés (`@govpf/ori-*`) et leur code source
- le site documentaire (https://ori.gov.pf une fois en ligne)
- les workflows GitHub Actions du dépôt
- les pipelines de publication npm

Sont **hors périmètre** :

- les services administratifs polynésiens qui consomment Ori (à
  signaler à l'éditeur du service concerné)
- la plateforme Keycloak du Gouvernement (les écrans documentés ici
  sont des spécifications, pas une instance en production)
- les vulnérabilités déjà rapportées et publiées dans les CVE des
  dépendances tierces (Angular, React, Tailwind, Lucide, etc.) - elles
  sont traitées via Dependabot

## Divulgation responsable

Ori suit une politique de **divulgation coordonnée** :

1. Le rapport est traité de manière confidentielle
2. Un correctif est préparé en privé via un GitHub Security Advisory
3. La version corrigée est publiée
4. Les services consommateurs sont notifiés
5. L'advisory est rendu public, avec mention du rapporteur (sauf
   demande contraire)

## Reconnaissance

Les rapporteurs de vulnérabilités sont mentionnés dans le CHANGELOG et
dans l'advisory public, sauf demande explicite d'anonymat. Aucun
programme de bug bounty n'est en place actuellement.
