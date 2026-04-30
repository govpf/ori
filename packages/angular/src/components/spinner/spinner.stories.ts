import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriSpinnerComponent } from './spinner.component';
import { OriButtonComponent } from '../button/button.component';

const meta: Meta<OriSpinnerComponent> = {
  title: 'Primitives/Feedback/Spinner',
  component: OriSpinnerComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [OriSpinnerComponent, OriButtonComponent] })],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Indicateur de chargement compact (role="status", aria-label requis). Hérite de currentColor pour s\'intégrer dans un bouton, un texte ou un champ.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<OriSpinnerComponent>;

export const Default: Story = {
  args: { size: 'md', label: 'Chargement…' },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: 16px;">
        <ori-spinner size="sm"></ori-spinner>
        <ori-spinner size="md"></ori-spinner>
        <ori-spinner size="lg"></ori-spinner>
      </div>
    `,
  }),
};

export const InsideButton: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 12px;">
        <ori-button [disabled]="true">
          <ori-spinner size="sm" label="Envoi en cours…"></ori-spinner>
          <span>Envoi…</span>
        </ori-button>
        <ori-button variant="secondary" [disabled]="true">
          <ori-spinner size="sm"></ori-spinner>
        </ori-button>
      </div>
    `,
  }),
};

export const InlineInText: Story = {
  render: () => ({
    template: `
      <p style="display: flex; align-items: center; gap: 8px; margin: 0;">
        <ori-spinner size="sm" label="Vérification du numéro fiscal"></ori-spinner>
        Vérification du numéro fiscal en cours…
      </p>
    `,
  }),
};

export const CustomColor: Story = {
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: 16px; color: #dc2626;">
        <ori-spinner size="lg"></ori-spinner>
        <span>Hérite de currentColor</span>
      </div>
    `,
  }),
};
