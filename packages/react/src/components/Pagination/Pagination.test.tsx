import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './Pagination';

function renderPag(page: number, totalPages: number, siblings = 1) {
  const onPageChange = vi.fn();
  const result = render(
    <Pagination
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      siblings={siblings}
    />,
  );
  return { ...result, onPageChange };
}

function visiblePages(): (number | '…')[] {
  const items = Array.from(document.querySelectorAll('ol > li'));
  // On ignore les boutons prev/next (1er et dernier)
  return items.slice(1, -1).map((li) => {
    const txt = li.textContent?.trim();
    if (txt === '…') return '…';
    return Number(txt);
  });
}

describe('Pagination', () => {
  describe('rendu compact (peu de pages)', () => {
    it('ne rend rien si totalPages <= 1 (rien à paginer)', () => {
      const { container } = render(<Pagination page={1} totalPages={1} onPageChange={vi.fn()} />);
      expect(container.firstChild).toBeNull();
    });

    it('affiche toutes les pages sans ellipse quand totalPages <= 2*siblings+5', () => {
      // siblings=1 → seuil = 7
      renderPag(3, 7, 1);
      expect(visiblePages()).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });
  });

  describe('rendu avec ellipses', () => {
    // Ex de la JSDoc : page=5, total=10, siblings=1 → [1, '...', 4, 5, 6, '...', 10]
    it('insère une ellipse à gauche et à droite quand la page est au milieu', () => {
      renderPag(5, 10, 1);
      expect(visiblePages()).toEqual([1, '…', 4, 5, 6, '…', 10]);
    });

    it("pas d'ellipse à gauche quand la page est proche du début", () => {
      renderPag(2, 10, 1);
      expect(visiblePages()).toEqual([1, 2, 3, '…', 10]);
    });

    it("pas d'ellipse à droite quand la page est proche de la fin", () => {
      renderPag(9, 10, 1);
      expect(visiblePages()).toEqual([1, '…', 8, 9, 10]);
    });

    it('siblings=2 élargit la fenêtre autour de la courante', () => {
      renderPag(6, 12, 2);
      expect(visiblePages()).toEqual([1, '…', 4, 5, 6, 7, 8, '…', 12]);
    });
  });

  describe('marquage de la page courante', () => {
    it('met aria-current="page" sur la page courante uniquement', () => {
      renderPag(3, 7);
      expect(screen.getByRole('button', { name: /Page 3, page courante/ })).toHaveAttribute(
        'aria-current',
        'page',
      );
      expect(screen.getByRole('button', { name: 'Page 1' })).not.toHaveAttribute('aria-current');
    });
  });

  describe('boutons précédent / suivant', () => {
    it('disable Précédent en page 1', () => {
      renderPag(1, 5);
      expect(screen.getByRole('button', { name: 'Page précédente' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Page suivante' })).toBeEnabled();
    });

    it('disable Suivant en dernière page', () => {
      renderPag(5, 5);
      expect(screen.getByRole('button', { name: 'Page précédente' })).toBeEnabled();
      expect(screen.getByRole('button', { name: 'Page suivante' })).toBeDisabled();
    });

    it('appelle onPageChange(page-1) au clic sur Précédent', async () => {
      const user = userEvent.setup();
      const { onPageChange } = renderPag(3, 5);
      await user.click(screen.getByRole('button', { name: 'Page précédente' }));
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('appelle onPageChange(page+1) au clic sur Suivant', async () => {
      const user = userEvent.setup();
      const { onPageChange } = renderPag(3, 5);
      await user.click(screen.getByRole('button', { name: 'Page suivante' }));
      expect(onPageChange).toHaveBeenCalledWith(4);
    });
  });

  describe('clic sur une page', () => {
    it('appelle onPageChange(p) au clic sur une autre page', async () => {
      const user = userEvent.setup();
      const { onPageChange } = renderPag(2, 5);
      await user.click(screen.getByRole('button', { name: 'Page 4' }));
      expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it("n'appelle pas onPageChange au clic sur la page courante", async () => {
      const user = userEvent.setup();
      const { onPageChange } = renderPag(3, 5);
      await user.click(screen.getByRole('button', { name: /Page 3, page courante/ }));
      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe('accessibilité', () => {
    it('rend un <nav> avec aria-label par défaut "Pagination"', () => {
      renderPag(1, 5);
      expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    });

    it("permet d'override aria-label", () => {
      render(
        <Pagination
          page={1}
          totalPages={3}
          onPageChange={vi.fn()}
          aria-label="Pagination des résultats"
        />,
      );
      expect(
        screen.getByRole('navigation', { name: 'Pagination des résultats' }),
      ).toBeInTheDocument();
    });

    it("marque les ellipses aria-hidden (lecteurs d'écran)", () => {
      renderPag(5, 10);
      const ellipses = document.querySelectorAll('.ori-pagination__ellipsis');
      expect(ellipses.length).toBeGreaterThan(0);
      ellipses.forEach((e) => expect(e).toHaveAttribute('aria-hidden', 'true'));
    });
  });
});
