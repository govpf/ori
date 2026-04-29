import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Wizard, WizardStep } from './Wizard.js';
import { Form, FormSection, FormField, FormActions } from '../Form/Form.js';
import { Input } from '../Input/Input.js';
import { Textarea } from '../Textarea/Textarea.js';
import { Button } from '../Button/Button.js';

const meta = {
  title: 'Composants/Layout/Wizard',
  component: Wizard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Wizard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Démarche en 3 étapes avec validation simple par étape. */
export const Default: Story = {
  render: () => {
    const [step, setStep] = useState(0);
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [details, setDetails] = useState('');

    // Validation : chaque étape exige ses champs renseignés.
    const canProceed =
      (step === 0 && nom.trim().length > 0) || (step === 1 && email.includes('@')) || step === 2;

    return (
      <div style={{ maxWidth: 640 }}>
        <Wizard
          currentStep={step}
          onStepChange={setStep}
          canProceed={canProceed}
          onComplete={() => alert('Démarche soumise')}
        >
          <WizardStep title="Identité" description="Vos informations personnelles">
            <Form>
              <FormSection>
                <FormField label="Nom complet" required>
                  {(p) => <Input {...p} value={nom} onChange={(e) => setNom(e.target.value)} />}
                </FormField>
              </FormSection>
            </Form>
          </WizardStep>
          <WizardStep title="Coordonnées" description="Comment vous joindre">
            <Form>
              <FormSection>
                <FormField label="Adresse électronique" required>
                  {(p) => (
                    <Input
                      {...p}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="exemple@administration.gov.pf"
                    />
                  )}
                </FormField>
              </FormSection>
            </Form>
          </WizardStep>
          <WizardStep title="Détails" description="Décrivez votre demande">
            <Form>
              <FormSection>
                <FormField label="Détails (optionnel)">
                  {(p) => (
                    <Textarea
                      {...p}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      rows={4}
                    />
                  )}
                </FormField>
              </FormSection>
            </Form>
          </WizardStep>
        </Wizard>
      </div>
    );
  },
};

/** Wizard avec 5 étapes : démontre le rendu de Steps avec plus de marches. */
export const FiveSteps: Story = {
  render: () => {
    const [step, setStep] = useState(0);
    return (
      <div style={{ maxWidth: 720 }}>
        <Wizard currentStep={step} onStepChange={setStep} onComplete={() => alert('Soumis')}>
          {['Identité', 'Coordonnées', 'Pièces jointes', 'Récapitulatif', 'Confirmation'].map(
            (title) => (
              <WizardStep key={title} title={title}>
                <p>Contenu de l'étape « {title} »</p>
                <p>Vous pouvez avancer librement dans cette démo.</p>
              </WizardStep>
            ),
          )}
        </Wizard>
      </div>
    );
  },
};

/** allowGoBack=false : retour aux étapes précédentes désactivé via Steps. */
export const NoGoBack: Story = {
  render: () => {
    const [step, setStep] = useState(0);
    return (
      <div style={{ maxWidth: 640 }}>
        <Wizard
          currentStep={step}
          onStepChange={setStep}
          allowGoBack={false}
          onComplete={() => alert('Soumis')}
        >
          <WizardStep title="Étape 1">
            <p>
              Cette story désactive le retour arrière via clic sur les marches complétées de Steps.
              Le bouton « Précédent » reste actif.
            </p>
          </WizardStep>
          <WizardStep title="Étape 2">
            <p>Contenu étape 2.</p>
          </WizardStep>
          <WizardStep title="Étape 3">
            <p>Dernière étape.</p>
          </WizardStep>
        </Wizard>
      </div>
    );
  },
};
