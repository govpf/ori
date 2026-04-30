import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './Accordion.js';

const meta = {
  title: 'Primitives/Navigation/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Accordéon basé sur `<details>` / `<summary>` natifs. A11y native gratuite, mode exclusif (single) via l'attribut HTML `name` (Chrome 120+, Firefox 122+, Safari 17+).",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 540 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Multiple: Story = {
  name: 'Multiple',
  render: () => (
    <Accordion type="multiple">
      <Accordion.Item title="Quelles sont les pièces à fournir ?">
        Une pièce d'identité, un justificatif de domicile de moins de 3 mois et le formulaire
        complété.
      </Accordion.Item>
      <Accordion.Item title="Quels sont les délais de traitement ?">
        Une fois le dossier complet reçu, le traitement prend en moyenne 7 jours ouvrés.
      </Accordion.Item>
      <Accordion.Item title="Comment suivre l'avancement ?">
        Vous recevez une notification par email à chaque changement d'état du dossier.
      </Accordion.Item>
    </Accordion>
  ),
};

export const Single: Story = {
  render: () => (
    <Accordion type="single">
      <Accordion.Item title="Section 1" defaultOpen>
        Quand un autre item est ouvert, celui-ci se ferme automatiquement (mode exclusif).
      </Accordion.Item>
      <Accordion.Item title="Section 2">Contenu de la section 2.</Accordion.Item>
      <Accordion.Item title="Section 3">Contenu de la section 3.</Accordion.Item>
    </Accordion>
  ),
};

export const WithDefaultOpen: Story = {
  render: () => (
    <Accordion type="multiple">
      <Accordion.Item title="Question fréquente A" defaultOpen>
        Cet item est ouvert au chargement.
      </Accordion.Item>
      <Accordion.Item title="Question fréquente B">Fermé par défaut.</Accordion.Item>
    </Accordion>
  ),
};
