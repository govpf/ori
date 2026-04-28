import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriDialogComponent } from './dialog.component';
import { OriButtonComponent } from '../button/button.component';

const meta: Meta<OriDialogComponent> = {
  title: 'Composants/Feedback/Dialog',
  component: OriDialogComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [OriDialogComponent, OriButtonComponent] })],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Modale bloquante avec backdrop, ESC, focus-trap et restauration de focus (via @angular/cdk/a11y). [→ Description complète & bonnes pratiques](?path=/docs/documentation-générale-composants-graphiques-dialog--docs)',
      },
    },
  },
};

export default meta;
type Story = StoryObj<OriDialogComponent>;

/**
 * Cas standard : un bouton qui ouvre la modale, action de confirmation
 * destructive en footer.
 *
 * Note : on n'utilise pas de story "AlwaysOpen" parce qu'avec le focus-trap
 * et le scroll-lock activés, garder le dialog ouvert en permanence dans une
 * page docs casse la navigation (focus piégé, body non scrollable).
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
      <ori-button (click)="open()">Ouvrir le dialog</ori-button>
      <ori-dialog
        [open]="isOpen"
        title="Confirmer la suppression"
        (close)="close()"
      >
        <p style="margin: 0">
          Voulez-vous vraiment supprimer cet élément ? Les données associées seront perdues.
        </p>
        <ng-container slot="footer">
          <ori-button variant="secondary" (click)="close()">Annuler</ori-button>
          <ori-button variant="danger" (click)="close()">Supprimer</ori-button>
        </ng-container>
      </ori-dialog>
    `,
  }),
};

/**
 * Contenu long : démontre le scroll interne du body du dialog (le header et
 * le footer restent fixes, seul le body scrolle). Parité avec la story React.
 */
export const LongContent: Story = {
  render: () => ({
    props: {
      isOpen: false,
      open() {
        (this as any).isOpen = true;
      },
      close() {
        (this as any).isOpen = false;
      },
      articles: Array.from({ length: 12 }, (_, i) => i + 1),
    },
    template: `
      <ori-button variant="secondary" (click)="open()">Voir les conditions</ori-button>
      <ori-dialog
        [open]="isOpen"
        title="Conditions générales d'utilisation"
        (close)="close()"
      >
        @for (n of articles; track n) {
          <p>
            Article {{ n }}. Texte de conditions générales suffisamment long pour
            tester le scroll interne de la modale sans déborder sur le viewport.
          </p>
        }
        <ng-container slot="footer">
          <ori-button (click)="close()">J'ai compris</ori-button>
        </ng-container>
      </ori-dialog>
    `,
  }),
};

/**
 * Sans footer : le dialog n'affiche que header + body. Parité avec la story React.
 */
export const NoFooter: Story = {
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
      <ori-button (click)="open()">Afficher une info</ori-button>
      <ori-dialog [open]="isOpen" title="Information" (close)="close()">
        <p style="margin: 0">Un dialog sans zone d'actions en pied.</p>
      </ori-dialog>
    `,
  }),
};
