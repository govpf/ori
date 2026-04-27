import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

export type CardVariant = 'default' | 'elevated' | 'flat';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'default', className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={clsx('ori-card', variant !== 'default' && `ori-card--${variant}`, className)}
      {...rest}
    >
      {children}
    </div>
  );
});

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  subtitle?: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { title, subtitle, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={clsx('ori-card__header', className)} {...rest}>
      {title && <h3 className="ori-card__title">{title}</h3>}
      {subtitle && <p className="ori-card__subtitle">{subtitle}</p>}
      {children}
    </div>
  );
});

export const CardBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardBody({ className, ...rest }, ref) {
    return <div ref={ref} className={clsx('ori-card__body', className)} {...rest} />;
  },
);

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardFooter({ className, ...rest }, ref) {
    return <div ref={ref} className={clsx('ori-card__footer', className)} {...rest} />;
  },
);
