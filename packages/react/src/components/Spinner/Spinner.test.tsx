import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('rend un élément avec role="status"', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('utilise le label par défaut "Chargement…"', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Chargement…');
  });

  it('respecte le label personnalisé', () => {
    render(<Spinner label="Vérification…" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Vérification…');
  });

  it('applique la classe de taille sm', () => {
    render(<Spinner size="sm" />);
    expect(screen.getByRole('status')).toHaveClass('ori-spinner', 'ori-spinner--sm');
  });

  it('applique la classe de taille lg', () => {
    render(<Spinner size="lg" />);
    expect(screen.getByRole('status')).toHaveClass('ori-spinner--lg');
  });

  it('rend un SVG aria-hidden pour ne pas dupliquer le label', () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
  });

  it('fusionne une className additionnelle', () => {
    render(<Spinner className="ml-2" />);
    expect(screen.getByRole('status')).toHaveClass('ori-spinner', 'ml-2');
  });
});
