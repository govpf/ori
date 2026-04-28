import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from './Checkbox.js';

const meta = {
  title: 'Composants/Saisie/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Case à cocher binaire (checked/unchecked) avec état indéterminé optionnel. Hérite des patterns ori-field (label, hint, error, ARIA).',
      },
    },
  },
  argTypes: {
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
  args: {
    label: "J'accepte les conditions générales",
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const WithHint: Story = {
  args: {
    hint: 'Vous pouvez retirer votre consentement à tout moment depuis vos préférences.',
  },
};

export const WithError: Story = {
  args: {
    error: 'Vous devez accepter les conditions pour continuer.',
  },
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Sélectionner toutes les lignes' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true, label: 'Option verrouillée' },
};

export const Group: Story = {
  render: () => (
    <fieldset className="ori-choice-group" style={{ border: 0, padding: 0, margin: 0 }}>
      <legend className="ori-field__label">Notifications par email</legend>
      <Checkbox defaultChecked label="Rappels de rendez-vous" />
      <Checkbox label="Lettre d'information mensuelle" />
      <Checkbox label="Mises à jour produit" />
    </fieldset>
  ),
};

/**
 * Pattern "select all" : le parent est indéterminé tant que la sélection
 * d'enfants est partielle, checked si tous sont sélectionnés.
 */
export const SelectAll: Story = {
  render: () => {
    const [items, setItems] = useState([
      { id: 1, label: 'Document A.pdf', selected: true },
      { id: 2, label: 'Document B.pdf', selected: false },
      { id: 3, label: 'Document C.pdf', selected: false },
    ]);
    const selectedCount = items.filter((i) => i.selected).length;
    const allSelected = selectedCount === items.length;
    const indeterminate = selectedCount > 0 && !allSelected;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Checkbox
          label={`Tout sélectionner (${selectedCount}/${items.length})`}
          checked={allSelected}
          indeterminate={indeterminate}
          onChange={(e) => setItems(items.map((i) => ({ ...i, selected: e.target.checked })))}
        />
        <div className="ori-choice-group" style={{ paddingLeft: 24 }}>
          {items.map((item) => (
            <Checkbox
              key={item.id}
              label={item.label}
              checked={item.selected}
              onChange={(e) =>
                setItems(
                  items.map((i) => (i.id === item.id ? { ...i, selected: e.target.checked } : i)),
                )
              }
            />
          ))}
        </div>
      </div>
    );
  },
};
