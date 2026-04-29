import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogAction,
} from './AlertDialog';

function setup(extra: { onAction?: () => void; onCancel?: () => void } = {}) {
  return render(
    <AlertDialog>
      <AlertDialogTrigger>Supprimer</AlertDialogTrigger>
      <AlertDialogContent
        title="Supprimer le compte ?"
        description="Cette action est définitive."
        footer={
          <>
            <AlertDialogCancel onClick={extra.onCancel}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={extra.onAction}>Supprimer</AlertDialogAction>
          </>
        }
      />
    </AlertDialog>,
  );
}

describe('AlertDialog', () => {
  describe('rendu', () => {
    it('ne rend pas le contenu quand fermé', () => {
      setup();
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });

    it('ouvre le dialog avec role="alertdialog" au clic sur le trigger', async () => {
      const user = userEvent.setup();
      setup();
      await user.click(screen.getByRole('button', { name: 'Supprimer' }));
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    it('lie le titre via aria-labelledby et la description via aria-describedby', async () => {
      const user = userEvent.setup();
      setup();
      await user.click(screen.getByRole('button', { name: 'Supprimer' }));
      const dialog = screen.getByRole('alertdialog');
      const labelledById = dialog.getAttribute('aria-labelledby');
      const describedById = dialog.getAttribute('aria-describedby');
      expect(labelledById).toBeTruthy();
      expect(describedById).toBeTruthy();
      expect(document.getElementById(labelledById!)).toHaveTextContent('Supprimer le compte ?');
      expect(document.getElementById(describedById!)).toHaveTextContent(
        'Cette action est définitive.',
      );
    });
  });

  describe('actions', () => {
    it('appelle onClick sur Annuler et ferme le dialog', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      setup({ onCancel });
      await user.click(screen.getByRole('button', { name: 'Supprimer' }));
      await user.click(screen.getByRole('button', { name: 'Annuler' }));
      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });

    it('appelle onClick sur Action et ferme le dialog', async () => {
      const user = userEvent.setup();
      const onAction = vi.fn();
      render(
        <AlertDialog>
          <AlertDialogTrigger>Ouvrir</AlertDialogTrigger>
          <AlertDialogContent
            title="Titre"
            description="Description"
            footer={
              <>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={onAction}>Confirmer</AlertDialogAction>
              </>
            }
          />
        </AlertDialog>,
      );
      await user.click(screen.getByRole('button', { name: 'Ouvrir' }));
      await user.click(screen.getByRole('button', { name: 'Confirmer' }));
      expect(onAction).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });

    it('ferme le dialog sur Escape', async () => {
      const user = userEvent.setup();
      setup();
      await user.click(screen.getByRole('button', { name: 'Supprimer' }));
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  });

  describe('contrôlé', () => {
    it('respecte la prop open', () => {
      render(
        <AlertDialog open={true}>
          <AlertDialogTrigger>Trigger</AlertDialogTrigger>
          <AlertDialogContent
            title="Titre"
            description="Description"
            footer={
              <>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction>OK</AlertDialogAction>
              </>
            }
          />
        </AlertDialog>,
      );
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    it("appelle onOpenChange à l'ouverture", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <AlertDialog onOpenChange={onOpenChange}>
          <AlertDialogTrigger>Trigger</AlertDialogTrigger>
          <AlertDialogContent
            title="Titre"
            description="Description"
            footer={
              <>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction>OK</AlertDialogAction>
              </>
            }
          />
        </AlertDialog>,
      );
      await user.click(screen.getByRole('button', { name: 'Trigger' }));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });
});
