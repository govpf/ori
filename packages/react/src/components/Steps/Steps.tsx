import { Fragment, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

export type StepStatus = 'completed' | 'current' | 'todo';

export interface StepItem {
  /** Titre court de l'étape (ex: "Identité"). */
  title: ReactNode;
  /** Description optionnelle (ex: "Vos informations personnelles"). */
  description?: ReactNode;
}

export interface StepsProps {
  steps: StepItem[];
  /** Index 0-based de l'étape courante. */
  current: number;
  /**
   * Si `true`, les étapes complétées (avant `current`) sont cliquables.
   * Cf. décision F.3 : read-only par défaut. Default: false.
   */
  clickable?: boolean;
  /** Callback de clic sur une étape (uniquement si `clickable`). */
  onStepClick?: (index: number) => void;
  className?: string;
}

/**
 * Steps : indicateur de progression d'un workflow multi-étapes.
 * Read-only par défaut, opt-in `clickable` pour permettre le retour
 * à une étape précédente complétée (cf. décision F.3).
 */
export function Steps({ steps, current, clickable, onStepClick, className }: StepsProps) {
  const getStatus = (index: number): StepStatus =>
    index < current ? 'completed' : index === current ? 'current' : 'todo';

  return (
    <ol className={clsx('ori-steps', className)}>
      {steps.map((step, index) => {
        const status = getStatus(index);
        const isClickable = clickable && status === 'completed';
        const itemClass = clsx('ori-steps__item', `ori-steps__item--${status}`);

        const marker = (
          <span className="ori-steps__marker" aria-hidden="true">
            {status === 'completed' ? <Check size={16} /> : index + 1}
          </span>
        );

        const label = (
          <span className="ori-steps__label">
            <span className="ori-steps__title">{step.title}</span>
            {step.description && <span className="ori-steps__description">{step.description}</span>}
          </span>
        );

        return (
          <Fragment key={index}>
            <li className={itemClass} aria-current={status === 'current' ? 'step' : undefined}>
              {isClickable ? (
                <button
                  type="button"
                  className="ori-steps__button"
                  onClick={() => onStepClick?.(index)}
                  aria-label={`Revenir à l'étape ${index + 1}`}
                >
                  {marker}
                  {label}
                </button>
              ) : (
                <>
                  {marker}
                  {label}
                </>
              )}
            </li>
            {index < steps.length - 1 && <li className="ori-steps__separator" aria-hidden="true" />}
          </Fragment>
        );
      })}
    </ol>
  );
}
