import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, signal } from '@angular/core';

/**
 * Bloc de code avec en-tête (langue / nom de fichier) et bouton de copie.
 *
 * Le syntax highlighting n'est PAS embarqué : projeter du HTML stylé via
 * `<ng-content>` pour afficher du code highlighté côté serveur (Shiki, Prism).
 * Sans projection, le contenu de `code` est rendu en texte brut.
 */
@Component({
  selector: 'ori-code-block',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<figure class="ori-code-block">
    <div class="ori-code-block__header">
      <span class="ori-code-block__lang">{{ filename ?? lang }}</span>
      @if (!noCopy) {
        <button
          type="button"
          class="ori-code-block__copy"
          [attr.data-copied]="copied() ? 'true' : null"
          aria-label="Copier le code dans le presse-papiers"
          (click)="onCopy()"
        >
          <span>{{ copied() ? 'Copié' : 'Copier' }}</span>
        </button>
      }
    </div>
    <pre class="ori-code-block__pre"><code><ng-content>{{ code }}</ng-content></code></pre>
  </figure>`,
})
export class OriCodeBlockComponent {
  @Input({ required: true }) code!: string;
  @Input() lang: string = 'text';
  @Input() filename?: string;
  @Input() noCopy: boolean = false;

  protected readonly copied = signal(false);

  protected onCopy(): void {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(this.code).then(() => {
      this.copied.set(true);
      window.setTimeout(() => this.copied.set(false), 1500);
    });
  }
}
