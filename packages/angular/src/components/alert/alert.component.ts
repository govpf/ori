import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { LucideAngularModule, Info, CircleCheck, TriangleAlert, CircleX, X } from 'lucide-angular';

// Le type LucideIconData n'est pas exporté par le barrel public de
// lucide-angular ; on le dérive depuis une icône connue. Évite l'erreur
// TS2742 (inferred type cannot be named without a reference) que ng-packagr
// remonte en mode partial-compilation.
type LucideIconData = typeof X;

export type OriAlertSeverity = 'info' | 'success' | 'warning' | 'danger';

/**
 * Directive marker pour fournir une icône custom à `<ori-alert>` :
 *
 *     <ori-alert severity="info">
 *       <ng-template pfAlertIcon>
 *         <i-lucide name="rocket" />
 *       </ng-template>
 *       Mon message
 *     </ori-alert>
 *
 * Sans cette directive, `<ori-alert>` rend l'icône Lucide par défaut associée
 * à la sévérité.
 */
@Directive({
  selector: '[pfAlertIcon]',
  standalone: true,
})
export class OriAlertIconDirective {
  constructor(public readonly templateRef: TemplateRef<unknown>) {}
}

/**
 * Alerte contextuelle. 4 sévérités, icône Lucide monochrome par défaut
 * (héritée du `currentColor` du conteneur), optionnellement dismissible.
 *
 * - Pour une icône custom : projeter une `<ng-template pfAlertIcon>`
 *   (cf. OriAlertIconDirective).
 * - Pour désactiver l'icône entièrement : `[showIcon]="false"`.
 */
@Component({
  selector: 'ori-alert',
  standalone: true,
  imports: [LucideAngularModule, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (showIcon) {
      <span class="ori-alert__icon" aria-hidden="true">
        @if (customIcon) {
          <ng-container *ngTemplateOutlet="customIcon.templateRef"></ng-container>
        } @else {
          @switch (severity) {
            @case ('info') {
              <lucide-icon [img]="InfoIcon" [size]="20"></lucide-icon>
            }
            @case ('success') {
              <lucide-icon [img]="CircleCheckIcon" [size]="20"></lucide-icon>
            }
            @case ('warning') {
              <lucide-icon [img]="TriangleAlertIcon" [size]="20"></lucide-icon>
            }
            @case ('danger') {
              <lucide-icon [img]="CircleXIcon" [size]="20"></lucide-icon>
            }
          }
        }
      </span>
    }
    <div class="ori-alert__content">
      @if (title) {
        <div class="ori-alert__title">{{ title }}</div>
      }
      <ng-content></ng-content>
    </div>
    @if (dismissible) {
      <button
        type="button"
        class="ori-alert__close"
        (click)="dismiss.emit()"
        [attr.aria-label]="dismissLabel"
      >
        <lucide-icon [img]="XIcon" [size]="16"></lucide-icon>
      </button>
    }
  `,
  host: {
    '[class]': 'classes',
    '[attr.role]': 'severity === "danger" ? "alert" : "status"',
  },
})
export class OriAlertComponent {
  @Input() severity: OriAlertSeverity = 'info';
  @Input() title: string = '';
  @Input() dismissible: boolean = false;
  @Input() dismissLabel: string = 'Fermer';
  /**
   * Désactive entièrement l'icône (par défaut, icône de sévérité affichée).
   */
  @Input() showIcon: boolean = true;

  @Output() dismiss = new EventEmitter<void>();

  @ContentChild(OriAlertIconDirective)
  protected customIcon?: OriAlertIconDirective;

  protected readonly InfoIcon: LucideIconData = Info;
  protected readonly CircleCheckIcon: LucideIconData = CircleCheck;
  protected readonly TriangleAlertIcon: LucideIconData = TriangleAlert;
  protected readonly CircleXIcon: LucideIconData = CircleX;
  protected readonly XIcon: LucideIconData = X;

  get classes(): string {
    return `ori-alert ori-alert--${this.severity}`;
  }
}
