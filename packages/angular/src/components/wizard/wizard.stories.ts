import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriWizardComponent, OriWizardStepComponent } from './wizard.component';
import {
  OriFormComponent,
  OriFormSectionComponent,
  OriFormFieldComponent,
} from '../form/form.component';
import { OriInputComponent } from '../input/input.component';
import { OriTextareaComponent } from '../textarea/textarea.component';

const meta: Meta<OriWizardComponent> = {
  title: 'Compositions/Layout/Wizard',
  component: OriWizardComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        OriWizardComponent,
        OriWizardStepComponent,
        OriFormComponent,
        OriFormSectionComponent,
        OriFormFieldComponent,
        OriInputComponent,
        OriTextareaComponent,
      ],
    }),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "Wizard multi-étapes : assemble Steps + contenu actif + actions Précédent / Suivant / Soumettre. Validation laissée à l'app via la prop [canProceed].",
      },
    },
  },
};

export default meta;
type Story = StoryObj<OriWizardComponent>;

export const Default: Story = {
  render: () => ({
    props: {
      step: 0,
      nom: '',
      email: '',
      details: '',
      get canProceed(): boolean {
        const s = this as any;
        if (s.step === 0) return s.nom?.trim().length > 0;
        if (s.step === 1) return s.email?.includes('@');
        return true;
      },
      onStep(value: number) {
        (this as any).step = value;
      },
      onNom(event: Event) {
        (this as any).nom = (event.target as HTMLInputElement).value;
      },
      onEmail(event: Event) {
        (this as any).email = (event.target as HTMLInputElement).value;
      },
      onComplete() {
        alert('Démarche soumise');
      },
    },
    template: `
      <div style="max-width: 640px;">
        <ori-wizard
          [currentStep]="step"
          [canProceed]="canProceed"
          (stepChange)="onStep($event)"
          (complete)="onComplete()"
        >
          <ori-wizard-step title="Identité" description="Vos informations personnelles">
            <ori-form>
              <ori-form-section>
                <ori-form-field #nomF label="Nom complet" [required]="true">
                  <ori-input
                    [id]="nomF.controlId"
                    [attr.aria-describedby]="nomF.describedById"
                    [value]="nom"
                    (input)="onNom($event)"
                  ></ori-input>
                </ori-form-field>
              </ori-form-section>
            </ori-form>
          </ori-wizard-step>
          <ori-wizard-step title="Coordonnées" description="Comment vous joindre">
            <ori-form>
              <ori-form-section>
                <ori-form-field #emailF label="Adresse électronique" [required]="true">
                  <ori-input
                    [id]="emailF.controlId"
                    [attr.aria-describedby]="emailF.describedById"
                    type="email"
                    placeholder="exemple@administration.gov.pf"
                    [value]="email"
                    (input)="onEmail($event)"
                  ></ori-input>
                </ori-form-field>
              </ori-form-section>
            </ori-form>
          </ori-wizard-step>
          <ori-wizard-step title="Détails" description="Décrivez votre demande">
            <ori-form>
              <ori-form-section>
                <ori-form-field #detF label="Détails (optionnel)">
                  <ori-textarea
                    [id]="detF.controlId"
                    [attr.aria-describedby]="detF.describedById"
                    [rows]="4"
                  ></ori-textarea>
                </ori-form-field>
              </ori-form-section>
            </ori-form>
          </ori-wizard-step>
        </ori-wizard>
      </div>
    `,
  }),
};

export const FiveSteps: Story = {
  render: () => ({
    props: {
      step: 0,
      onStep(value: number) {
        (this as any).step = value;
      },
      titles: ['Identité', 'Coordonnées', 'Pièces jointes', 'Récapitulatif', 'Confirmation'],
    },
    template: `
      <div style="max-width: 720px;">
        <ori-wizard
          [currentStep]="step"
          (stepChange)="onStep($event)"
          (complete)="alert('Soumis')"
        >
          <ori-wizard-step *ngFor="let title of titles" [title]="title">
            <p>Contenu de l'étape « {{ title }} »</p>
            <p>Vous pouvez avancer librement dans cette démo.</p>
          </ori-wizard-step>
        </ori-wizard>
      </div>
    `,
  }),
};

export const NoGoBack: Story = {
  render: () => ({
    props: {
      step: 0,
      onStep(value: number) {
        (this as any).step = value;
      },
    },
    template: `
      <div style="max-width: 640px;">
        <ori-wizard
          [currentStep]="step"
          [allowGoBack]="false"
          (stepChange)="onStep($event)"
        >
          <ori-wizard-step title="Étape 1">
            <p>
              Cette story désactive le retour arrière via clic sur les marches
              complétées de Steps. Le bouton « Précédent » reste actif.
            </p>
          </ori-wizard-step>
          <ori-wizard-step title="Étape 2">
            <p>Contenu étape 2.</p>
          </ori-wizard-step>
          <ori-wizard-step title="Étape 3">
            <p>Dernière étape.</p>
          </ori-wizard-step>
        </ori-wizard>
      </div>
    `,
  }),
};
