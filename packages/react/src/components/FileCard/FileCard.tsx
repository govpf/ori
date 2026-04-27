import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';
import { clsx } from 'clsx';
import {
  File,
  FileArchive,
  FileSpreadsheet,
  FileText,
  FileType,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '../Button/Button.js';
import { Tag } from '../Tag/Tag.js';
import { Tooltip } from '../Tooltip/Tooltip.js';

export type FileCardType = 'pdf' | 'image' | 'doc' | 'spreadsheet' | 'archive' | 'other';

export interface FileCardAction {
  /** Étiquette utilisée comme aria-label sur le bouton et tooltip. */
  label: string;
  icon: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Si `true`, l'action est désactivée. */
  disabled?: boolean;
  /**
   * `'danger'` pour les actions destructives (couleur du bouton inchangée
   * mais sémantique exposée via `data-danger` pour l'app si besoin).
   */
  variant?: 'default' | 'danger';
}

export interface FileCardLink {
  label: ReactNode;
  href?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
}

export interface FileCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Nom du fichier (avec extension recommandée). */
  name: string;
  /**
   * Type de fichier. Détermine l'icône affichée et le libellé du Tag.
   * Mapping fait par le DS : un PDF a la même icône partout dans Ori.
   */
  type: FileCardType;
  /** Taille formatée (ex: "1.2 Mo"). */
  size?: ReactNode;
  /** Métadonnée libre affichée à droite du tag (ex: "Ajouté le 2026-04-22"). */
  meta?: ReactNode;
  /**
   * Lien optionnel affiché en pied de carte. Utile pour pointer vers
   * la ressource liée (démarche, dossier).
   */
  link?: FileCardLink;
  /**
   * Actions affichées en haut à droite de la carte (3 max recommandé).
   * Au-delà, regrouper dans un menu kebab côté app.
   */
  actions?: FileCardAction[];
}

const ICON_BY_TYPE: Record<FileCardType, typeof File> = {
  pdf: FileText,
  image: ImageIcon,
  doc: FileType,
  spreadsheet: FileSpreadsheet,
  archive: FileArchive,
  other: File,
};

const LABEL_BY_TYPE: Record<FileCardType, string> = {
  pdf: 'PDF',
  image: 'Image',
  doc: 'Document',
  spreadsheet: 'Tableur',
  archive: 'Archive',
  other: 'Fichier',
};

/**
 * Tuile présentant un fichier (pièce jointe, document, archive). Affiche
 * une icône typée, le nom, le type, la taille, une métadonnée libre, un
 * lien et jusqu'à quelques actions (aperçu, téléchargement, suppression).
 *
 * Le mapping `type → icône` est porté par le DS pour garantir qu'un PDF
 * ait la même icône dans tous les services qui consomment Ori.
 *
 * Le composant est autonome (pas besoin d'envelopper dans `<Card>`) :
 * il intègre déjà bordure, padding et ombre légère.
 */
export function FileCard({
  name,
  type,
  size,
  meta,
  link,
  actions,
  className,
  ...rest
}: FileCardProps) {
  const Icon = ICON_BY_TYPE[type];
  const typeLabel = LABEL_BY_TYPE[type];
  const metaSeparator = size && meta ? ' · ' : '';

  return (
    <div className={clsx('ori-file-card', className)} {...rest}>
      <div className="ori-file-card__head">
        <span className="ori-file-card__icon" aria-hidden="true">
          <Icon size={20} />
        </span>
        {actions && actions.length > 0 && (
          <div className="ori-file-card__actions">
            {actions.map((action, i) => (
              <Tooltip key={i} content={action.label}>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={action.label}
                  disabled={action.disabled}
                  data-danger={action.variant === 'danger' ? 'true' : undefined}
                  onClick={action.onClick}
                >
                  {action.icon}
                </Button>
              </Tooltip>
            ))}
          </div>
        )}
      </div>

      <div className="ori-file-card__name" title={typeof name === 'string' ? name : undefined}>
        {name}
      </div>

      <div className="ori-file-card__meta">
        <Tag variant="neutral">{typeLabel}</Tag>
        {(size || meta) && (
          <span className="ori-file-card__meta-text">
            {size}
            {metaSeparator}
            {meta}
          </span>
        )}
      </div>

      {link &&
        (link.href ? (
          <a className="ori-file-card__link" href={link.href} onClick={link.onClick}>
            {link.label}
          </a>
        ) : (
          <button type="button" className="ori-file-card__link" onClick={link.onClick}>
            {link.label}
          </button>
        ))}
    </div>
  );
}
