import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { LucideAngularModule, Minus, TrendingDown, TrendingUp } from 'lucide-angular';
import { OriSkeletonComponent } from '../skeleton/skeleton.component';

type LucideIconData = typeof TrendingUp;

export type OriStatisticVariant = 'default' | 'lg' | 'inline';

export type OriStatisticTrendDirection = 'up' | 'down' | 'flat';

export interface OriStatisticTrend {
  direction: OriStatisticTrendDirection;
  /** Texte de la tendance (ex: '+1 cette semaine'). */
  label: string;
  /**
   * Sens "positif" sémantique. Default: 'up'. Inverser pour les métriques
   * où baisser est bon (ex: temps de traitement).
   */
  positive?: 'up' | 'down';
}

let nextId = 0;

/**
 * Affiche une métrique chiffrée (KPI) : valeur principale, libellé,
 * tendance optionnelle. Pas de conteneur intégré : l'app choisit (Card,
 * plain div, etc.).
 */
@Component({
  selector: 'ori-statistic',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, OriSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div role="group" [attr.aria-labelledby]="labelId" [class]="rootClasses">
      <span [id]="labelId" class="ori-statistic__label">{{ label }}</span>

      @if (loading) {
        <ori-skeleton
          variant="rect"
          [width]="96"
          [height]="variant === 'lg' ? 40 : 32"
        ></ori-skeleton>
      } @else {
        <span class="ori-statistic__value">
          @if (prefix) {
            <span class="ori-statistic__value-prefix">{{ prefix }}</span>
          }
          <span>{{ formattedValue }}</span>
          @if (suffix) {
            <span class="ori-statistic__value-suffix">{{ suffix }}</span>
          }
        </span>
      }

      @if (trend && !loading) {
        <span [class]="trendClasses">
          <lucide-icon [img]="trendIcon" [size]="14" aria-hidden="true"></lucide-icon>
          <span>{{ trend.label }}</span>
        </span>
      }
    </div>
  `,
})
export class OriStatisticComponent {
  /** Libellé de la métrique. */
  @Input({ required: true }) label!: string;
  /**
   * Valeur principale. Si number et `formatNumber` est `true` (défaut),
   * formatée selon la `locale`.
   */
  @Input({ required: true }) value!: number | string;
  @Input() prefix?: string;
  @Input() suffix?: string;
  @Input() trend?: OriStatisticTrend;
  @Input() variant: OriStatisticVariant = 'default';
  @Input() loading: boolean = false;
  @Input() formatNumber: boolean = true;
  @Input() locale: string = 'fr-FR';
  @Input() numberFormatOptions?: Intl.NumberFormatOptions;

  protected readonly labelId = `pf-stat-${++nextId}`;

  get rootClasses(): string {
    const base = 'ori-statistic';
    return this.variant === 'default' ? base : `${base} ori-statistic--${this.variant}`;
  }

  get formattedValue(): string {
    if (typeof this.value === 'number' && this.formatNumber) {
      return new Intl.NumberFormat(this.locale, this.numberFormatOptions).format(this.value);
    }
    return String(this.value ?? '');
  }

  get trendIcon(): LucideIconData {
    if (!this.trend) return Minus;
    if (this.trend.direction === 'up') return TrendingUp;
    if (this.trend.direction === 'down') return TrendingDown;
    return Minus;
  }

  get trendClasses(): string {
    if (!this.trend) return 'ori-statistic__trend';
    const positive = this.trend.positive ?? 'up';
    let tone: 'up' | 'down' | 'flat';
    if (this.trend.direction === 'flat') tone = 'flat';
    else tone = this.trend.direction === positive ? 'up' : 'down';
    return `ori-statistic__trend ori-statistic__trend--${tone}`;
  }
}
