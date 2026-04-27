import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { Skeleton } from '../Skeleton/Skeleton.js';

export type StatisticVariant = 'default' | 'lg' | 'inline';

export type StatisticTrendDirection = 'up' | 'down' | 'flat';

export interface StatisticTrend {
  direction: StatisticTrendDirection;
  /** Texte de la tendance (ex: "+1 cette semaine", "-3,5 %"). */
  label: ReactNode;
  /**
   * Sens "positif" sémantique. Default: `'up'`. Inverser pour les
   * métriques où baisser est bon (ex: temps de traitement) en passant
   * `positive: 'down'`. La couleur (succès / danger) suit ce mapping.
   */
  positive?: 'up' | 'down';
}

export interface StatisticProps extends Omit<HTMLAttributes<HTMLDivElement>, 'prefix'> {
  /** Libellé de la métrique (ex: "Démarches en cours"). */
  label: ReactNode;
  /**
   * Valeur principale. Si `number` et `formatNumber` est `true` (défaut),
   * la valeur est formatée selon la `locale`. Si `ReactNode`, affichée tel
   * quel.
   */
  value: ReactNode;
  /** Préfixe affiché avant la valeur (ex: devise). */
  prefix?: ReactNode;
  /** Suffixe affiché après la valeur (ex: "%", "j", "XPF"). */
  suffix?: ReactNode;
  /** Tendance affichée sous la valeur. */
  trend?: StatisticTrend;
  /** Taille / orientation du composant. Default: `'default'`. */
  variant?: StatisticVariant;
  /** Affiche un Skeleton à la place de la valeur. */
  loading?: boolean;
  /**
   * Si `true` (défaut) et `value` est un `number`, la valeur est formatée
   * via `Intl.NumberFormat`. Mettre à `false` pour conserver l'affichage
   * brut (ex: numéros qui ne doivent pas avoir de séparateur de milliers).
   */
  formatNumber?: boolean;
  /** Locale BCP 47 utilisée pour le formatage. Default: `'fr-FR'`. */
  locale?: string;
  /** Options passées à `Intl.NumberFormat`. */
  numberFormatOptions?: Intl.NumberFormatOptions;
}

const TREND_ICON: Record<StatisticTrendDirection, typeof TrendingUp> = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
};

function trendTone(trend: StatisticTrend): 'up' | 'down' | 'flat' {
  if (trend.direction === 'flat') return 'flat';
  const positive = trend.positive ?? 'up';
  const isPositive = trend.direction === positive;
  return isPositive ? 'up' : 'down';
}

/**
 * Affiche une métrique chiffrée (KPI) : valeur principale + libellé +
 * tendance optionnelle. Utilisé dans les tableaux de bord et vues de
 * synthèse. Le composant ne fournit pas de conteneur (Card, Panel) :
 * c'est l'application qui décide de l'envelopper, au cas par cas.
 *
 * Sémantique : la valeur et le libellé sont groupés via `aria-labelledby`
 * pour que les lecteurs d'écran annoncent "Démarches en cours, 2".
 */
export function Statistic({
  label,
  value,
  prefix,
  suffix,
  trend,
  variant = 'default',
  loading = false,
  formatNumber = true,
  locale = 'fr-FR',
  numberFormatOptions,
  className,
  ...rest
}: StatisticProps) {
  const reactId = useId();
  const labelId = `${reactId}-label`;
  const valueId = `${reactId}-value`;

  const renderedValue =
    typeof value === 'number' && formatNumber
      ? new Intl.NumberFormat(locale, numberFormatOptions).format(value)
      : value;

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      className={clsx(
        'ori-statistic',
        variant !== 'default' && `ori-statistic--${variant}`,
        className,
      )}
      {...rest}
    >
      <span id={labelId} className="ori-statistic__label">
        {label}
      </span>

      {loading ? (
        <Skeleton variant="rect" width={96} height={variant === 'lg' ? 40 : 32} />
      ) : (
        <span id={valueId} className="ori-statistic__value">
          {prefix && <span className="ori-statistic__value-prefix">{prefix}</span>}
          <span>{renderedValue}</span>
          {suffix && <span className="ori-statistic__value-suffix">{suffix}</span>}
        </span>
      )}

      {trend && !loading && <StatisticTrendBadge trend={trend} />}
    </div>
  );
}

function StatisticTrendBadge({ trend }: { trend: StatisticTrend }) {
  const Icon = TREND_ICON[trend.direction];
  const tone = trendTone(trend);
  return (
    <span className={clsx('ori-statistic__trend', `ori-statistic__trend--${tone}`)}>
      <Icon size={14} aria-hidden="true" />
      <span>{trend.label}</span>
    </span>
  );
}
