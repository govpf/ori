import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

export type OriTimelineItemStatus = 'completed' | 'current' | 'pending';

export interface OriTimelineItem {
  id: string;
  title: string;
  /** Date / heure formatée (ex: '2026-04-23 14:30'). */
  timestamp: string;
  /** Acteur ou source. Optionnel. */
  actor?: string;
  /** Détail supplémentaire. Optionnel. */
  description?: string;
  /** Status visuel du dot. Default: 'completed'. */
  status?: OriTimelineItemStatus;
}

/**
 * Timeline verticale d'événements (historique de dossier, journal d'audit,
 * suivi d'actions).
 *
 * Pour des icônes custom dans les dots, fournir `[iconTemplate]` qui reçoit
 * `{ $implicit: item, index }`. Sinon le dot affiche l'index numéroté.
 */
@Component({
  selector: 'ori-timeline',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ol class="ori-timeline">
      @for (item of items; track item.id; let i = $index) {
        <li [class]="itemClassFor(item)">
          <span class="ori-timeline__dot" aria-hidden="true">
            @if (iconTemplate) {
              <ng-container
                [ngTemplateOutlet]="iconTemplate"
                [ngTemplateOutletContext]="{ $implicit: item, index: i }"
              ></ng-container>
            } @else {
              {{ i + 1 }}
            }
          </span>
          <div class="ori-timeline__content">
            <span class="ori-timeline__title">{{ item.title }}</span>
            <span class="ori-timeline__meta">
              {{ item.timestamp }}
              @if (item.actor) {
                · {{ item.actor }}
              }
            </span>
            @if (item.description) {
              <span class="ori-timeline__description">{{ item.description }}</span>
            }
          </div>
        </li>
      }
    </ol>
  `,
  imports: [CommonModule],
})
export class OriTimelineComponent {
  @Input() items: OriTimelineItem[] = [];
  @Input() iconTemplate?: TemplateRef<{ $implicit: OriTimelineItem; index: number }>;

  itemClassFor(item: OriTimelineItem): string {
    const status = item.status ?? 'completed';
    return `ori-timeline__item ori-timeline__item--${status}`;
  }
}
