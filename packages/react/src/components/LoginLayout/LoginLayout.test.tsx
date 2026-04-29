import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoginLayout } from './LoginLayout';

describe('LoginLayout', () => {
  it('rend un h1 avec le titre', () => {
    render(<LoginLayout title="Se connecter">x</LoginLayout>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Se connecter');
  });

  it('rend la description quand fournie', () => {
    render(
      <LoginLayout title="x" description="Accédez à votre espace.">
        y
      </LoginLayout>,
    );
    expect(screen.getByText('Accédez à votre espace.')).toBeInTheDocument();
  });

  it('ne rend pas de paragraphe sans description', () => {
    const { container } = render(<LoginLayout title="x">y</LoginLayout>);
    expect(container.querySelector('.ori-login-layout__description')).toBeNull();
  });

  it('rend le logo quand fourni', () => {
    render(
      <LoginLayout logo={<span data-testid="logo">L</span>} title="x">
        y
      </LoginLayout>,
    );
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });

  it('ne rend pas de zone logo sans prop logo', () => {
    const { container } = render(<LoginLayout title="x">y</LoginLayout>);
    expect(container.querySelector('.ori-login-layout__logo')).toBeNull();
  });

  it('rend le cardFooter quand fourni', () => {
    render(
      <LoginLayout title="x" cardFooter={<a href="#">Aide</a>}>
        y
      </LoginLayout>,
    );
    expect(screen.getByRole('link', { name: 'Aide' })).toBeInTheDocument();
  });

  it('rend le footer quand fourni', () => {
    render(
      <LoginLayout title="x" footer={<span>© 2026</span>}>
        y
      </LoginLayout>,
    );
    expect(screen.getByText('© 2026')).toBeInTheDocument();
  });

  it('rend le contenu principal', () => {
    render(
      <LoginLayout title="x">
        <button>Se connecter</button>
      </LoginLayout>,
    );
    expect(screen.getByRole('button', { name: 'Se connecter' })).toBeInTheDocument();
  });
});
