import type { Meta, StoryObj } from '@storybook/react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogAction,
} from './AlertDialog.js';
import { Button } from '../Button/Button.js';

// Pas d'autodocs : Radix Portal rend depuis document.body, le rendu auto-doc
// en isolation casse. Mêmes contraintes que Dialog / DropdownMenu.
const meta = {
  title: 'Composants/Feedback/AlertDialog',
  component: AlertDialog,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Cas standard : confirmation d'une suppression. Le focus initial est posé
 * sur "Annuler" pour éviter qu'un Entrée accidentel ne déclenche l'action
 * destructive.
 */
export const Default: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="danger">Supprimer le compte</Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        title="Supprimer le compte ?"
        description="Cette action est définitive. Toutes les données associées au compte seront effacées et ne pourront pas être récupérées."
        footer={
          <>
            <AlertDialogCancel asChild>
              <Button variant="secondary">Annuler</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="danger">Supprimer définitivement</Button>
            </AlertDialogAction>
          </>
        }
      />
    </AlertDialog>
  ),
};

/**
 * Action non destructive : déconnexion. Même API, mais l'action principale
 * n'est pas en variant="danger".
 */
export const Logout: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary">Se déconnecter</Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        title="Se déconnecter ?"
        description="Vous devrez vous reconnecter pour accéder à nouveau à votre espace personnel."
        footer={
          <>
            <AlertDialogCancel asChild>
              <Button variant="secondary">Rester connecté</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button>Se déconnecter</Button>
            </AlertDialogAction>
          </>
        }
      />
    </AlertDialog>
  ),
};
