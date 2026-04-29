import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable, type DataTableColumn, type DataTableRowAction } from './DataTable';

interface Row {
  id: string;
  name: string;
  email: string;
  role: string;
}

const data: Row[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com', role: 'admin' },
  { id: '2', name: 'Bob', email: 'bob@example.com', role: 'editor' },
  { id: '3', name: 'Charlie', email: 'charlie@example.com', role: 'viewer' },
  { id: '4', name: 'Diana', email: 'diana@example.com', role: 'editor' },
  { id: '5', name: 'Eve', email: 'eve@example.com', role: 'admin' },
];

const columns: DataTableColumn<Row>[] = [
  { key: 'name', label: 'Nom', sortable: true, filterable: true },
  { key: 'email', label: 'Email', filterable: true },
  { key: 'role', label: 'Rôle', sortable: true },
];

describe('DataTable', () => {
  describe('rendu', () => {
    it('rend une table avec les colonnes et toutes les lignes (pageSize >= data.length)', () => {
      render(<DataTable columns={columns} data={data} rowKey={(r) => r.id} pageSize={20} />);
      expect(screen.getByRole('columnheader', { name: 'Nom' })).toBeInTheDocument();
      // 5 lignes de données + 1 row de header
      expect(screen.getAllByRole('row')).toHaveLength(6);
    });

    it('affiche le compteur de résultats', () => {
      render(<DataTable columns={columns} data={data} rowKey={(r) => r.id} />);
      expect(screen.getByText(/5 résultats/i)).toBeInTheDocument();
    });

    it('affiche un input de filtre par défaut', () => {
      render(<DataTable columns={columns} data={data} rowKey={(r) => r.id} />);
      expect(screen.getByPlaceholderText(/rechercher/i)).toBeInTheDocument();
    });

    it('masque le filtre si globalFilter=false', () => {
      render(<DataTable columns={columns} data={data} rowKey={(r) => r.id} globalFilter={false} />);
      expect(screen.queryByPlaceholderText(/rechercher/i)).not.toBeInTheDocument();
    });
  });

  describe('filtrage', () => {
    it('filtre les lignes au texte saisi', async () => {
      const user = userEvent.setup();
      render(<DataTable columns={columns} data={data} rowKey={(r) => r.id} pageSize={20} />);
      await user.type(screen.getByPlaceholderText(/rechercher/i), 'alice');
      expect(screen.getAllByRole('row')).toHaveLength(2); // header + 1 row
      expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    });

    it('ne filtre que sur les colonnes filterable=true', async () => {
      const user = userEvent.setup();
      render(<DataTable columns={columns} data={data} rowKey={(r) => r.id} pageSize={20} />);
      // 'admin' est uniquement dans la colonne 'role' qui n'est pas filterable
      await user.type(screen.getByPlaceholderText(/rechercher/i), 'admin');
      // Aucune ligne ne matche : Table rend header + 1 ligne "vide" pour l'emptyMessage.
      expect(screen.getByText(/aucune donnée/i)).toBeInTheDocument();
    });

    it('affiche emptyMessage quand aucune ligne ne correspond', async () => {
      const user = userEvent.setup();
      render(
        <DataTable
          columns={columns}
          data={data}
          rowKey={(r) => r.id}
          emptyMessage="Aucun résultat custom"
        />,
      );
      await user.type(screen.getByPlaceholderText(/rechercher/i), 'xyz');
      expect(screen.getByText('Aucun résultat custom')).toBeInTheDocument();
    });
  });

  describe('tri', () => {
    it("trie au clic sur l'en-tête d'une colonne sortable", async () => {
      const user = userEvent.setup();
      render(<DataTable columns={columns} data={data} rowKey={(r) => r.id} pageSize={20} />);
      // Premier clic = asc → Alice en tête
      await user.click(screen.getByRole('button', { name: 'Nom' }));
      const rowsAfter = screen.getAllByRole('row');
      // index 1 = première ligne après header
      expect(within(rowsAfter[1]!).getByText('Alice')).toBeInTheDocument();
    });

    it('toggle asc → desc → off', async () => {
      const user = userEvent.setup();
      render(<DataTable columns={columns} data={data} rowKey={(r) => r.id} pageSize={20} />);
      const trigger = screen.getByRole('button', { name: 'Nom' });
      await user.click(trigger); // asc
      await user.click(trigger); // desc → Eve en tête
      let rows = screen.getAllByRole('row');
      expect(within(rows[1]!).getByText('Eve')).toBeInTheDocument();
      await user.click(trigger); // off → ordre original (Alice en tête car premier)
      rows = screen.getAllByRole('row');
      expect(within(rows[1]!).getByText('Alice')).toBeInTheDocument();
    });
  });

  describe('pagination', () => {
    it('paginé : seules pageSize lignes sont visibles', () => {
      render(<DataTable columns={columns} data={data} rowKey={(r) => r.id} pageSize={2} />);
      // 2 lignes + header
      expect(screen.getAllByRole('row')).toHaveLength(3);
      // 5 / 2 = 3 pages → la pagination est visible
      expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument();
    });

    it('noPagination affiche toutes les lignes et masque la pagination', () => {
      render(<DataTable columns={columns} data={data} rowKey={(r) => r.id} noPagination />);
      expect(screen.getAllByRole('row')).toHaveLength(6);
      expect(screen.queryByRole('navigation', { name: /pagination/i })).not.toBeInTheDocument();
    });
  });

  describe('actions de ligne', () => {
    const rowActions = (row: Row): DataTableRowAction[] => [
      { id: 'edit', label: 'Modifier' },
      { id: 'delete', label: 'Supprimer', destructive: true },
    ];

    it("rend un bouton d'actions par ligne quand rowActions est fourni", () => {
      render(
        <DataTable
          columns={columns}
          data={data}
          rowKey={(r) => r.id}
          rowActions={rowActions}
          pageSize={2}
        />,
      );
      const actions = screen.getAllByRole('button', { name: 'Actions' });
      expect(actions).toHaveLength(2); // une par ligne visible
    });

    it('ouvre le menu et appelle onRowAction au clic sur une action', async () => {
      const user = userEvent.setup();
      const onRowAction = vi.fn();
      render(
        <DataTable
          columns={columns}
          data={data}
          rowKey={(r) => r.id}
          rowActions={rowActions}
          onRowAction={onRowAction}
          pageSize={1}
        />,
      );
      await user.click(screen.getByRole('button', { name: 'Actions' }));
      await user.click(screen.getByRole('menuitem', { name: 'Supprimer' }));
      expect(onRowAction).toHaveBeenCalledWith('delete', data[0]);
    });
  });
});
