import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input.js';

const meta = {
  title: 'Primitives/Saisie/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Champ de saisie textuelle. Gère label, hint, error, 3 tailles, ARIA. [→ Description complète & bonnes pratiques](?path=/docs/documentation-générale-composants-graphiques-input--docs)',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Nom',
    placeholder: 'Entrez votre nom',
    size: 'md',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: 'Par défaut' };

export const WithHint: Story = {
  name: 'Avec indication',
  args: { hint: "Tel qu'il apparaît sur votre pièce d'identité." },
};

export const Required: Story = {
  name: 'Requis',
  args: { required: true },
};

export const WithError: Story = {
  name: 'Avec erreur',
  args: {
    value: '',
    error: 'Ce champ est obligatoire.',
    required: true,
  },
};

export const Disabled: Story = {
  name: 'Désactivé',
  args: { disabled: true, value: 'Valeur verrouillée' },
};

export const Sizes: Story = {
  name: 'Tailles',
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Input {...args} size="sm" label="Petit" />
      <Input {...args} size="md" label="Moyen" />
      <Input {...args} size="lg" label="Grand" />
    </div>
  ),
};
