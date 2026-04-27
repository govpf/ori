import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

export interface OriFooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface OriFooterUtilityLink {
  label: string;
  href: string;
}

/**
 * Footer app-level. Brand + colonnes de liens en haut, mention légale
 * + liens utilitaires (accessibilité, mentions, plan du site) en bas.
 */
@Component({
  selector: 'ori-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <footer class="ori-footer">
      <div class="ori-footer__content">
        <div class="ori-footer__brand">
          <strong style="color: var(--color-text-primary); font-size: 0.9375rem;">
            {{ brand }}
          </strong>
          @if (description) {
            <span>{{ description }}</span>
          }
        </div>
        @if (columns.length > 0) {
          <div class="ori-footer__columns">
            @for (col of columns; track col.title) {
              <div class="ori-footer__column">
                <span class="ori-footer__column-title">{{ col.title }}</span>
                @for (link of col.links; track link.href) {
                  <a [href]="link.href" class="ori-link ori-link--quiet">{{ link.label }}</a>
                }
              </div>
            }
          </div>
        }
      </div>
      @if (legal || utilityLinks.length > 0) {
        <div class="ori-footer__bottom">
          @if (legal) {
            <span>{{ legal }}</span>
          }
          @if (utilityLinks.length > 0) {
            <div style="display: flex; gap: 16px; flex-wrap: wrap;">
              @for (link of utilityLinks; track link.href) {
                <a [href]="link.href" class="ori-link ori-link--quiet">{{ link.label }}</a>
              }
            </div>
          }
        </div>
      }
    </footer>
  `,
})
export class OriFooterComponent {
  @Input() brand: string = 'Polynésie française';
  @Input() description: string = '';
  @Input() columns: OriFooterColumn[] = [];
  @Input() legal: string = '';
  @Input() utilityLinks: OriFooterUtilityLink[] = [];
}
