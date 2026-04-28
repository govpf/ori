import type { Meta, StoryObj } from '@storybook/react';
import { ToastProvider, ToastViewport, useToast, type ToastViewportPosition } from './Toast.js';
import { Button } from '../Button/index.js';

const meta = {
  title: 'Composants/Feedback/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Toasts éphémères avec auto-dismiss. Pattern service-based : monter `<ToastProvider>` autour de l'app + `<ToastViewport>` une fois, puis appeler `useToast()` pour déclencher des messages depuis n'importe où.",
      },
    },
  },
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

function Trigger({ position }: { position?: ToastViewportPosition }) {
  const { toast } = useToast();
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
      <Button variant="secondary" onClick={() => toast.info('Informations mises à jour.')}>
        Info
      </Button>
      <Button variant="secondary" onClick={() => toast.success('Modifications enregistrées.')}>
        Success
      </Button>
      <Button variant="secondary" onClick={() => toast.warning('Champ obligatoire manquant.')}>
        Warning
      </Button>
      <Button variant="secondary" onClick={() => toast.danger('Échec de la connexion.')}>
        Danger
      </Button>
      <Button
        onClick={() =>
          toast({
            title: 'Demande envoyée',
            description: 'Votre dossier #2026-0042 a été transmis au service instructeur.',
            variant: 'success',
            duration: 8000,
          })
        }
      >
        Avec titre + 8s
      </Button>
      <Button
        variant="ghost"
        onClick={() =>
          toast({
            title: 'Persistant',
            description: 'Ce toast ne se ferme pas automatiquement.',
            duration: 0,
          })
        }
      >
        Sans auto-dismiss
      </Button>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <Trigger />
      <ToastViewport position="top-right" />
    </ToastProvider>
  ),
};

export const TopCenter: Story = {
  render: () => (
    <ToastProvider>
      <Trigger />
      <ToastViewport position="top-center" />
    </ToastProvider>
  ),
};

export const BottomRight: Story = {
  render: () => (
    <ToastProvider>
      <Trigger />
      <ToastViewport position="bottom-right" />
    </ToastProvider>
  ),
};
