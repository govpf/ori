import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from './DropdownMenu';

function setup(extra: { onModifier?: () => void; onSupprimer?: () => void } = {}) {
  return render(
    <DropdownMenu>
      <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions disponibles</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={extra.onModifier}>Modifier</DropdownMenuItem>
        <DropdownMenuItem disabled>Partager</DropdownMenuItem>
        <DropdownMenuItem destructive onSelect={extra.onSupprimer}>
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>,
  );
}

describe('DropdownMenu', () => {
  describe('rendu', () => {
    it('rend un trigger avec aria-haspopup="menu"', () => {
      setup();
      const trigger = screen.getByRole('button', { name: 'Actions' });
      expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('ne rend pas le menu quand fermé', () => {
      setup();
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('ouvre le menu au clic sur le trigger', async () => {
      const user = userEvent.setup();
      setup();
      const trigger = screen.getByRole('button', { name: 'Actions' });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await user.click(trigger);
      expect(screen.getByRole('menu')).toBeInTheDocument();
      // Une fois le menu ouvert, Radix marque le trigger aria-hidden ; on lit
      // donc l'attribut directement plutôt que via getByRole.
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('rend chaque item avec role="menuitem"', async () => {
      const user = userEvent.setup();
      setup();
      await user.click(screen.getByRole('button', { name: 'Actions' }));
      const items = screen.getAllByRole('menuitem');
      // 3 items (Modifier, Partager disabled, Supprimer) ; le label n'est pas un menuitem
      expect(items).toHaveLength(3);
    });

    it('marque les items disabled avec aria-disabled', async () => {
      const user = userEvent.setup();
      setup();
      await user.click(screen.getByRole('button', { name: 'Actions' }));
      expect(screen.getByRole('menuitem', { name: 'Partager' })).toHaveAttribute(
        'data-disabled',
        '',
      );
    });

    it('applique la classe destructive aux items destructive', async () => {
      const user = userEvent.setup();
      setup();
      await user.click(screen.getByRole('button', { name: 'Actions' }));
      expect(screen.getByRole('menuitem', { name: 'Supprimer' })).toHaveClass(
        'ori-dropdown-menu__item--destructive',
      );
    });
  });

  describe('sélection', () => {
    it('appelle onSelect au clic sur un item', async () => {
      const user = userEvent.setup();
      const onModifier = vi.fn();
      setup({ onModifier });
      await user.click(screen.getByRole('button', { name: 'Actions' }));
      await user.click(screen.getByRole('menuitem', { name: 'Modifier' }));
      expect(onModifier).toHaveBeenCalledTimes(1);
    });

    it("ferme le menu après sélection d'un item", async () => {
      const user = userEvent.setup();
      setup();
      await user.click(screen.getByRole('button', { name: 'Actions' }));
      await user.click(screen.getByRole('menuitem', { name: 'Modifier' }));
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it("n'appelle pas onSelect sur un item disabled", async () => {
      const user = userEvent.setup();
      const onShare = vi.fn();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem disabled onSelect={onShare}>
              Partager
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      await user.click(screen.getByRole('button', { name: 'Actions' }));
      await user.click(screen.getByRole('menuitem', { name: 'Partager' }));
      expect(onShare).not.toHaveBeenCalled();
    });
  });

  describe('navigation clavier', () => {
    it('ferme le menu sur Escape', async () => {
      const user = userEvent.setup();
      setup();
      await user.click(screen.getByRole('button', { name: 'Actions' }));
      expect(screen.getByRole('menu')).toBeInTheDocument();
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('déclenche onSelect sur Entrée', async () => {
      const user = userEvent.setup();
      const onModifier = vi.fn();
      setup({ onModifier });
      const trigger = screen.getByRole('button', { name: 'Actions' });
      trigger.focus();
      await user.keyboard('{Enter}');
      // Radix focus le premier item ouvert au clavier
      await user.keyboard('{Enter}');
      expect(onModifier).toHaveBeenCalledTimes(1);
    });
  });

  describe('contrôlé', () => {
    it('respecte la prop open', () => {
      render(
        <DropdownMenu open={true}>
          <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Modifier</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it("appelle onOpenChange à l'ouverture", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <DropdownMenu onOpenChange={onOpenChange}>
          <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Modifier</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      await user.click(screen.getByRole('button', { name: 'Actions' }));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });
});
