/**
 * Espace agent : back-office d'instruction de dossiers.
 *
 * Pendant agent du portail usager (apps/demo-portail). Cet exemple
 * démontre la consommation réelle de @govpf/ori-angular :
 * - <ori-app-shell> avec sidebar persistante et footer
 * - <ori-header> + <ori-logo> + <ori-main-navigation>
 * - <ori-side-menu> avec sections
 * - <ori-table> avec sélection multiple, tri, cellTemplate par colonne
 * - <ori-dropdown-menu> pour les actions ligne et le menu utilisateur
 * - <ori-alert-dialog> pour confirmer les actions destructrices
 * - <ori-search-bar> + <ori-select> pour filtrer la file
 * - <ori-notification> pour le feedback après action
 * - <ori-statistic> pour les KPI en haut de page
 */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewChild,
  computed,
  signal,
} from '@angular/core';
import {
  OriAlertDialogComponent,
  OriAppShellComponent,
  OriAvatarComponent,
  OriButtonComponent,
  OriCardBodyComponent,
  OriCardComponent,
  OriDropdownMenuComponent,
  OriFooterComponent,
  OriHeaderComponent,
  OriLogoComponent,
  OriMainNavigationComponent,
  OriNotificationComponent,
  OriSearchBarComponent,
  OriSelectComponent,
  OriSideMenuComponent,
  OriStatisticComponent,
  OriTableComponent,
  OriTagComponent,
  type OriDropdownMenuItem,
  type OriFooterUtilityLink,
  type OriMainNavigationItem,
  type OriSelectOption,
  type OriSideMenuSection,
  type OriStatisticTrend,
  type OriTableColumn,
  type OriTableSort,
} from '@govpf/ori-angular';
import {
  STATUT_LABEL,
  STATUT_VARIANT,
  dossiers as dossiersInitiaux,
  type Dossier,
  type DossierStatut,
} from './data';

