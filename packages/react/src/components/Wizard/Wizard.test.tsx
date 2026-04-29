import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Wizard, WizardStep } from './Wizard';

function ControlledWizard({
  initial = 0,
  canProceed = true,
  allowGoBack,
  onComplete,
}: {
  initial?: number;
  canProceed?: boolean;
  allowGoBack?: boolean;
  onComplete?: () => void;
}) {
  const [step, setStep] = useState(initial);
  return (
    <Wizard
      currentStep={step}
      onStepChange={setStep}
      canProceed={canProceed}
      allowGoBack={allowGoBack}
      onComplete={onComplete}
    >
      <WizardStep title="Identité">
        <p>Contenu identité</p>
      </WizardStep>
      <WizardStep title="Coordonnées">
        <p>Contenu coordonnées</p>
      </WizardStep>
      <WizardStep title="Détails">
        <p>Contenu détails</p>
      </WizardStep>
    </Wizard>
  );
}

describe('Wizard', () => {
  describe('rendu', () => {
    it('rend la première étape par défaut', () => {
      render(<ControlledWizard />);
      expect(screen.getByText('Contenu identité')).toBeInTheDocument();
      expect(screen.queryByText('Contenu coordonnées')).not.toBeInTheDocument();
    });

    it("rend un h2 avec le titre de l'étape active", () => {
      render(<ControlledWizard />);
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Identité');
    });

    it("rend Steps avec aria-current=step sur l'étape active", () => {
      render(<ControlledWizard />);
      // Steps rend une <ol> avec <li>; on vérifie aria-current sur l'item courant.
      const currentItem = document.querySelector('[aria-current="step"]');
      expect(currentItem).toHaveTextContent('Identité');
    });

    it('désactive le bouton Précédent sur la 1ère étape', () => {
      render(<ControlledWizard />);
      expect(screen.getByRole('button', { name: 'Précédent' })).toBeDisabled();
    });

    it("affiche le bouton Suivant tant qu'on n'est pas sur la dernière étape", () => {
      render(<ControlledWizard />);
      expect(screen.getByRole('button', { name: 'Suivant' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Soumettre' })).not.toBeInTheDocument();
    });

    it('affiche le bouton Soumettre sur la dernière étape', () => {
      render(<ControlledWizard initial={2} />);
      expect(screen.getByRole('button', { name: 'Soumettre' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Suivant' })).not.toBeInTheDocument();
    });

    it("throw quand aucun WizardStep n'est fourni", () => {
      // On supprime le warning React inutile pour ce test.
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() =>
        render(
          <Wizard currentStep={0}>
            <span>pas une étape</span>
          </Wizard>,
        ),
      ).toThrow(/au moins un.*WizardStep/i);
      spy.mockRestore();
    });
  });

  describe('navigation', () => {
    it('avance au clic sur Suivant', async () => {
      const user = userEvent.setup();
      render(<ControlledWizard />);
      await user.click(screen.getByRole('button', { name: 'Suivant' }));
      expect(screen.getByText('Contenu coordonnées')).toBeInTheDocument();
    });

    it('recule au clic sur Précédent', async () => {
      const user = userEvent.setup();
      render(<ControlledWizard initial={1} />);
      await user.click(screen.getByRole('button', { name: 'Précédent' }));
      expect(screen.getByText('Contenu identité')).toBeInTheDocument();
    });

    it('appelle onComplete au clic sur Soumettre', async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      render(<ControlledWizard initial={2} onComplete={onComplete} />);
      await user.click(screen.getByRole('button', { name: 'Soumettre' }));
      expect(onComplete).toHaveBeenCalled();
    });
  });

  describe('canProceed', () => {
    it('désactive Suivant quand canProceed=false', () => {
      render(<ControlledWizard canProceed={false} />);
      expect(screen.getByRole('button', { name: 'Suivant' })).toBeDisabled();
    });

    it('désactive Soumettre quand canProceed=false sur la dernière étape', () => {
      render(<ControlledWizard initial={2} canProceed={false} />);
      expect(screen.getByRole('button', { name: 'Soumettre' })).toBeDisabled();
    });

    it("n'appelle pas onComplete si canProceed=false", async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      render(<ControlledWizard initial={2} canProceed={false} onComplete={onComplete} />);
      await user.click(screen.getByRole('button', { name: 'Soumettre' }));
      expect(onComplete).not.toHaveBeenCalled();
    });
  });
});
