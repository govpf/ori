import { useState, type ImgHTMLAttributes } from 'react';
import { clsx } from 'clsx';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  /** URL de l'image. Si absente ou échoue à charger, on affiche les initiales (fallback). */
  src?: string;
  /** Texte alternatif de l'image (et nom complet utilisé pour les initiales). */
  alt: string;
  /** Initiales explicites. Sinon, calculées depuis `alt`. */
  initials?: string;
  size?: AvatarSize;
  className?: string;
  imgProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'className'>;
}

function defaultInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
}

/**
 * Avatar avec image et fallback sur initiales.
 * Si `src` n'est pas fourni ou échoue à charger, on affiche les
 * initiales calculées depuis `alt` (ou explicites via `initials`).
 */
export function Avatar({ src, alt, initials, size = 'md', className, imgProps }: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = src && !imageFailed;
  const displayInitials = initials ?? defaultInitials(alt);

  return (
    <span
      className={clsx('ori-avatar', `ori-avatar--${size}`, className)}
      role="img"
      aria-label={alt}
    >
      {showImage ? (
        <img
          {...imgProps}
          src={src}
          alt=""
          className="ori-avatar__img"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span aria-hidden="true">{displayInitials}</span>
      )}
    </span>
  );
}
