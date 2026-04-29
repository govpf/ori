import { Children, forwardRef, isValidElement, type ReactElement, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { Steps, type StepItem } from '../Steps/Steps.js';
import { Button } from '../Button/Button.js';

/**
 * Wizard multi-étapes.
 *
 * Assemble Steps + contenu actif + actions Précédent / Suivant / Soumettre.
 * Chaque étape est déclarée via un <WizardStep> enfant qui porte un titre,
 * une description optionnelle, et son contenu (typiquement un <Form>).
 *
 * Validation : Ori ne pose aucune logique de validation. L'app la gère
 * elle-même et désactive l'avancement via `canProceed` (boolean prop sur
 * <Wizard>) quand l'étape courante n'est pas valide.
 *
 * Pas de skip / step direct par défaut : l'utilisateur peut revenir aux
 * étapes complétées via Steps `clickable` activable côté props.
 *
 * a11y :
 * - Steps porte aria-current="step" sur l'étape courante (cf. composant Steps)
 * - chaque WizardStep est rendu dans un <section> avec aria-labelledby
 *   pointant sur son titre
 * - les boutons d'action sont des `<button>` standard
 */

export interface WizardStepProps {
  /** Titre court de l'étape, affiché dans Steps et en h2 du contenu. */
  title: string;
  /** Description courte optionnelle (Steps). */
  description?: string;
  children?: ReactNode;
}

/**
 * Marqueur déclaratif d'une étape de Wizard. Doit être un enfant direct
 * de <Wizard>. Le rendu effectif est piloté par le parent.
 */
export function WizardStep(_props: WizardStepProps): null {
  return null;
}
WizardStep.displayName = 'WizardStep';

export interface WizardProps {
  /** Index 0-based de l'étape courante (contrôlé). */
  currentStep: number;
  onStepChange?: (index: number) => void;
  /** Si false, le bouton Suivant est désactivé. Default: true. */
  canProceed?: boolean;
  /** Callback déclenché au clic sur Soumettre (sur la dernière étape). */
  onComplete?: () => void;
  /** Permet de re-cliquer sur une étape déjà complétée pour y revenir. Default: true. */
  allowGoBack?: boolean;
  /** Labels des boutons (i18n). */
  previousLabel?: string;
  nextLabel?: string;
  submitLabel?: string;
  children: ReactNode;
  className?: string;
}

export const Wizard = forwardRef<HTMLDivElement, WizardProps>(function Wizard(
  {
    currentStep,
    onStepChange,
    canProceed = true,
    onComplete,
    allowGoBack = true,
    previousLabel = 'Précédent',
    nextLabel = 'Suivant',
    submitLabel = 'Soumettre',
    children,
    className,
  },
  ref,
) {
  // Collecte des étapes via Children + filtrage des WizardStep
  const stepElements = Children.toArray(children).filter(
    (child): child is ReactElement<WizardStepProps> =>
      isValidElement(child) &&
      // @ts-expect-error - displayName peut ne pas être typé
      (child.type === WizardStep || child.type?.displayName === 'WizardStep'),
  );

  if (stepElements.length === 0) {
    throw new Error('Wizard doit contenir au moins un <WizardStep>.');
  }

  const clampedCurrent = Math.max(0, Math.min(currentStep, stepElements.length - 1));
  const isFirst = clampedCurrent === 0;
  const isLast = clampedCurrent === stepElements.length - 1;
  const activeStep = stepElements[clampedCurrent];
  // stepElements.length > 0 garanti par le throw plus haut, donc activeStep est défini.
  if (!activeStep) {
    throw new Error('Wizard : index courant hors limites.');
  }

  const stepsItems: StepItem[] = stepElements.map((el) => ({
    title: el.props.title,
    description: el.props.description,
  }));

  const goToPrevious = () => {
    if (!isFirst) onStepChange?.(clampedCurrent - 1);
  };

  const goToNext = () => {
    if (!isLast && canProceed) onStepChange?.(clampedCurrent + 1);
  };

  const handleSubmit = () => {
    if (canProceed) onComplete?.();
  };

  // Garantir un id stable pour l'aria-labelledby de chaque section
  const baseId = 'pf-wizard';

  return (
    <div ref={ref} className={clsx('ori-wizard', className)}>
      <Steps
        steps={stepsItems}
        current={clampedCurrent}
        clickable={allowGoBack}
        onStepClick={(index) => onStepChange?.(index)}
        className="ori-wizard__steps"
      />
      <section
        className="ori-wizard__panel"
        aria-labelledby={`${baseId}-step-title-${clampedCurrent}`}
      >
        <h2 id={`${baseId}-step-title-${clampedCurrent}`} className="ori-wizard__step-title">
          {activeStep.props.title}
        </h2>
        <div className="ori-wizard__step-body">{activeStep.props.children}</div>
      </section>
      <div className="ori-wizard__actions">
        <Button variant="secondary" onClick={goToPrevious} disabled={isFirst}>
          {previousLabel}
        </Button>
        {isLast ? (
          <Button onClick={handleSubmit} disabled={!canProceed}>
            {submitLabel}
          </Button>
        ) : (
          <Button onClick={goToNext} disabled={!canProceed}>
            {nextLabel}
          </Button>
        )}
      </div>
    </div>
  );
});
