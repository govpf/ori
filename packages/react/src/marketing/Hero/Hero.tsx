import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

export interface HeroProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  muted?: boolean;
}

/**
 * Bloc Hero pour landing page institutionnelle.
 *
 * Composition typique :
 *
 *   <Hero
 *     eyebrow="Démarches en ligne"
 *     title="..."
 *     subtitle="..."
 *     actions={<><Button>Commencer</Button><Button variant="ghost">En savoir plus</Button></>}
 *   />
 */
export const Hero = forwardRef<HTMLElement, HeroProps>(function Hero(
  { eyebrow, title, subtitle, actions, muted = false, className, children, ...rest },
  ref,
) {
  const classes = clsx('ori-hero', muted && 'ori-hero--muted', className);
  return (
    <section ref={ref} className={classes} {...rest}>
      <div className="ori-hero__inner">
        {eyebrow && <span className="ori-hero__eyebrow">{eyebrow}</span>}
        <h1 className="ori-hero__title">{title}</h1>
        {subtitle && <p className="ori-hero__subtitle">{subtitle}</p>}
        {actions && <div className="ori-hero__actions">{actions}</div>}
        {children}
      </div>
    </section>
  );
});
