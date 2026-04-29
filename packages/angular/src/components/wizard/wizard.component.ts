import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { OriStepsComponent, type OriStepItem } from '../steps/steps.component';
import { OriButtonComponent } from '../button/button.component';

let nextUid = 0;

/**
 * Étape déclarative d'un Wizard. Doit être enfant direct d'<ori-wizard>.
 *
 * L'étape rend son contenu (`ng-content`) en permanence dans le DOM mais
 * masquée via `[hidden]` quand non active. Ça évite de réinitialiser les
 * formulaires Reactive Forms à chaque changement d'étape (perte de saisie),
 * tout en gardant l'a11y propre (l'élément non actif n'apparaît pas à l'AT).
 */
@Component({
  selector: 'ori-wizard-step',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [hidden]="!active" class="ori-wizard__step-body">
      <ng-content></ng-content>
    </div>
  `,
})
export class OriWizardStepComponent {
  @Input() title: string = '';
  @Input() description: string = '';

  /** Activé par le parent <ori-wizard> via le query ContentChildren. */
  active: boolean = false;

  private readonly cdr = inject(ChangeDetectorRef);

  setActive(active: boolean): void {
    if (this.active === active) return;
    this.active = active;
    this.cdr.markForCheck();
  }
}

/**
 * Wizard multi-étapes.
 *
 * Assemble Steps + contenu actif + actions Précédent / Suivant / Soumettre.
 * Chaque étape est déclarée via un <ori-wizard-step> enfant.
 *
 * Validation : Ori ne pose aucune logique. L'app gère côté Reactive Forms /
 * signals et désactive l'avancement via `[canProceed]="false"`.
 *
 * Parité avec la version React : même API publique (currentStep,
 * canProceed, onComplete, allowGoBack), mêmes labels par défaut.
 */
@Component({
  selector: 'ori-wizard',
  standalone: true,
  imports: [OriStepsComponent, OriButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ori-wizard">
      <ori-steps
        class="ori-wizard__steps"
        [steps]="stepItems"
        [current]="clampedCurrent"
        [clickable]="allowGoBack"
        (stepClick)="onStepClick($event)"
      ></ori-steps>
      <section class="ori-wizard__panel" [attr.aria-labelledby]="titleId">
        <h2 [id]="titleId" class="ori-wizard__step-title">{{ activeStepTitle }}</h2>
        <ng-content></ng-content>
      </section>
      <div class="ori-wizard__actions">
        <ori-button variant="secondary" [disabled]="isFirst" (click)="goToPrevious()">
          {{ previousLabel }}
        </ori-button>
        @if (isLast) {
          <ori-button [disabled]="!canProceed" (click)="handleSubmit()">{{
            submitLabel
          }}</ori-button>
        } @else {
          <ori-button [disabled]="!canProceed" (click)="goToNext()">{{ nextLabel }}</ori-button>
        }
      </div>
    </div>
  `,
})
export class OriWizardComponent implements AfterContentInit {
  @Input() set currentStep(value: number) {
    this._currentStep = value;
    this.refreshActive();
  }
  get currentStep(): number {
    return this._currentStep;
  }

  @Input() canProceed: boolean = true;
  @Input() allowGoBack: boolean = true;
  @Input() previousLabel: string = 'Précédent';
  @Input() nextLabel: string = 'Suivant';
  @Input() submitLabel: string = 'Soumettre';

  @Output() stepChange = new EventEmitter<number>();
  @Output() complete = new EventEmitter<void>();

  @ContentChildren(OriWizardStepComponent)
  protected stepsRef?: QueryList<OriWizardStepComponent>;

  protected readonly titleId = `pf-wizard-title-${++nextUid}`;
  protected stepItems: OriStepItem[] = [];
  protected activeStepTitle: string = '';
  protected clampedCurrent: number = 0;
  protected isFirst: boolean = true;
  protected isLast: boolean = false;

  private _currentStep: number = 0;

  private readonly cdr = inject(ChangeDetectorRef);

  ngAfterContentInit(): void {
    this.refreshActive();
    this.stepsRef?.changes.subscribe(() => this.refreshActive());
  }

  protected onStepClick(index: number): void {
    if (!this.allowGoBack) return;
    this.stepChange.emit(index);
  }

  protected goToPrevious(): void {
    if (!this.isFirst) this.stepChange.emit(this.clampedCurrent - 1);
  }

  protected goToNext(): void {
    if (!this.isLast && this.canProceed) this.stepChange.emit(this.clampedCurrent + 1);
  }

  protected handleSubmit(): void {
    if (this.canProceed) this.complete.emit();
  }

  private refreshActive(): void {
    if (!this.stepsRef) return;
    const total = this.stepsRef.length;
    if (total === 0) {
      throw new Error('OriWizard doit contenir au moins un <ori-wizard-step>.');
    }
    this.clampedCurrent = Math.max(0, Math.min(this._currentStep, total - 1));
    this.isFirst = this.clampedCurrent === 0;
    this.isLast = this.clampedCurrent === total - 1;
    this.stepItems = this.stepsRef.toArray().map((s) => ({
      title: s.title,
      description: s.description || undefined,
    }));
    this.activeStepTitle = this.stepItems[this.clampedCurrent]?.title ?? '';
    this.stepsRef.forEach((step, idx) => step.setActive(idx === this.clampedCurrent));
    this.cdr.markForCheck();
  }
}
