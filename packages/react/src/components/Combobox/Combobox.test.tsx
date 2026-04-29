import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Combobox, type ComboboxOption } from './Combobox';

const options: ComboboxOption[] = [
  { id: 'a', label: 'Apple' },
  { id: 'b', label: 'Banane' },
  { id: 'c', label: 'Cerise' },
  { id: 'd', label: 'Datte (indisponible)', disabled: true },
];

function ControlledCombobox({ onValueChange }: { onValueChange?: (id?: string) => void }) {
  const [value, setValue] = useState<string | undefined>(undefined);
  return (
    <Combobox
      options={options}
      value={value}
      onValueChange={(v) => {
        setValue(v);
        onValueChange?.(v);
      }}
      label="Fruit"
      placeholder="Choisir"
    />
  );
}

describe('Combobox', () => {
  describe('rendu', () => {
    it('rend un input avec role="combobox"', () => {
      render(<ControlledCombobox />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('lie le label via aria-labelledby', () => {
      render(<ControlledCombobox />);
      const input = screen.getByRole('combobox');
      const labelledById = input.getAttribute('aria-labelledby');
      expect(labelledById).toBeTruthy();
      expect(document.getElementById(labelledById!)).toHaveTextContent('Fruit');
    });

    it('aria-expanded à false initialement', () => {
      render(<ControlledCombobox />);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    });

    it('ouvre la listbox au focus', async () => {
      const user = userEvent.setup();
      render(<ControlledCombobox />);
      await user.click(screen.getByRole('combobox'));
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
    });

    it('rend chaque option avec role="option"', async () => {
      const user = userEvent.setup();
      render(<ControlledCombobox />);
      await user.click(screen.getByRole('combobox'));
      expect(screen.getAllByRole('option')).toHaveLength(4);
    });
  });

  describe('filtrage', () => {
    it('filtre les options à la frappe (insensible à la casse)', async () => {
      const user = userEvent.setup();
      render(<ControlledCombobox />);
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.type(input, 'ban');
      const opts = screen.getAllByRole('option');
      expect(opts).toHaveLength(1);
      expect(opts[0]).toHaveTextContent('Banane');
    });

    it("affiche le message 'Aucun résultat' quand rien ne correspond", async () => {
      const user = userEvent.setup();
      render(<ControlledCombobox />);
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.type(input, 'xyz');
      expect(screen.queryAllByRole('option')).toHaveLength(0);
      expect(screen.getByText(/aucun résultat/i)).toBeInTheDocument();
    });
  });

  describe('sélection', () => {
    it('sélectionne une option au clic', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ControlledCombobox onValueChange={onChange} />);
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: /banane/i }));
      expect(onChange).toHaveBeenCalledWith('b');
      expect(screen.getByRole('combobox')).toHaveValue('Banane');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('marque la sélection avec aria-selected', async () => {
      const user = userEvent.setup();
      render(<ControlledCombobox />);
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: /apple/i }));
      // Réouvrir
      await user.click(screen.getByRole('combobox'));
      expect(screen.getByRole('option', { name: /apple/i })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });

    it('ne sélectionne pas une option disabled', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ControlledCombobox onValueChange={onChange} />);
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: /datte/i }));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('navigation clavier', () => {
    it('ArrowDown ouvre la liste et active la 1ère option', async () => {
      const user = userEvent.setup();
      render(<ControlledCombobox />);
      const input = screen.getByRole('combobox');
      input.focus();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      // La première option enabled est "Apple", donc aria-activedescendant doit pointer vers elle
      const apple = screen.getByRole('option', { name: /apple/i });
      expect(input).toHaveAttribute('aria-activedescendant', apple.id);
    });

    it("Entrée sélectionne l'option active", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ControlledCombobox onValueChange={onChange} />);
      const input = screen.getByRole('combobox');
      input.focus();
      await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
      expect(onChange).toHaveBeenCalledWith('b');
    });

    it('Escape ferme la liste sans changer la valeur', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ControlledCombobox onValueChange={onChange} />);
      const input = screen.getByRole('combobox');
      input.focus();
      await user.keyboard('{ArrowDown}{Escape}');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
