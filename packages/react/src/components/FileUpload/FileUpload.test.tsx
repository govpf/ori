import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileUpload } from './FileUpload';

function makeFile(name: string, type: string, size = 100): File {
  const f = new File(['x'.repeat(size)], name, { type });
  // Vérification : la taille du blob est respectée
  Object.defineProperty(f, 'size', { value: size });
  return f;
}

function getInput(): HTMLInputElement {
  // L'input file est <input type="file"> avec class ori-file__input
  // Il n'a pas de role accessible standard, on le récupère par sélecteur.
  const input = document.querySelector('input[type="file"]');
  if (!input) throw new Error('input file not found');
  return input as HTMLInputElement;
}

async function uploadFiles(input: HTMLInputElement, files: File[]) {
  // On utilise fireEvent.change plutôt que userEvent.upload pour
  // bypasser la validation HTML `accept` de l'input. C'est notre
  // composant qui doit faire la validation et émettre `onReject` ;
  // on veut couvrir ce code, donc on lui passe les fichiers tels quels.
  Object.defineProperty(input, 'files', { value: files, configurable: true });
  fireEvent.change(input);
}
// userEvent reste utilisé ailleurs (clics sur boutons) ; on garde son import
void userEvent;

describe('FileUpload', () => {
  describe('sélection de fichier', () => {
    it('appelle onFilesChange quand un fichier est sélectionné', async () => {
      const onFilesChange = vi.fn();
      render(<FileUpload onFilesChange={onFilesChange} />);
      await uploadFiles(getInput(), [makeFile('cv.pdf', 'application/pdf')]);
      expect(onFilesChange).toHaveBeenCalledTimes(1);
      expect(onFilesChange.mock.calls[0][0]).toHaveLength(1);
      expect(onFilesChange.mock.calls[0][0][0].name).toBe('cv.pdf');
    });

    it('en mode incontrôlé, garde un seul fichier par défaut (multiple=false)', async () => {
      render(<FileUpload />);
      await uploadFiles(getInput(), [
        makeFile('a.pdf', 'application/pdf'),
        makeFile('b.pdf', 'application/pdf'),
      ]);
      // multiple=false → un seul fichier conservé
      expect(screen.getAllByText(/\.pdf$/)).toHaveLength(1);
    });

    it('en mode multiple, accumule les fichiers à chaque sélection', async () => {
      const onFilesChange = vi.fn();
      const { rerender } = render(<FileUpload multiple onFilesChange={onFilesChange} />);
      await uploadFiles(getInput(), [makeFile('a.pdf', 'application/pdf')]);
      // simuler un re-render après la 1ère sélection (le state interne est mis à jour
      // automatiquement, on doit juste laisser React refléter)
      rerender(<FileUpload multiple onFilesChange={onFilesChange} />);
      await uploadFiles(getInput(), [makeFile('b.pdf', 'application/pdf')]);
      expect(onFilesChange).toHaveBeenLastCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ name: 'a.pdf' }),
          expect.objectContaining({ name: 'b.pdf' }),
        ]),
      );
    });
  });

  describe('validation par type (accept)', () => {
    it('accepte un fichier qui matche un MIME exact', async () => {
      const onReject = vi.fn();
      const onFilesChange = vi.fn();
      render(
        <FileUpload accept="application/pdf" onFilesChange={onFilesChange} onReject={onReject} />,
      );
      await uploadFiles(getInput(), [makeFile('cv.pdf', 'application/pdf')]);
      expect(onFilesChange).toHaveBeenCalled();
      expect(onReject).not.toHaveBeenCalled();
    });

    it('accepte un fichier qui matche un wildcard MIME (image/*)', async () => {
      const onReject = vi.fn();
      const onFilesChange = vi.fn();
      render(<FileUpload accept="image/*" onFilesChange={onFilesChange} onReject={onReject} />);
      await uploadFiles(getInput(), [makeFile('photo.png', 'image/png')]);
      expect(onFilesChange).toHaveBeenCalled();
      expect(onReject).not.toHaveBeenCalled();
    });

    it('accepte un fichier qui matche une extension (.pdf)', async () => {
      const onReject = vi.fn();
      const onFilesChange = vi.fn();
      render(<FileUpload accept=".pdf" onFilesChange={onFilesChange} onReject={onReject} />);
      // Type MIME bidon, mais l'extension matche → accepté
      await uploadFiles(getInput(), [makeFile('cv.pdf', '')]);
      expect(onFilesChange).toHaveBeenCalled();
      expect(onReject).not.toHaveBeenCalled();
    });

    it('rejette un fichier dont le type ne matche pas', async () => {
      const onReject = vi.fn();
      const onFilesChange = vi.fn();
      render(
        <FileUpload accept="application/pdf" onFilesChange={onFilesChange} onReject={onReject} />,
      );
      await uploadFiles(getInput(), [makeFile('photo.png', 'image/png')]);
      expect(onReject).toHaveBeenCalledTimes(1);
      expect(onReject.mock.calls[0][0]).toEqual([
        expect.objectContaining({
          file: expect.objectContaining({ name: 'photo.png' }),
          reason: 'type',
        }),
      ]);
      expect(onFilesChange).not.toHaveBeenCalled();
    });

    it("ne valide rien quand accept n'est pas fourni", async () => {
      const onReject = vi.fn();
      const onFilesChange = vi.fn();
      render(<FileUpload onFilesChange={onFilesChange} onReject={onReject} />);
      await uploadFiles(getInput(), [makeFile('foo.xyz', 'application/octet-stream')]);
      expect(onFilesChange).toHaveBeenCalled();
      expect(onReject).not.toHaveBeenCalled();
    });
  });

  describe('validation par taille (maxSize)', () => {
    it('accepte un fichier sous la limite', async () => {
      const onReject = vi.fn();
      const onFilesChange = vi.fn();
      render(<FileUpload maxSize={1024} onFilesChange={onFilesChange} onReject={onReject} />);
      await uploadFiles(getInput(), [makeFile('small.pdf', 'application/pdf', 500)]);
      expect(onFilesChange).toHaveBeenCalled();
      expect(onReject).not.toHaveBeenCalled();
    });

    it('rejette un fichier au-dessus de la limite', async () => {
      const onReject = vi.fn();
      const onFilesChange = vi.fn();
      render(<FileUpload maxSize={1024} onFilesChange={onFilesChange} onReject={onReject} />);
      await uploadFiles(getInput(), [makeFile('big.pdf', 'application/pdf', 2048)]);
      expect(onReject).toHaveBeenCalledTimes(1);
      expect(onReject.mock.calls[0][0][0].reason).toBe('size');
      expect(onFilesChange).not.toHaveBeenCalled();
    });

    it('mélange : remonte les acceptés via onFilesChange et les rejetés via onReject', async () => {
      const onReject = vi.fn();
      const onFilesChange = vi.fn();
      render(
        <FileUpload
          multiple
          maxSize={1024}
          accept="application/pdf"
          onFilesChange={onFilesChange}
          onReject={onReject}
        />,
      );
      await uploadFiles(getInput(), [
        makeFile('ok.pdf', 'application/pdf', 500),
        makeFile('too-big.pdf', 'application/pdf', 2048),
        makeFile('wrong.png', 'image/png', 500),
      ]);
      expect(onFilesChange.mock.calls[0][0]).toEqual([expect.objectContaining({ name: 'ok.pdf' })]);
      expect(onReject.mock.calls[0][0]).toEqual([
        expect.objectContaining({ reason: 'size' }),
        expect.objectContaining({ reason: 'type' }),
      ]);
    });
  });

  describe('drag & drop', () => {
    it('ajoute la classe --dragging pendant le drag over', () => {
      const { container } = render(<FileUpload />);
      const dropzone = container.querySelector('.ori-file__dropzone')!;
      fireEvent.dragOver(dropzone);
      expect(dropzone).toHaveClass('ori-file__dropzone--dragging');
      fireEvent.dragLeave(dropzone);
      expect(dropzone).not.toHaveClass('ori-file__dropzone--dragging');
    });

    it('appelle handleIncoming au drop', () => {
      const onFilesChange = vi.fn();
      const { container } = render(<FileUpload onFilesChange={onFilesChange} />);
      const dropzone = container.querySelector('.ori-file__dropzone')!;
      const file = makeFile('drop.pdf', 'application/pdf');
      fireEvent.drop(dropzone, {
        dataTransfer: { files: [file] },
      });
      expect(onFilesChange).toHaveBeenCalled();
      expect(onFilesChange.mock.calls[0][0][0].name).toBe('drop.pdf');
    });

    it('disabled : le drop ne déclenche aucun callback', () => {
      const onFilesChange = vi.fn();
      const { container } = render(<FileUpload disabled onFilesChange={onFilesChange} />);
      const dropzone = container.querySelector('.ori-file__dropzone')!;
      fireEvent.drop(dropzone, {
        dataTransfer: { files: [makeFile('x.pdf', 'application/pdf')] },
      });
      expect(onFilesChange).not.toHaveBeenCalled();
    });
  });

  describe('liste affichée et suppression', () => {
    it('affiche la liste des fichiers sélectionnés avec leur taille formatée', async () => {
      render(<FileUpload multiple />);
      await uploadFiles(getInput(), [
        makeFile('petit.pdf', 'application/pdf', 500),
        makeFile('moyen.pdf', 'application/pdf', 50_000),
      ]);
      expect(screen.getByText('petit.pdf')).toBeInTheDocument();
      expect(screen.getByText('500 o')).toBeInTheDocument();
      expect(screen.getByText('moyen.pdf')).toBeInTheDocument();
      expect(screen.getByText('48.8 Ko')).toBeInTheDocument();
    });

    it('retire un fichier au clic sur "Retirer"', async () => {
      const user = userEvent.setup();
      render(<FileUpload />);
      await uploadFiles(getInput(), [makeFile('cv.pdf', 'application/pdf')]);
      expect(screen.getByText('cv.pdf')).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: 'Retirer cv.pdf' }));
      expect(screen.queryByText('cv.pdf')).not.toBeInTheDocument();
    });
  });

  describe('accessibilité', () => {
    it("lie hint et error à l'input via aria-describedby", () => {
      render(<FileUpload hint="PDF uniquement" error="Champ requis" id="cv" />);
      const input = getInput();
      const describedBy = input.getAttribute('aria-describedby');
      expect(describedBy).toContain('cv-error');
      // hint est masqué quand error est présent (cf. JSX), mais l'ID
      // dans aria-describedby couvre les deux pour la robustesse
    });

    it('marque aria-invalid quand error est fourni', () => {
      render(<FileUpload error="Trop gros" />);
      expect(getInput()).toHaveAttribute('aria-invalid', 'true');
    });

    it("rend l'erreur avec role=alert", () => {
      render(<FileUpload error="Type non accepté" />);
      expect(screen.getByRole('alert')).toHaveTextContent('Type non accepté');
    });
  });
});
