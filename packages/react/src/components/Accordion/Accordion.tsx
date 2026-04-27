import { useId, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

export interface AccordionProps {
  /**
   * Mode `single` : un seul item ouvert à la fois (utilise l'attribut
   * `name` natif HTML, supporté Chrome 120+, Firefox 122+, Safari 17+).
   * Mode `multiple` : plusieurs items peuvent être ouverts.
   */
  type?: 'single' | 'multiple';
  className?: string;
  children?: ReactNode;
}

/**
 * Accordéon basé sur `<details>` / `<summary>` natifs HTML
 * (cf. décision F.1).
 *
 * A11y native (focus, expand/collapse géré par le navigateur). Le mode
 * `single` utilise l'attribut natif `name` pour rendre les items
 * mutuellement exclusifs.
 */
export function Accordion({ type = 'multiple', className, children }: AccordionProps) {
  const reactId = useId();
  const groupName = type === 'single' ? `pf-accordion-${reactId}` : undefined;

  return (
    <div className={clsx('ori-accordion', className)} data-accordion-name={groupName}>
      {children}
    </div>
  );
}

export interface AccordionItemProps {
  /** Titre cliquable de l'item. */
  title: ReactNode;
  /** Ouvert par défaut. Pour le contrôle dynamique, utiliser plusieurs items. */
  defaultOpen?: boolean;
  className?: string;
  children?: ReactNode;
}

function AccordionItem({ title, defaultOpen, className, children }: AccordionItemProps) {
  // On ne peut pas accéder au context Accordion sans complication ; on lit
  // l'attribut data-* du parent au render. Acceptable parce qu'on n'a pas
  // besoin de réactivité ici (le name est fixé à la création).
  return (
    <details
      className={clsx('ori-accordion__item', className)}
      open={defaultOpen}
      ref={(el) => {
        if (!el) return;
        const groupName = el.parentElement?.getAttribute('data-accordion-name');
        if (groupName) el.setAttribute('name', groupName);
        else el.removeAttribute('name');
      }}
    >
      <summary className="ori-accordion__summary">
        <span>{title}</span>
        <ChevronDown size={18} className="ori-accordion__chevron" aria-hidden="true" />
      </summary>
      <div className="ori-accordion__content">{children}</div>
    </details>
  );
}

Accordion.Item = AccordionItem;
