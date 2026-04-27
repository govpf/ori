import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { LucideAngularModule, ExternalLink } from 'lucide-angular';

type LucideIconData = typeof ExternalLink;

export type OriLinkVariant = 'default' | 'quiet';

function isExternalUrl(href: string | undefined): boolean {
  if (!href) return false;
  return /^(https?:|\/\/)/i.test(href);
}

/**
 * Lien stylé avec détection automatique des URLs externes
 * (`target="_blank"` + `rel="noreferrer noopener"` + icône + libellé
 * caché « nouvel onglet » pour les lecteurs d'écran).
 */
@Component({
  selector: 'ori-link',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <a [href]="href" [class]="linkClasses" [attr.target]="finalTarget" [attr.rel]="finalRel">
      <ng-content></ng-content>
      @if (isExternal) {
        <lucide-icon
          [img]="ExternalIcon"
          [size]="14"
          class="ori-link__external"
          aria-hidden="true"
        ></lucide-icon>
        <span
          style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;"
        >
          (nouvel onglet)
        </span>
      }
    </a>
  `,
})
export class OriLinkComponent {
  @Input() href: string = '';
  @Input() variant: OriLinkVariant = 'default';
  @Input() target: string = '';
  @Input() rel: string = '';
  /**
   * Force l'externalité du lien. Si non fourni, détecté à partir de
   * `href` (commence par `http(s):` ou `//`).
   */
  @Input() external: boolean | null = null;

  protected readonly ExternalIcon: LucideIconData = ExternalLink;

  get isExternal(): boolean {
    return this.external ?? isExternalUrl(this.href);
  }

  get finalTarget(): string | null {
    if (this.target) return this.target;
    return this.isExternal ? '_blank' : null;
  }

  get finalRel(): string | null {
    if (this.rel) return this.rel;
    return this.isExternal ? 'noreferrer noopener' : null;
  }

  get linkClasses(): string {
    return ['ori-link', this.variant === 'quiet' ? 'ori-link--quiet' : null]
      .filter((c): c is string => Boolean(c))
      .join(' ');
  }
}
