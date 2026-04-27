import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

export type OriAvatarSize = 'sm' | 'md' | 'lg' | 'xl';

function defaultInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
}

/**
 * Avatar avec image et fallback sur initiales.
 * Si `src` n'est pas fourni ou échoue à charger, on affiche les
 * initiales calculées depuis `alt` (ou explicites via `initials`).
 */
@Component({
  selector: 'ori-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span [class]="avatarClasses" role="img" [attr.aria-label]="alt">
      @if (src && !imageFailed) {
        <img [src]="src" alt="" class="ori-avatar__img" (error)="imageFailed = true" />
      } @else {
        <span aria-hidden="true">{{ displayInitials }}</span>
      }
    </span>
  `,
})
export class OriAvatarComponent {
  @Input() src: string = '';
  @Input() alt: string = '';
  @Input() initials: string = '';
  @Input() size: OriAvatarSize = 'md';

  imageFailed = false;

  get avatarClasses(): string {
    return `ori-avatar ori-avatar--${this.size}`;
  }

  get displayInitials(): string {
    return this.initials || defaultInitials(this.alt);
  }
}