type NotifVariant = 'info' | 'success' | 'danger';
interface Notif {
  variant: NotifVariant;
  text: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    OriAlertDialogComponent,
    OriAppShellComponent,
    OriAvatarComponent,
    OriButtonComponent,
    OriCardBodyComponent,
    OriCardComponent,
    OriDropdownMenuComponent,
    OriFooterComponent,
    OriHeaderComponent,
    OriLogoComponent,
    OriMainNavigationComponent,
    OriNotificationComponent,
    OriSearchBarComponent,
    OriSelectComponent,
    OriSideMenuComponent,
    OriStatisticComponent,
    OriTableComponent,
    OriTagComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit {
  // Helpers typés appelés depuis le template — évite les indexations
  // implicit-any que strictTemplates refuse pour les variables let-row.
  statutLabel(row: Dossier): string {
    return STATUT_LABEL[row.statut];
  }
  statutVariant(row: Dossier): 'info' | 'warning' | 'success' | 'danger' | 'neutral' {
    return STATUT_VARIANT[row.statut];
  }

  readonly dossiers = signal<Dossier[]>(dossiersInitiaux);
  readonly search = signal('');
  readonly statutFilter = signal('');
  readonly sort = signal<OriTableSort | null>(null);
  readonly selected = signal<string[]>([]);
  readonly confirmReject = signal<Dossier | null>(null);
  readonly notif = signal<Notif | null>(null);
  readonly sidebarOpen = signal(true);

  readonly navItems: OriMainNavigationItem[] = [
    { label: 'Dossiers', href: '#', current: true },
    { label: 'Instructions', href: '#' },
    { label: 'Statistiques', href: '#' },
    { label: 'Référentiels', href: '#' },
  ];

  readonly sideMenuSections: OriSideMenuSection[] = [
    {
      title: 'Files de travail',
      items: [
        { label: 'Tous les dossiers', href: '#', current: true },
        { label: 'À instruire', href: '#' },
        { label: 'À compléter', href: '#' },
        { label: 'Mes dossiers', href: '#' },
      ],
    },
    {
      title: 'Outils',
      items: [
        { label: 'Modèles de courrier', href: '#' },
        { label: 'Référentiel des aides', href: '#' },
        { label: 'Annuaire interne', href: '#' },
      ],
    },
  ];

  readonly footerUtilityLinks: OriFooterUtilityLink[] = [
    { label: 'Mentions légales', href: '#' },
    { label: 'Politique de sécurité', href: '#' },
    { label: 'Aide', href: '#' },
  ];

  readonly userMenuItems: OriDropdownMenuItem[] = [
    { id: 'profile', label: 'Mon profil' },
    { id: 'prefs', label: 'Préférences' },
    { id: 'sep', separator: true },
    { id: 'logout', label: 'Se déconnecter', destructive: true },
  ];

  readonly statutOptions: OriSelectOption[] = [
    { value: '', label: 'Tous les statuts' },
    { value: 'a_instruire', label: 'À instruire' },
    { value: 'en_cours', label: 'En cours' },
    { value: 'a_completer', label: 'À compléter' },
    { value: 'valide', label: 'Validés' },
    { value: 'rejete', label: 'Rejetés' },
  ];

  // rowKey est passé en input à <ori-table>. Référence stable sur l'instance.
  readonly rowKey = (row: Dossier) => row.id;

  // Typage exact attendu par OriTableColumn.cellTemplate
  // ($implicit = ligne, index = position dans la liste filtrée).
  @ViewChild('statutTpl', { static: true })
  statutTpl!: TemplateRef<{ $implicit: Dossier; index: number }>;
  @ViewChild('agentTpl', { static: true })
  agentTpl!: TemplateRef<{ $implicit: Dossier; index: number }>;
  @ViewChild('actionsTpl', { static: true })
  actionsTpl!: TemplateRef<{ $implicit: Dossier; index: number }>;

  readonly columns = signal<OriTableColumn<Dossier>[]>([]);

  readonly filtered = computed(() => {
    let rows = this.dossiers();
    const f = this.statutFilter();
    if (f) rows = rows.filter((d) => d.statut === f);
    const q = this.search().trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (d) =>
          d.numero.toLowerCase().includes(q) ||
          d.demandeur.toLowerCase().includes(q) ||
          d.type.toLowerCase().includes(q) ||
          d.commune.toLowerCase().includes(q),
      );
    }
    const s = this.sort();
    if (s) {
      const key = s.column as keyof Dossier;
      rows = [...rows].sort((a, b) => {
        const av = String(a[key] ?? '');
        const bv = String(b[key] ?? '');
        const cmp = av.localeCompare(bv, 'fr');
        return s.direction === 'asc' ? cmp : -cmp;
      });
    }
    return rows;
  });

  readonly kpis = computed(() => {
    const rows = this.dossiers();
    return {
      total: rows.length,
      aInstruire: rows.filter((d) => d.statut === 'a_instruire').length,
      enCours: rows.filter((d) => d.statut === 'en_cours').length,
      aCompleter: rows.filter((d) => d.statut === 'a_completer').length,
    };
  });

  readonly emptyMessage = computed(() =>
    this.search() || this.statutFilter()
      ? 'Aucun dossier ne correspond aux filtres.'
      : 'Aucun dossier dans la file.',
  );

  readonly trendAInstruire = computed<OriStatisticTrend | undefined>(() => {
    const n = this.kpis().aInstruire;
    return n > 0 ? { direction: 'up', label: 'à traiter', positive: 'down' } : undefined;
  });

  ngAfterViewInit(): void {
    // Les templates sont disponibles dès la 1ʳᵉ détection (static: true) ;
    // on les passe aux colonnes après init pour éviter une 1ʳᵉ frame
    // sans cellTemplate.
    queueMicrotask(() => {
      this.columns.set([
        { key: 'numero', label: 'Numéro', sortable: true, width: '140px' },
        { key: 'demandeur', label: 'Demandeur', sortable: true },
        { key: 'type', label: 'Type', sortable: true },
        { key: 'commune', label: 'Commune', sortable: true, width: '120px' },
        { key: 'montant', label: 'Montant', align: 'end', width: '170px' },
        {
          key: 'statut',
          label: 'Statut',
          width: '180px',
          cellTemplate: this.statutTpl,
        },
        {
          key: 'agent',
          label: 'Agent',
          width: '140px',
          cellTemplate: this.agentTpl,
        },
        {
          key: 'actions',
          label: '',
          width: '60px',
          align: 'end',
          cellTemplate: this.actionsTpl,
        },
      ]);
    });
  }

  resetFilters(): void {
    this.search.set('');
    this.statutFilter.set('');
  }

  actionItemsFor(row: Dossier): OriDropdownMenuItem[] {
    const items: OriDropdownMenuItem[] = [{ id: 'voir', label: 'Ouvrir le dossier' }];
    if (!row.agent) items.push({ id: 'assigner', label: "S'attribuer" });
    items.push(
      { id: 'demander_info', label: 'Demander un complément' },
      { id: 'sep', separator: true },
      { id: 'valider', label: 'Valider' },
      { id: 'rejeter', label: 'Rejeter…', destructive: true },
    );
    return items;
  }

  onUserMenuAction(_item: OriDropdownMenuItem): void {
    // démo : pas de routing
  }

  onRowAction(row: Dossier, item: OriDropdownMenuItem): void {
    const action = item.id;
    if (action === 'rejeter') {
      this.confirmReject.set(row);
      return;
    }
    this.dossiers.update((prev) =>
      prev.map((d) => {
        if (d.id !== row.id) return d;
        if (action === 'valider') return { ...d, statut: 'valide' as DossierStatut };
        if (action === 'assigner') {
          return {
            ...d,
            agent: 'Vous (démo)',
            statut: d.statut === 'a_instruire' ? ('en_cours' as DossierStatut) : d.statut,
          };
        }
        if (action === 'demander_info') return { ...d, statut: 'a_completer' as DossierStatut };
        return d;
      }),
    );
    const labels: Record<string, string> = {
      valider: `Dossier ${row.numero} validé.`,
      assigner: `Dossier ${row.numero} attribué.`,
      demander_info: `Demande de complément envoyée pour ${row.numero}.`,
      voir: `Ouverture de ${row.numero}…`,
    };
    if (action && labels[action]) {
      this.notif.set({
        variant: action === 'valider' ? 'success' : 'info',
        text: labels[action],
      });
    }
  }

  handleConfirmReject(): void {
    const r = this.confirmReject();
    if (!r) return;
    this.dossiers.update((prev) =>
      prev.map((d) => (d.id === r.id ? { ...d, statut: 'rejete' as DossierStatut } : d)),
    );
    this.notif.set({ variant: 'danger', text: `Dossier ${r.numero} rejeté.` });
    this.confirmReject.set(null);
  }
}
