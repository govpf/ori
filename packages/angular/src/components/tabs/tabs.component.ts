import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
  forwardRef,
  inject,
} from '@angular/core';

let nextUid = 0;

/**
 * Item d'un `<ori-tabs>`. Le contenu projeté correspond au panel.
 * Le panel n'est rendu que quand l'item est actif (parité React).
 */
@Component({
  selector: 'ori-tab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (isActive) {
      <div
        role="tabpanel"
        [id]="tabsBaseId + '-panel-' + value"
        [attr.aria-labelledby]="tabsBaseId + '-tab-' + value"
        [attr.tabindex]="0"
        class="ori-tabs__panel"
      >
        <ng-content></ng-content>
      </div>
    }
  `,
})
export class OriTabComponent {
  @Input() value: string = '';
  @Input() label: string = '';
  @Input() disabled: boolean = false;

  /** Renseignés par le parent <ori-tabs>. */
  tabsBaseId: string = '';
  isActive: boolean = false;

  private readonly cdr = inject(ChangeDetectorRef);

  setActive(active: boolean): void {
    if (this.isActive !== active) {
      this.isActive = active;
      this.cdr.markForCheck();
    }
  }
}

/**
 * Onglets ARIA avec activation manuelle (cf. décision F.2).
 */
@Component({
  selector: 'ori-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ori-tabs">
      <div role="tablist" [attr.aria-label]="ariaLabel || null" class="ori-tabs__list">
        @for (tab of tabsArray; track tab.value) {
          <button
            #tabBtn
            type="button"
            role="tab"
            [id]="baseId + '-tab-' + tab.value"
            [attr.aria-selected]="tab.value === value"
            [attr.aria-controls]="baseId + '-panel-' + tab.value"
            [attr.tabindex]="tab.value === value ? 0 : -1"
            [disabled]="tab.disabled"
            class="ori-tabs__tab"
            (click)="select(tab.value)"
            (keydown)="onKeyDown($event, tab.value)"
          >
            {{ tab.label }}
          </button>
        }
      </div>
      <ng-content></ng-content>
    </div>
  `,
})
export class OriTabsComponent implements AfterContentInit {
  @Input() value: string = '';
  @Input() ariaLabel: string = '';
  @Output() valueChange = new EventEmitter<string>();

  @ContentChildren(forwardRef(() => OriTabComponent))
  private tabsRef?: QueryList<OriTabComponent>;

  @ViewChildren('tabBtn') private buttons?: QueryList<ElementRef<HTMLButtonElement>>;

  readonly baseId = `pf-tabs-${++nextUid}`;
  tabsArray: { value: string; label: string; disabled: boolean }[] = [];

  private readonly cdr = inject(ChangeDetectorRef);

  ngAfterContentInit(): void {
    this.refresh();
    this.tabsRef?.changes.subscribe(() => this.refresh());
  }

  private refresh(): void {
    if (!this.tabsRef) return;
    this.tabsArray = this.tabsRef.toArray().map((t) => ({
      value: t.value,
      label: t.label,
      disabled: t.disabled,
    }));
    this.tabsRef.forEach((t) => {
      t.tabsBaseId = this.baseId;
      t.setActive(t.value === this.value);
    });
    this.cdr.markForCheck();
  }

  select(value: string): void {
    if (this.value === value) return;
    this.value = value;
    this.valueChange.emit(value);
    this.tabsRef?.forEach((t) => t.setActive(t.value === value));
  }

  onKeyDown(event: KeyboardEvent, currentValue: string): void {
    const enabled = this.tabsArray.filter((t) => !t.disabled);
    if (!enabled.length) return;
    const currentIndex = enabled.findIndex((t) => t.value === currentValue);
    let nextIndex: number | null = null;
    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % enabled.length;
        break;
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + enabled.length) % enabled.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = enabled.length - 1;
        break;
    }
    if (nextIndex === null) return;
    event.preventDefault();
    const targetValue = enabled[nextIndex].value;
    const idx = this.tabsArray.findIndex((t) => t.value === targetValue);
    this.buttons?.toArray()[idx]?.nativeElement.focus();
  }
}
