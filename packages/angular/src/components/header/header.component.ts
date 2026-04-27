import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

/**
 * Header app-level en 3 zones (cf. décision J.1).
 *
 * Slots ng-content :
 * ```html
 * <ori-header>
 *   <ng-container brand><ori-logo title="..." /></ng-container>
 *   <ng-container nav><ori-main-navigation [items]="..." /></ng-container>
 *   <ng-container actions><ori-button>Se connecter</ori-button></ng-container>
 * </ori-header>
 * ```
 *
 * Aucune logique métier hardcodée. L'app insère ce qu'elle veut dans
 * la zone actions (auth, notifications, profil, etc., cf. J.5).
 */
@Component({
  selector: 'ori-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <header class="ori-header">
      <div class="ori-header__brand">
        <ng-content select="[brand]"></ng-content>
      </div>
      <div class="ori-header__nav">
        <ng-content select="[nav]"></ng-content>
      </div>
      <div class="ori-header__actions">
        <ng-content select="[actions]"></ng-content>
      </div>
    </header>
  `,
})
export class OriHeaderComponent {}
