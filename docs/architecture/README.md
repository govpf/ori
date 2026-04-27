# Décisions d'architecture

Ce dossier rassemble les documents de travail internes du design system Ori :
analyses, audits, choix techniques structurants. Ces contenus sont destinés
aux **mainteneurs** et aux contributeurs avancés.

La documentation publique orientée utilisateur (Quickstart, fondations,
composants) vit sur [ori.gov.pf](https://ori.gov.pf).

## Documents

- [Stratégie d'ouverture](./strategie-ouverture.md) - position du DS
  sur la publication open source, checklist de sécurité avant mise en
  visibilité publique.
- [Iconographie](./iconographie.md) - rationale du choix de Lucide
  comme bibliothèque d'icônes (versus alternatives évaluées).
- [Différences React / Angular](./differences-frameworks.md) - audit
  fonctionnel des écarts entre les deux implémentations, points
  d'harmonisation.
- [Décisions de design](./decisions.md) - historique des choix
  structurants (border-radius, palette, espacements, dark mode,
  primitives utilisées).

## Comment contribuer à ces documents

Toute proposition d'évolution structurante (changement de palette, ajout
d'un primitif, réécriture d'API) doit faire l'objet d'un document dans
ce dossier **avant** d'être implémentée. Le format est libre, l'important
est de tracer le contexte et la décision.
