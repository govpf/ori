import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
}

/**
 * Bouton du DS.
 *
 * Pour intégrer une icône, utiliser la composition via `children` :
 *
 *   <Button><Mail /> Envoyer</Button>
 *   <Button>Suivant <ArrowRight /></Button>
 *   <Button aria-label="Fermer"><X /></Button>
 *
 * (Parité avec l'API Angular `<ori-button><lucide-icon /> Envoyer</ori-button>`.)
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    block = false,
    className,
    type = 'button',
    children,
    ...rest
  },
  ref,
) {
  const classes = clsx(
    'ori-button',
    `ori-button--${variant}`,
    size !== 'md' && `ori-button--${size}`,
    block && 'ori-button--block',
    className,
  );

  return (
    <button ref={ref} type={type} className={classes} {...rest}>
      {children}
    </button>
  );
});
