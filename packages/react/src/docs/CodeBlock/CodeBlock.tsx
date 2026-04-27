import { forwardRef, useCallback, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

export interface CodeBlockProps extends HTMLAttributes<HTMLElement> {
  code: string;
  lang?: string;
  filename?: string;
  /**
   * Si fourni, remplace le contenu par défaut du `<pre><code>`. Permet
   * d'injecter un rendu syntax-highlighté (Prism, Shiki, etc.) sans que
   * le composant n'ait à dépendre d'un highlighter.
   */
  highlighted?: ReactNode;
  /**
   * Désactive le bouton de copie (utile pour les exemples non-copiables :
   * commande dangereuse, snippet partiel...).
   */
  noCopy?: boolean;
}

/**
 * Bloc de code avec en-tête (langue / nom de fichier) et bouton de copie.
 *
 * Le syntax highlighting n'est PAS embarqué : passer `highlighted` pour
 * afficher du code stylé (typiquement le résultat de Shiki ou Prism côté
 * serveur). Sans `highlighted`, le contenu est rendu en texte brut.
 */
export const CodeBlock = forwardRef<HTMLElement, CodeBlockProps>(function CodeBlock(
  { code, lang = 'text', filename, highlighted, noCopy = false, className, ...rest },
  ref,
) {
  const [copied, setCopied] = useState(false);
  const label = filename ?? lang;

  const handleCopy = useCallback(() => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    });
  }, [code]);

  return (
    <figure ref={ref} className={clsx('ori-code-block', className)} {...rest}>
      <div className="ori-code-block__header">
        <span className="ori-code-block__lang">{label}</span>
        {!noCopy && (
          <button
            type="button"
            className="ori-code-block__copy"
            data-copied={copied || undefined}
            aria-label="Copier le code dans le presse-papiers"
            onClick={handleCopy}
          >
            <span>{copied ? 'Copié' : 'Copier'}</span>
          </button>
        )}
      </div>
      <pre className="ori-code-block__pre">
        <code>{highlighted ?? code}</code>
      </pre>
    </figure>
  );
});
