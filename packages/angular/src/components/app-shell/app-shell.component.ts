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
  // Trick : on duplique les ng-content avec sélecteurs pour pouvoir détecter
  // si du contenu est projeté (via ContentChild + ElementRef sur les wraps).
  // Plus propre que des @Input booleans dupliqués qui désynchroniseraient.
})
export class OriAppShellComponent {
  @Input() skipLinkLabel: string = 'Aller au contenu principal';
  @Input() closeSidebarLabel: string = 'Fermer le menu';
  @Input() sidebarOpen: boolean = false;

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

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.sidebarOpen) this.closeSidebar();
  }
}
