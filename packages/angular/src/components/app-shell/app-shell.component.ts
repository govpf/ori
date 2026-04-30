import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';

type LucideIconData = typeof ChevronLeft;

const MAIN_ID = 'ori-app-shell-main';

/**
 * AppShell : layout d'application.
 *
 * Pose le squelette d'une app interne ou usager : header sticky en haut,
 * sidebar à gauche (optionnelle, drawer responsive sur mobile), main au
 * centre, footer en bas (optionnel). Inclut un skip link "Aller au contenu
 * principal" pour l'a11y clavier.
 *
 * Volontairement agnostique : ne fournit pas de Header / Sidebar / Footer
 * tout faits, l'app projette ce qu'elle veut via les slots :
 * - `slot="header"`
 * - `slot="sidebar"` (la présence du contenu active le mode "with-sidebar")
 * - `slot="footer"`
 * - contenu principal = projection par défaut
 *
 * Sidebar drawer mobile : à viewport < 768px, la sidebar est cachée et
 * accessible via un toggle externe (le bouton vit dans le header projeté).
 * L'app contrôle l'état via `[sidebarOpen]` + `(sidebarOpenChange)`.
 * ESC ferme le drawer.
 *
 * a11y :
 * - skip link en première position, visible au focus uniquement
 * - main avec id="ori-app-shell-main" + tabindex=-1 pour le skip link
 * - drawer mobile : aria-modal + scrim cliquable
 */
@Component({
  selector: 'ori-app-shell',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      [class]="
        'ori-app-shell ' +
        (hasSidebar ? 'ori-app-shell--with-sidebar ' : '') +
        (sidebarOpen ? 'ori-app-shell--sidebar-open' : '')
      "
    >
      <a [attr.href]="'#' + mainId" class="ori-app-shell__skip-link">{{ skipLinkLabel }}</a>
      <div #headerSlot class="ori-app-shell__header" [hidden]="!hasHeader">
        <ng-content select="[slot=header]"></ng-content>
      </div>
      <div class="ori-app-shell__body">
        @if (hasSidebar) {
          <aside class="ori-app-shell__sidebar" aria-label="Navigation latérale">
            <ng-content select="[slot=sidebar]"></ng-content>
          </aside>
          <button
            type="button"
            class="ori-app-shell__sidebar-toggle"
            [attr.aria-label]="sidebarOpen ? collapseSidebarLabel : expandSidebarLabel"
            [attr.aria-expanded]="sidebarOpen"
            [attr.aria-controls]="mainId"
            (click)="toggleSidebar()"
          >
            <lucide-icon
              [img]="sidebarOpen ? ChevronLeftIcon : ChevronRightIcon"
              [size]="16"
              aria-hidden="true"
            ></lucide-icon>
          </button>
          <div
            class="ori-app-shell__scrim"
            role="button"
            tabindex="-1"
            [attr.aria-label]="closeSidebarLabel"
            (click)="closeSidebar()"
          ></div>
        }
        <main [id]="mainId" tabindex="-1" class="ori-app-shell__main">
          <ng-content></ng-content>
        </main>
      </div>
      <div #footerSlot class="ori-app-shell__footer" [hidden]="!hasFooter">
        <ng-content select="[slot=footer]"></ng-content>
      </div>
    </div>
  `,
})
export class OriAppShellComponent {
  @Input() skipLinkLabel: string = 'Aller au contenu principal';
  @Input() closeSidebarLabel: string = 'Fermer le menu';
  @Input() collapseSidebarLabel: string = 'Masquer la navigation latérale';
  @Input() expandSidebarLabel: string = 'Afficher la navigation latérale';

  protected readonly ChevronLeftIcon: LucideIconData = ChevronLeft;
  protected readonly ChevronRightIcon: LucideIconData = ChevronRight;
  /**
   * État de la sidebar. Pilote l'affichage sur tous les viewports :
   * - desktop ≥ 768px : `true` = visible in-flow, `false` = masquée
   * - mobile < 768px : `true` = drawer ouvert, `false` = drawer fermé
   *
   * Default : `true` (sidebar visible par défaut sur desktop).
   */
  @Input() sidebarOpen: boolean = true;

  @Output() sidebarOpenChange = new EventEmitter<boolean>();

  protected readonly mainId = MAIN_ID;

  // Détection de la présence des slots projetés via ContentChild
  // d'attribut. Quand le slot existe dans le template parent, ces refs
  // sont définies ; sinon undefined.
  @ContentChild('headerSlotRef') protected headerSlotProvided?: unknown;
  @ContentChild('sidebarSlotRef') protected sidebarSlotProvided?: unknown;
  @ContentChild('footerSlotRef') protected footerSlotProvided?: unknown;

  // Note pragmatique : ContentChild sur un attribut projeté ne fonctionne pas
  // de la même manière qu'en React. On expose donc des @Input pour piloter
  // explicitement la présence des zones depuis l'app, plutôt que de tenter
  // une détection automatique fragile. C'est le pattern standard côté Angular.
  /** Indique si le slot header est présent. Default: true (le slot vide reste discret). */
  @Input() hasHeader: boolean = true;
  /** Indique si la sidebar est présente. Default: false (layout simple par défaut). */
  @Input() hasSidebar: boolean = false;
  /** Indique si le slot footer est présent. Default: false. */
  @Input() hasFooter: boolean = false;

  closeSidebar(): void {
    if (!this.sidebarOpen) return;
    this.sidebarOpen = false;
    this.sidebarOpenChange.emit(false);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
    this.sidebarOpenChange.emit(this.sidebarOpen);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.sidebarOpen) this.closeSidebar();
  }
}
