import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner.js';
import { Button } from '../Button/Button.js';

const meta = {
  title: 'Composants/Status/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { size: 'md', label: 'Chargement…' },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};

/**
 * Inline dans un bouton : le spinner remplace le texte ou l'accompagne
 * pendant une action asynchrone (envoi de formulaire, validation).
 */
export const InsideButton: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button disabled>
        <Spinner size="sm" label="Envoi en cours…" /> <span>Envoi…</span>
      </Button>
      <Button variant="secondary" disabled>
        <Spinner size="sm" />
      </Button>
    </div>
  ),
};

/**
 * Inline dans un texte : indique un chargement local sans bloquer l'écran.
 */
export const InlineInText: Story = {
  render: () => (
    <p style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
      <Spinner size="sm" label="Vérification du numéro fiscal" />
      Vérification du numéro fiscal en cours…
    </p>
  ),
};

/**
 * Couleur custom : le spinner hérite de la couleur du parent via
 * `currentColor`. Ici, un parent en rouge.
 */
export const CustomColor: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#dc2626' }}>
      <Spinner size="lg" />
      <span>Hérite de currentColor</span>
    </div>
  ),
};
