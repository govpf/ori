import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MultiSelect, type MultiSelectOption } from './MultiSelect.js';

const meta = {
  title: 'Composants/Inputs/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const services: MultiSelectOption[] = [
  { id: 'dgi', label: 'Direction générale des impôts' },
  { id: 'dasn', label: 'Direction des affaires sanitaires et sociales' },
  { id: 'dge', label: 'Direction de la jeunesse et des sports' },
  { id: 'dpac', label: 'Direction du patrimoine, des archives et de la culture' },
  { id: 'dttn', label: 'Direction du transport terrestre numérique' },
  { id: 'darm', label: 'Direction des affaires maritimes' },
  { id: 'dre', label: 'Direction des ressources humaines' },
  { id: 'dge2', label: "Direction générale de l'environnement" },
  { id: 'dgae', label: 'Direction générale des affaires économiques' },
];

/** Cas standard : peu d'options, sans virtualisation perçue. */
export const Default: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>([]);
    return (
      <div style={{ width: 480 }}>
        <MultiSelect
          options={services}
          values={values}
          onValuesChange={setValues}
          label="Services concernés"
          placeholder="Sélectionnez un ou plusieurs services…"
        />
      </div>
    );
  },
};

/** Cas large : 5 000 options générées, démontre la virtualisation. */
export const Virtualized5000: Story = {
  render: () => {
    const opts: MultiSelectOption[] = Array.from({ length: 5000 }, (_, i) => ({
      id: `opt-${i}`,
      label: `Option ${(i + 1).toString().padStart(4, '0')} - exemple de label long pour tester le rendu`,
    }));
    const [values, setValues] = useState<string[]>([]);
    return (
      <div style={{ width: 600 }}>
        <p style={{ marginTop: 0 }}>
          5 000 options dans la liste. Le DOM ne contient qu'une dizaine d'éléments en permanence ;
          les autres sont rendus à la demande au scroll.
        </p>
        <MultiSelect
          options={opts}
          values={values}
          onValuesChange={setValues}
          label="Sélectionnez des options"
          placeholder="Tapez pour filtrer…"
        />
      </div>
    );
  },
};

/** Limite à 3 sélections : les autres options se grisent quand la limite est atteinte. */
export const WithMaxLimit: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>([]);
    return (
      <div style={{ width: 480 }}>
        <p style={{ marginTop: 0 }}>
          Limite à 3 sélections. Au-delà, les autres options apparaissent grisées tant qu'on n'en
          retire pas une.
        </p>
        <MultiSelect
          options={services}
          values={values}
          onValuesChange={setValues}
          label="Services prioritaires"
          placeholder="3 maximum"
          maxSelected={3}
        />
      </div>
    );
  },
};

export const WithDisabledOption: Story = {
  render: () => {
    const opts: MultiSelectOption[] = [
      { id: 'a', label: 'Option A' },
      { id: 'b', label: 'Option B (indisponible)', disabled: true },
      { id: 'c', label: 'Option C' },
      { id: 'd', label: 'Option D' },
    ];
    const [values, setValues] = useState<string[]>(['a']);
    return (
      <div style={{ width: 360 }}>
        <MultiSelect
          options={opts}
          values={values}
          onValuesChange={setValues}
          label="Choix multiples"
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <MultiSelect options={services} values={['dgi', 'dge']} label="Services concernés" disabled />
    </div>
  ),
};
