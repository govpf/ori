import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { MultiSelect, type MultiSelectOption } from './MultiSelect';

const options: MultiSelectOption[] = [
  { id: 'a', label: 'Apple' },
  { id: 'b', label: 'Banane' },
  { id: 'c', label: 'Cerise' },
  { id: 'd', label: 'Datte (indisponible)', disabled: true },
];

function ControlledMultiSelect({
  initial = [],
  onChange,
  maxSelected,
}: {
  initial?: string[];
  onChange?: (v: string[]) => void;
  maxSelected?: number;
}) {
  const [values, setValues] = useState<string[]>(initial);
  return (
    <MultiSelect
      options={options}
      values={values}
      onValuesChange={(v) => {
        setValues(v);
        onChange?.(v);
      }}
      label="Fruits"
      placeholder="Choisir"
      maxSelected={maxSelected}
    />
  );
}

describe('MultiSelect', () => {
  describe('rendu', () => {
    it('rend un input avec role="combobox"', () => {
      render(<ControlledMultiSelect />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('rend une listbox avec aria-multiselectable au focus', async () => {
      const user = userEvent.setup();
      render(<ControlledMultiSelect />);
      await user.click(screen.getByRole('combobox'));
      const listbox = screen.getByRole('listbox');
      expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('rend chaque option avec aria-selected initialisé à false', async () => {
      const user = userEvent.setup();
      render(<ControlledMultiSelect />);
      await user.click(screen.getByRole('combobox'));
      const opts = screen.getAllByRole('option');
      opts.forEach((o) => expect(o).toHaveAttribute('aria-selected', 'false'));
    });

    it('rend les options déjà sélectionnées en aria-selected=true', async () => {
      const user = userEvent.setup();
      render(<ControlledMultiSelect initial={['a']} />);
      await user.click(screen.getByRole('combobox'));
      expect(screen.getByRole('option', { name: /apple/i })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });
  });

  describe('sélection', () => {
    it('ajoute une sélection au clic', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ControlledMultiSelect onChange={onChange} />);
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: /banane/i }));
      expect(onChange).toHaveBeenLastCalledWith(['b']);
    });

    it('ajoute plusieurs sélections', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ControlledMultiSelect onChange={onChange} />);
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: /apple/i }));
      await user.click(screen.getByRole('option', { name: /cerise/i }));
      expect(onChange).toHaveBeenLastCalledWith(['a', 'c']);
    });

    it('retire une sélection au re-clic', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ControlledMultiSelect initial={['a', 'b']} onChange={onChange} />);
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: /apple/i }));
      expect(onChange).toHaveBeenLastCalledWith(['b']);
    });

    it('rend les tags des sélections avec un bouton de suppression', () => {
      render(<ControlledMultiSelect initial={['a', 'b']} />);
      expect(screen.getByRole('button', { name: /retirer apple/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retirer banane/i })).toBeInTheDocument();
    });

    it('retire une sélection en cliquant sur la croix du tag', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ControlledMultiSelect initial={['a', 'b']} onChange={onChange} />);
      await user.click(screen.getByRole('button', { name: /retirer apple/i }));
      expect(onChange).toHaveBeenLastCalledWith(['b']);
    });

    it('ne sélectionne pas une option disabled', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ControlledMultiSelect onChange={onChange} />);
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: /datte/i }));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('limite max', () => {
    it('bloque les sélections supplémentaires quand maxSelected est atteint', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ControlledMultiSelect initial={['a']} maxSelected={1} onChange={onChange} />);
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: /banane/i }));
      expect(onChange).not.toHaveBeenCalled();
    });

    it('permet de retirer une sélection même si la limite est atteinte', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ControlledMultiSelect initial={['a']} maxSelected={1} onChange={onChange} />);
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: /apple/i }));
      expect(onChange).toHaveBeenLastCalledWith([]);
    });
  });

  describe('navigation clavier', () => {
    it('Backspace retire la dernière sélection si la query est vide', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ControlledMultiSelect initial={['a', 'b']} onChange={onChange} />);
      const input = screen.getByRole('combobox');
      input.focus();
      await user.keyboard('{Backspace}');
      expect(onChange).toHaveBeenLastCalledWith(['a']);
    });

    it("Entrée toggle l'option active", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ControlledMultiSelect onChange={onChange} />);
      const input = screen.getByRole('combobox');
      input.focus();
      await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
      expect(onChange).toHaveBeenLastCalledWith(['b']);
    });

    it('Escape ferme la liste', async () => {
      const user = userEvent.setup();
      render(<ControlledMultiSelect />);
      const input = screen.getByRole('combobox');
      await user.click(input);
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('virtualisation', () => {
    it("ne monte qu'un sous-ensemble du DOM pour 1000 options", async () => {
      const user = userEvent.setup();
      const big: MultiSelectOption[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `o-${i}`,
        label: `Option ${i}`,
      }));
      render(
        <MultiSelect options={big} values={[]} label="L" listboxHeight={240} optionHeight={36} />,
      );
      await user.click(screen.getByRole('combobox'));
      // Avec listboxHeight=240 et optionHeight=36, on a ~7 options visibles +
      // buffer (4 avant + 4 après) → quelques dizaines d'options dans le DOM,
      // pas 1000.
      const opts = screen.getAllByRole('option');
      expect(opts.length).toBeLessThan(50);
      expect(opts.length).toBeGreaterThan(5);
    });
  });
});
