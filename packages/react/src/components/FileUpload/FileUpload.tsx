import { forwardRef, useId, useRef, useState, type DragEvent, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { Upload, X } from 'lucide-react';

export interface FileUploadProps {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  /** Accepter plusieurs fichiers. Default: false. */
  multiple?: boolean;
  /** Filtre MIME passé à `<input accept>`. Ex: `image/*,application/pdf`. */
  accept?: string;
  /** Taille max en octets. Les fichiers dépassant sont rejetés avec un onError. */
  maxSize?: number;
  /** Désactive l'input + la dropzone. */
  disabled?: boolean;
  /**
   * Liste contrôlée des fichiers sélectionnés. Si fourni, `<FileUpload>`
   * devient contrôlé : c'est l'app qui décide quand mettre à jour la
   * liste. Sinon, le composant maintient sa propre liste interne.
   */
  files?: File[];
  /** Appelé à chaque changement de la liste. */
  onFilesChange?: (files: File[]) => void;
  /**
   * Appelé quand un fichier est rejeté pour cause de validation
   * (taille, type). L'app peut afficher un toast / un message.
   */
  onReject?: (rejected: { file: File; reason: 'size' | 'type' }[]) => void;
  /** Texte principal de la dropzone. */
  dropzoneTitle?: ReactNode;
  /** Texte secondaire (formats acceptés, taille max). */
  dropzoneHint?: ReactNode;
  id?: string;
  name?: string;
  wrapperClassName?: string;
  className?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} Go`;
}

function matchesAccept(file: File, accept: string | undefined): boolean {
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
 * l'app. Le composant émet `onFilesChange(File[])` à chaque
 * sélection ; c'est l'app qui POSTe (avec sa logique d'auth, de
 * progression, de retry).
 */
export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(function FileUpload(
  {
    label,
    hint,
    error,
    required,
    multiple = false,
    accept,
    maxSize,
    disabled,
    files: controlledFiles,
    onFilesChange,
    onReject,
    dropzoneTitle = 'Glissez-déposez ou cliquez pour sélectionner',
    dropzoneHint,
    id,
    name,
    wrapperClassName,
    className,
  },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  const [internalFiles, setInternalFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isControlled = controlledFiles !== undefined;
  const files = isControlled ? controlledFiles : internalFiles;

  const validateFiles = (
    incoming: File[],
  ): { accepted: File[]; rejected: { file: File; reason: 'size' | 'type' }[] } => {
    const accepted: File[] = [];
    const rejected: { file: File; reason: 'size' | 'type' }[] = [];
    for (const file of incoming) {
      if (!matchesAccept(file, accept)) {
        rejected.push({ file, reason: 'type' });
      } else if (maxSize !== undefined && file.size > maxSize) {
        rejected.push({ file, reason: 'size' });
      } else {
        accepted.push(file);
      }
    }
    return { accepted, rejected };
  };

  const updateFiles = (next: File[]) => {
    if (!isControlled) setInternalFiles(next);
    onFilesChange?.(next);
  };

  const handleIncoming = (incoming: FileList | File[]) => {
    const arr = Array.from(incoming);
    const { accepted, rejected } = validateFiles(arr);
    if (rejected.length) onReject?.(rejected);
    if (!accepted.length) return;
    const next = multiple ? [...files, ...accepted] : accepted.slice(0, 1);
    updateFiles(next);
  };

  const removeAt = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    updateFiles(next);
    // Reset l'input pour permettre de re-sélectionner le même fichier
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (disabled) return;
    if (!dragging) setDragging(true);
  };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files?.length) handleIncoming(e.dataTransfer.files);
  };

  return (
    <div className={clsx('ori-field', wrapperClassName)}>
      {label && (
        <span
          id={`${inputId}-label`}
          className={clsx('ori-field__label', required && 'ori-field__label--required')}
        >
          {label}
        </span>
      )}
      <div className={clsx('ori-file', className)}>
        <label
          className={clsx(
            'ori-file__dropzone',
            dragging && 'ori-file__dropzone--dragging',
            error && 'ori-file__dropzone--invalid',
          )}
          htmlFor={inputId}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) ref.current = node;
            }}
            id={inputId}
            type="file"
            className="ori-file__input"
            multiple={multiple}
            accept={accept}
            disabled={disabled}
            required={required}
            name={name}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            aria-labelledby={label ? `${inputId}-label` : undefined}
            onChange={(e) => {
              if (e.target.files) handleIncoming(e.target.files);
            }}
          />
          <Upload size={24} aria-hidden="true" />
          <span className="ori-file__dropzone-title">{dropzoneTitle}</span>
          {dropzoneHint && <span className="ori-file__dropzone-hint">{dropzoneHint}</span>}
        </label>

        {files.length > 0 && (
          <ul className="ori-file__list">
            {files.map((file, i) => (
              <li key={`${file.name}-${i}`} className="ori-file__item">
                <span className="ori-file__item-name">{file.name}</span>
                <span className="ori-file__item-size">{formatBytes(file.size)}</span>
                <button
                  type="button"
                  className="ori-file__item-remove"
                  onClick={() => removeAt(i)}
                  aria-label={`Retirer ${file.name}`}
                  disabled={disabled}
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {hint && !error && (
        <span id={hintId} className="ori-field__hint">
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className="ori-field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
});
