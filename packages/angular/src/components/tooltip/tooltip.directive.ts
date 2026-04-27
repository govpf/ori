import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  Renderer2,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  createComponent,
  inject,
} from '@angular/core';

export type OriTooltipSide = 'top' | 'right' | 'bottom' | 'left';

let nextUid = 0;

/**
 * Composant interne du tooltip - rendu via la directive `[oriTooltip]`.
 * Pas exporté hors du module : l'API publique est la directive.
 */
@Component({
  selector: 'ori-tooltip-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span role="tooltip" [id]="tooltipId" [class]="'ori-tooltip ori-tooltip--' + side">{{
      content
    }}</span>
  `,
})
export class OriTooltipContentComponent {
  @Input() content: string = '';
  @Input() side: OriTooltipSide = 'top';
  @Input() tooltipId: string = '';
}

/**
 * Tooltip minimaliste sans dépendance (cf. décision G.1).
 *
 * Usage : `<button pfTooltip="Mon aide">Action</button>`
 *
 * - Apparition au mouseenter + focus, disparition au mouseleave + blur + Escape
 * - Délai 700ms par défaut
 * - Position fixe via `[oriTooltipSide]="'top' | 'right' | 'bottom' | 'left'"`
 * - ARIA `aria-describedby` câblé dynamiquement sur l'élément hôte
 */
@Directive({
  selector: '[oriTooltip]',
  standalone: true,
})
export class OriTooltipDirective implements OnDestroy {
  /** Texte du tooltip. Si vide ou disabled, le tooltip ne s'affiche pas. */
  @Input('oriTooltip') content: string = '';
  @Input('oriTooltipSide') side: OriTooltipSide = 'top';
  @Input('oriTooltipDelay') openDelay: number = 700;
  @Input('pfTooltipDisabled') disabled: boolean = false;

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly vcr = inject(ViewContainerRef);

  private readonly tooltipId = `pf-tooltip-${++nextUid}`;
  private componentRef?: ComponentRef<OriTooltipContentComponent>;
  private timer?: number;
  private wrapperEl?: HTMLElement;

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.scheduleShow();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.hide();
  }

  @HostListener('focus')
  onFocus(): void {
    this.scheduleShow();
  }

  @HostListener('blur')
  onBlur(): void {
    this.hide();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.hide();
  }

  private scheduleShow(): void {
    if (this.disabled || !this.content) return;
    this.clearTimer();
    this.timer = window.setTimeout(() => this.show(), this.openDelay);
  }

  private show(): void {
    if (this.componentRef) return;
    // On wrappe l'hôte dans un span position:relative pour ancrer le tooltip
    const hostEl = this.host.nativeElement;
    if (!this.wrapperEl) {
      this.wrapperEl = this.renderer.createElement('span');
      this.renderer.addClass(this.wrapperEl, 'ori-tooltip-wrap');
      const parent = this.renderer.parentNode(hostEl);
      this.renderer.insertBefore(parent, this.wrapperEl, hostEl);
      this.renderer.appendChild(this.wrapperEl, hostEl);
    }
    this.componentRef = this.vcr.createComponent(OriTooltipContentComponent);
    this.componentRef.instance.content = this.content;
    this.componentRef.instance.side = this.side;
    this.componentRef.instance.tooltipId = this.tooltipId;
    this.renderer.appendChild(this.wrapperEl, this.componentRef.location.nativeElement);
    this.componentRef.changeDetectorRef.detectChanges();
    this.renderer.setAttribute(hostEl, 'aria-describedby', this.tooltipId);
  }

  private hide(): void {
    this.clearTimer();
    if (!this.componentRef) return;
    this.componentRef.destroy();
    this.componentRef = undefined;
    this.renderer.removeAttribute(this.host.nativeElement, 'aria-describedby');
  }

  private clearTimer(): void {
    if (this.timer !== undefined) {
      window.clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

  ngOnDestroy(): void {
    this.hide();
  }
}
