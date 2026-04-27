import { Component, inject } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriToastService } from './toast.service';
import {
  OriToastViewportComponent,
  type OriToastViewportPosition,
} from './toast-viewport.component';
import { OriButtonComponent } from '../button/button.component';

@Component({
  selector: 'ori-toast-demo',
  standalone: true,
  imports: [OriButtonComponent, OriToastViewportComponent],
  template: `
    <div style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: center;">
      <ori-button variant="secondary" (click)="toast.info('Informations mises à jour.')"
        >Info</ori-button
      >
      <ori-button variant="secondary" (click)="toast.success('Modifications enregistrées.')"
        >Success</ori-button
      >
      <ori-button variant="secondary" (click)="toast.warning('Champ obligatoire manquant.')"
        >Warning</ori-button
      >
      <ori-button variant="secondary" (click)="toast.danger('Échec de la connexion.')"
        >Danger</ori-button
      >
      <ori-button
        (click)="
          toast.show({
            title: 'Demande envoyée',
            description: 'Votre dossier #2026-0042 a été transmis.',
            variant: 'success',
            duration: 8000,
          })
        "
      >
        Avec titre + 8s
      </ori-button>
      <ori-button
        variant="ghost"
        (click)="
          toast.show({
            title: 'Persistant',
            description: 'Ce toast ne se ferme pas automatiquement.',
            duration: 0,
          })
        "
      >
        Sans auto-dismiss
      </ori-button>
    </div>
    <ori-toast-viewport [position]="position"></ori-toast-viewport>
  `,
})
class ToastDemo {
  position: OriToastViewportPosition = 'top-right';
  protected readonly toast = inject(OriToastService);
}

const meta: Meta<ToastDemo> = {
  title: 'Composants graphiques/Toast',
  component: ToastDemo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Toasts éphémères avec auto-dismiss. Pattern service-based : `inject(OriToastService).success('…')` depuis n'importe où, et `<ori-toast-viewport>` monté une fois dans l'app.",
      },
    },
  },
  decorators: [
    moduleMetadata({ imports: [ToastDemo, OriToastViewportComponent, OriButtonComponent] }),
  ],
};

export default meta;
type Story = StoryObj<ToastDemo>;

export const Default: Story = {
  args: { position: 'top-right' },
};

export const TopCenter: Story = {
  args: { position: 'top-center' },
};

export const BottomRight: Story = {
  args: { position: 'bottom-right' },
};
