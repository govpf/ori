import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

let nextUid = 0;

/**
 * Form layout standardisé.
 *
 * Pose la structure standard d'un formulaire administratif. Le DS ne fournit
 * ni validation ni gestion d'erreurs (chaque app a déjà ses propres tools :
 * Reactive Forms, signals…). Seule la structure visuelle et l'a11y sont
 * standardisées.
 *
 * Pattern composé : <ori-form> + <ori-form-section> + <ori-form-field> +
 * <ori-form-actions>.
 *
 * Différences vs React (où FormField utilise une render-prop pour passer
 * id / aria-describedby / required au control) : côté Angular, l'utilisateur
 * récupère les ids via les variables locales `#field` ou `#errorTpl` et les
 * applique manuellement sur l'<input>. Pattern idiomatique Angular.
 */
@Component({
  selector: 'ori-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <form class="ori-form" novalidate (submit)="onSubmit($event)">
      <ng-content></ng-content>
    </form>
  `,
})
export class OriFormComponent {
  @Output() formSubmit = new EventEmitter<Event>();

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.formSubmit.emit(event);
  }
}

/**
 * Section d'un formulaire : titre + description + groupe de champs.
 */
@Component({
  selector: 'ori-form-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <section [attr.aria-labelledby]="title ? titleId : null" class="ori-form-section">
      @if (title || description) {
        <header class="ori-form-section__header">
          @if (title) {
            <h3 [id]="titleId" class="ori-form-section__title">{{ title }}</h3>
          }
          @if (description) {
            <p class="ori-form-section__description">{{ description }}</p>
          }
        </header>
      }
      <div class="ori-form-section__fields">
        <ng-content></ng-content>
      </div>
    </section>
  `,
})
export class OriFormSectionComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  protected readonly titleId = `pf-form-section-${++nextUid}`;
}

/**
 * Champ de formulaire : label + slot input + hint + erreur, avec ARIA câblé.
 *
 * L'utilisateur projette son input via le slot par défaut. Pour brancher
 * `aria-describedby` et l'`id` du label, lire les propriétés exposées via
 * la variable de template :
 *
 * ```html
 * <ori-form-field #field label="Nom" required hint="Indication">
 *   <ori-input [id]="field.controlId" [attr.aria-describedby]="field.describedById"></ori-input>
 * </ori-form-field>
 * ```
 *
 * Pour des cas simples, l'utilisateur peut aussi se contenter d'imbriquer
 * un `<input>` natif sans wiring (le label restera lié visuellement mais
 * pas via htmlFor).
 */
@Component({
  selector: 'ori-form-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="'ori-form-field ' + (error ? 'ori-form-field--invalid' : '')">
      <label [attr.for]="controlId" class="ori-form-field__label">
        {{ label }}
        @if (required) {
          <span class="ori-form-field__required" aria-hidden="true"> *</span>
        }
      </label>
      <ng-content></ng-content>
      @if (hint) {
        <p [id]="hintId" class="ori-form-field__hint">{{ hint }}</p>
      }
      @if (error) {
        <p [id]="errorId" class="ori-form-field__error" role="alert">{{ error }}</p>
      }
    </div>
  `,
})
export class OriFormFieldComponent {
  @Input() label: string = '';
  @Input() hint: string = '';
  @Input() error: string = '';
  @Input() required: boolean = false;

  private readonly uid = ++nextUid;
  /** ID exposé pour brancher l'input projeté via [id] et [for] du label. */
  readonly controlId = `pf-form-field-${this.uid}`;

  get hintId(): string | null {
    return this.hint ? `${this.controlId}-hint` : null;
  }

  get errorId(): string | null {
    return this.error ? `${this.controlId}-error` : null;
  }

  /** À brancher sur l'input via [attr.aria-describedby]. */
  get describedById(): string | null {
    const parts = [this.hintId, this.errorId].filter(Boolean);
    return parts.length ? parts.join(' ') : null;
  }
}

/**
 * Pied du formulaire : zone d'actions (boutons).
 */
@Component({
  selector: 'ori-form-actions',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="'ori-form-actions ori-form-actions--' + align">
      <ng-content></ng-content>
    </div>
  `,
})
export class OriFormActionsComponent {
  @Input() align: 'start' | 'center' | 'end' = 'end';
}
