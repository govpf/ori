import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

/**
 * Grille responsive de FeatureCard. Auto-fit sur des colonnes de 16rem
 * minimum, gap automatique. À combiner avec `<ori-feature-card>`.
 */
@Component({
  selector: 'ori-feature-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<div class="ori-feature-grid"><ng-content></ng-content></div>`,
})
export class OriFeatureGridComponent {}
