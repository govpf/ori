import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Highlight } from './Highlight';

describe('Highlight', () => {
  describe('mode 1 : sans prop query', () => {
    it('surligne tout le contenu dans un <mark>', () => {
      render(<Highlight>important</Highlight>);
      const mark = screen.getByText('important');
      expect(mark.tagName).toBe('MARK');
      expect(mark).toHaveClass('ori-highlight');
    });

    it('accepte du JSX comme children', () => {
      render(
        <Highlight>
          <span data-testid="inner">contenu</span>
        </Highlight>,
      );
      expect(screen.getByTestId('inner').parentElement?.tagName).toBe('MARK');
    });
  });

  describe('mode 2 : recherche inactive (query="")', () => {
    it('rend les children tels quels sans <mark>', () => {
      const { container } = render(<Highlight query="">titre</Highlight>);
      expect(container.querySelector('mark')).toBeNull();
      expect(container.textContent).toBe('titre');
    });

    // Régression : avant le fix, query="" était traité comme "pas de
    // query" et surlignait tout le contenu. C'est le bug qui surlignait
    // les descriptions des cards quand l'input de recherche était vide.
    it("ne surligne rien quand l'input de recherche est vide (régression)", () => {
      const { container } = render(<Highlight query="">Description complète</Highlight>);
      expect(container.querySelectorAll('mark')).toHaveLength(0);
    });

    it('rend les children tels quels même si non-string', () => {
      render(
        <Highlight query="ti">
          <span data-testid="inner">titre</span>
        </Highlight>,
      );
      // children non-string + query non-vide → impossible de matcher,
      // donc pas de surlignage
      expect(screen.getByTestId('inner').closest('mark')).toBeNull();
    });
  });

  describe('mode 2 : recherche active', () => {
    it('surligne une seule occurrence', () => {
      const { container } = render(<Highlight query="ti">titre</Highlight>);
      const marks = container.querySelectorAll('mark');
      expect(marks).toHaveLength(1);
      expect(marks[0]).toHaveTextContent('ti');
    });

    it('surligne plusieurs occurrences', () => {
      const { container } = render(<Highlight query="a">papa banane</Highlight>);
      const marks = container.querySelectorAll('mark');
      expect(marks).toHaveLength(4);
      marks.forEach((m) => expect(m).toHaveTextContent('a'));
    });

    it('match insensible à la casse', () => {
      const { container } = render(<Highlight query="LICE">Licence professionnelle</Highlight>);
      const marks = container.querySelectorAll('mark');
      expect(marks).toHaveLength(1);
      // Le texte affiché conserve la casse d'origine, pas celle de query
      expect(marks[0]).toHaveTextContent('Lice');
    });

    it('ne surligne rien quand le query ne match pas', () => {
      const { container } = render(<Highlight query="xyz">titre</Highlight>);
      expect(container.querySelectorAll('mark')).toHaveLength(0);
      expect(container.textContent).toBe('titre');
    });

    it('préserve le texte non-matché entre les surlignages', () => {
      const { container } = render(<Highlight query="b">abcabc</Highlight>);
      // Texte rendu : a + <mark>b</mark> + ca + <mark>b</mark> + c
      expect(container.textContent).toBe('abcabc');
      expect(container.querySelectorAll('mark')).toHaveLength(2);
    });

    it('applique className sur les <mark> générés', () => {
      const { container } = render(
        <Highlight query="a" className="custom">
          banane
        </Highlight>,
      );
      const marks = container.querySelectorAll('mark');
      expect(marks.length).toBeGreaterThan(0);
      marks.forEach((m) => {
        expect(m).toHaveClass('ori-highlight');
        expect(m).toHaveClass('custom');
      });
    });
  });
});
