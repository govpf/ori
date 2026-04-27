import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { LucideAngularModule, Globe, ChevronDown } from 'lucide-angular';

type LucideIconData = typeof Globe;

export interface OriLanguageOption {
  code: string;
  label: string;
}

/**
 * Sélecteur de langue compact (cf. décision J.2).
 * Liste de langues fournie par l'app, pas de hardcoding.
 */
@Component({
  selector: 'ori-language-switcher',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ori-language-switcher">
      <button
        type="button"
        class="ori-language-switcher__trigger"
        aria-haspopup="listbox"
        [attr.aria-expanded]="open"
        [attr.aria-label]="triggerAriaLabel"
        (click)="toggle()"
      >
        <lucide-icon [img]="GlobeIcon" [size]="14" aria-hidden="true"></lucide-icon>
        {{ value }}
        <lucide-icon [img]="ChevronDownIcon" [size]="14" aria-hidden="true"></lucide-icon>
      </button>
      @if (open) {
        <ul role="listbox" class="ori-language-switcher__menu">
          @for (lang of languages; track lang.code) {
            <li role="presentation">
              <button
                type="button"
                role="option"
                class="ori-language-switcher__option"
                [attr.aria-checked]="lang.code === value"
                (click)="select(lang.code)"
              >
                {{ lang.label }}
              </button>
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class OriLanguageSwitcherComponent {
  @Input() languages: OriLanguageOption[] = [];
  @Input() value: string = '';
  @Input() triggerAriaLabel: string = 'Changer la langue';

  @Output() languageChange = new EventEmitter<string>();

  open = false;

  protected readonly GlobeIcon: LucideIconData = Globe;
  protected readonly ChevronDownIcon: LucideIconData = ChevronDown;

  private readonly host = inject(ElementRef<HTMLElement>);

  toggle(): void {
    this.open = !this.open;
  }

  select(code: string): void {
    this.languageChange.emit(code);
    this.open = false;
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent): void {
    if (!this.open) return;
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.open = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.open = false;
  }
}
