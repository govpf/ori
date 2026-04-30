import type { Meta, StoryObj } from '@storybook/react';
import { Dialog, DialogTrigger, DialogContent, DialogClose } from './Dialog.js';
import { Button } from '../Button/Button.js';

// Pas d'autodocs ici : Radix Portal rend depuis document.body, ce que la doc
// auto-générée n'a pas (rendu en isolation) → "Cannot destructure 'document'".
// Les stories explicites ci-dessous restent navigables normalement.
const meta = {
  title: 'Primitives/Feedback/Dialog',
  component: Dialog,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Par défaut',
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Ouvrir le dialog</Button>
      </DialogTrigger>
      <DialogContent
        title="Confirmer la suppression"
        description="Cette action est irréversible."
        footer={
          <>
            <DialogClose asChild>
              <Button variant="secondary">Annuler</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="danger">Supprimer</Button>
            </DialogClose>
          </>
        }
      >
        <p style={{ margin: 0 }}>
          Voulez-vous vraiment supprimer cet élément ? Les données associées seront perdues.
        </p>
      </DialogContent>
    </Dialog>
  ),
};

export const LongContent: Story = {
  name: 'Contenu long',
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Voir les conditions</Button>
      </DialogTrigger>
      <DialogContent
        title="Conditions générales d'utilisation"
        footer={
          <DialogClose asChild>
            <Button>J'ai compris</Button>
          </DialogClose>
        }
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <p key={i}>
            Article {i + 1}. Texte de conditions générales suffisamment long pour tester le scroll
            interne de la modale sans déborder sur le viewport.
          </p>
        ))}
      </DialogContent>
    </Dialog>
  ),
};

export const NoFooter: Story = {
  name: 'Sans pied',
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Afficher une info</Button>
      </DialogTrigger>
      <DialogContent title="Information">
        <p style={{ margin: 0 }}>Un dialog sans zone d'actions en pied.</p>
      </DialogContent>
    </Dialog>
  ),
};
