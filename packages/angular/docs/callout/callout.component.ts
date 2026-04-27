import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

export type OriCalloutVariant = 'note' | 'tip' | 'warning' | 'danger';

const ICONS: Record<OriCalloutVariant, string> = {
  note: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 4a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zm1 12h-2v-7h2v7z',
  tip: 'M12 2L9 9 2 9.27l5.45 4.73L5.82 21 12 17.27 18.18 21l-1.63-7 5.45-4.73L15 9z',
  warning: 'M12 2L1 21h22L12 2zm0 6l7.53 13H4.47L12 8zm-1 4v4h2v-4h-2zm0 6v2h2v-2h-2z',
  danger: 'M11 9h2v6h-2zm0 8h2v2h-2zm1-15a10 10 0 100 20 10 10 0 000-20z',
};

/**
 * Callout éditorial pour mettre en avant une information dans la doc.
 * Distinct de `<ori-alert>` (transactionnel app, dismissible) : `Callout` est
 * statique et orienté lecture longue.
 */
@Component({
  selector: 'ori-callout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<aside [class]="classes" role="note">
    <svg
      class="ori-callout__icon"
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path [attr.d]="iconPath" />
    </svg>
    <div class="ori-callout__body">
      @if (title) {
        <strong class="ori-callout__title">{{ title }}</strong>
      }
      <ng-content></ng-content>
    </div>
  </aside>`,
})
export class OriCalloutComponent {
  @Input() variant: OriCalloutVariant = 'note';
  @Input() title?: string;

  get classes(): string {
    return `ori-callout ori-callout--${this.variant}`;
  }

  get iconPath(): string {
    return ICONS[this.variant];
  }
}
