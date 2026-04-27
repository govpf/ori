import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
  ElementRef,
} from '@angular/core';
import { LucideAngularModule, Upload, X } from 'lucide-angular';

// lucide-angular n'exporte pas de type public depuis le barrel ; on
// reproduit la forme via typeof pour éviter TS2742 lors du build
// ng-packagr en mode partiel.
type LucideIconData = typeof Upload;

export interface OriFileRejection {
  file: File;
  reason: 'size' | 'type';
}

let nextUid = 0;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} Go`;
}

function matchesAccept(file: File, accept: string): boolean {
  if (!accept) return true;
  const patterns = accept.split(',').map((p) => p.trim().toLowerCase());
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  return patterns.some((p) => {
    if (p.startsWith('.')) return fileName.endsWith(p);
    if (p.endsWith('/*')) return fileType.startsWith(p.slice(0, -1));
    return fileType === p;
  });
}

/**
 * Sélecteur de fichiers avec drag-and-drop, basé sur `<input type="file">`.
 *
 * Choix volontaire (cf. décision E.3) : l'upload réseau reste à
 * l'app. Le composant émet `(filesChange)` à chaque sélection ; c'est
 * l'app qui POSTe (avec sa logique d'auth, de progression, de retry).
 */
@Component({
  selector: 'ori-file-upload',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div [class]="fieldClasses">
      @if (label) {
        <span [id]="inputId + '-label'" [class]="labelClasses">{{ label }}</span>
      }
      <div class="ori-file">
        <label
          [class]="dropzoneClasses"
          [attr.for]="inputId"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave()"
          (drop)="onDrop($event)"
        >
          <input
            #inputEl
            type="file"
            class="ori-file__input"
            [id]="inputId"
            [multiple]="multiple"
            [accept]="accept || null"
            [disabled]="disabled"
            [required]="required"
            [attr.name]="name || null"
            [attr.aria-invalid]="error ? 'true' : null"
            [attr.aria-describedby]="describedBy"
            [attr.aria-labelledby]="label ? inputId + '-label' : null"
            (change)="onInputChange($event)"
          />
          <lucide-icon [img]="UploadIcon" [size]="24" aria-hidden="true"></lucide-icon>
          <span class="ori-file__dropzone-title">{{ dropzoneTitle }}</span>
          @if (dropzoneHint) {
            <span class="ori-file__dropzone-hint">{{ dropzoneHint }}</span>
          }
        </label>

        @if (files.length > 0) {
          <ul class="ori-file__list">
            @for (file of files; track file.name + i; let i = $index) {
              <li class="ori-file__item">
                <span class="ori-file__item-name">{{ file.name }}</span>
                <span class="ori-file__item-size">{{ formatSize(file.size) }}</span>
                <button
                  type="button"
                  class="ori-file__item-remove"
                  [attr.aria-label]="'Retirer ' + file.name"
                  [disabled]="disabled"
                  (click)="removeAt(i)"
                >
                  <lucide-icon [img]="XIcon" [size]="16" aria-hidden="true"></lucide-icon>
                </button>
              </li>
            }
          </ul>
        }
      </div>
      @if (hint && !error) {
        <span [attr.id]="hintId" class="ori-field__hint">{{ hint }}</span>
      }
      @if (error) {
        <span [attr.id]="errorId" class="ori-field__error" role="alert">{{ error }}</span>
      }
    </div>
  `,
})
export class OriFileUploadComponent {
  @Input() label: string = '';
  @Input() hint: string = '';
  @Input() error: string = '';
  @Input() multiple: boolean = false;
  @Input() accept: string = '';
  @Input() maxSize: number | null = null;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() wrapperClass: string = '';
  @Input() dropzoneTitle: string = 'Glissez-déposez ou cliquez pour sélectionner';
  @Input() dropzoneHint: string = '';

  /**
   * Liste des fichiers. Bind compatible avec [(files)] via
   * (filesChange). Si l'app passe sa propre liste, le composant la
   * reflète ; sinon il maintient sa liste interne.
   */
  @Input() files: File[] = [];
  @Output() filesChange = new EventEmitter<File[]>();
  @Output() reject = new EventEmitter<OriFileRejection[]>();

  @ViewChild('inputEl') private inputEl?: ElementRef<HTMLInputElement>;

  protected readonly UploadIcon: LucideIconData = Upload;
  protected readonly XIcon: LucideIconData = X;

  dragging = false;

  private readonly autoId = `pf-file-${++nextUid}`;

  get inputId(): string {
    return this.id || this.autoId;
  }

  get hintId(): string | null {
    return this.hint && !this.error ? `${this.inputId}-hint` : null;
  }

  get errorId(): string | null {
    return this.error ? `${this.inputId}-error` : null;
  }

  get describedBy(): string | null {
    const ids = [this.hintId, this.errorId].filter(Boolean) as string[];
    return ids.length ? ids.join(' ') : null;
  }

  get fieldClasses(): string {
    return ['ori-field', this.wrapperClass].filter((c): c is string => Boolean(c)).join(' ');
  }

  get labelClasses(): string {
    return ['ori-field__label', this.required ? 'ori-field__label--required' : null]
      .filter((c): c is string => Boolean(c))
      .join(' ');
  }

  get dropzoneClasses(): string {
    return [
      'ori-file__dropzone',
      this.dragging ? 'ori-file__dropzone--dragging' : null,
      this.error ? 'ori-file__dropzone--invalid' : null,
    ]
      .filter((c): c is string => Boolean(c))
      .join(' ');
  }

  formatSize(bytes: number): string {
    return formatBytes(bytes);
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) this.handleIncoming(input.files);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (this.disabled) return;
    if (!this.dragging) this.dragging = true;
  }

  onDragLeave(): void {
    this.dragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;
    if (this.disabled) return;
    if (event.dataTransfer?.files?.length) this.handleIncoming(event.dataTransfer.files);
  }

  removeAt(index: number): void {
    const next = this.files.filter((_, i) => i !== index);
    this.files = next;
    this.filesChange.emit(next);
    if (this.inputEl) this.inputEl.nativeElement.value = '';
  }

  private handleIncoming(incoming: FileList): void {
    const arr = Array.from(incoming);
    const accepted: File[] = [];
    const rejected: OriFileRejection[] = [];
    for (const file of arr) {
      if (!matchesAccept(file, this.accept)) {
        rejected.push({ file, reason: 'type' });
      } else if (this.maxSize !== null && file.size > this.maxSize) {
        rejected.push({ file, reason: 'size' });
      } else {
        accepted.push(file);
      }
    }
    if (rejected.length) this.reject.emit(rejected);
    if (!accepted.length) return;
    const next = this.multiple ? [...this.files, ...accepted] : accepted.slice(0, 1);
    this.files = next;
    this.filesChange.emit(next);
  }
}
