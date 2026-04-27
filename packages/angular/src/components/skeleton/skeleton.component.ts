import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

export type OriSkeletonVariant = 'text' | 'rect' | 'circle';

/**
 * Skeleton placeholder animé (shimmer) pour indiquer un chargement.
 * Décoratif (`aria-hidden`).
 */
@Component({
  selector: 'ori-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span
      [class]="skeletonClasses"
      [style.width]="cssWidth"
      [style.height]="cssHeight"
      aria-hidden="true"
    ></span>
  `,
})
export class OriSkeletonComponent {
  @Input() variant: OriSkeletonVariant = 'rect';
  @Input() width: string | number = '';
  @Input() height: string | number = '';

  get skeletonClasses(): string {
    return `ori-skeleton ori-skeleton--${this.variant}`;
  }

  get cssWidth(): string | null {
    if (this.width === '') return null;
    return typeof this.width === 'number' ? `${this.width}px` : this.width;
  }

  get cssHeight(): string | null {
    if (this.height === '') return null;
    return typeof this.height === 'number' ? `${this.height}px` : this.height;
  }
}
