import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

export interface OriMainNavigationItem {
  label: string;
  href: string;
  current?: boolean;
}

/**
 * Navigation principale horizontale.
 * `<nav aria-label>` + `<ul>` + `aria-current="page"` sur l'item actif.
 */
@Component({
  selector: 'ori-main-navigation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <nav [attr.aria-label]="ariaLabel">
      <ul class="ori-main-nav">
        @for (item of items; track item.href) {
          <li class="ori-main-nav__item">
            <a
              [href]="item.href"
              class="ori-main-nav__link"
              [attr.aria-current]="item.current ? 'page' : null"
              >{{ item.label }}</a
            >
          </li>
        }
      </ul>
    </nav>
  `,
})
export class OriMainNavigationComponent {
  @Input() items: OriMainNavigationItem[] = [];
  @Input() ariaLabel: string = 'Navigation principale';
}
