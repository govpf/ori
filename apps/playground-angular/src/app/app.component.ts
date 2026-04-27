import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Download, Eye, LucideAngularModule, Moon, Send, Sun, Trash2, Undo2 } from 'lucide-angular';
import {
  OriButtonComponent,
  OriCardComponent,
  OriCardBodyComponent,
  OriFileCardComponent,
  OriStatisticComponent,
  type OriFileCardAction,
} from '@govpf/ori-angular';

/**
 * App de démonstration Angular consommant @govpf/ori-angular.
 *
 * Objectif : prouver que la chaîne package -> consommateur fonctionne
 * de bout en bout sur une vraie application (build Angular CLI, Tailwind preset,
 * tokens CSS, thème sombre).
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    OriButtonComponent,
    OriCardComponent,
    OriCardBodyComponent,
    OriFileCardComponent,
    OriStatisticComponent,
    LucideAngularModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="wrap">
      <header class="topbar">
        <div>
          <h1>Ori - playground Angular</h1>
          <small>App Angular minimale consommant <code>&#64;Ori/angular</code></small>
        </div>
        <ori-button variant="secondary" (click)="toggleTheme()">
          <lucide-icon [img]="themeIcon()" [size]="16"></lucide-icon>
          Thème : <strong>{{ themeLabel() }}</strong>
        </ori-button>
      </header>

      <section>
        <h2>Boutons - variantes</h2>
        <div class="row">
          <ori-button variant="primary">Primary</ori-button>
          <ori-button variant="secondary">Secondary</ori-button>
          <ori-button variant="ghost">Ghost</ori-button>
          <ori-button variant="danger">Danger</ori-button>
          <ori-button variant="primary" [disabled]="true">Disabled</ori-button>
        </div>

        <h2 style="margin-top: 1.25rem">Tailles</h2>
        <div class="row">
          <ori-button variant="primary" size="sm">Petit</ori-button>
          <ori-button variant="primary" size="md">Moyen</ori-button>
          <ori-button variant="primary" size="lg">Grand</ori-button>
        </div>

        <h2 style="margin-top: 1.25rem">Pleine largeur</h2>
        <div style="max-width: 320px">
          <ori-button variant="primary" [block]="true">Pleine largeur</ori-button>
        </div>

        <h2 style="margin-top: 1.25rem">Composition (contenu projeté)</h2>
        <div class="row">
          <ori-button variant="primary">
            <lucide-icon [img]="SendIcon" [size]="16"></lucide-icon>
            Envoyer
          </ori-button>
          <ori-button variant="secondary">
            <lucide-icon [img]="UndoIcon" [size]="16"></lucide-icon>
            Retour
          </ori-button>
          <ori-button variant="danger">
            <lucide-icon [img]="TrashIcon" [size]="16"></lucide-icon>
            Supprimer
          </ori-button>
        </div>
      </section>

      <section>
        <h2>Compteur (preuve d'interactivité)</h2>
        <div class="row">
          <ori-button variant="secondary" (click)="dec()">−</ori-button>
          <span style="font-size: 1.5rem; min-width: 3rem; text-align: center">{{ count() }}</span>
          <ori-button variant="primary" (click)="inc()">+</ori-button>
        </div>
      </section>

      <section>
        <h2>FileCard</h2>
        <div class="file-grid">
          <ori-file-card
            name="Pièce identité.pdf"
            type="pdf"
            size="1.2 Mo"
            meta="Ajouté le 2026-04-22"
            [link]="{ label: 'Lié à 2026-0042', href: '#42' }"
            [actions]="fileActions"
          ></ori-file-card>
          <ori-file-card
            name="Photo identité.jpg"
            type="image"
            size="2.3 Mo"
            meta="Ajouté le 2026-04-20"
          ></ori-file-card>
          <ori-file-card
            name="Statuts.docx"
            type="doc"
            size="180 Ko"
            meta="Ajouté le 2026-04-15"
          ></ori-file-card>
        </div>
      </section>

      <section>
        <h2>Statistic (KPI)</h2>
        <div class="kpi-grid">
          <ori-card>
            <ori-card-body>
              <ori-statistic
                label="Démarches en cours"
                [value]="2"
                [trend]="{ direction: 'up', label: '+1 cette semaine' }"
              ></ori-statistic>
            </ori-card-body>
          </ori-card>
          <ori-card>
            <ori-card-body>
              <ori-statistic label="À compléter" [value]="1"></ori-statistic>
            </ori-card-body>
          </ori-card>
          <ori-card>
            <ori-card-body>
              <ori-statistic
                label="Délai moyen"
                [value]="8"
                suffix="j"
                [trend]="{ direction: 'down', label: '-1,2 j vs M-1', positive: 'down' }"
              ></ori-statistic>
            </ori-card-body>
          </ori-card>
          <ori-card>
            <ori-card-body>
              <ori-statistic
                label="Aides versées"
                [value]="1240000"
                suffix="XPF"
                variant="lg"
              ></ori-statistic>
            </ori-card-body>
          </ori-card>
        </div>
      </section>
    </main>
  `,
  styles: [
    `
      .wrap {
        max-width: 1024px;
        margin: 0 auto;
        padding: 2rem 1.5rem 4rem;
      }
      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 1.5rem;
        margin-bottom: 2rem;
        border-bottom: 1px solid var(--color-border-subtle);
      }
      .topbar h1 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
      }
      .topbar small {
        color: var(--color-text-secondary);
        display: block;
      }
      h2 {
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--color-text-secondary);
        margin: 1rem 0 0.75rem;
      }
      .row {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
        align-items: center;
      }
      section {
        margin-bottom: 2rem;
      }
      .kpi-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }
      .file-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1rem;
      }
    `,
  ],
})
export class AppComponent {
  readonly count = signal(0);
  private readonly theme = signal<'light' | 'dark'>('light');

  // Icônes Lucide exposées en propriétés pour pouvoir être bindées en template.
  protected readonly SendIcon = Send;
  protected readonly UndoIcon = Undo2;
  protected readonly TrashIcon = Trash2;
  protected readonly MoonIcon = Moon;
  protected readonly SunIcon = Sun;

  protected readonly fileActions: OriFileCardAction[] = [
    { id: 'preview', label: 'Aperçu', icon: Eye },
    { id: 'download', label: 'Télécharger', icon: Download },
    { id: 'delete', label: 'Supprimer', icon: Trash2, variant: 'danger' },
  ];

  readonly themeLabel = () => (this.theme() === 'dark' ? 'sombre' : 'clair');
  readonly themeIcon = () => (this.theme() === 'dark' ? this.SunIcon : this.MoonIcon);

  inc(): void {
    this.count.update((n) => n + 1);
  }

  dec(): void {
    this.count.update((n) => n - 1);
  }

  toggleTheme(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    document.documentElement.setAttribute('data-theme', next);
  }
}
