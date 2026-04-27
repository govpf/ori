import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { A11yModule, ConfigurableFocusTrap, ConfigurableFocusTrapFactory } from '@angular/cdk/a11y';
import { LucideAngularModule, X } from 'lucide-angular';

// Le type LucideIconData n'est pas exporté par le barrel public de
// lucide-angular ; on le dérive depuis une icône connue. Évite l'erreur
// TS2742 (inferred type cannot be named without a reference) que ng-packagr
// remonte en mode partial-compilation.
type LucideIconData = typeof X;

/**
 * Dialog modal du DS.
 *
 * Comportement a11y aligné sur le Dialog React (Radix UI) :
 * - Focus trap : la navigation clavier reste piégée dans le dialog tant qu'il
 *   est ouvert (via @angular/cdk/a11y ConfigurableFocusTrap).
 * - Restauration du focus : à la fermeture, le focus revient sur l'élément
 *   qui l'avait avant l'ouverture.
 * - Scroll lock : le body ne scrolle pas tant que le dialog est ouvert.
 * - ESC pour fermer.
 * - Backdrop click pour fermer.
 *
 * Le dialog est rendu in-place dans le DOM (pas dans un portal `document.body`).
 * C'est suffisant pour la plupart des cas d'usage, mais si une app a besoin
 * d'éviter les conflits de stacking-context ou d'overflow:hidden parent, elle
 * peut wrapper avec `@angular/cdk/overlay` côté application.
 */
@Component({
  selector: 'ori-dialog',
  standalone: true,
  imports: [LucideAngularModule, A11yModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (open) {
      <div class="ori-dialog-overlay" (click)="closeDialog()"></div>
      <div
        #dialogElement
        class="ori-dialog"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="titleId"
      >
        <div class="ori-dialog__header">
          <h3 [id]="titleId" class="ori-dialog__title">{{ title }}</h3>
          @if (showCloseButton) {
            <button
              type="button"
              class="ori-dialog__close"
              (click)="closeDialog()"
              [attr.aria-label]="closeLabel"
            >
              <lucide-icon [img]="XIcon" [size]="18"></lucide-icon>
            </button>
          }
        </div>
        <div class="ori-dialog__body">
          <ng-content></ng-content>
        </div>
        <div class="ori-dialog__footer">
          <ng-content select="[slot=footer]"></ng-content>
        </div>
      </div>
    }
  `,
})
export class OriDialogComponent implements OnDestroy {
  @Input() set open(value: boolean) {
    if (value === this._open) return;
    this._open = value;
    if (value) this.handleOpen();
    else this.handleClose();
  }
  get open(): boolean {
    return this._open;
  }

  @Input() title: string = '';
  @Input() showCloseButton: boolean = true;
  @Input() closeLabel: string = 'Fermer';

  @Output() close = new EventEmitter<void>();

  @ViewChild('dialogElement') protected dialogRef?: ElementRef<HTMLElement>;

  readonly titleId = `pf-dialog-title-${Math.random().toString(36).slice(2, 8)}`;

  protected readonly XIcon: LucideIconData = X;

  private _open = false;
  private focusTrap?: ConfigurableFocusTrap;
  private previousFocus: HTMLElement | null = null;
  private originalBodyOverflow = '';

  constructor(
    private readonly focusTrapFactory: ConfigurableFocusTrapFactory,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {}

  closeDialog(): void {
    this.close.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this._open) this.closeDialog();
  }

  ngOnDestroy(): void {
    this.handleClose();
  }

  private handleOpen(): void {
    // Mémoriser le focus courant pour le restaurer à la fermeture.
    const active = this.document.activeElement;
    this.previousFocus = active instanceof HTMLElement ? active : null;

    // Lock du scroll du body.
    this.originalBodyOverflow = this.document.body.style.overflow;
    this.document.body.style.overflow = 'hidden';

    // Focus trap : on diffère pour laisser Angular rendre le @if(open) avant
    // d'attacher le piège (sinon dialogRef n'existe pas encore).
    requestAnimationFrame(() => {
      if (this.dialogRef) {
        this.focusTrap = this.focusTrapFactory.create(this.dialogRef.nativeElement);
        this.focusTrap.focusInitialElementWhenReady();
      }
    });
  }

  private handleClose(): void {
    // Démonter le focus trap.
    if (this.focusTrap) {
      this.focusTrap.destroy();
      this.focusTrap = undefined;
    }

    // Restaurer le scroll du body.
    this.document.body.style.overflow = this.originalBodyOverflow;
    this.originalBodyOverflow = '';

    // Restaurer le focus.
    if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
      this.previousFocus.focus();
    }
    this.previousFocus = null;
  }
}
