---
'@govpf/ori-react': minor
'@govpf/ori-angular': minor
'@govpf/ori-tailwind-preset': minor
'@govpf/ori-css': minor
---

Nouveau composant `MobileTabBar` (React) / `<ori-mobile-tab-bar>` (Angular).

Barre de navigation fixée en bas d'écran sur mobile, pattern UX standard
(Material BottomNavigation, iOS TabBar). 3 à 5 items, chacun = icône
au-dessus d'un label court. Items rendus en `<a>` ou `<button>` selon
qu'un `href` est fourni.

API React :

```tsx
<MobileTabBar
  items={[
    { id: 'home', label: 'Accueil', icon: <Home size={20} />, current: true },
    { id: 'demarches', label: 'Démarches', icon: <FileText size={20} />, badge: 2 },
    { id: 'profil', label: 'Profil', icon: <User size={20} /> },
  ]}
  onSelect={(item) => router.push(`/${item.id}`)}
/>
```

API Angular :

```html
<ori-mobile-tab-bar
  [items]="[
    { id: 'home', label: 'Accueil', icon: HomeIcon, current: true },
    { id: 'demarches', label: 'Démarches', icon: FileTextIcon, badge: 2 },
    { id: 'profil', label: 'Profil', icon: UserIcon }
  ]"
  (select)="onSelect($event)"
></ori-mobile-tab-bar>
```

Caractéristiques :

- Masquée par défaut au-dessus du breakpoint `md` (768px) ; `alwaysVisible`
  pour forcer l'affichage sur desktop.
- Touch target 56px sur chaque item (au-delà du minimum WCAG 2.5.5).
- Respecte `env(safe-area-inset-bottom)` pour l'iPhone home indicator.
- Support des pastilles de notification (`badge`).
- Items désactivables (`disabled`).
- ARIA : `<nav aria-label>`, `aria-current="page"` sur l'item courant,
  `aria-disabled` sur les items désactivés.

Acquis fonctionnel repris de PF-UI, première action structurelle de la
roadmap mobile (issue #94).
