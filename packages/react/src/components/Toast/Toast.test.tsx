import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { ToastProvider, ToastViewport, useToast } from './Toast';

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <ToastViewport />
      {children}
    </ToastProvider>
  );
}

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('useToast hors provider lève une erreur explicite', () => {
    expect(() => renderHook(() => useToast())).toThrow(/ToastProvider/);
  });

  describe('création de toasts', () => {
    it('toast({ description }) ajoute un toast avec variant info par défaut', () => {
      const { result } = renderHook(() => useToast(), { wrapper: Wrapper });
      act(() => {
        result.current.toast({ description: 'Bonjour' });
      });
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0]).toMatchObject({
        description: 'Bonjour',
        variant: 'info',
      });
    });

    it('toast.success(description) crée un toast variant success', () => {
      const { result } = renderHook(() => useToast(), { wrapper: Wrapper });
      act(() => {
        result.current.toast.success('OK !');
      });
      expect(result.current.toasts[0].variant).toBe('success');
      expect(result.current.toasts[0].description).toBe('OK !');
    });

    it('toast.danger émet un toast danger (et la viewport le rend en role=alert)', () => {
      render(<Wrapper>{null}</Wrapper>);
      // Note : on ne peut pas re-utiliser renderHook + render dans le même wrapper,
      // donc on accède au context via un composant temporaire
      function Trigger() {
        const { toast } = useToast();
        return (
          <button onClick={() => toast.danger('Erreur grave')} type="button">
            crash
          </button>
        );
      }
      render(
        <ToastProvider>
          <ToastViewport />
          <Trigger />
        </ToastProvider>,
      );
      act(() => {
        screen.getByRole('button', { name: 'crash' }).click();
      });
      // role=alert pour danger, role=status pour les autres
      expect(screen.getByRole('alert')).toHaveTextContent('Erreur grave');
    });

    it('toast retourne un id unique par toast', () => {
      const { result } = renderHook(() => useToast(), { wrapper: Wrapper });
      let id1 = 0;
      let id2 = 0;
      act(() => {
        id1 = result.current.toast({ description: 'a' });
        id2 = result.current.toast({ description: 'b' });
      });
      expect(id1).not.toBe(id2);
      expect(result.current.toasts).toHaveLength(2);
    });
  });

  describe('auto-dismiss', () => {
    it('dismiss après duration ms', () => {
      const { result } = renderHook(() => useToast(), { wrapper: Wrapper });
      act(() => {
        result.current.toast({ description: 'Bonjour', duration: 1000 });
      });
      expect(result.current.toasts).toHaveLength(1);
      act(() => {
        vi.advanceTimersByTime(999);
      });
      expect(result.current.toasts).toHaveLength(1);
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(result.current.toasts).toHaveLength(0);
    });

    it('duration par défaut = 5000ms', () => {
      const { result } = renderHook(() => useToast(), { wrapper: Wrapper });
      act(() => {
        result.current.toast({ description: 'défaut' });
      });
      act(() => {
        vi.advanceTimersByTime(4999);
      });
      expect(result.current.toasts).toHaveLength(1);
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(result.current.toasts).toHaveLength(0);
    });

    it("duration: 0 désactive l'auto-dismiss (toast persistant)", () => {
      const { result } = renderHook(() => useToast(), { wrapper: Wrapper });
      act(() => {
        result.current.toast({ description: 'persistant', duration: 0 });
      });
      act(() => {
        vi.advanceTimersByTime(60_000);
      });
      expect(result.current.toasts).toHaveLength(1);
    });
  });

  describe('dismiss programmatique', () => {
    it('dismiss(id) retire le toast immédiatement', () => {
      const { result } = renderHook(() => useToast(), { wrapper: Wrapper });
      let id = 0;
      act(() => {
        id = result.current.toast({ description: 'Bonjour', duration: 0 });
      });
      expect(result.current.toasts).toHaveLength(1);
      act(() => {
        result.current.dismiss(id);
      });
      expect(result.current.toasts).toHaveLength(0);
    });

    it('dismiss(id) annule le timer (pas de double-dismiss qui plante)', () => {
      const { result } = renderHook(() => useToast(), { wrapper: Wrapper });
      let id = 0;
      act(() => {
        id = result.current.toast({ description: 'Bonjour', duration: 1000 });
      });
      act(() => {
        result.current.dismiss(id);
      });
      // Le timer aurait expiré ici, mais comme on a dismissé manuellement,
      // pas de crash et le state reste vide
      expect(() => {
        act(() => {
          vi.advanceTimersByTime(2000);
        });
      }).not.toThrow();
      expect(result.current.toasts).toHaveLength(0);
    });
  });

  describe('UI viewport', () => {
    it('rend un <ol role="region" aria-live="polite">', () => {
      render(<Wrapper>{null}</Wrapper>);
      const region = screen.getByRole('region', { name: 'Notifications' });
      expect(region.tagName).toBe('OL');
      expect(region).toHaveAttribute('aria-live', 'polite');
    });

    it('clic sur le bouton Fermer dismiss le toast', async () => {
      // userEvent ne fonctionne pas avec fakeTimers de base ; on utilise
      // un advanceTimers shim.
      vi.useRealTimers();
      const user = userEvent.setup();

      function Trigger() {
        const { toast } = useToast();
        return (
          <button onClick={() => toast({ description: 'Bonjour', duration: 0 })} type="button">
            spawn
          </button>
        );
      }
      render(
        <ToastProvider>
          <ToastViewport />
          <Trigger />
        </ToastProvider>,
      );
      await user.click(screen.getByRole('button', { name: 'spawn' }));
      expect(screen.getByText('Bonjour')).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: 'Fermer' }));
      expect(screen.queryByText('Bonjour')).not.toBeInTheDocument();
    });
  });
});
