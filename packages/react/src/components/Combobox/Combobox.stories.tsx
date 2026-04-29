import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Combobox, type ComboboxOption } from './Combobox.js';

const meta = {
  title: 'Composants/Inputs/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

const services: ComboboxOption[] = [
  { id: 'dgi', label: 'Direction générale des impôts' },
  { id: 'dasn', label: 'Direction des affaires sanitaires et sociales' },
  { id: 'dge', label: 'Direction de la jeunesse et des sports' },
  { id: 'dpac', label: 'Direction du patrimoine, des archives et de la culture' },
  { id: 'dttn', label: 'Direction du transport terrestre numérique' },
  { id: 'darm', label: 'Direction des affaires maritimes' },
  { id: 'dre', label: 'Direction des ressources humaines' },
];

const archipels: ComboboxOption[] = [
  { id: 'soc', label: 'Société', description: 'Tahiti, Moorea, Bora Bora…' },
  { id: 'tua', label: 'Tuamotu', description: '76 atolls habités' },
  { id: 'mar', label: 'Marquises', description: '6 îles habitées' },
  { id: 'gam', label: 'Gambier', description: 'Mangareva et environs' },
  { id: 'aus', label: 'Australes', description: 'Rurutu, Tubuai, Rimatara…' },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <div style={{ width: 360 }}>
        <Combobox
          options={services}
          value={value}
          onValueChange={setValue}
          label="Service administratif"
          placeholder="Tapez pour rechercher…"
        />
      </div>
    );
  },
};

export const WithDescription: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>('soc');
    return (
      <div style={{ width: 360 }}>
        <Combobox
          options={archipels}
          value={value}
          onValueChange={setValue}
          label="Archipel"
          placeholder="Sélectionnez un archipel"
        />
      </div>
    );
  },
};

export const WithDisabledOption: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined);
    const opts: ComboboxOption[] = [
      { id: 'a', label: 'Option A' },
      { id: 'b', label: 'Option B (indisponible)', disabled: true },
      { id: 'c', label: 'Option C' },
    ];
    return (
      <div style={{ width: 360 }}>
        <Combobox
          options={opts}
          value={value}
          onValueChange={setValue}
          label="Choix"
          placeholder="Choisir une option"
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <Combobox options={services} value="dgi" label="Service administratif" disabled />
    </div>
  ),
};

export const NoResults: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <div style={{ width: 360 }}>
        <p style={{ marginTop: 0 }}>
          Tapez un texte qui ne correspond à aucun service pour voir le message "Aucun résultat".
        </p>
        <Combobox
          options={services}
          value={value}
          onValueChange={setValue}
          label="Service administratif"
          placeholder="Essayez 'xxx'"
          noResultsLabel="Aucun service ne correspond"
        />
      </div>
    );
  },
};
