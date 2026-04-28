import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  File,
  FileArchive,
  FileSpreadsheet,
  FileText,
  FileType,
  Image,
  LucideAngularModule,
} from 'lucide-angular';
import { OriButtonComponent } from '../button/button.component';
import { OriTagComponent } from '../tag/tag.component';
import { OriTooltipDirective } from '../tooltip/tooltip.directive';

type LucideIconData = typeof File;

export type OriFileCardType = 'pdf' | 'image' | 'doc' | 'spreadsheet' | 'archive' | 'other';

export interface OriFileCardAction {
  /** Identifiant logique remonté avec (actionTriggered). */
  id: string;
  /** Étiquette utilisée comme aria-label sur le bouton et tooltip. */
  label: string;
  /** Icône Lucide (passer le binding direct, ex: `Eye`). */
  icon: unknown;
  disabled?: boolean;
  variant?: 'default' | 'danger';
}

export interface OriFileCardLink {
  label: string;
  href?: string;
}

const ICON_BY_TYPE: Record<OriFileCardType, LucideIconData> = {
  pdf: FileText,
  image: Image,
  doc: FileType,
  spreadsheet: FileSpreadsheet,
  archive: FileArchive,
  other: File,
};

const LABEL_BY_TYPE: Record<OriFileCardType, string> = {
  pdf: 'PDF',
  image: 'Image',
  doc: 'Document',
  spreadsheet: 'Tableur',
  archive: 'Archive',
  other: 'Fichier',
};

/**
 * Tuile de fichier (pièce jointe, document, archive). Mapping `type → icône`
 * porté par le DS pour garantir l'homogénéité entre services.
 *
 * Composant autonome : intègre déjà bordure, padding et ombre légère.
 */
@Component({
  selector: 'ori-file-card',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    OriButtonComponent,
    OriTagComponent,
    OriTooltipDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ori-file-card">
      <div class="ori-file-card__head">
        <span class="ori-file-card__icon" aria-hidden="true">
          <lucide-icon [img]="iconForType" [size]="20"></lucide-icon>
        </span>
        @if (actions && actions.length > 0) {
          <div class="ori-file-card__actions">
            @for (a of actions; track a.id) {
              <ori-button
                variant="ghost"
                size="sm"
                [oriTooltip]="a.label"
                [aria-label]="a.label"
                [disabled]="!!a.disabled"
                [attr.data-danger]="a.variant === 'danger' ? 'true' : null"
                (click)="actionTriggered.emit(a.id)"
              >
                <lucide-icon [img]="$any(a.icon)" [size]="16"></lucide-icon>
              </ori-button>
            }
          </div>
        }
      </div>

      <div class="ori-file-card__name" [attr.title]="name">{{ name }}</div>

      <div class="ori-file-card__meta">
        <ori-tag variant="neutral">{{ typeLabel }}</ori-tag>
        @if (size || meta) {
          <span class="ori-file-card__meta-text">
            {{ size }}{{ size && meta ? ' · ' : '' }}{{ meta }}
          </span>
        }
      </div>

      @if (link) {
        @if (link.href) {
          <a class="ori-file-card__link" [href]="link.href" (click)="linkClicked.emit($event)">
            {{ link.label }}
          </a>
        } @else {
          <button type="button" class="ori-file-card__link" (click)="linkClicked.emit($event)">
            {{ link.label }}
          </button>
        }
      }
    </div>
  `,
})
export class OriFileCardComponent {
  @Input({ required: true }) name!: string;
  @Input({ required: true }) type!: OriFileCardType;
  @Input() size?: string;
  @Input() meta?: string;
  @Input() link?: OriFileCardLink;
  @Input() actions?: OriFileCardAction[];

  /** Émis avec l'`id` de l'action cliquée. */
  @Output() actionTriggered = new EventEmitter<string>();
  /** Émis quand le lien (footer) est cliqué. */
  @Output() linkClicked = new EventEmitter<MouseEvent>();

  get iconForType(): LucideIconData {
    return ICON_BY_TYPE[this.type] ?? File;
  }

  get typeLabel(): string {
    return LABEL_BY_TYPE[this.type] ?? 'Fichier';
  }
}
