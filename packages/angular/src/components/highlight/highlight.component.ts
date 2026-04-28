import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';

interface HighlightSegment {
  text: string;
  highlighted: boolean;
}

/**
 * Surlignage basé sur l'élément `<mark>` natif HTML5.
 *
 * Trois modes :
 * - Direct : `<ori-highlight text="texte"></ori-highlight>` surligne tout
 *   (pas de prop `query` du tout, donc undefined)
 * - Recherche inactive : `<ori-highlight text="..." [query]="''">`
 *   rend le texte tel quel (recherche en cours mais champ vide)
 * - Recherche active : `<ori-highlight text="..." query="ti">` surligne
 *   uniquement les occurrences (insensible à la casse)
 *
 * Le découpage en segments est fait côté composant : on rend des
 * `<span>` et `<mark>` Angular-safe, pas de bypass de sanitizer.
 */
@Component({
  selector: 'ori-highlight',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (query === undefined) {
      <mark class="ori-highlight">{{ text }}</mark>
    } @else if (query === '') {
      {{ text }}
    } @else {
      @for (seg of segments; track $index) {
        @if (seg.highlighted) {
          <mark class="ori-highlight">{{ seg.text }}</mark>
        } @else {
          {{ seg.text }}
        }
      }
    }
  `,
})
export class OriHighlightComponent implements OnChanges {
  @Input() text: string = '';
  @Input() query?: string;

  segments: HighlightSegment[] = [];

  ngOnChanges(_changes: SimpleChanges): void {
    this.segments = this.computeSegments();
  }

  private computeSegments(): HighlightSegment[] {
    if (!this.query || !this.text) return [];
    const result: HighlightSegment[] = [];
    const lowerText = this.text.toLowerCase();
    const lowerQuery = this.query.toLowerCase();
    let cursor = 0;
    while (cursor < this.text.length) {
      const idx = lowerText.indexOf(lowerQuery, cursor);
      if (idx === -1) {
        result.push({ text: this.text.slice(cursor), highlighted: false });
        break;
      }
      if (idx > cursor) {
        result.push({ text: this.text.slice(cursor, idx), highlighted: false });
      }
      result.push({
        text: this.text.slice(idx, idx + this.query.length),
        highlighted: true,
      });
      cursor = idx + this.query.length;
    }
    return result;
  }
}
