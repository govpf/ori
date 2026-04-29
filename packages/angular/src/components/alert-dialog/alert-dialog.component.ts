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

let nextUid = 0;

/**
 * AlertDialog : variante du Dialog dédiée aux confirmations critiques.
 *
 * Distinct du Dialog par sa sémantique ARIA :
 * - role="alertdialog" (au lieu de role="dialog") : annoncé spécifiquement
 *   par les lecteurs d'écran comme une alerte interrompant le flux
 * - aria-describedby explicite (description requise)
 * - pas de bouton de fermeture (X) ; l'utilisateur doit cliquer Annuler ou
 *   Action pour rendre l'intention explicite
 * - le clic sur le backdrop ne ferme pas (idem)
 *
 * Comportement a11y aligné sur le Dialog :
 * - Focus trap (`@angular/cdk/a11y`) avec focus initial sur le bouton Annuler
 *   pour éviter qu'un Entrée accidentel ne déclenche l'action destructive
 * - Restauration du focus à la fermeture
 * - Scroll lock du body
 * - ESC ferme et émet `(cancel)`
 *
 * In-place dans le DOM (pas de portal, cohérent avec décision B.1).
 */
@Component({
  selector: 'ori-alert-dialog',
  standalone: true,
  imports: [A11yModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (open) {
      <div class="ori-dialog-overlay"></div>
      <div
        #dialogElement
        class="ori-dialog ori-alert-dialog"
        role="alertdialog"
        [attr.aria-labelledby]="titleId"
        [attr.aria-describedby]="descriptionId"
      >
        <div class="ori-dialog__header">
          <h3 [id]="titleId" class="ori-dialog__title">{{ title }}</h3>
        </div>
        <div [id]="descriptionId" class="ori-dialog__body">
          <ng-content></ng-content>
        </div>
        <div class="ori-dialog__footer">
          <ng-content select="[slot=footer]"></ng-content>
        </div>
      </div>
    }
  `,
})
export class OriAlertDialogComponent implements OnDestroy {
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

  /** Émis quand l'utilisateur appuie sur ESC. Le composant ne ferme pas
   *  automatiquement : le parent décide via `[open]`. */
  @Output() cancel = new EventEmitter<void>();

  @ViewChild('dialogElement') protected dialogRef?: ElementRef<HTMLElement>;

  private readonly uid = ++nextUid;
  readonly titleId = `pf-alert-dialog-title-${this.uid}`;
  readonly descriptionId = `pf-alert-dialog-description-${this.uid}`;

  private _open = false;
  private focusTrap?: ConfigurableFocusTrap;
  private previousFocus: HTMLElement | null = null;
  private originalBodyOverflow = '';

  constructor(
    private readonly focusTrapFactory: ConfigurableFocusTrapFactory,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {}

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this._open) this.cancel.emit();
  }

  ngOnDestroy(): void {
    this.handleClose();
  }

  private handleOpen(): void {
    const active = this.document.activeElement;
    this.previousFocus = active instanceof HTMLElement ? active : null;

    this.originalBodyOverflow = this.document.body.style.overflow;
    this.document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      if (this.dialogRef) {
        this.focusTrap = this.focusTrapFactory.create(this.dialogRef.nativeElement);
        this.focusTrap.focusInitialElementWhenReady();
      }
    });
  }

  private handleClose(): void {
    if (this.focusTrap) {
      this.focusTrap.destroy();
      this.focusTrap = undefined;
    }

    this.document.body.style.overflow = this.originalBodyOverflow;
    this.originalBodyOverflow = '';

    if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
      this.previousFocus.focus();
    }
    this.previousFocus = null;
  }
}
