import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { Download } from 'lucide-react';

export interface DownloadButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Type de fichier affiché en métadonnée (ex. "PDF", "DOCX"). Optionnel. */
  fileType?: string;
  /** Taille du fichier déjà formatée (ex. "2.55 MB"). Optionnel. */
  fileSize?: string;
  /** Texte du lien. */
  children?: ReactNode;
  /**
   * Si `true`, ne rend pas la ligne de métadonnée même si `fileType`/`fileSize`
   * sont fournis. Utile dans des listes denses.
   */
  hideMeta?: boolean;
}

/**
 * Lien de téléchargement avec icône et métadonnées de fichier.
 *
 * Reprend l'attribut natif HTML `download` : si `download` est passé sans
 * valeur, le navigateur déclenche le téléchargement avec le nom du fichier
 * source. Avec une valeur, force le nom du fichier sauvegardé.
 *
 * Quand `fileType` et/ou `fileSize` sont fournis, une ligne de méta s'affiche
 * sous le lien sous la forme "PDF - 2.55 MB" (séparateur tiret simple).
 *
 * a11y : le bouton reste un `<a>` natif, donc clavier et lecteur d'écran
 * gèrent l'activation. L'icône est marquée `aria-hidden`.
 */
export const DownloadButton = forwardRef<HTMLAnchorElement, DownloadButtonProps>(
  function DownloadButton(
    { fileType, fileSize, hideMeta, className, children, download = '', ...rest },
    ref,
  ) {
    const showMeta = !hideMeta && (fileType || fileSize);
    const metaParts = [fileType, fileSize].filter(Boolean) as string[];

    return (
      <span className={clsx('ori-download-button', className)}>
        <a ref={ref} className="ori-download-button__link" download={download} {...rest}>
          <span className="ori-download-button__label">{children}</span>
          <Download size={16} className="ori-download-button__icon" aria-hidden="true" />
        </a>
        {showMeta && (
          <span className="ori-download-button__meta" aria-hidden="true">
            {metaParts.join(' - ')}
          </span>
        )}
      </span>
    );
  },
);
