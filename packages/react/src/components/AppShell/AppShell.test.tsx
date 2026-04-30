import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppShell } from './AppShell';

describe('AppShell', () => {
  it('rend un main avec id et tabindex pour le skip link', () => {
    render(<AppShell>contenu</AppShell>);
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('id', 'ori-app-shell-main');
    expect(main).toHaveAttribute('tabindex', '-1');
  });

  it('rend le skip link en première position', () => {
    render(<AppShell>contenu</AppShell>);
    const link = screen.getByRole('link', { name: /aller au contenu principal/i });
    expect(link).toHaveAttribute('href', '#ori-app-shell-main');
  });

  it('respecte le label personnalisé du skip link', () => {
    render(<AppShell skipLinkLabel="Skip to content">x</AppShell>);
    expect(screen.getByRole('link', { name: 'Skip to content' })).toBeInTheDocument();
  });

  it('rend le header quand fourni', () => {
    render(<AppShell header={<header>Mon header</header>}>x</AppShell>);
    expect(screen.getByRole('banner')).toHaveTextContent('Mon header');
  });

  it('ne rend pas de zone header sans prop header', () => {
    const { container } = render(<AppShell>x</AppShell>);
    expect(container.querySelector('.ori-app-shell__header')).toBeNull();
  });

  it('rend la sidebar comme aside quand fournie', () => {
    render(<AppShell sidebar={<nav>Nav</nav>}>x</AppShell>);
    expect(screen.getByRole('complementary')).toHaveAttribute('aria-label', 'Navigation latérale');
  });

  it('ne rend pas de sidebar sans prop sidebar', () => {
    const { container } = render(<AppShell>x</AppShell>);
    expect(container.querySelector('.ori-app-shell__sidebar')).toBeNull();
  });

  it('rend le footer quand fourni', () => {
    render(<AppShell footer={<footer>Pied</footer>}>x</AppShell>);
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Pied');
  });

  it('applique la classe sidebar-open quand sidebarOpen=true', () => {
    const { container } = render(
      <AppShell sidebar={<nav>x</nav>} sidebarOpen>
        x
      </AppShell>,
    );
    expect(container.firstChild).toHaveClass('ori-app-shell--sidebar-open');
  });

  it('applique sidebar-open par défaut (sidebar visible sans pilotage)', () => {
    const { container } = render(<AppShell sidebar={<nav>x</nav>}>x</AppShell>);
    expect(container.firstChild).toHaveClass('ori-app-shell--sidebar-open');
  });

  it('retire la classe sidebar-open quand sidebarOpen={false}', () => {
    const { container } = render(
      <AppShell sidebar={<nav>x</nav>} sidebarOpen={false}>
        x
      </AppShell>,
    );
    expect(container.firstChild).not.toHaveClass('ori-app-shell--sidebar-open');
  });

  it('appelle onSidebarOpenChange(false) au clic sur le scrim', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <AppShell sidebar={<nav>x</nav>} sidebarOpen onSidebarOpenChange={onOpenChange}>
        x
      </AppShell>,
    );
    await user.click(screen.getByRole('button', { name: /fermer le menu/i }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('ferme la sidebar sur Escape', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <AppShell sidebar={<nav>x</nav>} sidebarOpen onSidebarOpenChange={onOpenChange}>
        x
      </AppShell>,
    );
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("Escape n'a aucun effet si la sidebar n'est pas ouverte", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <AppShell sidebar={<nav>x</nav>} sidebarOpen={false} onSidebarOpenChange={onOpenChange}>
        x
      </AppShell>,
    );
    await user.keyboard('{Escape}');
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
