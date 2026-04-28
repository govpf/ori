import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from './Tabs';

function setup(extra: { value?: string; onValueChange?: (v: string) => void } = {}) {
  return render(
    <Tabs defaultValue={extra.value === undefined ? 'profile' : undefined} {...extra}>
      <Tabs.List aria-label="Réglages">
        <Tabs.Tab value="profile">Profil</Tabs.Tab>
        <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
        <Tabs.Tab value="security" disabled>
          Sécurité
        </Tabs.Tab>
        <Tabs.Tab value="preferences">Préférences</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="profile">contenu profil</Tabs.Panel>
      <Tabs.Panel value="notifications">contenu notifications</Tabs.Panel>
      <Tabs.Panel value="security">contenu sécurité</Tabs.Panel>
      <Tabs.Panel value="preferences">contenu préférences</Tabs.Panel>
    </Tabs>,
  );
}

describe('Tabs', () => {
  describe('rendu', () => {
    it('rend un role="tablist" avec les boutons en role="tab"', () => {
      setup();
      expect(screen.getByRole('tablist', { name: 'Réglages' })).toBeInTheDocument();
      expect(screen.getAllByRole('tab')).toHaveLength(4);
    });

    it('marque le tab par défaut comme aria-selected="true"', () => {
      setup();
      expect(screen.getByRole('tab', { name: 'Profil' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tab', { name: 'Notifications' })).toHaveAttribute(
        'aria-selected',
        'false',
      );
    });

    it('rend uniquement le panel actif (les autres en hidden)', () => {
      setup();
      expect(screen.getByRole('tabpanel', { hidden: false })).toHaveTextContent('contenu profil');
      // Les autres panels sont en hidden, on ne peut pas les voir avec getByRole
      // sauf en passant hidden: true.
      const allPanels = screen.getAllByRole('tabpanel', { hidden: true });
      expect(allPanels).toHaveLength(4);
    });

    it('lie chaque tab à son panel via aria-controls / aria-labelledby', () => {
      setup();
      const tab = screen.getByRole('tab', { name: 'Profil' });
      const ariaControls = tab.getAttribute('aria-controls');
      expect(ariaControls).toBeTruthy();
      const panel = document.getElementById(ariaControls!);
      expect(panel).toHaveAttribute('aria-labelledby', tab.id);
    });
  });

  describe('sélection', () => {
    it('change le tab actif au clic (incontrôlé)', async () => {
      const user = userEvent.setup();
      setup();
      await user.click(screen.getByRole('tab', { name: 'Notifications' }));
      expect(screen.getByRole('tab', { name: 'Notifications' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      expect(screen.getByRole('tab', { name: 'Profil' })).toHaveAttribute('aria-selected', 'false');
    });

    it('appelle onValueChange en mode incontrôlé', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Tabs defaultValue="a" onValueChange={onValueChange}>
          <Tabs.List>
            <Tabs.Tab value="a">A</Tabs.Tab>
            <Tabs.Tab value="b">B</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="a">A</Tabs.Panel>
          <Tabs.Panel value="b">B</Tabs.Panel>
        </Tabs>,
      );
      await user.click(screen.getByRole('tab', { name: 'B' }));
      expect(onValueChange).toHaveBeenCalledWith('b');
    });

    it('en mode contrôlé, le clic ne change pas le tab actif sans rerender parent', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Tabs value="a" onValueChange={onValueChange}>
          <Tabs.List>
            <Tabs.Tab value="a">A</Tabs.Tab>
            <Tabs.Tab value="b">B</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="a">A</Tabs.Panel>
          <Tabs.Panel value="b">B</Tabs.Panel>
        </Tabs>,
      );
      await user.click(screen.getByRole('tab', { name: 'B' }));
      // onValueChange est notifié mais l'état affiché reste "a" tant que
      // le parent ne pousse pas value="b"
      expect(onValueChange).toHaveBeenCalledWith('b');
      expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('navigation clavier', () => {
    it('ArrowRight déplace le focus au tab suivant (et saute les disabled)', async () => {
      const user = userEvent.setup();
      setup();
      const profil = screen.getByRole('tab', { name: 'Profil' });
      profil.focus();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: 'Notifications' })).toHaveFocus();
      await user.keyboard('{ArrowRight}');
      // "Sécurité" est disabled donc on saute à "Préférences"
      expect(screen.getByRole('tab', { name: 'Préférences' })).toHaveFocus();
    });

    it('ArrowLeft déplace le focus au tab précédent', async () => {
      const user = userEvent.setup();
      setup();
      const notif = screen.getByRole('tab', { name: 'Notifications' });
      notif.focus();
      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('tab', { name: 'Profil' })).toHaveFocus();
    });

    it('ArrowRight depuis le dernier tab boucle au premier', async () => {
      const user = userEvent.setup();
      setup();
      const last = screen.getByRole('tab', { name: 'Préférences' });
      last.focus();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: 'Profil' })).toHaveFocus();
    });

    it('Home déplace le focus au premier tab', async () => {
      const user = userEvent.setup();
      setup();
      const last = screen.getByRole('tab', { name: 'Préférences' });
      last.focus();
      await user.keyboard('{Home}');
      expect(screen.getByRole('tab', { name: 'Profil' })).toHaveFocus();
    });

    it('End déplace le focus au dernier tab', async () => {
      const user = userEvent.setup();
      setup();
      const profil = screen.getByRole('tab', { name: 'Profil' });
      profil.focus();
      await user.keyboard('{End}');
      expect(screen.getByRole('tab', { name: 'Préférences' })).toHaveFocus();
    });
  });

  describe('roving tabindex', () => {
    it('seul le tab actif a tabIndex=0, les autres ont tabIndex=-1', () => {
      setup();
      expect(screen.getByRole('tab', { name: 'Profil' })).toHaveAttribute('tabindex', '0');
      expect(screen.getByRole('tab', { name: 'Notifications' })).toHaveAttribute('tabindex', '-1');
    });
  });
});
