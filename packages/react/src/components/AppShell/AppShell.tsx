import { forwardRef, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { clsx } from 'clsx';

/**
 * AppShell : layout d'application.
 *
 * Pose le squelette d'une app interne ou usager : header sticky en haut,
 * sidebar à gauche (optionnelle, drawer responsive sur mobile), main au
 * centre, footer en bas (optionnel). Inclut un skip link "Aller au contenu
 * principal" pour l'a11y clavier.
 *
 * Volontairement agnostique : ne fournit pas de Header / Sidebar / Footer
 * tout faits, l'app projette ce qu'elle veut. Pour l'usage standard, brancher
 * les composants Ori `<Header>`, `<SideMenu>` et `<Footer>`.
 *
 * Sidebar pilotable sur tous les viewports via `sidebarOpen` /
 * `onSidebarOpenChange` :
 *
 * - Desktop ≥ 768px : `sidebarOpen=true` (défaut) la sidebar est visible
 *   in-flow à gauche. `sidebarOpen=false` la sidebar est masquée et le main
 *   prend toute la largeur.
 * - Mobile < 768px : la sidebar est en drawer hors-flux. `sidebarOpen=true`
 *   l'ouvre par-dessus le scrim, `sidebarOpen=false` la ferme.
 *
 * Le bouton de toggle (hamburger) vit dans le header projeté ; l'app décide
 * où le placer et quand l'afficher. Le drawer mobile ferme aussi sur ESC
 * et au clic sur le scrim.
 *
 * a11y :
 * - skip link en première position, visible au focus uniquement
 * - main a `id="ori-app-shell-main"` + `tabindex={-1}` pour le skip link
 * - drawer mobile : `aria-modal="true"` + scrim cliquable
 */

export interface AppShellProps {
  /** Contenu projeté en haut, sticky (généralement <Header>). */
  header?: ReactNode;
  /** Contenu projeté à gauche (généralement <SideMenu>). Optionnel : si absent, pas de sidebar. */
  sidebar?: ReactNode;
  /** Contenu projeté en bas, hors flux scroll (généralement <Footer>). Optionnel. */
  footer?: ReactNode;
  /** Contenu principal. Rendu dans `<main>` avec id pour le skip link. */
  children?: ReactNode;
  /** Texte du skip link. */
  skipLinkLabel?: string;
  /**
   * État de la sidebar. Pilote l'affichage sur tous les viewports :
   * - desktop ≥ 768px : `true` = visible in-flow, `false` = masquée
   * - mobile < 768px : `true` = drawer ouvert (sur scrim), `false` = drawer fermé
   *
   * Default : `true` (sidebar visible par défaut sur desktop).
   */
  sidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
  /** Label accessible du scrim (lecteur d'écran). */
  closeSidebarLabel?: string;
  className?: string;
}

const MAIN_ID = 'ori-app-shell-main';

export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(function AppShell(
  {
    header,
    sidebar,
    footer,
    children,
    skipLinkLabel = 'Aller au contenu principal',
    sidebarOpen = true,
    onSidebarOpenChange,
    closeSidebarLabel = 'Fermer le menu',
    className,
  },
  ref,
) {
  const closeSidebar = useCallback(() => {
    onSidebarOpenChange?.(false);
  }, [onSidebarOpenChange]);

  // Fermer le drawer sur ESC quand il est ouvert.
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSidebar();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [sidebarOpen, closeSidebar]);

  return (
    <div
      ref={ref}
      className={clsx(
        'ori-app-shell',
        sidebar && 'ori-app-shell--with-sidebar',
        sidebarOpen && 'ori-app-shell--sidebar-open',
        className,
      )}
    >
      <a href={`#${MAIN_ID}`} className="ori-app-shell__skip-link">
        {skipLinkLabel}
      </a>
      {header && <div className="ori-app-shell__header">{header}</div>}
      <div className="ori-app-shell__body">
        {sidebar && (
          <>
            <aside className="ori-app-shell__sidebar" aria-label="Navigation latérale">
              {sidebar}
            </aside>
            <div
              className="ori-app-shell__scrim"
              role="button"
              tabIndex={-1}
              aria-label={closeSidebarLabel}
              onClick={closeSidebar}
            />
          </>
        )}
        <main id={MAIN_ID} tabIndex={-1} className="ori-app-shell__main">
          {children}
        </main>
      </div>
      {footer && <div className="ori-app-shell__footer">{footer}</div>}
    </div>
  );
});
