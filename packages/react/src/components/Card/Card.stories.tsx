import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardBody, CardFooter } from './Card.js';
import { Button } from '../Button/Button.js';

const meta = {
  title: 'Composants/Affichage/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Conteneur d'aperçu structuré (header, body, footer). 3 variantes : default, elevated, flat. [→ Description complète & bonnes pratiques](?path=/docs/documentation-générale-composants-graphiques-card--docs)",
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'elevated', 'flat'] },
  },
  args: { variant: 'default' },
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader title="Titre de la card" subtitle="Un sous-titre descriptif" />
      <CardBody>
        <p style={{ margin: 0 }}>
          Contenu principal de la carte. Les paragraphes héritent de la typographie du DS.
        </p>
      </CardBody>
      <CardFooter>
        <Button variant="secondary" size="sm">
          Annuler
        </Button>
        <Button size="sm">Valider</Button>
      </CardFooter>
    </Card>
  ),
};

export const Elevated: Story = {
  args: { variant: 'elevated' },
  render: Default.render,
};

export const Flat: Story = {
  args: { variant: 'flat' },
  render: Default.render,
};

export const BodyOnly: Story = {
  render: (args) => (
    <Card {...args}>
      <CardBody>Une carte minimale sans header ni footer.</CardBody>
    </Card>
  ),
};
