import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { OriAppShellComponent } from './app-shell.component';
import { OriButtonComponent } from '../button/button.component';

const meta: Meta<OriAppShellComponent> = {
  title: 'Compositions/Layout/AppShell',
  component: OriAppShellComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [OriAppShellComponent, OriButtonComponent] })],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "Layout d'application : header sticky + sidebar optionnelle (drawer responsive sur mobile) + main + footer optionnel. Skip link a11y intégré.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<OriAppShellComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <div style="height: 600px; border: 1px dashed #d4d4d8;">
        <ori-app-shell [hasHeader]="true" [hasSidebar]="true" [hasFooter]="true">
          <header
            slot="header"
            style="height: 56px; padding-inline: 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e5e7eb; background-color: #fff;"
          >
            <strong>Démo AppShell</strong>
            <span style="font-size: 14px; color: #6b7280;">Header projeté</span>
          </header>
          <nav
            slot="sidebar"
            aria-label="Navigation"
            style="width: 240px; padding-block: 16px; padding-inline: 12px; border-right: 1px solid #e5e7eb; background-color: #f9fafb; height: 100%;"
          >
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 4px;">
              <li><a href="#a">Tableau de bord</a></li>
              <li><a href="#b">Mes demandes</a></li>
              <li><a href="#c">Documents</a></li>
              <li><a href="#d">Préférences</a></li>
            </ul>
          </nav>
          <div style="padding: 24px;">
            <h1 style="margin-top: 0;">Page de démonstration</h1>
            <p>Le main porte un id et un tabindex=-1 pour le skip link.</p>
            <p>Paragraphe 1 pour démontrer le scroll vertical du main.</p>
            <p>Paragraphe 2.</p>
            <p>Paragraphe 3.</p>
          </div>
          <footer
            slot="footer"
            style="padding-block: 12px; padding-inline: 16px; border-top: 1px solid #e5e7eb; background-color: #fff; font-size: 14px; color: #6b7280; text-align: center;"
          >
            © 2026 Démo Ori
          </footer>
        </ori-app-shell>
      </div>
    `,
  }),
};

export const NoSidebar: Story = {
  render: () => ({
    template: `
      <div style="height: 600px; border: 1px dashed #d4d4d8;">
        <ori-app-shell [hasHeader]="true" [hasFooter]="true">
          <header
            slot="header"
            style="height: 56px; padding-inline: 16px; display: flex; align-items: center; border-bottom: 1px solid #e5e7eb; background-color: #fff;"
          >
            <strong>Démo sans sidebar</strong>
          </header>
          <div style="padding: 24px;">
            <p>Layout simple : header + main + footer, sans sidebar.</p>
          </div>
          <footer
            slot="footer"
            style="padding-block: 12px; padding-inline: 16px; border-top: 1px solid #e5e7eb; background-color: #fff; font-size: 14px; color: #6b7280; text-align: center;"
          >
            © 2026
          </footer>
        </ori-app-shell>
      </div>
    `,
  }),
};

export const SidebarDrawer: Story = {
  render: () => ({
    props: {
      open: false,
      toggle() {
        (this as any).open = !(this as any).open;
      },
    },
    template: `
      <div style="height: 600px; border: 1px dashed #d4d4d8;">
        <ori-app-shell
          [hasHeader]="true"
          [hasSidebar]="true"
          [sidebarOpen]="open"
          (sidebarOpenChange)="open = $event"
        >
          <header
            slot="header"
            style="height: 56px; padding-inline: 16px; display: flex; align-items: center; gap: 16px; border-bottom: 1px solid #e5e7eb; background-color: #fff;"
          >
            <ori-button variant="secondary" (click)="toggle()">☰ Menu</ori-button>
            <strong>Démo drawer</strong>
            <span style="font-size: 14px; color: #6b7280; margin-left: auto;">
              Sidebar ouvert : {{ open ? 'oui' : 'non' }}
            </span>
          </header>
          <nav
            slot="sidebar"
            aria-label="Navigation"
            style="width: 240px; padding: 16px; background-color: #f9fafb; height: 100%;"
          >
            <p style="margin: 0;">Contenu sidebar</p>
          </nav>
          <div style="padding: 24px;">
            <p>
              Au-dessus de 768px, la sidebar reste visible. En réduisant la fenêtre,
              elle devient un drawer piloté par le bouton "Menu" (clic sur le scrim
              ou ESC pour fermer).
            </p>
          </div>
        </ori-app-shell>
      </div>
    `,
  }),
};
