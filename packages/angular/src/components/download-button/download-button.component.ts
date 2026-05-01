import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { LucideAngularModule, Download } from 'lucide-angular';

type LucideIconData = typeof Download;

/**
 * Lien de téléchargement avec icône et métadonnées de fichier.
 *
 * Reprend l'attribut natif HTML `download` : si la valeur est vide, le
 * navigateur télécharge avec le nom du fichier source ; avec une valeur,
 * force le nom de sauvegarde.
 *
 * Quand `fileType` et/ou `fileSize` sont fournis, une ligne de méta
 * s'affiche sous le lien sous la forme "PDF - 2.55 MB".
 *
 * a11y : ancre native, l'icône est `aria-hidden`.
 */
@Component({
  selector: 'ori-download-button',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span class="ori-download-button">
      <a class="ori-download-button__link" [attr.href]="href" [attr.download]="downloadAttr">
        <span class="ori-download-button__label">
          <ng-content></ng-content>
        </span>
        <lucide-icon
          class="ori-download-button__icon"
          [img]="DownloadIcon"
          [size]="16"
          aria-hidden="true"
        ></lucide-icon>
      </a>
      @if (showMeta) {
        <span class="ori-download-button__meta" aria-hidden="true">{{ metaText }}</span>
      }
    </span>
  `,
})
export class OriDownloadButtonComponent {
  @Input() href: string = '';
  /** Type de fichier affiché en métadonnée (ex. "PDF", "DOCX"). */
  @Input() fileType: string = '';
  /** Taille du fichier déjà formatée (ex. "2.55 MB"). */
  @Input() fileSize: string = '';
  /** Valeur de l'attribut `download`. Vide = laisser le navigateur décider. */
  @Input() download: string = '';
  /** Si `true`, masque la ligne de métadonnée même si fileType/fileSize sont fournis. */
  @Input() hideMeta: boolean = false;

  protected readonly DownloadIcon: LucideIconData = Download;

  get downloadAttr(): string | null {
    return this.download === undefined || this.download === null ? null : this.download;
  }

  get showMeta(): boolean {
    return !this.hideMeta && Boolean(this.fileType || this.fileSize);
  }

  get metaText(): string {
    return [this.fileType, this.fileSize].filter((s) => Boolean(s)).join(' - ');
  }
}
