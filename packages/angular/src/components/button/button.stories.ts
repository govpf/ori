import type { Meta, StoryObj, Args } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { LucideAngularModule, Send, Undo2, Trash2 } from 'lucide-angular';
import { OriButtonComponent } from './button.component';

/**
 * Le composant utilise `<ng-content>` pour son contenu, on définit donc un
 * meta arg "label" virtuel pour piloter le texte projeté depuis les controls
 * Storybook. Il est consommé dans le template via interpolation.
 */
type ButtonStoryArgs = OriButtonComponent & { label: string };

const meta: Meta<ButtonStoryArgs> = {
  title: 'Composants/Actions/Button',
  component: OriButtonComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Élément d'interaction principal. 4 variantes, 3 tailles, bloc, désactivé. [→ Description complète & bonnes pratiques](?path=/docs/documentation-générale-composants-graphiques-button--docs)",
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
    block: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: {
      control: 'text',
      description: 'Texte projeté dans le bouton (ng-content).',
    },
  },
  args: {
    variant: 'primary',
    size: 'md',
    block: false,
    disabled: false,
    label: 'Envoyer',
  },
  render: (args: Args) => ({
    props: args,
    template: `<ori-button
      [variant]="variant"
      [size]="size"
      [block]="block"
      [disabled]="disabled"
    >{{ label }}</ori-button>`,
  }),
};

export default meta;
type Story = StoryObj<ButtonStoryArgs>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Danger: Story = { args: { variant: 'danger', label: 'Supprimer' } };
export const Disabled: Story = { args: { disabled: true, label: 'Désactivé' } };

export const Sizes: Story = {
  render: (args: Args) => ({
    props: args,
    template: `
      <div style="display: flex; gap: 1rem; align-items: center;">
        <ori-button [variant]="variant" size="sm">Petit</ori-button>
        <ori-button [variant]="variant" size="md">Moyen</ori-button>
        <ori-button [variant]="variant" size="lg">Grand</ori-button>
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <ori-button variant="primary">Primary</ori-button>
        <ori-button variant="secondary">Secondary</ori-button>
        <ori-button variant="ghost">Ghost</ori-button>
        <ori-button variant="danger">Danger</ori-button>
        <ori-button variant="primary" [disabled]="true">Disabled</ori-button>
      </div>
    `,
  }),
};

export const Block: Story = {
  args: { block: true, label: 'Bouton pleine largeur' },
  decorators: [
    (storyFn) => {
      const story = storyFn();
      return {
        ...story,
        template: `<div style="width: 320px;">${story.template}</div>`,
      };
    },
  ],
};

/**
 * Démo de composition : le bouton accepte n'importe quel contenu projeté,
 * y compris des icônes Lucide via lucide-icon.
 */
export const Composition: Story = {
  decorators: [moduleMetadata({ imports: [LucideAngularModule] })],
  render: () => ({
    props: { SendIcon: Send, UndoIcon: Undo2, TrashIcon: Trash2 },
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <ori-button variant="primary">
          <lucide-icon [img]="SendIcon" [size]="16"></lucide-icon>
          Envoyer
        </ori-button>
        <ori-button variant="secondary">
          <lucide-icon [img]="UndoIcon" [size]="16"></lucide-icon>
          Retour
        </ori-button>
        <ori-button variant="danger">
          <lucide-icon [img]="TrashIcon" [size]="16"></lucide-icon>
          Supprimer
        </ori-button>
      </div>
    `,
  }),
};
