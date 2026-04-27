import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { LucideAngularModule, ChevronDown } from 'lucide-angular';

type LucideIconData = typeof ChevronDown;

let nextUid = 0;

/**
 * Accordéon basé sur `<details>` / `<summary>` natifs HTML
 * (cf. décision F.1).
 *
 * Mode `single` : utilise l'attribut natif `name` partagé pour rendre
 * les items mutuellement exclusifs (Chrome 120+, Firefox 122+, Safari 17+).
 * Mode `multiple` : pas d'attribut `name`.
 */
@Component({
  selector: 'ori-accordion',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ori-accordion">
      <ng-content></ng-content>
    </div>
  `,
})
export class OriAccordionComponent {
  @Input() type: 'single' | 'multiple' = 'multiple';

  private readonly autoId = `pf-accordion-${++nextUid}`;

  /** Nom partagé entre les items en mode `single` (null en mode `multiple`). */
  get groupName(): string | null {
    return this.type === 'single' ? this.autoId : null;
  }
}

/**
 * Item d'un `<ori-accordion>`. Wrappe `<details>` + `<summary>`.
 *
 * Récupère le parent `OriAccordionComponent` via injection et applique
 * l'attribut natif `name` sur le `<details>` au montage si le parent
 * est en mode `single`.
 */
@Component({
  selector: 'ori-accordion-item',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <details #detailsEl class="ori-accordion__item" [open]="defaultOpen">
      <summary class="ori-accordion__summary">
        <span>{{ title }}</span>
        <lucide-icon
          [img]="ChevronIcon"
          [size]="18"
          class="ori-accordion__chevron"
          aria-hidden="true"
        ></lucide-icon>
      </summary>
      <div class="ori-accordion__content">
        <ng-content></ng-content>
      </div>
    </details>
  `,
})
export class OriAccordionItemComponent implements AfterViewInit {
  @Input() title: string = '';
  @Input() defaultOpen: boolean = false;

  @ViewChild('detailsEl') private detailsEl?: ElementRef<HTMLDetailsElement>;

  private readonly accordion = inject(OriAccordionComponent, { optional: true });
  private readonly renderer = inject(Renderer2);

  protected readonly ChevronIcon: LucideIconData = ChevronDown;

  ngAfterViewInit(): void {
    const groupName = this.accordion?.groupName;
    if (groupName && this.detailsEl) {
      this.renderer.setAttribute(this.detailsEl.nativeElement, 'name', groupName);
    }
  }
}
