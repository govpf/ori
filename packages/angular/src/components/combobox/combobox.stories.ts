import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriComboboxComponent, type OriComboboxOption } from './combobox.component';

const services: OriComboboxOption[] = [
  { id: 'dgi', label: 'Direction générale des impôts' },
  { id: 'dasn', label: 'Direction des affaires sanitaires et sociales' },
  { id: 'dge', label: 'Direction de la jeunesse et des sports' },
  { id: 'dpac', label: 'Direction du patrimoine, des archives et de la culture' },
  { id: 'dttn', label: 'Direction du transport terrestre numérique' },
  { id: 'darm', label: 'Direction des affaires maritimes' },
  { id: 'dre', label: 'Direction des ressources humaines' },
];

const archipels: OriComboboxOption[] = [
  { id: 'soc', label: 'Société', description: 'Tahiti, Moorea, Bora Bora…' },
  { id: 'tua', label: 'Tuamotu', description: '76 atolls habités' },
  { id: 'mar', label: 'Marquises', description: '6 îles habitées' },
  { id: 'gam', label: 'Gambier', description: 'Mangareva et environs' },
  { id: 'aus', label: 'Australes', description: 'Rurutu, Tubuai, Rimatara…' },
];

const meta: Meta<OriComboboxComponent> = {
  title: 'Primitives/Saisie/Combobox',
  component: OriComboboxComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [OriComboboxComponent] })],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "Combobox / Autocomplete data-driven (pattern WAI-ARIA combobox v1.2). Filtre à la frappe, navigation clavier complète, sélection à l'Entrée ou au clic.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<OriComboboxComponent>;

export const Default: Story = {
  render: () => ({
    props: {
      options: services,
      value: undefined as string | undefined,
      onChange(id: string | undefined) {
        (this as any).value = id;
      },
    },
    template: `
      <div style="width: 360px;">
        <ori-combobox
          [options]="options"
          [value]="value"
          label="Service administratif"
          placeholder="Tapez pour rechercher…"
          (valueChange)="onChange($event)"
        ></ori-combobox>
      </div>
    `,
  }),
};

export const WithDescription: Story = {
  render: () => ({
    props: {
      options: archipels,
      value: 'soc' as string | undefined,
      onChange(id: string | undefined) {
        (this as any).value = id;
      },
    },
    template: `
      <div style="width: 360px;">
        <ori-combobox
          [options]="options"
          [value]="value"
          label="Archipel"
          placeholder="Sélectionnez un archipel"
          (valueChange)="onChange($event)"
        ></ori-combobox>
      </div>
    `,
  }),
};

export const WithDisabledOption: Story = {
  render: () => ({
    props: {
      options: [
        { id: 'a', label: 'Option A' },
        { id: 'b', label: 'Option B (indisponible)', disabled: true },
        { id: 'c', label: 'Option C' },
      ] as OriComboboxOption[],
      value: undefined as string | undefined,
      onChange(id: string | undefined) {
        (this as any).value = id;
      },
    },
    template: `
      <div style="width: 360px;">
        <ori-combobox
          [options]="options"
          [value]="value"
          label="Choix"
          placeholder="Choisir une option"
          (valueChange)="onChange($event)"
        ></ori-combobox>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    props: { options: services },
    template: `
      <div style="width: 360px;">
        <ori-combobox
          [options]="options"
          value="dgi"
          label="Service administratif"
          [disabled]="true"
        ></ori-combobox>
      </div>
    `,
  }),
};
