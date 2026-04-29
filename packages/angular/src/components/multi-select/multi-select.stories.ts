import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriMultiSelectComponent, type OriMultiSelectOption } from './multi-select.component';

const services: OriMultiSelectOption[] = [
  { id: 'dgi', label: 'Direction générale des impôts' },
  { id: 'dasn', label: 'Direction des affaires sanitaires et sociales' },
  { id: 'dge', label: 'Direction de la jeunesse et des sports' },
  { id: 'dpac', label: 'Direction du patrimoine, des archives et de la culture' },
  { id: 'dttn', label: 'Direction du transport terrestre numérique' },
  { id: 'darm', label: 'Direction des affaires maritimes' },
  { id: 'dre', label: 'Direction des ressources humaines' },
];

const meta: Meta<OriMultiSelectComponent> = {
  title: 'Composants/Inputs/MultiSelect',
  component: OriMultiSelectComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [OriMultiSelectComponent] })],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "Multi-sélection virtualisée. Pattern listbox aria-multiselectable, navigation clavier complète, tags supprimables, supporte plusieurs milliers d'options sans pénaliser le rendu.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<OriMultiSelectComponent>;

export const Default: Story = {
  render: () => ({
    props: {
      options: services,
      values: [] as string[],
      onChange(v: string[]) {
        (this as any).values = v;
      },
    },
    template: `
      <div style="width: 480px;">
        <ori-multi-select
          [options]="options"
          [values]="values"
          label="Services concernés"
          placeholder="Sélectionnez un ou plusieurs services…"
          (valuesChange)="onChange($event)"
        ></ori-multi-select>
      </div>
    `,
  }),
};

export const Virtualized5000: Story = {
  render: () => ({
    props: {
      options: Array.from({ length: 5000 }, (_, i) => ({
        id: `opt-${i}`,
        label: `Option ${(i + 1).toString().padStart(4, '0')} - exemple de label long pour tester le rendu`,
      })) as OriMultiSelectOption[],
      values: [] as string[],
      onChange(v: string[]) {
        (this as any).values = v;
      },
    },
    template: `
      <div style="width: 600px;">
        <p style="margin-top: 0;">
          5 000 options dans la liste. Le DOM ne contient qu'une dizaine
          d'éléments en permanence ; les autres sont rendus à la demande au scroll.
        </p>
        <ori-multi-select
          [options]="options"
          [values]="values"
          label="Sélectionnez des options"
          placeholder="Tapez pour filtrer…"
          (valuesChange)="onChange($event)"
        ></ori-multi-select>
      </div>
    `,
  }),
};

export const WithMaxLimit: Story = {
  render: () => ({
    props: {
      options: services,
      values: [] as string[],
      onChange(v: string[]) {
        (this as any).values = v;
      },
    },
    template: `
      <div style="width: 480px;">
        <p style="margin-top: 0;">
          Limite à 3 sélections. Au-delà, les autres options apparaissent
          grisées tant qu'on n'en retire pas une.
        </p>
        <ori-multi-select
          [options]="options"
          [values]="values"
          [maxSelected]="3"
          label="Services prioritaires"
          placeholder="3 maximum"
          (valuesChange)="onChange($event)"
        ></ori-multi-select>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    props: { options: services },
    template: `
      <div style="width: 360px;">
        <ori-multi-select
          [options]="options"
          [values]="['dgi', 'dge']"
          label="Services concernés"
          [disabled]="true"
        ></ori-multi-select>
      </div>
    `,
  }),
};
