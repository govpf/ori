import type { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

export type TimelineItemStatus = 'completed' | 'current' | 'pending';

export interface TimelineItem {
  id: string;
  /** Titre principal de l'événement. */
  title: ReactNode;
  /** Date / heure formatée (ex: '2026-04-23 14:30'). */
  timestamp: ReactNode;
  /** Acteur ou source (ex: 'Vous', 'Service A'). Optionnel. */
  actor?: ReactNode;
  /** Détail supplémentaire (ex: nom du fichier ajouté). Optionnel. */
  description?: ReactNode;
  /** Status visuel du dot. Default: 'completed' (le 1er item peut être 'current'). */
  status?: TimelineItemStatus;
  /**
   * Contenu custom du dot (par défaut : index numéroté). Permet d'injecter
   * une icône Lucide par exemple.
   */
  icon?: ReactNode;
}

export interface TimelineProps extends Omit<HTMLAttributes<HTMLOListElement>, 'children'> {
  items: TimelineItem[];
}

/**
 * Timeline verticale d'événements (historique de dossier, journal d'audit,
 * suivi d'actions). Pas d'animation, pas de pagination - l'app gère sa
 * donnée et la pagine si nécessaire.
 */
export function Timeline({ items, className, ...rest }: TimelineProps) {
  return (
    <ol className={clsx('ori-timeline', className)} {...rest}>
      {items.map((item, i) => {
        const status = item.status ?? 'completed';
        return (
          <li key={item.id} className={clsx('ori-timeline__item', `ori-timeline__item--${status}`)}>
            <span className="ori-timeline__dot" aria-hidden="true">
              {item.icon ?? i + 1}
            </span>
            <div className="ori-timeline__content">
              <span className="ori-timeline__title">{item.title}</span>
              <span className="ori-timeline__meta">
                {item.timestamp}
                {item.actor && <> · {item.actor}</>}
              </span>
              {item.description && (
                <span className="ori-timeline__description">{item.description}</span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
