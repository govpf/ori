import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriAlertDialogComponent } from './alert-dialog.component';
import { OriButtonComponent } from '../button/button.component';

const meta: Meta<OriAlertDialogComponent> = {
  title: 'Composants/Feedback/AlertDialog',
  component: OriAlertDialogComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [OriAlertDialogComponent, OriButtonComponent] })],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Modale de confirmation critique. Sémantique role="alertdialog", focus initial sur Annuler, pas de bouton de fermeture (X) ni de fermeture au clic backdrop : la décision doit être explicite.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<OriAlertDialogComponent>;

/**
 * Cas standard : confirmation d'une suppression. Le focus initial est posé
 * sur "Annuler" pour éviter qu'un Entrée accidentel ne déclenche l'action.
 */
export const Default: Story = {
  render: () => ({
    props: {
      isOpen: false,
      open() {
        (this as any).isOpen = true;
      },
      close() {
        (this as any).isOpen = false;
      },
    },
    template: `
      <ori-button variant="danger" (click)="open()">Supprimer le compte</ori-button>
      <ori-alert-dialog
        [open]="isOpen"
        title="Supprimer le compte ?"
        (cancel)="close()"
      >
        <p style="margin: 0">
          Cette action est définitive. Toutes les données associées au compte
          seront effacées et ne pourront pas être récupérées.
        </p>
        <ng-container slot="footer">
          <ori-button variant="secondary" (click)="close()">Annuler</ori-button>
          <ori-button variant="danger" (click)="close()">Supprimer définitivement</ori-button>
        </ng-container>
      </ori-alert-dialog>
    `,
  }),
};

/**
 * Action non destructive : déconnexion. Même API, action principale en
 * variant standard plutôt que danger.
 */
export const Logout: Story = {
  render: () => ({
    props: {
      isOpen: false,
      open() {
        (this as any).isOpen = true;
      },
      close() {
        (this as any).isOpen = false;
      },
    },
    template: `
      <ori-button variant="secondary" (click)="open()">Se déconnecter</ori-button>
      <ori-alert-dialog
        [open]="isOpen"
        title="Se déconnecter ?"
        (cancel)="close()"
      >
        <p style="margin: 0">
          Vous devrez vous reconnecter pour accéder à nouveau à votre espace personnel.
        </p>
        <ng-container slot="footer">
          <ori-button variant="secondary" (click)="close()">Rester connecté</ori-button>
          <ori-button (click)="close()">Se déconnecter</ori-button>
        </ng-container>
      </ori-alert-dialog>
    `,
  }),
};
