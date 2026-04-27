import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

export type OriCardVariant = 'default' | 'elevated' | 'flat';

/**
 * Conteneur Card avec 3 variantes (default / elevated / flat).
 * Composer avec <ori-card-header>, <ori-card-body>, <ori-card-footer> ou contenu libre.
 */
@Component({
  selector: 'ori-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes',
  },
})
export class OriCardComponent {
  @Input() variant: OriCardVariant = 'default';
  /**
   * Classe CSS additionnelle appliquée à l'élément hôte `<ori-card>`.
   * Pratique pour ajouter des marges, layout, ou des helpers Tailwind
   * dans le projet consommateur.
   */
  @Input() wrapperClass: string = '';

  get classes(): string {
    return [
      'ori-card',
      this.variant !== 'default' ? `ori-card--${this.variant}` : null,
      this.wrapperClass || null,
    ]
      .filter((c): c is string => Boolean(c))
      .join(' ');
  }
}

@Component({
  selector: 'ori-card-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (title) {
      <h3 class="ori-card__title">{{ title }}</h3>
    }
    @if (subtitle) {
      <p class="ori-card__subtitle">{{ subtitle }}</p>
    }
    <ng-content></ng-content>
  `,
  host: { class: 'ori-card__header' },
})
export class OriCardHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
}

@Component({
  selector: 'ori-card-body',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  host: { class: 'ori-card__body' },
})
export class OriCardBodyComponent {}

@Component({
  selector: 'ori-card-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  host: { class: 'ori-card__footer' },
})
export class OriCardFooterComponent {}
