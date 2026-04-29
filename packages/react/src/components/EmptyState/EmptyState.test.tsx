import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('rend un titre h3', () => {
    render(<EmptyState title="Aucune donnée" />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Aucune donnée');
  });

  it('rend la description quand fournie', () => {
    render(<EmptyState title="Vide" description="Ajoutez du contenu pour commencer." />);
    expect(screen.getByText(/ajoutez du contenu/i)).toBeInTheDocument();
  });

  it('ne rend pas de paragraphe sans description', () => {
    const { container } = render(<EmptyState title="Vide" />);
    expect(container.querySelector('.ori-empty-state__description')).toBeNull();
  });

  it("rend l'icône avec aria-hidden", () => {
    const { container } = render(<EmptyState title="Vide" icon={<svg data-testid="icon" />} />);
    const wrap = container.querySelector('.ori-empty-state__icon');
    expect(wrap).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('rend les actions quand fournies', () => {
    render(
      <EmptyState
        title="Vide"
        actions={
          <>
            <button>Action A</button>
            <button>Action B</button>
          </>
        }
      />,
    );
    expect(screen.getByRole('button', { name: 'Action A' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action B' })).toBeInTheDocument();
  });

  it('applique la classe de taille sm', () => {
    const { container } = render(<EmptyState title="Vide" size="sm" />);
    expect(container.firstChild).toHaveClass('ori-empty-state--sm');
  });

  it('applique la classe de taille lg', () => {
    const { container } = render(<EmptyState title="Vide" size="lg" />);
    expect(container.firstChild).toHaveClass('ori-empty-state--lg');
  });

  it('md est la taille par défaut', () => {
    const { container } = render(<EmptyState title="Vide" />);
    expect(container.firstChild).toHaveClass('ori-empty-state--md');
  });
});
