/**
 * Plugin Tailwind : classes sémantiques Ori.
 *
 * Principes :
 *   - Les COULEURS passent par des variables CSS (var(--color-*)) plutôt que
 *     des valeurs résolues à la compilation. Cela permet le theming dynamique
 *     (light/dark, white-label…) sans recompilation.
 *   - Les autres tokens (spacing, radii, typo) restent résolus via theme(...)
 *     car ils ne varient pas selon le thème.
 *
 * Les variables CSS sont définies dans `@govpf/ori-tokens/css` et importées par
 * le CSS consommateur (preview.css pour Storybook, ori.css pour le livrable
 * statique).
 */

// Petit helper : pointe vers une CSS var définie par @govpf/ori-tokens.
const v = (name) => `var(--color-${name})`;

export function componentsPlugin({ addComponents, addBase, theme }) {
  addBase({
    ':root': {
      fontFamily: theme('fontFamily.sans'),
      color: v('text-primary'),
      backgroundColor: v('surface-base'),
    },
    body: {
      margin: '0',
      fontSize: theme('fontSize.base'),
      lineHeight: theme('lineHeight.normal'),
    },
    '*, *::before, *::after': { boxSizing: 'border-box' },
  });

  addComponents({
    // ─── Button ────────────────────────────────────────────────────────────
    '.ori-btn': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme('spacing.2'),
      paddingInline: theme('spacing.4'),
      paddingBlock: theme('spacing.2'),
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      fontWeight: theme('fontWeight.medium'),
      lineHeight: theme('lineHeight.tight'),
      borderRadius: theme('borderRadius.md'),
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      cursor: 'pointer',
      transitionProperty: 'background-color, border-color, color, box-shadow',
      transitionDuration: theme('transitionDuration.fast'),
      transitionTimingFunction: theme('transitionTimingFunction.standard'),
      userSelect: 'none',
      '&:focus-visible': {
        outline: 'none',
        boxShadow: `0 0 0 2px ${v('surface-base')}, 0 0 0 4px ${v('border-focus')}`,
      },
      '&:disabled, &[aria-disabled="true"]': {
        cursor: 'not-allowed',
        opacity: '0.5',
      },
    },
    '.ori-btn--primary': {
      backgroundColor: v('brand-primary'),
      color: v('brand-on-primary'),
      '&:hover:not(:disabled):not([aria-disabled="true"])': {
        backgroundColor: v('brand-primary-hover'),
      },
      '&:active:not(:disabled):not([aria-disabled="true"])': {
        backgroundColor: v('brand-primary-active'),
      },
    },
    '.ori-btn--secondary': {
      backgroundColor: v('surface-base'),
      color: v('text-primary'),
      borderColor: v('border-default'),
      '&:hover:not(:disabled):not([aria-disabled="true"])': {
        backgroundColor: v('surface-muted'),
        borderColor: v('border-strong'),
      },
      '&:active:not(:disabled):not([aria-disabled="true"])': {
        backgroundColor: v('surface-subtle'),
      },
    },
    '.ori-btn--ghost': {
      backgroundColor: 'transparent',
      color: v('text-secondary'),
      '&:hover:not(:disabled):not([aria-disabled="true"])': {
        backgroundColor: v('surface-subtle'),
        color: v('text-primary'),
      },
    },
    '.ori-btn--danger': {
      backgroundColor: v('feedback-danger'),
      color: v('brand-on-primary'),
      '&:hover:not(:disabled):not([aria-disabled="true"])': {
        backgroundColor: v('danger-600'),
      },
      '&:active:not(:disabled):not([aria-disabled="true"])': {
        backgroundColor: v('danger-700'),
      },
    },
    '.ori-btn--sm': {
      paddingInline: theme('spacing.3'),
      paddingBlock: theme('spacing.1'),
      fontSize: theme('fontSize.xs'),
    },
    '.ori-btn--lg': {
      paddingInline: theme('spacing.6'),
      paddingBlock: theme('spacing.3'),
      fontSize: theme('fontSize.base'),
    },
    '.ori-btn--block': {
      display: 'flex',
      width: '100%',
    },

    // ─── Input ─────────────────────────────────────────────────────────────
    '.ori-field': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.1'),
    },
    '.ori-field__label': {
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      fontWeight: theme('fontWeight.medium'),
      color: v('text-primary'),
    },
    '.ori-field__label--required::after': {
      content: '" *"',
      color: v('feedback-danger'),
    },
    '.ori-field__hint': {
      fontSize: theme('fontSize.xs'),
      color: v('text-secondary'),
    },
    '.ori-field__error': {
      fontSize: theme('fontSize.xs'),
      color: v('feedback-danger'),
    },
    '.ori-input': {
      display: 'block',
      width: '100%',
      paddingInline: theme('spacing.3'),
      paddingBlock: theme('spacing.2'),
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      lineHeight: theme('lineHeight.normal'),
      color: v('text-primary'),
      backgroundColor: v('surface-base'),
      borderRadius: theme('borderRadius.md'),
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: v('border-default'),
      // Permet au navigateur d'adapter ses contrôles natifs (icône date
      // picker, autocomplete, etc.) au thème ambiant. Sans ça, l'icône du
      // calendrier de `<input type="date">` reste noire en dark mode et
      // devient invisible sur fond foncé. `light dark` (vs juste `dark`)
      // laisse le browser choisir selon le `data-theme` ambiant.
      colorScheme: 'light dark',
      transitionProperty: 'border-color, box-shadow',
      transitionDuration: theme('transitionDuration.fast'),
      transitionTimingFunction: theme('transitionTimingFunction.standard'),
      '&::placeholder': { color: v('text-muted') },
      '&:hover:not(:disabled):not([aria-invalid="true"])': {
        borderColor: v('border-strong'),
      },
      '&:focus-visible, &:focus': {
        outline: 'none',
        borderColor: v('border-focus'),
        boxShadow: `0 0 0 3px ${v('brand-primary-subtle')}`,
      },
      '&:disabled': {
        cursor: 'not-allowed',
        backgroundColor: v('surface-muted'),
        color: v('text-disabled'),
      },
      '&[aria-invalid="true"]': {
        borderColor: v('feedback-danger'),
        '&:focus': {
          boxShadow: `0 0 0 3px ${v('feedback-danger-bg')}`,
        },
      },
    },
    '.ori-input--sm': {
      paddingInline: theme('spacing.2'),
      paddingBlock: theme('spacing.1'),
      fontSize: theme('fontSize.xs'),
    },
    '.ori-input--lg': {
      paddingInline: theme('spacing.4'),
      paddingBlock: theme('spacing.3'),
      fontSize: theme('fontSize.base'),
    },

    // ─── Textarea ──────────────────────────────────────────────────────────
    // Réutilise les bases de .ori-input et ajoute les contraintes propres au
    // textarea (resize vertical par défaut, hauteur min en lignes, etc.).
    '.ori-textarea': {
      display: 'block',
      width: '100%',
      minHeight: '6rem',
      paddingInline: theme('spacing.4'),
      paddingBlock: theme('spacing.3'),
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      lineHeight: theme('lineHeight.relaxed'),
      color: v('text-primary'),
      backgroundColor: v('surface-base'),
      borderRadius: theme('borderRadius.md'),
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: v('border-default'),
      // Adapte la scrollbar native au thème ambiant (idem .ori-input).
      colorScheme: 'light dark',
      resize: 'vertical',
      transitionProperty: 'border-color, box-shadow',
      transitionDuration: theme('transitionDuration.fast'),
      transitionTimingFunction: theme('transitionTimingFunction.standard'),
      '&::placeholder': { color: v('text-muted') },
      '&:hover:not(:disabled):not([aria-invalid="true"])': {
        borderColor: v('border-strong'),
      },
      '&:focus-visible, &:focus': {
        outline: 'none',
        borderColor: v('border-focus'),
        boxShadow: `0 0 0 3px ${v('brand-primary-subtle')}`,
      },
      '&:disabled': {
        cursor: 'not-allowed',
        backgroundColor: v('surface-muted'),
        color: v('text-disabled'),
        resize: 'none',
      },
      '&[aria-invalid="true"]': {
        borderColor: v('feedback-danger'),
        '&:focus': {
          boxShadow: `0 0 0 3px ${v('feedback-danger-bg')}`,
        },
      },
    },

    // ─── Choice (Checkbox / Radio / Switch) ────────────────────────────────
    // Wrapper d'un input + label aligné. Choice = case + libellé sur la même
    // ligne. ChoiceGroup = plusieurs Choice empilés (pour Radio et Checkbox).
    '.ori-choice': {
      display: 'inline-flex',
      // align-items: center pour le cas standard (label simple) où on veut
      // que la case et le texte soient parfaitement centrés verticalement.
      // Quand il y a un hint, on bascule en flex-start (cf. modificateur ci-dessous)
      // pour que la case s'aligne avec la première ligne du label.
      alignItems: 'center',
      gap: theme('spacing.2'),
      cursor: 'pointer',
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      color: v('text-primary'),
      lineHeight: theme('lineHeight.normal'),
      '&[data-disabled="true"]': {
        cursor: 'not-allowed',
        color: v('text-disabled'),
      },
      // Quand le label contient un hint (block en dessous), on aligne en haut
      // pour que la case se cale sur la première ligne, pas au milieu du bloc.
      '&:has(.ori-choice__hint)': {
        alignItems: 'flex-start',
      },
    },
    '.ori-choice__label': {
      // Compense la différence de hauteur entre la case (1.125rem) et la
      // line-height du texte. Sans ça, le texte paraît légèrement décalé.
      lineHeight: '1.125rem',
    },
    '.ori-choice__hint': {
      display: 'block',
      fontSize: theme('fontSize.xs'),
      color: v('text-secondary'),
      lineHeight: theme('lineHeight.normal'),
      marginTop: '0.125rem',
    },
    '.ori-choice-group': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.2'),
    },
    '.ori-choice-group--inline': {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme('spacing.4'),
    },

    // ─── Checkbox ──────────────────────────────────────────────────────────
    '.ori-checkbox': {
      flex: '0 0 auto',
      width: '1.125rem',
      height: '1.125rem',
      margin: '0',
      appearance: 'none',
      WebkitAppearance: 'none',
      backgroundColor: v('surface-base'),
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: v('border-default'),
      borderRadius: theme('borderRadius.sm'),
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transitionProperty: 'background-color, border-color, box-shadow',
      transitionDuration: theme('transitionDuration.fast'),
      transitionTimingFunction: theme('transitionTimingFunction.standard'),
      '&:hover:not(:disabled):not([aria-invalid="true"])': {
        borderColor: v('border-strong'),
      },
      '&:focus-visible': {
        outline: 'none',
        boxShadow: `0 0 0 3px ${v('brand-primary-subtle')}`,
        borderColor: v('border-focus'),
      },
      '&:checked, &:indeterminate': {
        backgroundColor: v('brand-primary'),
        borderColor: v('brand-primary'),
      },
      // Coche : SVG en background-image pour ne dépendre d'aucun glyphe
      '&:checked': {
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='3 8 7 12 13 4'/%3E%3C/svg%3E\")",
        backgroundSize: '85%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      },
      '&:indeterminate': {
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round'%3E%3Cline x1='4' y1='8' x2='12' y2='8'/%3E%3C/svg%3E\")",
        backgroundSize: '85%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      },
      '&:disabled': {
        cursor: 'not-allowed',
        backgroundColor: v('surface-muted'),
        borderColor: v('border-subtle'),
      },
      '&:disabled:checked, &:disabled:indeterminate': {
        backgroundColor: v('text-disabled'),
        borderColor: v('text-disabled'),
      },
      '&[aria-invalid="true"]': {
        borderColor: v('feedback-danger'),
        '&:focus-visible': {
          boxShadow: `0 0 0 3px ${v('feedback-danger-bg')}`,
        },
      },
    },

    // ─── Radio ─────────────────────────────────────────────────────────────
    '.ori-radio': {
      flex: '0 0 auto',
      width: '1.125rem',
      height: '1.125rem',
      margin: '0',
      appearance: 'none',
      WebkitAppearance: 'none',
      backgroundColor: v('surface-base'),
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: v('border-default'),
      borderRadius: '9999px',
      cursor: 'pointer',
      transitionProperty: 'background-color, border-color, box-shadow',
      transitionDuration: theme('transitionDuration.fast'),
      transitionTimingFunction: theme('transitionTimingFunction.standard'),
      '&:hover:not(:disabled):not([aria-invalid="true"])': {
        borderColor: v('border-strong'),
      },
      '&:focus-visible': {
        outline: 'none',
        boxShadow: `0 0 0 3px ${v('brand-primary-subtle')}`,
        borderColor: v('border-focus'),
      },
      '&:checked': {
        borderColor: v('brand-primary'),
        // Pastille intérieure via radial-gradient (pas de pseudo nécessaire
        // sur un input natif, qui n'accepte pas ::before).
        backgroundImage: `radial-gradient(circle, ${v('brand-primary')} 40%, transparent 45%)`,
      },
      '&:disabled': {
        cursor: 'not-allowed',
        backgroundColor: v('surface-muted'),
        borderColor: v('border-subtle'),
      },
      '&:disabled:checked': {
        borderColor: v('text-disabled'),
        backgroundImage: `radial-gradient(circle, ${v('text-disabled')} 40%, transparent 45%)`,
      },
      '&[aria-invalid="true"]': {
        borderColor: v('feedback-danger'),
        '&:focus-visible': {
          boxShadow: `0 0 0 3px ${v('feedback-danger-bg')}`,
        },
      },
    },

    // ─── Switch ────────────────────────────────────────────────────────────
    // L'input natif est rendu invisible mais focusable, et c'est le label qui
    // contient la track + thumb stylés via :checked sibling selector.
    '.ori-switch': {
      position: 'relative',
      flex: '0 0 auto',
      display: 'inline-block',
      width: '2.25rem',
      height: '1.25rem',
    },
    '.ori-switch__input': {
      position: 'absolute',
      opacity: '0',
      width: '100%',
      height: '100%',
      margin: '0',
      cursor: 'pointer',
      zIndex: '1',
      '&:disabled': { cursor: 'not-allowed' },
    },
    '.ori-switch__track': {
      position: 'absolute',
      inset: '0',
      backgroundColor: v('border-default'),
      borderRadius: '9999px',
      transitionProperty: 'background-color, box-shadow',
      transitionDuration: theme('transitionDuration.fast'),
      transitionTimingFunction: theme('transitionTimingFunction.standard'),
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '2px',
        left: '2px',
        width: 'calc(1.25rem - 4px)',
        height: 'calc(1.25rem - 4px)',
        backgroundColor: v('surface-base'),
        borderRadius: '9999px',
        boxShadow: '0 1px 2px rgb(0 0 0 / 0.2)',
        transitionProperty: 'transform',
        transitionDuration: theme('transitionDuration.fast'),
        transitionTimingFunction: theme('transitionTimingFunction.standard'),
      },
    },
    '.ori-switch__input:checked + .ori-switch__track': {
      backgroundColor: v('brand-primary'),
      '&::before': { transform: 'translateX(1rem)' },
    },
    '.ori-switch__input:focus-visible + .ori-switch__track': {
      boxShadow: `0 0 0 3px ${v('brand-primary-subtle')}`,
    },
    '.ori-switch__input:disabled + .ori-switch__track': {
      backgroundColor: v('border-subtle'),
      '&::before': { backgroundColor: v('surface-muted') },
    },
    '.ori-switch__input:disabled:checked + .ori-switch__track': {
      backgroundColor: v('text-disabled'),
    },

    // ─── Select ────────────────────────────────────────────────────────────
    // Wrapper d'un <select> natif. On reprend les bases de .ori-input (focus,
    // border, états) + une flèche personnalisée en background-image (le
    // chevron natif n'est pas stylable en CSS).
    '.ori-select': {
      display: 'block',
      width: '100%',
      paddingInline: theme('spacing.3'),
      paddingBlock: theme('spacing.2'),
      paddingInlineEnd: theme('spacing.10'),
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      lineHeight: theme('lineHeight.normal'),
      color: v('text-primary'),
      backgroundColor: v('surface-base'),
      borderRadius: theme('borderRadius.md'),
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: v('border-default'),
      appearance: 'none',
      WebkitAppearance: 'none',
      // Adapte la liste déroulante native au thème ambiant (idem .ori-input).
      colorScheme: 'light dark',
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%2371717a' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='4 6 8 10 12 6'/%3E%3C/svg%3E\")",
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 0.75rem center',
      backgroundSize: '1rem',
      transitionProperty: 'border-color, box-shadow',
      transitionDuration: theme('transitionDuration.fast'),
      transitionTimingFunction: theme('transitionTimingFunction.standard'),
      '&:hover:not(:disabled):not([aria-invalid="true"])': {
        borderColor: v('border-strong'),
      },
      '&:focus-visible, &:focus': {
        outline: 'none',
        borderColor: v('border-focus'),
        boxShadow: `0 0 0 3px ${v('brand-primary-subtle')}`,
      },
      '&:disabled': {
        cursor: 'not-allowed',
        backgroundColor: v('surface-muted'),
        color: v('text-disabled'),
      },
      '&[aria-invalid="true"]': {
        borderColor: v('feedback-danger'),
        '&:focus': { boxShadow: `0 0 0 3px ${v('feedback-danger-bg')}` },
      },
    },
    '.ori-select--sm': {
      paddingInline: theme('spacing.2'),
      paddingBlock: theme('spacing.1'),
      paddingInlineEnd: theme('spacing.8'),
      fontSize: theme('fontSize.xs'),
    },
    '.ori-select--lg': {
      paddingInline: theme('spacing.4'),
      paddingBlock: theme('spacing.3'),
      paddingInlineEnd: theme('spacing.12'),
      fontSize: theme('fontSize.base'),
    },

    // ─── Combobox / Autocomplete ────────────────────────────────────────────
    // Wrapper relatif (positionne le listbox absolu en dessous), input qui
    // reprend les styles .ori-input + chevron à droite + listbox flottant.
    '.ori-combobox': {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.1'),
      width: '100%',
    },
    '.ori-combobox__label': {
      fontSize: theme('fontSize.sm'),
      fontWeight: theme('fontWeight.medium'),
      color: v('text-primary'),
    },
    '.ori-combobox__field': {
      position: 'relative',
    },
    '.ori-combobox__input': {
      display: 'block',
      width: '100%',
      paddingInline: theme('spacing.3'),
      paddingBlock: theme('spacing.2'),
      paddingInlineEnd: theme('spacing.10'),
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      lineHeight: theme('lineHeight.normal'),
      color: v('text-primary'),
      backgroundColor: v('surface-base'),
      borderRadius: theme('borderRadius.md'),
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: v('border-default'),
      colorScheme: 'light dark',
      transitionProperty: 'border-color, box-shadow',
      transitionDuration: theme('transitionDuration.fast'),
      transitionTimingFunction: theme('transitionTimingFunction.standard'),
      '&::placeholder': { color: v('text-muted') },
      '&:hover:not(:disabled)': {
        borderColor: v('border-strong'),
      },
      '&:focus-visible, &:focus': {
        outline: 'none',
        borderColor: v('border-focus'),
        boxShadow: `0 0 0 3px ${v('brand-primary-subtle')}`,
      },
      '&:disabled': {
        cursor: 'not-allowed',
        backgroundColor: v('surface-muted'),
        color: v('text-disabled'),
      },
    },
    '.ori-combobox__chevron': {
      position: 'absolute',
      top: '50%',
      right: theme('spacing.3'),
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: v('text-muted'),
      lineHeight: '0',
    },
    '.ori-combobox__listbox': {
      position: 'absolute',
      top: 'calc(100% + 4px)',
      left: '0',
      right: '0',
      maxHeight: '15rem',
      margin: '0',
      padding: theme('spacing.1'),
      listStyle: 'none',
      backgroundColor: v('surface-base'),
      border: `1px solid ${v('border-subtle')}`,
      borderRadius: theme('borderRadius.md'),
      boxShadow: theme('boxShadow.lg'),
      zIndex: '60',
      overflowY: 'auto',
      animation:
        'ori-fade-in var(--ori-duration-fast, 150ms) var(--ori-easing-standard, cubic-bezier(0.4, 0, 0.2, 1))',
    },
    '.ori-combobox__option': {
      display: 'flex',
      alignItems: 'center',
      gap: theme('spacing.2'),
      paddingInline: theme('spacing.3'),
      paddingBlock: theme('spacing.2'),
      borderRadius: theme('borderRadius.sm'),
      fontSize: theme('fontSize.sm'),
      color: v('text-primary'),
      cursor: 'pointer',
    },
    '.ori-combobox__option--active': {
      backgroundColor: v('surface-muted'),
    },
    '.ori-combobox__option--selected': {
      fontWeight: theme('fontWeight.medium'),
    },
    '.ori-combobox__option--disabled': {
      opacity: '0.5',
      cursor: 'not-allowed',
    },
    '.ori-combobox__option-text': {
      flex: '1 1 auto',
      minWidth: '0',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.125rem',
    },
    '.ori-combobox__option-label': {
      lineHeight: theme('lineHeight.snug'),
    },
    '.ori-combobox__option-description': {
      fontSize: theme('fontSize.xs'),
      color: v('text-muted'),
      lineHeight: theme('lineHeight.snug'),
    },
    '.ori-combobox__option-check': {
      flexShrink: '0',
      color: v('brand-primary'),
    },
    '.ori-combobox__empty': {
      paddingInline: theme('spacing.3'),
      paddingBlock: theme('spacing.2'),
      fontSize: theme('fontSize.sm'),
      color: v('text-muted'),
      fontStyle: 'italic',
    },

    // ─── MultiSelect virtualisé ─────────────────────────────────────────────
    // Variante multi-sélection avec tags supprimables au-dessus de l'input
    // et listbox virtualisée (rendu uniquement de la fenêtre visible).
    '.ori-multi-select': {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.1'),
      width: '100%',
    },
    '.ori-multi-select__label': {
      fontSize: theme('fontSize.sm'),
      fontWeight: theme('fontWeight.medium'),
      color: v('text-primary'),
    },
    '.ori-multi-select__field': {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: theme('spacing.2'),
      paddingInline: theme('spacing.2'),
      paddingBlock: theme('spacing.1'),
      backgroundColor: v('surface-base'),
      borderRadius: theme('borderRadius.md'),
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: v('border-default'),
      transitionProperty: 'border-color, box-shadow',
      transitionDuration: theme('transitionDuration.fast'),
      transitionTimingFunction: theme('transitionTimingFunction.standard'),
      minHeight: '2.5rem',
      '&:focus-within': {
        borderColor: v('border-focus'),
        boxShadow: `0 0 0 3px ${v('brand-primary-subtle')}`,
      },
    },
    '.ori-multi-select__field--disabled': {
      cursor: 'not-allowed',
      backgroundColor: v('surface-muted'),
      color: v('text-disabled'),
    },
    '.ori-multi-select__tags': {
      display: 'contents',
      margin: '0',
      padding: '0',
      listStyle: 'none',
    },
    '.ori-multi-select__tag': {
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme('spacing.1'),
      paddingInline: theme('spacing.2'),
      paddingBlock: '0.125rem',
      fontSize: theme('fontSize.xs'),
      fontWeight: theme('fontWeight.medium'),
      color: v('text-primary'),
      backgroundColor: v('brand-primary-subtle'),
      borderRadius: theme('borderRadius.sm'),
      maxWidth: '12rem',
    },
    '.ori-multi-select__tag-label': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    '.ori-multi-select__tag-remove': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '1rem',
      height: '1rem',
      padding: '0',
      background: 'transparent',
      border: 'none',
      borderRadius: '9999px',
      color: v('text-secondary'),
      cursor: 'pointer',
      flexShrink: '0',
      '&:hover:not(:disabled)': {
        backgroundColor: v('surface-muted'),
        color: v('text-primary'),
      },
      '&:focus-visible': {
        outline: `2px solid ${v('border-focus')}`,
        outlineOffset: '1px',
      },
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: '0.5',
      },
    },
    '.ori-multi-select__input-wrap': {
      position: 'relative',
      flex: '1 1 auto',
      minWidth: '6rem',
    },
    '.ori-multi-select__input': {
      display: 'block',
      width: '100%',
      paddingInline: theme('spacing.2'),
      paddingBlock: theme('spacing.1'),
      paddingInlineEnd: theme('spacing.6'),
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      lineHeight: theme('lineHeight.normal'),
      color: v('text-primary'),
      backgroundColor: 'transparent',
      border: 'none',
      outline: 'none',
      '&::placeholder': { color: v('text-muted') },
      '&:disabled': {
        cursor: 'not-allowed',
        color: v('text-disabled'),
      },
    },
    '.ori-multi-select__chevron': {
      position: 'absolute',
      top: '50%',
      right: theme('spacing.2'),
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: v('text-muted'),
      lineHeight: '0',
    },
    '.ori-multi-select__listbox': {
      position: 'absolute',
      top: 'calc(100% + 4px)',
      left: '0',
      right: '0',
      margin: '0',
      padding: '0',
      backgroundColor: v('surface-base'),
      border: `1px solid ${v('border-subtle')}`,
      borderRadius: theme('borderRadius.md'),
      boxShadow: theme('boxShadow.lg'),
      zIndex: '60',
      overflowY: 'auto',
      animation:
        'ori-fade-in var(--ori-duration-fast, 150ms) var(--ori-easing-standard, cubic-bezier(0.4, 0, 0.2, 1))',
    },
    '.ori-multi-select__option': {
      display: 'flex',
      alignItems: 'center',
      gap: theme('spacing.2'),
      paddingInline: theme('spacing.3'),
      fontSize: theme('fontSize.sm'),
      color: v('text-primary'),
      cursor: 'pointer',
    },
    '.ori-multi-select__option--active': {
      backgroundColor: v('surface-muted'),
    },
    '.ori-multi-select__option--selected': {
      fontWeight: theme('fontWeight.medium'),
    },
    '.ori-multi-select__option--disabled': {
      opacity: '0.5',
      cursor: 'not-allowed',
    },
    '.ori-multi-select__option-checkbox': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '1rem',
      height: '1rem',
      borderRadius: theme('borderRadius.sm'),
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: v('border-default'),
      backgroundColor: v('surface-base'),
      flexShrink: '0',
      color: v('brand-primary'),
    },
    '.ori-multi-select__option-checkbox--checked': {
      borderColor: v('brand-primary'),
      backgroundColor: v('brand-primary-subtle'),
    },
    '.ori-multi-select__option-label': {
      flex: '1 1 auto',
      minWidth: '0',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    '.ori-multi-select__empty': {
      paddingInline: theme('spacing.3'),
      paddingBlock: theme('spacing.2'),
      fontSize: theme('fontSize.sm'),
      color: v('text-muted'),
      fontStyle: 'italic',
    },

    // ─── FileUpload ────────────────────────────────────────────────────────
    // Pattern : input file natif rendu invisible + zone drop-zone clickable
    // qui sert à la fois de bouton de sélection et de cible drag-and-drop.
    '.ori-file': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.2'),
    },
    '.ori-file__input': {
      // Visually hidden mais accessible au clavier (cf. WCAG)
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      borderWidth: '0',
    },
    '.ori-file__dropzone': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme('spacing.2'),
      paddingInline: theme('spacing.6'),
      paddingBlock: theme('spacing.6'),
      borderRadius: theme('borderRadius.md'),
      borderWidth: '1px',
      borderStyle: 'dashed',
      borderColor: v('border-default'),
      backgroundColor: v('surface-base'),
      color: v('text-secondary'),
      fontSize: theme('fontSize.sm'),
      cursor: 'pointer',
      transitionProperty: 'border-color, background-color',
      transitionDuration: theme('transitionDuration.fast'),
      transitionTimingFunction: theme('transitionTimingFunction.standard'),
      '&:hover': {
        borderColor: v('border-strong'),
        backgroundColor: v('surface-muted'),
      },
    },
    '.ori-file__input:focus-visible + .ori-file__dropzone': {
      outline: 'none',
      borderColor: v('border-focus'),
      boxShadow: `0 0 0 3px ${v('brand-primary-subtle')}`,
    },
    '.ori-file__dropzone--dragging': {
      borderColor: v('border-focus'),
      borderStyle: 'solid',
      backgroundColor: v('brand-primary-subtle'),
      color: v('text-primary'),
    },
    '.ori-file__dropzone--invalid': {
      borderColor: v('feedback-danger'),
      backgroundColor: v('feedback-danger-bg'),
    },
    '.ori-file__dropzone-title': {
      fontWeight: theme('fontWeight.medium'),
      color: v('text-primary'),
    },
    '.ori-file__dropzone-hint': {
      fontSize: theme('fontSize.xs'),
      color: v('text-muted'),
    },
    '.ori-file__list': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.1'),
      margin: '0',
      padding: '0',
      listStyle: 'none',
    },
    '.ori-file__item': {
      display: 'flex',
      alignItems: 'center',
      gap: theme('spacing.2'),
      paddingInline: theme('spacing.3'),
      paddingBlock: theme('spacing.2'),
      borderRadius: theme('borderRadius.md'),
      backgroundColor: v('surface-muted'),
      fontSize: theme('fontSize.sm'),
      color: v('text-primary'),
    },
    '.ori-file__item-name': {
      flex: '1 1 auto',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    '.ori-file__item-size': {
      flex: '0 0 auto',
      fontSize: theme('fontSize.xs'),
      color: v('text-secondary'),
    },
    '.ori-file__item-remove': {
      flex: '0 0 auto',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: theme('spacing.1'),
      borderRadius: theme('borderRadius.sm'),
      color: v('text-secondary'),
      '&:hover': { color: v('text-primary'), backgroundColor: v('surface-base') },
    },

    // ─── Tabs ──────────────────────────────────────────────────────────────
    // Pas de `gap` sur le container : on espace via padding-top du panel pour
    // garder un rendu identique quel que soit l'index du panel actif (les
    // panels inactifs sont en display:none, mais certains navigateurs comptent
    // le gap différemment selon la position).
    '.ori-tabs': {
      display: 'flex',
      flexDirection: 'column',
    },
    '.ori-tabs__list': {
      display: 'flex',
      flexWrap: 'wrap',
      gap: theme('spacing.1'),
      margin: '0',
      padding: '0',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: v('border-subtle'),
    },
    '.ori-tabs__tab': {
      paddingInline: theme('spacing.4'),
      paddingBlock: theme('spacing.2'),
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      fontWeight: theme('fontWeight.medium'),
      color: v('text-secondary'),
      backgroundColor: 'transparent',
      borderWidth: '0',
      borderBottomWidth: '2px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'transparent',
      marginBottom: '-1px',
      cursor: 'pointer',
      transitionProperty: 'color, border-color, background-color',
      transitionDuration: theme('transitionDuration.fast'),
      transitionTimingFunction: theme('transitionTimingFunction.standard'),
      '&:hover:not(:disabled):not([aria-selected="true"])': {
        color: v('text-primary'),
      },
      '&:focus-visible': {
        outline: 'none',
        boxShadow: `0 0 0 3px ${v('brand-primary-subtle')}`,
        borderRadius: theme('borderRadius.sm'),
      },
      '&[aria-selected="true"]': {
        color: v('brand-primary'),
        borderBottomColor: v('brand-primary'),
      },
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: '0.5',
      },
    },
    '.ori-tabs__panel': {
      paddingTop: theme('spacing.4'),
      paddingBottom: theme('spacing.2'),
      color: v('text-primary'),
      '&[hidden]': { display: 'none' },
    },

    // ─── Accordion ─────────────────────────────────────────────────────────
    // Wraps `<details>` / `<summary>` natifs.
    '.ori-accordion': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.2'),
    },
    '.ori-accordion__item': {
      borderRadius: theme('borderRadius.md'),
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: v('border-subtle'),
      backgroundColor: v('surface-base'),
      overflow: 'hidden',
    },
    '.ori-accordion__summary': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme('spacing.3'),
      paddingInline: theme('spacing.4'),
      paddingBlock: theme('spacing.3'),
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      fontWeight: theme('fontWeight.medium'),
      color: v('text-primary'),
      cursor: 'pointer',
      listStyle: 'none',
      transitionProperty: 'background-color',
      transitionDuration: theme('transitionDuration.fast'),
      transitionTimingFunction: theme('transitionTimingFunction.standard'),
      '&::-webkit-details-marker': { display: 'none' },
      '&:hover': { backgroundColor: v('surface-muted') },
      '&:focus-visible': {
        outline: 'none',
        boxShadow: `inset 0 0 0 3px ${v('brand-primary-subtle')}`,
      },
    },
    '.ori-accordion__chevron': {
      flex: '0 0 auto',
      transitionProperty: 'transform',
      transitionDuration: theme('transitionDuration.fast'),
      transitionTimingFunction: theme('transitionTimingFunction.standard'),
    },
    'details[open] > .ori-accordion__summary > .ori-accordion__chevron': {
      transform: 'rotate(180deg)',
    },
    '.ori-accordion__content': {
      paddingInline: theme('spacing.4'),
      paddingBlock: theme('spacing.3'),
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: v('border-subtle'),
      color: v('text-primary'),
      fontSize: theme('fontSize.sm'),
      lineHeight: theme('lineHeight.relaxed'),
    },

    // ─── Breadcrumb ────────────────────────────────────────────────────────
    '.ori-breadcrumb': {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: theme('spacing.1'),
      margin: '0',
      padding: '0',
      listStyle: 'none',
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      color: v('text-secondary'),
    },
    '.ori-breadcrumb__item': {
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme('spacing.1'),
    },
    '.ori-breadcrumb__link': {
      color: v('text-secondary'),
      textDecoration: 'none',
      paddingInline: theme('spacing.1'),
      paddingBlock: '0.125rem',
      borderRadius: theme('borderRadius.sm'),
      transitionProperty: 'color, background-color',
      transitionDuration: theme('transitionDuration.fast'),
      transitionTimingFunction: theme('transitionTimingFunction.standard'),
      '&:hover': { color: v('text-primary'), backgroundColor: v('surface-muted') },
      '&:focus-visible': {
        outline: 'none',
        boxShadow: `0 0 0 3px ${v('brand-primary-subtle')}`,
      },
    },
    '.ori-breadcrumb__current': {
      color: v('text-primary'),
      fontWeight: theme('fontWeight.medium'),
      paddingInline: theme('spacing.1'),
    },
    '.ori-breadcrumb__separator': {
      color: v('text-muted'),
      userSelect: 'none',
    },

    // ─── Pagination ────────────────────────────────────────────────────────
    '.ori-pagination': {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: theme('spacing.1'),
      margin: '0',
      padding: '0',
      listStyle: 'none',
    },
    '.ori-pagination__item': { display: 'inline-flex' },
    '.ori-pagination__link': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '2.25rem',
      height: '2.25rem',
      paddingInline: theme('spacing.2'),
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      fontWeight: theme('fontWeight.medium'),
      color: v('text-primary'),
      backgroundColor: 'transparent',
      borderRadius: theme('borderRadius.md'),
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      cursor: 'pointer',
      transitionProperty: 'background-color, border-color, color',
      transitionDuration: theme('transitionDuration.fast'),
      transitionTimingFunction: theme('transitionTimingFunction.standard'),
      '&:hover:not(:disabled):not([aria-current="page"])': {
        backgroundColor: v('surface-muted'),
        borderColor: v('border-default'),
      },
      '&:focus-visible': {
        outline: 'none',
        boxShadow: `0 0 0 3px ${v('brand-primary-subtle')}`,
      },
      '&[aria-current="page"]': {
        backgroundColor: v('brand-primary'),
        color: v('brand-on-primary'),
        cursor: 'default',
      },
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: '0.5',
      },
    },
    '.ori-pagination__ellipsis': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '2.25rem',
      height: '2.25rem',
      color: v('text-muted'),
      userSelect: 'none',
    },

    // ─── Steps ─────────────────────────────────────────────────────────────
    '.ori-steps': {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      gap: theme('spacing.2'),
      margin: '0',
      padding: '0',
      listStyle: 'none',
      counterReset: 'pf-step',
    },
    '.ori-steps__item': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: theme('spacing.2'),
      flex: '1 1 0',
      minWidth: '6rem',
      counterIncrement: 'pf-step',
    },
    '.ori-steps__marker': {
      flex: '0 0 auto',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '2rem',
      height: '2rem',
      borderRadius: '9999px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: v('border-default'),
      backgroundColor: v('surface-base'),
      color: v('text-secondary'),
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      fontWeight: theme('fontWeight.semibold'),
    },
    '.ori-steps__item--current .ori-steps__marker': {
      backgroundColor: v('brand-primary'),
      borderColor: v('brand-primary'),
      color: v('brand-on-primary'),
    },
    '.ori-steps__item--completed .ori-steps__marker': {
      backgroundColor: v('feedback-success'),
      borderColor: v('feedback-success'),
      color: v('brand-on-primary'),
    },
    '.ori-steps__label': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.125rem',
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
    },
    '.ori-steps__title': {
      fontWeight: theme('fontWeight.medium'),
      color: v('text-primary'),
    },
    '.ori-steps__item--todo .ori-steps__title': {
      color: v('text-secondary'),
      fontWeight: theme('fontWeight.normal'),
    },
    '.ori-steps__description': {
      fontSize: theme('fontSize.xs'),
      color: v('text-secondary'),
    },
    '.ori-steps__separator': {
      flex: '1 1 auto',
      height: '1px',
      minWidth: '1rem',
      backgroundColor: v('border-subtle'),
      // Layout vertical : dot au-dessus, label en dessous. Les séparateurs
      // doivent être alignés horizontalement avec le centre des dots.
      // Le dot fait 2rem (32px) de hauteur, donc son centre est à 1rem du
      // haut de l'item. On retranche 0.5px (demi-épaisseur du séparateur)
      // pour un alignement pixel-perfect. La position est indépendante
      // de la longueur du label (qui s'étend uniquement vers le bas).
      alignSelf: 'flex-start',
      marginTop: 'calc(1rem - 0.5px)',
    },
    '.ori-steps__item--completed + .ori-steps__separator': {
      backgroundColor: v('feedback-success'),
    },
    '.ori-steps__button': {
      // En mode clickable, le bouton englobe le dot + label. Même
      // structure verticale que l'item non-clickable pour cohérence.
      flex: '1 1 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: theme('spacing.2'),
      paddingInline: theme('spacing.2'),
      paddingBlock: theme('spacing.1'),
      borderRadius: theme('borderRadius.md'),
      borderWidth: '0',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      '&:hover': { backgroundColor: v('surface-muted') },
      '&:focus-visible': {
        outline: 'none',
        boxShadow: `0 0 0 3px ${v('brand-primary-subtle')}`,
      },
      '&:disabled': {
        cursor: 'not-allowed',
      },
    },

    // ─── Tag ───────────────────────────────────────────────────────────────
    '.ori-tag': {
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme('spacing.1'),
      paddingInline: theme('spacing.2'),
      paddingBlock: '0.125rem',
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.xs'),
      fontWeight: theme('fontWeight.medium'),
      lineHeight: theme('lineHeight.tight'),
      borderRadius: theme('borderRadius.sm'),
      borderWidth: '1px',
      borderStyle: 'solid',
    },
    '.ori-tag--neutral': {
      backgroundColor: v('surface-muted'),
      borderColor: v('border-default'),
      color: v('text-primary'),
    },
    '.ori-tag--info': {
      backgroundColor: v('feedback-info-bg'),
      borderColor: v('feedback-info'),
      color: v('feedback-info-strong'),
    },
    '.ori-tag--success': {
      backgroundColor: v('feedback-success-bg'),
      borderColor: v('feedback-success'),
      color: v('feedback-success-strong'),
    },
    '.ori-tag--warning': {
      backgroundColor: v('feedback-warning-bg'),
      borderColor: v('feedback-warning'),
      color: v('feedback-warning-strong'),
    },
    '.ori-tag--danger': {
      backgroundColor: v('feedback-danger-bg'),
      borderColor: v('feedback-danger'),
      color: v('feedback-danger-strong'),
    },
    '.ori-tag__remove': {
      flex: '0 0 auto',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '0',
      marginInlineStart: '0.125rem',
      color: 'currentColor',
      opacity: '0.6',
      borderRadius: theme('borderRadius.sm'),
      '&:hover': { opacity: '1' },
      '&:focus-visible': {
        outline: 'none',
        boxShadow: `0 0 0 2px currentColor`,
      },
    },

    // ─── Avatar ────────────────────────────────────────────────────────────
    '.ori-avatar': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: '0 0 auto',
      borderRadius: '9999px',
      backgroundColor: v('surface-muted'),
      color: v('text-secondary'),
      fontFamily: theme('fontFamily.sans'),
      fontWeight: theme('fontWeight.semibold'),
      overflow: 'hidden',
      userSelect: 'none',
    },
    '.ori-avatar--sm': { width: '1.5rem', height: '1.5rem', fontSize: theme('fontSize.xs') },
    '.ori-avatar--md': { width: '2.25rem', height: '2.25rem', fontSize: theme('fontSize.sm') },
    '.ori-avatar--lg': { width: '3rem', height: '3rem', fontSize: theme('fontSize.base') },
    '.ori-avatar--xl': { width: '4rem', height: '4rem', fontSize: theme('fontSize.lg') },
    '.ori-avatar__img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },

    // ─── Tooltip ───────────────────────────────────────────────────────────
    '.ori-tooltip-wrap': {
      position: 'relative',
      display: 'inline-flex',
    },
    '.ori-tooltip': {
      position: 'absolute',
      zIndex: '40',
      paddingInline: theme('spacing.2'),
      paddingBlock: theme('spacing.1'),
      backgroundColor: v('text-primary'),
      color: v('surface-base'),
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.xs'),
      lineHeight: theme('lineHeight.tight'),
      borderRadius: theme('borderRadius.sm'),
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      boxShadow: theme('boxShadow.md'),
      animation:
        'ori-fade-in var(--ori-duration-fast, 150ms) var(--ori-easing-standard, cubic-bezier(0.4, 0, 0.2, 1))',
    },
    '.ori-tooltip--top': {
      bottom: 'calc(100% + 0.375rem)',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    '.ori-tooltip--bottom': {
      top: 'calc(100% + 0.375rem)',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    '.ori-tooltip--left': {
      right: 'calc(100% + 0.375rem)',
      top: '50%',
      transform: 'translateY(-50%)',
    },
    '.ori-tooltip--right': {
      left: 'calc(100% + 0.375rem)',
      top: '50%',
      transform: 'translateY(-50%)',
    },

    // ─── Link ──────────────────────────────────────────────────────────────
    '.ori-link': {
      color: v('text-link'),
      textDecorationLine: 'underline',
      textUnderlineOffset: '2px',
      textDecorationThickness: '1px',
      borderRadius: theme('borderRadius.sm'),
      transitionProperty: 'color, text-decoration-thickness',
      transitionDuration: theme('transitionDuration.fast'),
      transitionTimingFunction: theme('transitionTimingFunction.standard'),
      '&:hover': {
        textDecorationThickness: '2px',
      },
      '&:focus-visible': {
        outline: 'none',
        boxShadow: `0 0 0 3px ${v('brand-primary-subtle')}`,
      },
    },
    '.ori-link--quiet': {
      color: 'inherit',
      textDecorationLine: 'none',
      '&:hover': { textDecorationLine: 'underline' },
    },
    '.ori-link__external': {
      display: 'inline-block',
      marginInlineStart: '0.25em',
      verticalAlign: '-0.125em',
    },

    // ─── Highlight (mark) ──────────────────────────────────────────────────
    '.ori-highlight': {
      backgroundColor: v('feedback-warning-bg'),
      color: v('text-primary'),
      paddingInline: '0.125rem',
      borderRadius: theme('borderRadius.sm'),
    },

    // ─── Progress ──────────────────────────────────────────────────────────
    '.ori-progress': {
      display: 'block',
      width: '100%',
      height: '0.5rem',
      borderRadius: '9999px',
      overflow: 'hidden',
      borderWidth: '0',
      backgroundColor: v('surface-muted'),
      appearance: 'none',
      WebkitAppearance: 'none',
      // Webkit (Chrome, Safari, Edge)
      '&::-webkit-progress-bar': {
        backgroundColor: v('surface-muted'),
        borderRadius: '9999px',
      },
      '&::-webkit-progress-value': {
        backgroundColor: v('brand-primary'),
        borderRadius: '9999px',
        transition: `width ${theme('transitionDuration.normal')} ${theme('transitionTimingFunction.standard')}`,
      },
      // Firefox
      '&::-moz-progress-bar': {
        backgroundColor: v('brand-primary'),
        borderRadius: '9999px',
      },
      // Indéterminé : on force une animation custom
      '&:indeterminate': {
        backgroundColor: v('surface-muted'),
        backgroundImage: `linear-gradient(90deg, transparent 0%, ${v('brand-primary')} 50%, transparent 100%)`,
        backgroundSize: '40% 100%',
        backgroundRepeat: 'no-repeat',
        animation: 'ori-progress-indeterminate 1.4s ease-in-out infinite',
      },
      '&:indeterminate::-webkit-progress-bar': {
        backgroundColor: 'transparent',
      },
      '&:indeterminate::-moz-progress-bar': {
        backgroundColor: 'transparent',
      },
    },
    '.ori-progress-wrap': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.1'),
    },
    '.ori-progress__label': {
      display: 'flex',
      justifyContent: 'space-between',
      gap: theme('spacing.2'),
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      color: v('text-primary'),
    },
    '.ori-progress__value': { color: v('text-secondary') },

    // ─── Skeleton ──────────────────────────────────────────────────────────
    '.ori-skeleton': {
      display: 'block',
      backgroundColor: v('surface-muted'),
      borderRadius: theme('borderRadius.sm'),
      backgroundImage: `linear-gradient(90deg, ${v('surface-muted')} 0%, ${v('surface-subtle')} 50%, ${v('surface-muted')} 100%)`,
      backgroundSize: '200% 100%',
      animation: 'ori-skeleton-shimmer 1.6s ease-in-out infinite',
    },
    '.ori-skeleton--text': {
      height: '0.875rem',
      borderRadius: theme('borderRadius.sm'),
    },
    '.ori-skeleton--circle': {
      borderRadius: '9999px',
    },

    // ─── Spinner inline ─────────────────────────────────────────────────────
    // Indicateur de chargement compact, hérite de currentColor.
    '.ori-spinner': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      lineHeight: '0',
      verticalAlign: 'middle',
      color: 'currentColor',
    },
    '.ori-spinner__svg': {
      animation: 'ori-spinner-rotate 0.9s linear infinite',
    },
    // Réduction motion : on ralentit fortement plutôt que de figer (un
    // chargement statique perd son sens).
    '@media (prefers-reduced-motion: reduce)': {
      '.ori-spinner__svg': {
        animationDuration: '4s',
      },
    },

    // ─── EmptyState ─────────────────────────────────────────────────────────
    // Bloc d'absence de données : icône, titre, description, actions empilés
    // verticalement et centrés. Trois tailles (sm, md, lg) qui ajustent le
    // padding et la taille de l'icône.
    '.ori-empty-state': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      gap: theme('spacing.3'),
      color: v('text-secondary'),
    },
    '.ori-empty-state--sm': {
      paddingBlock: theme('spacing.6'),
      paddingInline: theme('spacing.4'),
      gap: theme('spacing.2'),
    },
    '.ori-empty-state--md': {
      paddingBlock: theme('spacing.10'),
      paddingInline: theme('spacing.6'),
    },
    '.ori-empty-state--lg': {
      paddingBlock: theme('spacing.16'),
      paddingInline: theme('spacing.8'),
      gap: theme('spacing.4'),
    },
    '.ori-empty-state__icon': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: v('text-muted'),
      lineHeight: '0',
    },
    '.ori-empty-state__icon:empty': {
      display: 'none',
    },
    '.ori-empty-state__title': {
      margin: '0',
      fontSize: theme('fontSize.lg'),
      fontWeight: theme('fontWeight.semibold'),
      color: v('text-primary'),
    },
    '.ori-empty-state--sm .ori-empty-state__title': {
      fontSize: theme('fontSize.base'),
    },
    '.ori-empty-state--lg .ori-empty-state__title': {
      fontSize: theme('fontSize.xl'),
    },
    '.ori-empty-state__description': {
      margin: '0',
      maxWidth: '32rem',
      fontSize: theme('fontSize.sm'),
      lineHeight: theme('lineHeight.relaxed'),
      color: v('text-secondary'),
    },
    '.ori-empty-state__actions': {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: theme('spacing.2'),
      marginTop: theme('spacing.2'),
    },
    '.ori-empty-state__actions:empty': {
      display: 'none',
    },

    // ─── AppShell ───────────────────────────────────────────────────────────
    // Layout d'application : grille à 3 lignes (header / body / footer), avec
    // une 2e dimension dans body pour aside + main quand sidebar présente.
    // Sidebar drawer en responsive < 768px (translate-x off-screen + scrim).
    '.ori-app-shell': {
      display: 'grid',
      gridTemplateRows: 'auto 1fr auto',
      minHeight: '100vh',
      backgroundColor: v('surface-base'),
      color: v('text-primary'),
    },
    '.ori-app-shell__skip-link': {
      position: 'absolute',
      insetInlineStart: theme('spacing.4'),
      top: theme('spacing.2'),
      paddingBlock: theme('spacing.2'),
      paddingInline: theme('spacing.3'),
      backgroundColor: v('brand-primary'),
      color: v('brand-on-primary'),
      borderRadius: theme('borderRadius.md'),
      fontWeight: theme('fontWeight.medium'),
      textDecoration: 'none',
      zIndex: '100',
      // Hors viewport tant qu'il n'a pas le focus.
      transform: 'translateY(-150%)',
      transitionProperty: 'transform',
      transitionDuration: theme('transitionDuration.fast'),
      transitionTimingFunction: theme('transitionTimingFunction.standard'),
      '&:focus, &:focus-visible': {
        transform: 'translateY(0)',
        outline: `2px solid ${v('border-focus')}`,
        outlineOffset: '2px',
      },
    },
    '.ori-app-shell__header': {
      position: 'sticky',
      top: '0',
      zIndex: '40',
      backgroundColor: v('surface-base'),
    },
    '.ori-app-shell__body': {
      display: 'flex',
      flex: '1 1 auto',
      minHeight: '0',
      position: 'relative',
    },
    '.ori-app-shell__sidebar': {
      flexShrink: '0',
      overflowY: 'auto',
      backgroundColor: v('surface-base'),
      // Container flex column pour que le contenu projeté (typiquement un
      // <nav>) s'étire en hauteur sur toute la sidebar. Sans ça, une bordure
      // ou un fond appliqué au contenu projeté s'arrête à la hauteur de ses
      // items et laisse un espace blanc en bas avant le footer.
      display: 'flex',
      flexDirection: 'column',
      '& > *': {
        flex: '1 1 auto',
        minHeight: '0',
      },
    },
    // Desktop ≥ 768px : si `sidebarOpen=false` (classe `--sidebar-open`
    // absente), la sidebar disparaît du flow et le main reprend toute la
    // largeur. Sur mobile, la même prop pilote l'ouverture du drawer (cf.
    // règles @media (max-width: 767px) plus bas).
    '.ori-app-shell--with-sidebar:not(.ori-app-shell--sidebar-open) .ori-app-shell__sidebar': {
      '@media (min-width: 768px)': {
        display: 'none',
      },
    },
    // Bouton de toggle intégré : sur desktop, frère direct du sidebar et du
    // main. Sa position dans le flow flex le colle naturellement entre les
    // deux quand la sidebar est visible, et au début du body quand elle est
    // masquée. Caché sur mobile (le drawer ferme via le scrim cliquable).
    '.ori-app-shell__sidebar-toggle': {
      alignSelf: 'flex-start',
      flexShrink: '0',
      marginTop: theme('spacing.4'),
      width: '1.75rem',
      height: '1.75rem',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0',
      backgroundColor: v('surface-base'),
      border: `1px solid ${v('border-subtle')}`,
      borderRadius: '9999px',
      color: v('text-secondary'),
      cursor: 'pointer',
      boxShadow: theme('boxShadow.sm'),
      transitionProperty: 'background-color, color, border-color, transform',
      transitionDuration: theme('transitionDuration.fast'),
      transitionTimingFunction: theme('transitionTimingFunction.standard'),
      // Translate le bouton pour qu'il chevauche pile la frontière
      // sidebar/main (effet "collé sur le bord droit de la sidebar"
      // quand ouverte, "collé au bord gauche du main" quand fermée).
      transform: 'translateX(-50%)',
      zIndex: '5',
      '&:hover': {
        backgroundColor: v('surface-muted'),
        color: v('text-primary'),
        borderColor: v('border-default'),
      },
      '&:focus-visible': {
        outline: `2px solid ${v('border-focus')}`,
        outlineOffset: '2px',
      },
      '@media (max-width: 767px)': {
        display: 'none',
      },
    },
    '.ori-app-shell__main': {
      flex: '1 1 auto',
      minWidth: '0',
      overflowY: 'auto',
      // Le main reçoit le focus au skip link, on retire l'outline natif quand
      // le focus vient programmatiquement (par contre le focus visible
      // intentionnel garde un outline via les composants enfants).
      '&:focus': {
        outline: 'none',
      },
    },
    '.ori-app-shell__footer': {
      backgroundColor: v('surface-base'),
    },
    // Scrim mobile : caché au-dessus de 768px, visible quand drawer ouvert.
    '.ori-app-shell__scrim': {
      display: 'none',
      position: 'fixed',
      inset: '0',
      backgroundColor: 'rgb(0 0 0 / 0.5)',
      zIndex: '30',
      border: 'none',
      cursor: 'pointer',
    },
    // Mode mobile : sidebar devient un drawer hors flux.
    // NB : on imbrique l'@media DANS chaque sélecteur (et non l'inverse) car
    // PostCSS / Tailwind aplatit les @media de niveau racine d'addComponents
    // en perdant les sélecteurs parents composés (`.parent .child`), ce qui
    // appliquait la règle "drawer fixed" sur tous les viewports. Avec cette
    // forme, chaque sélecteur garde son `parent .child` et l'@media est
    // correctement préservée dans la sortie CSS.
    '.ori-app-shell--with-sidebar .ori-app-shell__sidebar': {
      '@media (max-width: 767px)': {
        position: 'fixed',
        top: '0',
        bottom: '0',
        insetInlineStart: '0',
        zIndex: '50',
        transform: 'translateX(-100%)',
        transitionProperty: 'transform',
        transitionDuration: theme('transitionDuration.normal'),
        transitionTimingFunction: theme('transitionTimingFunction.standard'),
        boxShadow: theme('boxShadow.xl'),
      },
    },
    '.ori-app-shell--sidebar-open .ori-app-shell__sidebar': {
      '@media (max-width: 767px)': {
        transform: 'translateX(0)',
      },
    },
    '.ori-app-shell--sidebar-open .ori-app-shell__scrim': {
      '@media (max-width: 767px)': {
        display: 'block',
      },
    },

    // ─── Form layout ────────────────────────────────────────────────────────
    // Espacement vertical cohérent entre sections, fields et actions. La
    // hiérarchie visuelle vit dans le titre h3 + description courte de chaque
    // section ; les champs eux-mêmes restent neutres pour ne pas concurrencer
    // le contenu de l'input projeté.
    '.ori-form': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.8'),
    },
    '.ori-form-section': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.4'),
    },
    '.ori-form-section__header': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.1'),
    },
    '.ori-form-section__title': {
      margin: '0',
      fontSize: theme('fontSize.base'),
      fontWeight: theme('fontWeight.semibold'),
      color: v('text-primary'),
    },
    '.ori-form-section__description': {
      margin: '0',
      fontSize: theme('fontSize.sm'),
      color: v('text-secondary'),
      lineHeight: theme('lineHeight.relaxed'),
    },
    '.ori-form-section__fields': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.4'),
    },
    '.ori-form-field': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.1'),
    },
    '.ori-form-field__label': {
      fontSize: theme('fontSize.sm'),
      fontWeight: theme('fontWeight.medium'),
      color: v('text-primary'),
    },
    '.ori-form-field__required': {
      color: v('feedback-danger'),
    },
    '.ori-form-field__hint': {
      margin: '0',
      fontSize: theme('fontSize.xs'),
      color: v('text-secondary'),
      lineHeight: theme('lineHeight.relaxed'),
    },
    '.ori-form-field__error': {
      margin: '0',
      fontSize: theme('fontSize.xs'),
      color: v('feedback-danger'),
      lineHeight: theme('lineHeight.relaxed'),
    },
    '.ori-form-actions': {
      display: 'flex',
      flexWrap: 'wrap',
      gap: theme('spacing.2'),
      paddingTop: theme('spacing.2'),
    },
    '.ori-form-actions--start': {
      justifyContent: 'flex-start',
    },
    '.ori-form-actions--center': {
      justifyContent: 'center',
    },
    '.ori-form-actions--end': {
      justifyContent: 'flex-end',
    },

    // ─── LoginLayout ────────────────────────────────────────────────────────
    // Page d'authentification : centrage vertical/horizontal d'une carte
    // contenant le titre + contenu + footer optionnel. Le logo et le footer
    // de page restent en dehors de la carte.
    '.ori-login-layout': {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBlock: theme('spacing.10'),
      paddingInline: theme('spacing.4'),
      backgroundColor: v('surface-muted'),
    },
    '.ori-login-layout__inner': {
      width: '100%',
      maxWidth: '28rem',
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.6'),
      alignItems: 'center',
    },
    '.ori-login-layout__logo': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    '.ori-login-layout__card': {
      width: '100%',
      backgroundColor: v('surface-base'),
      borderRadius: theme('borderRadius.lg'),
      boxShadow: theme('boxShadow.lg'),
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: v('border-subtle'),
      padding: theme('spacing.6'),
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.5'),
    },
    '.ori-login-layout__header': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.1'),
    },
    '.ori-login-layout__title': {
      margin: '0',
      fontSize: theme('fontSize.xl'),
      fontWeight: theme('fontWeight.semibold'),
      color: v('text-primary'),
    },
    '.ori-login-layout__description': {
      margin: '0',
      fontSize: theme('fontSize.sm'),
      color: v('text-secondary'),
      lineHeight: theme('lineHeight.relaxed'),
    },
    '.ori-login-layout__body': {
      display: 'flex',
      flexDirection: 'column',
    },
    '.ori-login-layout__card-footer': {
      paddingTop: theme('spacing.4'),
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: v('border-subtle'),
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.2'),
      fontSize: theme('fontSize.sm'),
      color: v('text-secondary'),
      textAlign: 'center',
    },
    '.ori-login-layout__footer': {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: theme('spacing.4'),
      fontSize: theme('fontSize.xs'),
      color: v('text-muted'),
      textAlign: 'center',
    },

    // ─── Wizard ─────────────────────────────────────────────────────────────
    // Steps en haut + panneau de l'étape active + actions en pied. Espacement
    // vertical aligné sur Form pour permettre une intégration cohérente.
    '.ori-wizard': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.6'),
    },
    '.ori-wizard__steps': {
      display: 'block',
    },
    '.ori-wizard__panel': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.4'),
    },
    '.ori-wizard__step-title': {
      margin: '0',
      fontSize: theme('fontSize.lg'),
      fontWeight: theme('fontWeight.semibold'),
      color: v('text-primary'),
    },
    '.ori-wizard__step-body': {
      display: 'flex',
      flexDirection: 'column',
    },
    '.ori-wizard__actions': {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: theme('spacing.2'),
      paddingTop: theme('spacing.4'),
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: v('border-subtle'),
    },

    // ─── DataTable ──────────────────────────────────────────────────────────
    // Toolbar avec filtre + compteur, table existante .ori-table en dessous,
    // pagination en pied. Bouton 3-dots dans la dernière colonne pour les
    // actions de ligne (rendu via DropdownMenu).
    '.ori-data-table': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.3'),
    },
    '.ori-data-table__toolbar': {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme('spacing.3'),
    },
    '.ori-data-table__filter-label': {
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme('spacing.2'),
      flex: '1 1 auto',
      minWidth: '14rem',
      maxWidth: '24rem',
      paddingInline: theme('spacing.3'),
      paddingBlock: theme('spacing.2'),
      backgroundColor: v('surface-base'),
      borderRadius: theme('borderRadius.md'),
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: v('border-default'),
      transitionProperty: 'border-color, box-shadow',
      transitionDuration: theme('transitionDuration.fast'),
      transitionTimingFunction: theme('transitionTimingFunction.standard'),
      '&:focus-within': {
        borderColor: v('border-focus'),
        boxShadow: `0 0 0 3px ${v('brand-primary-subtle')}`,
      },
    },
    '.ori-data-table__filter-icon': {
      display: 'inline-flex',
      color: v('text-muted'),
      lineHeight: '0',
      flexShrink: '0',
    },
    '.ori-data-table__filter-input': {
      flex: '1 1 auto',
      minWidth: '0',
      border: 'none',
      outline: 'none',
      backgroundColor: 'transparent',
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      color: v('text-primary'),
      '&::placeholder': { color: v('text-muted') },
      // Retire la croix du search natif (esthétique inégale entre browsers)
      '&::-webkit-search-cancel-button': {
        WebkitAppearance: 'none',
      },
    },
    '.ori-data-table__count': {
      fontSize: theme('fontSize.sm'),
      color: v('text-secondary'),
      whiteSpace: 'nowrap',
    },
    '.ori-data-table__footer': {
      display: 'flex',
      justifyContent: 'flex-end',
      paddingTop: theme('spacing.2'),
    },
    '.ori-data-table__row-actions-trigger': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '2rem',
      height: '2rem',
      padding: '0',
      background: 'transparent',
      border: 'none',
      borderRadius: theme('borderRadius.sm'),
      color: v('text-secondary'),
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: v('surface-muted'),
        color: v('text-primary'),
      },
      '&:focus-visible': {
        outline: `2px solid ${v('border-focus')}`,
        outlineOffset: '2px',
      },
    },

    // ─── Timeline ──────────────────────────────────────────────────────────
    '.ori-timeline': {
      display: 'flex',
      flexDirection: 'column',
      margin: '0',
      padding: '0',
      listStyle: 'none',
    },
    '.ori-timeline__item': {
      display: 'flex',
      gap: theme('spacing.4'),
      paddingBottom: theme('spacing.5'),
      position: 'relative',
    },
    // Ligne verticale entre les dots (tous sauf le dernier)
    '.ori-timeline__item:not(:last-child)::before': {
      content: '""',
      position: 'absolute',
      left: '0.6875rem',
      top: '1.5rem',
      bottom: '0',
      width: '2px',
      backgroundColor: v('border-subtle'),
    },
    '.ori-timeline__dot': {
      flex: '0 0 auto',
      width: '1.5rem',
      height: '1.5rem',
      borderRadius: '9999px',
      backgroundColor: v('brand-primary-subtle'),
      color: v('brand-primary'),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: theme('fontSize.xs'),
      fontWeight: theme('fontWeight.semibold'),
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: v('surface-base'),
      zIndex: '1',
    },
    '.ori-timeline__item--completed .ori-timeline__dot': {
      backgroundColor: v('feedback-success'),
      color: v('brand-on-primary'),
    },
    '.ori-timeline__item--current .ori-timeline__dot': {
      backgroundColor: v('brand-primary'),
      color: v('brand-on-primary'),
    },
    '.ori-timeline__item--pending .ori-timeline__dot': {
      backgroundColor: v('surface-muted'),
      color: v('text-secondary'),
      borderColor: v('border-default'),
    },
    '.ori-timeline__content': {
      flex: '1 1 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.125rem',
      minWidth: '0',
    },
    '.ori-timeline__title': {
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      fontWeight: theme('fontWeight.medium'),
      color: v('text-primary'),
    },
    '.ori-timeline__meta': {
      fontSize: theme('fontSize.xs'),
      color: v('text-muted'),
    },
    '.ori-timeline__description': {
      marginTop: '0.25rem',
      fontSize: theme('fontSize.sm'),
      color: v('text-secondary'),
      lineHeight: theme('lineHeight.normal'),
    },

    // ─── Toast ─────────────────────────────────────────────────────────────
    '.ori-toast-viewport': {
      position: 'fixed',
      zIndex: '60',
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.2'),
      padding: theme('spacing.4'),
      maxWidth: 'calc(100vw - 2rem)',
      width: '24rem',
      pointerEvents: 'none',
    },
    '.ori-toast-viewport--top-right': { top: '0', right: '0' },
    '.ori-toast-viewport--top-left': { top: '0', left: '0' },
    '.ori-toast-viewport--bottom-right': { bottom: '0', right: '0' },
    '.ori-toast-viewport--bottom-left': { bottom: '0', left: '0' },
    '.ori-toast-viewport--top-center': { top: '0', left: '50%', transform: 'translateX(-50%)' },
    '.ori-toast-viewport--bottom-center': {
      bottom: '0',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    '.ori-toast': {
      display: 'flex',
      alignItems: 'flex-start',
      gap: theme('spacing.3'),
      padding: theme('spacing.3'),
      backgroundColor: v('surface-base'),
      borderRadius: theme('borderRadius.md'),
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: v('border-default'),
      boxShadow: theme('boxShadow.lg'),
      pointerEvents: 'auto',
      animation:
        'ori-toast-in var(--ori-duration-fast, 200ms) var(--ori-easing-standard, cubic-bezier(0.4, 0, 0.2, 1))',
    },
    '.ori-toast__icon': {
      flex: '0 0 auto',
      width: '1.25rem',
      height: '1.25rem',
      marginTop: '0.125rem',
    },
    '.ori-toast__content': {
      flex: '1 1 auto',
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      lineHeight: theme('lineHeight.normal'),
      color: v('text-primary'),
    },
    '.ori-toast__title': {
      fontWeight: theme('fontWeight.semibold'),
      marginBottom: '0.125rem',
    },
    '.ori-toast__close': {
      flex: '0 0 auto',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: theme('spacing.1'),
      borderRadius: theme('borderRadius.sm'),
      color: v('text-secondary'),
      '&:hover': { color: v('text-primary'), backgroundColor: v('surface-muted') },
    },
    '.ori-toast--info .ori-toast__icon': { color: v('feedback-info') },
    '.ori-toast--success .ori-toast__icon': { color: v('feedback-success') },
    '.ori-toast--warning .ori-toast__icon': { color: v('feedback-warning') },
    '.ori-toast--danger .ori-toast__icon': { color: v('feedback-danger') },

    // ─── Notification (banner) ─────────────────────────────────────────────
    '.ori-notification': {
      display: 'flex',
      alignItems: 'flex-start',
      gap: theme('spacing.3'),
      paddingInline: theme('spacing.5'),
      paddingBlock: theme('spacing.3'),
      borderTopWidth: '0',
      borderInlineWidth: '0',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      lineHeight: theme('lineHeight.normal'),
    },
    '.ori-notification__icon': {
      flex: '0 0 auto',
      width: '1.25rem',
      height: '1.25rem',
      marginTop: '0.125rem',
    },
    '.ori-notification__content': {
      flex: '1 1 auto',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: theme('spacing.2'),
    },
    '.ori-notification__action': {
      flex: '0 0 auto',
      color: 'currentColor',
      textDecorationLine: 'underline',
      textDecorationThickness: '1px',
      textUnderlineOffset: '2px',
      fontWeight: theme('fontWeight.medium'),
      cursor: 'pointer',
      background: 'transparent',
      border: 'none',
      padding: '0',
      '&:hover': { textDecorationThickness: '2px' },
    },
    '.ori-notification__close': {
      flex: '0 0 auto',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: theme('spacing.1'),
      borderRadius: theme('borderRadius.sm'),
      color: 'currentColor',
      opacity: '0.7',
      '&:hover': { opacity: '1' },
    },
    '.ori-notification--info': {
      backgroundColor: v('feedback-info-bg'),
      borderBottomColor: v('feedback-info'),
      color: v('feedback-info-strong'),
    },
    '.ori-notification--success': {
      backgroundColor: v('feedback-success-bg'),
      borderBottomColor: v('feedback-success'),
      color: v('feedback-success-strong'),
    },
    '.ori-notification--warning': {
      backgroundColor: v('feedback-warning-bg'),
      borderBottomColor: v('feedback-warning'),
      color: v('feedback-warning-strong'),
    },
    '.ori-notification--danger': {
      backgroundColor: v('feedback-danger-bg'),
      borderBottomColor: v('feedback-danger'),
      color: v('feedback-danger-strong'),
    },

    // ─── Table ─────────────────────────────────────────────────────────────
    '.ori-table-wrap': {
      width: '100%',
      overflowX: 'auto',
      borderRadius: theme('borderRadius.md'),
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: v('border-subtle'),
    },
    '.ori-table': {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      color: v('text-primary'),
    },
    '.ori-table thead': {
      backgroundColor: v('surface-muted'),
    },
    '.ori-table th': {
      paddingInline: theme('spacing.4'),
      paddingBlock: theme('spacing.3'),
      textAlign: 'start',
      fontWeight: theme('fontWeight.semibold'),
      color: v('text-secondary'),
      fontSize: theme('fontSize.xs'),
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: v('border-default'),
    },
    '.ori-table td': {
      paddingInline: theme('spacing.4'),
      paddingBlock: theme('spacing.3'),
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: v('border-subtle'),
    },
    '.ori-table tbody tr:last-child td': {
      borderBottomWidth: '0',
    },
    // Zebra striping opt-in : alterne `surface-base` et `surface-subtle`.
    // Contraste texte respecté sur les deux fonds (cf. WCAG 1.4.3).
    // Le hover et la sélection l'emportent visuellement.
    '.ori-table--striped tbody tr:nth-child(even)': {
      backgroundColor: v('surface-subtle'),
    },
    '.ori-table tbody tr:hover': {
      backgroundColor: v('surface-muted'),
    },
    '.ori-table tbody tr[aria-selected="true"]': {
      backgroundColor: v('brand-primary-subtle'),
    },
    '.ori-table tbody tr[aria-selected="true"]:hover': {
      backgroundColor: v('brand-primary-subtle'),
    },
    '.ori-table--clickable tbody tr': {
      cursor: 'pointer',
    },
    '.ori-table__sort-button': {
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme('spacing.1'),
      background: 'transparent',
      border: 'none',
      padding: '0',
      margin: '0',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      fontWeight: 'inherit',
      color: 'inherit',
      textTransform: 'inherit',
      letterSpacing: 'inherit',
      borderRadius: theme('borderRadius.sm'),
      '&:hover': { color: v('text-primary') },
      '&:focus-visible': {
        outline: 'none',
        boxShadow: `0 0 0 3px ${v('brand-primary-subtle')}`,
      },
    },
    '.ori-table__sort-icon': {
      flex: '0 0 auto',
      opacity: '0.5',
    },
    // L'attribut aria-sort vit sur le <th> (cf. ARIA spec), pas sur le
    // <button> interne ; le sélecteur cible donc le th parent.
    'th[aria-sort="ascending"] .ori-table__sort-icon, th[aria-sort="descending"] .ori-table__sort-icon':
      {
        opacity: '1',
        color: v('brand-primary'),
      },
    '.ori-table__select-cell': {
      width: '2.5rem',
      paddingInlineEnd: '0',
    },
    '.ori-table__empty': {
      padding: theme('spacing.8'),
      textAlign: 'center',
      color: v('text-secondary'),
    },
    '.ori-table__loading': {
      padding: theme('spacing.6'),
      textAlign: 'center',
      color: v('text-secondary'),
    },

    // ─── Logo ──────────────────────────────────────────────────────────────
    '.ori-logo': {
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme('spacing.3'),
      color: 'inherit',
      textDecoration: 'none',
    },
    '.ori-logo__crest': {
      flex: '0 0 auto',
      width: '2.25rem',
      height: '2.25rem',
    },
    '.ori-logo__text': {
      display: 'flex',
      flexDirection: 'column',
      lineHeight: theme('lineHeight.tight'),
    },
    '.ori-logo__title': {
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      fontWeight: theme('fontWeight.semibold'),
      color: v('text-primary'),
    },
    '.ori-logo__subtitle': {
      fontSize: theme('fontSize.xs'),
      color: v('text-secondary'),
    },

    // ─── Header (app-level) ────────────────────────────────────────────────
    '.ori-header': {
      display: 'flex',
      alignItems: 'center',
      gap: theme('spacing.4'),
      paddingInline: theme('spacing.5'),
      paddingBlock: theme('spacing.3'),
      backgroundColor: v('surface-base'),
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: v('border-subtle'),
    },
    '.ori-header__brand': { flex: '0 0 auto' },
    '.ori-header__nav': {
      flex: '1 1 auto',
      display: 'flex',
      justifyContent: 'center',
      minWidth: '0',
    },
    '.ori-header__actions': {
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      gap: theme('spacing.2'),
    },

    // ─── Footer (app-level) ────────────────────────────────────────────────
    '.ori-footer': {
      paddingInline: theme('spacing.5'),
      paddingBlock: theme('spacing.5'),
      backgroundColor: v('surface-muted'),
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: v('border-subtle'),
      color: v('text-secondary'),
      fontSize: theme('fontSize.sm'),
    },
    '.ori-footer__content': {
      display: 'flex',
      flexWrap: 'wrap',
      gap: theme('spacing.6'),
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    '.ori-footer__brand': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.2'),
    },
    '.ori-footer__columns': {
      display: 'flex',
      flexWrap: 'wrap',
      gap: theme('spacing.6'),
    },
    '.ori-footer__column': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.1'),
      minWidth: '8rem',
    },
    '.ori-footer__column-title': {
      fontSize: theme('fontSize.xs'),
      fontWeight: theme('fontWeight.semibold'),
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      color: v('text-primary'),
      marginBottom: theme('spacing.1'),
    },
    '.ori-footer__bottom': {
      marginTop: theme('spacing.5'),
      paddingTop: theme('spacing.3'),
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: v('border-subtle'),
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: theme('spacing.3'),
      fontSize: theme('fontSize.xs'),
    },

    // ─── MainNavigation ────────────────────────────────────────────────────
    '.ori-main-nav': {
      display: 'flex',
      flexWrap: 'wrap',
      gap: theme('spacing.1'),
      margin: '0',
      padding: '0',
      listStyle: 'none',
    },
    '.ori-main-nav__item': { display: 'inline-flex' },
    '.ori-main-nav__link': {
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme('spacing.2'),
      paddingInline: theme('spacing.3'),
      paddingBlock: theme('spacing.2'),
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      fontWeight: theme('fontWeight.medium'),
      color: v('text-secondary'),
      textDecoration: 'none',
      borderRadius: theme('borderRadius.md'),
      transitionProperty: 'background-color, color',
      transitionDuration: theme('transitionDuration.fast'),
      transitionTimingFunction: theme('transitionTimingFunction.standard'),
      '&:hover': { backgroundColor: v('surface-muted'), color: v('text-primary') },
      '&:focus-visible': {
        outline: 'none',
        boxShadow: `0 0 0 3px ${v('brand-primary-subtle')}`,
      },
      '&[aria-current="page"]': {
        color: v('brand-primary'),
        backgroundColor: v('brand-primary-subtle'),
      },
    },

    // ─── SideMenu ──────────────────────────────────────────────────────────
    '.ori-side-menu': {
      display: 'flex',
      flexDirection: 'column',
      width: '16rem',
      // Remplit la hauteur de son container parent (pattern d'un sidebar
      // persistent dans un layout flex). Sans ça, la sidebar s'arrête au
      // niveau de son contenu et le fond de page apparaît dessous, ce qui
      // donne un rendu cassé surtout en dark mode où les surfaces sont
      // proches en luminosité.
      height: '100%',
      paddingBlock: theme('spacing.4'),
      paddingInline: theme('spacing.3'),
      backgroundColor: v('surface-base'),
      borderRightWidth: '1px',
      borderRightStyle: 'solid',
      borderRightColor: v('border-default'),
      overflowY: 'auto',
    },
    '.ori-side-menu--drawer': {
      position: 'fixed',
      top: '0',
      left: '0',
      bottom: '0',
      zIndex: '50',
      boxShadow: theme('boxShadow.xl'),
      animation:
        'ori-side-menu-in var(--ori-duration-fast, 200ms) var(--ori-easing-standard, cubic-bezier(0.4, 0, 0.2, 1))',
    },
    '.ori-side-menu__overlay': {
      position: 'fixed',
      inset: '0',
      zIndex: '49',
      backgroundColor: 'rgb(0 0 0 / 0.5)',
      animation:
        'ori-fade-in var(--ori-duration-normal, 250ms) var(--ori-easing-standard, cubic-bezier(0.4, 0, 0.2, 1))',
    },
    '.ori-side-menu__section': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.1'),
      paddingBlock: theme('spacing.4'),
    },
    '.ori-side-menu__section + .ori-side-menu__section': {
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: v('border-subtle'),
    },
    '.ori-side-menu__section-title': {
      paddingInline: theme('spacing.3'),
      fontSize: theme('fontSize.xs'),
      fontWeight: theme('fontWeight.bold'),
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: v('text-secondary'),
      marginBottom: theme('spacing.2'),
    },
    '.ori-side-menu__list': {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.125rem',
      margin: '0',
      padding: '0',
      listStyle: 'none',
    },
    '.ori-side-menu__link': {
      display: 'flex',
      alignItems: 'center',
      gap: theme('spacing.2'),
      paddingInline: theme('spacing.3'),
      paddingBlock: theme('spacing.2'),
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      color: v('text-primary'),
      textDecoration: 'none',
      borderRadius: theme('borderRadius.md'),
      transitionProperty: 'background-color, color',
      transitionDuration: theme('transitionDuration.fast'),
      transitionTimingFunction: theme('transitionTimingFunction.standard'),
      '&:hover': { backgroundColor: v('surface-muted') },
      '&:focus-visible': {
        outline: 'none',
        boxShadow: `0 0 0 3px ${v('brand-primary-subtle')}`,
      },
      '&[aria-current="page"]': {
        backgroundColor: v('brand-primary-subtle'),
        color: v('brand-primary'),
        fontWeight: theme('fontWeight.medium'),
      },
    },
    '.ori-side-menu__close': {
      alignSelf: 'flex-end',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: theme('spacing.1'),
      borderRadius: theme('borderRadius.sm'),
      color: v('text-secondary'),
      '&:hover': { color: v('text-primary'), backgroundColor: v('surface-muted') },
    },

    // ─── LanguageSwitcher ──────────────────────────────────────────────────
    '.ori-language-switcher': {
      position: 'relative',
      display: 'inline-block',
    },
    '.ori-language-switcher__trigger': {
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme('spacing.1'),
      paddingInline: theme('spacing.2'),
      paddingBlock: theme('spacing.1'),
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      fontWeight: theme('fontWeight.medium'),
      color: v('text-secondary'),
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      borderRadius: theme('borderRadius.md'),
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      '&:hover': { color: v('text-primary'), backgroundColor: v('surface-muted') },
      '&:focus-visible': {
        outline: 'none',
        boxShadow: `0 0 0 3px ${v('brand-primary-subtle')}`,
      },
    },
    '.ori-language-switcher__menu': {
      position: 'absolute',
      top: 'calc(100% + 0.25rem)',
      right: '0',
      zIndex: '40',
      minWidth: '8rem',
      paddingBlock: theme('spacing.1'),
      backgroundColor: v('surface-base'),
      borderRadius: theme('borderRadius.md'),
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: v('border-default'),
      boxShadow: theme('boxShadow.lg'),
      margin: '0',
      listStyle: 'none',
    },
    '.ori-language-switcher__option': {
      width: '100%',
      paddingInline: theme('spacing.3'),
      paddingBlock: theme('spacing.2'),
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      color: v('text-primary'),
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'start',
      '&:hover': { backgroundColor: v('surface-muted') },
      '&[aria-checked="true"]': {
        color: v('brand-primary'),
        fontWeight: theme('fontWeight.medium'),
      },
    },

    // ─── Card ──────────────────────────────────────────────────────────────
    '.ori-card': {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: v('surface-base'),
      borderRadius: theme('borderRadius.lg'),
      borderWidth: '1px',
      borderStyle: 'solid',
      // `border-default` (neutral-300) au lieu de `border-subtle` (neutral-200) :
      // sur fond `surface-base` (blanc), border-subtle se confond presque avec
      // le fond. La séparation interne entre header/body/footer reste en
      // border-subtle (plus discrète, contraste géré par le contenu).
      borderColor: v('border-default'),
      overflow: 'hidden',
    },
    '.ori-card--elevated': {
      borderColor: v('border-default'),
      boxShadow: theme('boxShadow.md'),
    },
    '.ori-card--flat': {
      borderColor: 'transparent',
      backgroundColor: v('surface-muted'),
    },
    '.ori-card__header': {
      paddingInline: theme('spacing.5'),
      paddingBlock: theme('spacing.4'),
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: v('border-subtle'),
    },
    '.ori-card__title': {
      fontSize: theme('fontSize.lg'),
      fontWeight: theme('fontWeight.semibold'),
      color: v('text-primary'),
      margin: '0',
    },
    '.ori-card__subtitle': {
      fontSize: theme('fontSize.sm'),
      color: v('text-secondary'),
      marginTop: theme('spacing.1'),
    },
    '.ori-card__body': {
      paddingInline: theme('spacing.5'),
      paddingBlock: theme('spacing.4'),
      flex: '1 1 auto',
    },
    '.ori-card__footer': {
      display: 'flex',
      alignItems: 'center',
      gap: theme('spacing.2'),
      paddingInline: theme('spacing.5'),
      paddingBlock: theme('spacing.3'),
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: v('border-subtle'),
      backgroundColor: v('surface-muted'),
    },

    // ─── Statistic ─────────────────────────────────────────────────────────
    '.ori-statistic': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.1'),
      minWidth: '0',
    },
    '.ori-statistic--inline': {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: theme('spacing.4'),
    },
    '.ori-statistic__label': {
      fontSize: theme('fontSize.sm'),
      fontWeight: theme('fontWeight.medium'),
      color: v('text-secondary'),
      lineHeight: theme('lineHeight.snug'),
    },
    '.ori-statistic__value': {
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: theme('spacing.1'),
      fontSize: theme('fontSize.3xl'),
      fontWeight: theme('fontWeight.semibold'),
      lineHeight: '1',
      color: v('text-primary'),
      fontVariantNumeric: 'tabular-nums',
    },
    '.ori-statistic--lg .ori-statistic__value': {
      fontSize: theme('fontSize.4xl'),
    },
    '.ori-statistic--inline .ori-statistic__value': {
      fontSize: theme('fontSize.xl'),
    },
    '.ori-statistic__value-prefix, .ori-statistic__value-suffix': {
      fontSize: theme('fontSize.sm'),
      fontWeight: theme('fontWeight.medium'),
      color: v('text-secondary'),
    },
    '.ori-statistic__trend': {
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme('spacing.1'),
      fontSize: theme('fontSize.xs'),
      fontWeight: theme('fontWeight.medium'),
      lineHeight: theme('lineHeight.snug'),
    },
    '.ori-statistic__trend--up': {
      color: v('feedback-success-strong'),
    },
    '.ori-statistic__trend--down': {
      color: v('feedback-danger-strong'),
    },
    '.ori-statistic__trend--flat': {
      color: v('text-secondary'),
    },

    // ─── FileCard ──────────────────────────────────────────────────────────
    '.ori-file-card': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.2'),
      padding: theme('spacing.4'),
      backgroundColor: v('surface-base'),
      borderRadius: theme('borderRadius.lg'),
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: v('border-default'),
      minWidth: '0',
      boxShadow: theme('boxShadow.sm'),
    },
    '.ori-file-card__head': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme('spacing.2'),
    },
    '.ori-file-card__icon': {
      flex: '0 0 auto',
      width: '2.5rem',
      height: '2.5rem',
      borderRadius: theme('borderRadius.md'),
      backgroundColor: v('surface-muted'),
      color: v('text-secondary'),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    '.ori-file-card__actions': {
      flex: '0 0 auto',
      display: 'flex',
      gap: '0.125rem',
    },
    '.ori-file-card__name': {
      fontWeight: theme('fontWeight.semibold'),
      fontSize: theme('fontSize.sm'),
      color: v('text-primary'),
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      lineHeight: theme('lineHeight.snug'),
    },
    '.ori-file-card__meta': {
      display: 'flex',
      alignItems: 'center',
      gap: theme('spacing[1.5]'),
      fontSize: theme('fontSize.xs'),
      color: v('text-secondary'),
      minWidth: '0',
    },
    '.ori-file-card__meta-text': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      minWidth: '0',
    },
    '.ori-file-card__link': {
      fontSize: theme('fontSize.xs'),
      color: v('text-link'),
      textDecoration: 'underline',
      textUnderlineOffset: '2px',
      alignSelf: 'flex-start',
    },
    '.ori-file-card__link[role="button"], a.ori-file-card__link': {
      cursor: 'pointer',
      background: 'transparent',
      border: '0',
      padding: '0',
      font: 'inherit',
    },

    // ─── Alert ─────────────────────────────────────────────────────────────
    '.ori-alert': {
      display: 'flex',
      alignItems: 'flex-start',
      gap: theme('spacing.3'),
      padding: theme('spacing.4'),
      borderRadius: theme('borderRadius.md'),
      borderWidth: '1px',
      borderStyle: 'solid',
      fontSize: theme('fontSize.sm'),
      lineHeight: theme('lineHeight.normal'),
    },
    '.ori-alert__icon': {
      flex: '0 0 auto',
      width: '1.25rem',
      height: '1.25rem',
      marginTop: '0.125rem',
    },
    '.ori-alert__content': { flex: '1 1 auto' },
    '.ori-alert__title': {
      fontWeight: theme('fontWeight.semibold'),
      marginBottom: theme('spacing.1'),
    },
    '.ori-alert__close': {
      flex: '0 0 auto',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: theme('spacing.1'),
      borderRadius: theme('borderRadius.sm'),
      color: 'currentColor',
      opacity: '0.7',
      '&:hover': { opacity: '1' },
    },
    '.ori-alert--info': {
      backgroundColor: v('feedback-info-bg'),
      borderColor: v('feedback-info'),
      color: v('feedback-info-strong'),
    },
    '.ori-alert--success': {
      backgroundColor: v('feedback-success-bg'),
      borderColor: v('feedback-success'),
      color: v('feedback-success-strong'),
    },
    '.ori-alert--warning': {
      backgroundColor: v('feedback-warning-bg'),
      borderColor: v('feedback-warning'),
      color: v('feedback-warning-strong'),
    },
    '.ori-alert--danger': {
      backgroundColor: v('feedback-danger-bg'),
      borderColor: v('feedback-danger'),
      color: v('feedback-danger-strong'),
    },

    // ─── Dialog ────────────────────────────────────────────────────────────
    '.ori-dialog-overlay': {
      position: 'fixed',
      inset: '0',
      backgroundColor: 'rgb(0 0 0 / 0.5)',
      zIndex: '50',
      animation:
        'ori-fade-in var(--ori-duration-normal, 250ms) var(--ori-easing-standard, cubic-bezier(0.4, 0, 0.2, 1))',
    },
    '.ori-dialog': {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100%',
      maxWidth: '32rem',
      maxHeight: '85vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: v('surface-base'),
      borderRadius: theme('borderRadius.lg'),
      boxShadow: theme('boxShadow.xl'),
      zIndex: '51',
      overflow: 'hidden',
    },
    '.ori-dialog__header': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme('spacing.4'),
      paddingInline: theme('spacing.5'),
      paddingBlock: theme('spacing.4'),
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: v('border-subtle'),
    },
    '.ori-dialog__title': {
      fontSize: theme('fontSize.lg'),
      fontWeight: theme('fontWeight.semibold'),
      color: v('text-primary'),
      margin: '0',
    },
    '.ori-dialog__close': {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: theme('spacing.1'),
      borderRadius: theme('borderRadius.sm'),
      color: v('text-secondary'),
      '&:hover': { color: v('text-primary'), backgroundColor: v('surface-muted') },
    },
    '.ori-dialog__body': {
      flex: '1 1 auto',
      overflow: 'auto',
      paddingInline: theme('spacing.5'),
      paddingBlock: theme('spacing.4'),
      color: v('text-primary'),
    },
    '.ori-dialog__footer': {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: theme('spacing.2'),
      paddingInline: theme('spacing.5'),
      paddingBlock: theme('spacing.3'),
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: v('border-subtle'),
      backgroundColor: v('surface-muted'),
    },

    // ─── DropdownMenu ────────────────────────────────────────────────────────
    // Trigger projeté + content positionné sous le trigger. Côté React, Radix
    // positionne via Portal + collision detection ; côté Angular, position
    // absolute sous le wrap (in-place, cohérent avec décision B.1).
    '.ori-dropdown-menu-wrap': {
      position: 'relative',
      display: 'inline-block',
    },
    '.ori-dropdown-menu-trigger-wrap': {
      display: 'inline-block',
    },
    '.ori-dropdown-menu': {
      position: 'absolute',
      top: 'calc(100% + 4px)',
      left: '0',
      minWidth: '12rem',
      maxWidth: '20rem',
      paddingBlock: theme('spacing.1'),
      backgroundColor: v('surface-base'),
      border: `1px solid ${v('border-subtle')}`,
      borderRadius: theme('borderRadius.md'),
      boxShadow: theme('boxShadow.lg'),
      zIndex: '60',
      animation:
        'ori-fade-in var(--ori-duration-fast, 150ms) var(--ori-easing-standard, cubic-bezier(0.4, 0, 0.2, 1))',
      // Radix React rend dans un Portal (position fixe) : on neutralise alors
      // le positionnement absolu de la version Angular.
      '&[data-radix-menu-content]': {
        position: 'static',
      },
    },
    '.ori-dropdown-menu--align-center': {
      left: '50%',
      transform: 'translateX(-50%)',
    },
    '.ori-dropdown-menu--align-end': {
      left: 'auto',
      right: '0',
    },
    '.ori-dropdown-menu__label': {
      paddingInline: theme('spacing.3'),
      paddingBlock: theme('spacing.2'),
      fontSize: theme('fontSize.xs'),
      fontWeight: theme('fontWeight.semibold'),
      color: v('text-secondary'),
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
    },
    '.ori-dropdown-menu__separator': {
      height: '1px',
      marginBlock: theme('spacing.1'),
      backgroundColor: v('border-subtle'),
    },
    '.ori-dropdown-menu__item': {
      display: 'flex',
      alignItems: 'center',
      gap: theme('spacing.2'),
      width: '100%',
      paddingInline: theme('spacing.3'),
      paddingBlock: theme('spacing.2'),
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: theme('fontSize.sm'),
      color: v('text-primary'),
      textAlign: 'left',
      outline: 'none',
      '&:hover:not([disabled]):not([data-disabled])': {
        backgroundColor: v('surface-muted'),
      },
      '&:focus-visible, &[data-highlighted]': {
        backgroundColor: v('surface-muted'),
        outline: `2px solid ${v('border-focus')}`,
        outlineOffset: '-2px',
      },
      '&[disabled], &[data-disabled]': {
        opacity: '0.5',
        cursor: 'not-allowed',
      },
    },
    '.ori-dropdown-menu__item-icon': {
      display: 'inline-flex',
      alignItems: 'center',
      flexShrink: '0',
      color: v('text-secondary'),
    },
    '.ori-dropdown-menu__item-label': {
      flex: '1 1 auto',
      minWidth: '0',
    },
    '.ori-dropdown-menu__item-shortcut': {
      flexShrink: '0',
      marginLeft: theme('spacing.4'),
      fontSize: theme('fontSize.xs'),
      color: v('text-muted'),
      fontFamily: theme('fontFamily.mono'),
    },
    '.ori-dropdown-menu__item--destructive': {
      color: v('feedback-danger'),
      '& .ori-dropdown-menu__item-icon': {
        color: v('feedback-danger'),
      },
      '&:hover:not([disabled]):not([data-disabled])': {
        backgroundColor: v('feedback-danger-bg'),
      },
    },
  });

  // ─── Publishing : composants pour landing pages et documentation ──────────
  // Distincts des composants d'app : ici on parle d'editorial, marketing,
  // pages publiques. Consommés par ori.gov.pf et tout site institutionnel PF.
  addComponents({
    // ─── Hero ──────────────────────────────────────────────────────────────
    '.ori-hero': {
      paddingBlock: theme('spacing.16'),
      paddingInline: theme('spacing.6'),
      backgroundColor: v('surface-base'),
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: v('border-subtle'),
    },
    '.ori-hero--muted': {
      backgroundColor: v('surface-muted'),
    },
    '.ori-hero__inner': {
      maxWidth: '64rem',
      marginInline: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.5'),
    },
    '.ori-hero__eyebrow': {
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.xs'),
      fontWeight: theme('fontWeight.semibold'),
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: v('brand-primary'),
    },
    '.ori-hero__title': {
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.4xl'),
      fontWeight: theme('fontWeight.bold'),
      lineHeight: theme('lineHeight.tight'),
      color: v('text-primary'),
      margin: '0',
    },
    '.ori-hero__subtitle': {
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.lg'),
      lineHeight: theme('lineHeight.relaxed'),
      color: v('text-secondary'),
      margin: '0',
      maxWidth: '48rem',
    },
    '.ori-hero__actions': {
      display: 'flex',
      flexWrap: 'wrap',
      gap: theme('spacing.3'),
      marginTop: theme('spacing.2'),
    },

    // ─── Callout (note, tip, warning, danger, info) ───────────────────────
    // Distinct d'Alert (transactionnel app) : Callout est éditorial,
    // utilisé dans la doc pour mettre en avant un point particulier.
    '.ori-callout': {
      display: 'flex',
      gap: theme('spacing.3'),
      paddingInline: theme('spacing.4'),
      paddingBlock: theme('spacing.3'),
      marginBlock: theme('spacing.5'),
      borderRadius: theme('borderRadius.md'),
      borderLeftWidth: '4px',
      borderLeftStyle: 'solid',
      borderLeftColor: v('border-default'),
      backgroundColor: v('surface-muted'),
      color: v('text-primary'),
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      lineHeight: theme('lineHeight.relaxed'),
    },
    '.ori-callout__icon': {
      flex: '0 0 auto',
      width: theme('spacing.5'),
      height: theme('spacing.5'),
      marginTop: '0.125rem',
    },
    '.ori-callout__body': {
      flex: '1 1 auto',
      minWidth: '0',
    },
    '.ori-callout__title': {
      display: 'block',
      fontWeight: theme('fontWeight.semibold'),
      marginBottom: theme('spacing.1'),
    },
    '.ori-callout__body > p:last-child': { marginBottom: '0' },
    '.ori-callout--note': {
      borderLeftColor: v('brand-primary'),
      backgroundColor: v('brand-primary-subtle'),
    },
    '.ori-callout--note .ori-callout__icon': { color: v('brand-primary') },
    '.ori-callout--tip': {
      borderLeftColor: v('feedback-success'),
      backgroundColor: v('feedback-success-bg'),
    },
    '.ori-callout--tip .ori-callout__icon': { color: v('feedback-success') },
    '.ori-callout--warning': {
      borderLeftColor: v('feedback-warning'),
      backgroundColor: v('feedback-warning-bg'),
    },
    '.ori-callout--warning .ori-callout__icon': { color: v('feedback-warning') },
    '.ori-callout--danger': {
      borderLeftColor: v('feedback-danger'),
      backgroundColor: v('feedback-danger-bg'),
    },
    '.ori-callout--danger .ori-callout__icon': { color: v('feedback-danger') },

    // ─── CodeBlock ─────────────────────────────────────────────────────────
    '.ori-code-block': {
      position: 'relative',
      marginBlock: theme('spacing.5'),
      borderRadius: theme('borderRadius.md'),
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: v('border-subtle'),
      backgroundColor: v('surface-inverse', '#0f172a'),
      overflow: 'hidden',
    },
    '.ori-code-block__header': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingInline: theme('spacing.3'),
      paddingBlock: theme('spacing.2'),
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'rgba(255, 255, 255, 0.08)',
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.xs'),
      color: 'rgba(255, 255, 255, 0.65)',
    },
    '.ori-code-block__lang': {
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      fontWeight: theme('fontWeight.semibold'),
    },
    '.ori-code-block__copy': {
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme('spacing.1'),
      paddingInline: theme('spacing.2'),
      paddingBlock: '0.25rem',
      backgroundColor: 'transparent',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: theme('borderRadius.sm'),
      color: 'rgba(255, 255, 255, 0.85)',
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.xs'),
      cursor: 'pointer',
      transitionProperty: 'background-color, border-color, color',
      transitionDuration: theme('transitionDuration.fast'),
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderColor: 'rgba(255, 255, 255, 0.25)',
        color: '#fff',
      },
      '&:focus-visible': {
        outline: 'none',
        boxShadow: `0 0 0 2px ${v('border-focus')}`,
      },
    },
    '.ori-code-block__copy[data-copied="true"]': {
      color: v('feedback-success-strong', '#22c55e'),
      borderColor: 'rgba(34, 197, 94, 0.4)',
    },
    '.ori-code-block__pre': {
      margin: '0',
      padding: theme('spacing.4'),
      fontFamily: theme('fontFamily.mono'),
      fontSize: theme('fontSize.sm'),
      lineHeight: theme('lineHeight.relaxed'),
      color: '#e5e7eb',
      overflowX: 'auto',
    },
    '.ori-code-block__pre code': {
      fontFamily: 'inherit',
      fontSize: 'inherit',
      backgroundColor: 'transparent',
      padding: '0',
      border: '0',
      color: 'inherit',
    },

    // ─── Toc (table of contents) ──────────────────────────────────────────
    '.ori-toc': {
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      lineHeight: theme('lineHeight.relaxed'),
    },
    '.ori-toc__title': {
      fontSize: theme('fontSize.xs'),
      fontWeight: theme('fontWeight.semibold'),
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      color: v('text-muted'),
      marginBottom: theme('spacing.3'),
    },
    '.ori-toc__list': {
      listStyle: 'none',
      margin: '0',
      padding: '0',
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.1'),
      borderLeftWidth: '1px',
      borderLeftStyle: 'solid',
      borderLeftColor: v('border-subtle'),
    },
    '.ori-toc__list .ori-toc__list': {
      borderLeft: '0',
      paddingLeft: theme('spacing.3'),
      marginTop: theme('spacing.1'),
    },
    '.ori-toc__link': {
      display: 'block',
      paddingInline: theme('spacing.3'),
      paddingBlock: '0.25rem',
      color: v('text-secondary'),
      textDecoration: 'none',
      borderLeftWidth: '2px',
      borderLeftStyle: 'solid',
      borderLeftColor: 'transparent',
      marginLeft: '-1px',
      transitionProperty: 'color, border-color',
      transitionDuration: theme('transitionDuration.fast'),
      '&:hover': { color: v('text-primary') },
      '&:focus-visible': {
        outline: 'none',
        color: v('text-primary'),
        borderLeftColor: v('border-focus'),
      },
      '&[aria-current="true"]': {
        color: v('brand-primary'),
        fontWeight: theme('fontWeight.medium'),
        borderLeftColor: v('brand-primary'),
      },
    },

    // ─── FeatureGrid ──────────────────────────────────────────────────────
    '.ori-feature-grid': {
      display: 'grid',
      gap: theme('spacing.5'),
      gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))',
      marginBlock: theme('spacing.8'),
    },
    '.ori-feature-card': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.2'),
      padding: theme('spacing.5'),
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: v('border-subtle'),
      borderRadius: theme('borderRadius.md'),
      backgroundColor: v('surface-base'),
    },
    '.ori-feature-card__icon': {
      width: theme('spacing.10'),
      height: theme('spacing.10'),
      borderRadius: theme('borderRadius.md'),
      backgroundColor: v('brand-primary-subtle'),
      color: v('brand-primary'),
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme('spacing.2'),
    },
    '.ori-feature-card__title': {
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.lg'),
      fontWeight: theme('fontWeight.semibold'),
      color: v('text-primary'),
      margin: '0',
    },
    '.ori-feature-card__description': {
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      lineHeight: theme('lineHeight.relaxed'),
      color: v('text-secondary'),
      margin: '0',
    },

    // ─── ErrorPage ─────────────────────────────────────────────────────────
    // Pattern de page d'erreur ou de maintenance pour les apps PF.
    // Variantes : 404, 403, 500, maintenance. Variante non précisée = neutre.
    '.ori-error-page': {
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingInline: theme('spacing.6'),
      paddingBlock: theme('spacing.16'),
      backgroundColor: v('surface-base'),
      color: v('text-primary'),
    },
    '.ori-error-page__inner': {
      maxWidth: '40rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: theme('spacing.4'),
    },
    '.ori-error-page__code': {
      fontFamily: theme('fontFamily.mono'),
      fontSize: theme('fontSize.xs'),
      fontWeight: theme('fontWeight.semibold'),
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: v('text-muted'),
      paddingInline: theme('spacing.3'),
      paddingBlock: theme('spacing.1'),
      borderRadius: theme('borderRadius.full'),
      backgroundColor: v('surface-muted'),
      border: `1px solid ${v('border-subtle')}`,
    },
    '.ori-error-page__title': {
      margin: '0',
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.4xl'),
      fontWeight: theme('fontWeight.bold'),
      lineHeight: theme('lineHeight.tight'),
      color: v('text-primary'),
    },
    '.ori-error-page__description': {
      margin: '0',
      maxWidth: '32rem',
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.lg'),
      lineHeight: theme('lineHeight.relaxed'),
      color: v('text-secondary'),
    },
    '.ori-error-page__actions': {
      display: 'flex',
      flexWrap: 'wrap',
      gap: theme('spacing.3'),
      marginTop: theme('spacing.4'),
      justifyContent: 'center',
    },
    '.ori-error-page__detail': {
      marginTop: theme('spacing.6'),
      paddingTop: theme('spacing.4'),
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: v('border-subtle'),
      fontSize: theme('fontSize.sm'),
      color: v('text-muted'),
      width: '100%',
    },
    // Variante maintenance : couleur warning sur le code (badge orange).
    '.ori-error-page--maintenance .ori-error-page__code': {
      backgroundColor: v('feedback-warning-bg'),
      borderColor: v('feedback-warning'),
      color: v('feedback-warning-strong'),
    },
    // Variante danger (500) : couleur danger sur le code.
    '.ori-error-page--danger .ori-error-page__code': {
      backgroundColor: v('feedback-danger-bg'),
      borderColor: v('feedback-danger'),
      color: v('feedback-danger-strong'),
    },

    // ─── LegalLayout ──────────────────────────────────────────────────────
    // Pattern de page éditoriale longue : mentions légales, accessibilité,
    // RGPD, CGU. Le DS fournit la structure et le rythme typographique ;
    // le contenu (responsable de publication, hébergeur, DPO, etc.) est
    // produit par chaque service consommateur.
    '.ori-legal-layout': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.6'),
      maxWidth: '55rem',
    },
    '.ori-legal-layout__header': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.2'),
      marginBottom: theme('spacing.2'),
    },
    '.ori-legal-layout__title': {
      margin: '0',
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.2xl'),
      fontWeight: theme('fontWeight.semibold'),
      lineHeight: theme('lineHeight.tight'),
      color: v('text-primary'),
    },
    '.ori-legal-layout__subtitle': {
      margin: '0',
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.base'),
      lineHeight: theme('lineHeight.relaxed'),
      color: v('text-secondary'),
    },

    // Section : un bloc thématique (sur Card visuellement, mais on ne
    // dépend pas de .ori-card pour rester composable). Chaque section a
    // un titre h2 + corps de texte.
    '.ori-legal-section': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.2'),
      padding: theme('spacing.5'),
      borderRadius: theme('borderRadius.lg'),
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: v('border-default'),
      backgroundColor: v('surface-base'),
    },
    '.ori-legal-section__title': {
      margin: '0 0 0.25rem',
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.lg'),
      fontWeight: theme('fontWeight.semibold'),
      color: v('text-primary'),
    },
    '.ori-legal-section p': {
      margin: '0 0 0.75rem',
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      lineHeight: theme('lineHeight.relaxed'),
      color: v('text-secondary'),
    },
    '.ori-legal-section p:last-child': {
      marginBottom: '0',
    },
    '.ori-legal-section strong': {
      fontWeight: theme('fontWeight.semibold'),
      color: v('text-primary'),
    },
    '.ori-legal-section h3': {
      margin: '0.75rem 0 0.5rem',
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      fontWeight: theme('fontWeight.semibold'),
      color: v('text-primary'),
    },

    // Variante "flat" : pour un bloc d'info périphérique (date de mise à
    // jour, mention de bas de page) sans surcharge visuelle.
    '.ori-legal-section--flat': {
      backgroundColor: v('surface-muted'),
      borderColor: v('border-subtle'),
      padding: theme('spacing.4'),
    },
    '.ori-legal-section--flat p': {
      fontSize: theme('fontSize.xs'),
      color: v('text-muted'),
    },

    // Liste de définitions clé/valeur, fréquente dans les mentions légales
    // (adresse, téléphone, courriel...).
    '.ori-legal-dl': {
      display: 'grid',
      gridTemplateColumns: 'minmax(8rem, max-content) 1fr',
      gap: '0.375rem 1rem',
      margin: '0.75rem 0 0',
      fontSize: theme('fontSize.sm'),
    },
    '.ori-legal-dl dt': {
      fontWeight: theme('fontWeight.semibold'),
      color: v('text-secondary'),
    },
    '.ori-legal-dl dd': {
      margin: '0',
      color: v('text-primary'),
    },

    // ─── AuthButton ────────────────────────────────────────────────────────
    // Bouton d'authentification fédérée pour les apps Ori. Trois variantes
    // imposées par les chartes des fournisseurs d'identité :
    //
    //   - rumia       : IdP usager (peuple polynésien), charte teal Rumia
    //   - gov-connect : IdP agent (broker vers Entra ID), charte Ori
    //   - microsoft   : Entra ID direct, Microsoft Identity Branding Guidelines
    //
    // Cf. memory project-gov-connect-rumia pour le placement.
    '.ori-auth-btn': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme('spacing.3'),
      paddingInline: theme('spacing.4'),
      paddingBlock: theme('spacing.3'),
      minWidth: '15rem',
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      fontWeight: theme('fontWeight.semibold'),
      lineHeight: theme('lineHeight.tight'),
      borderRadius: theme('borderRadius.md'),
      borderWidth: '1px',
      borderStyle: 'solid',
      cursor: 'pointer',
      textDecoration: 'none',
      transitionProperty: 'background-color, border-color, color, box-shadow',
      transitionDuration: theme('transitionDuration.fast'),
      transitionTimingFunction: theme('transitionTimingFunction.standard'),
      userSelect: 'none',
      '&:focus-visible': {
        outline: 'none',
        boxShadow: `0 0 0 2px ${v('surface-base')}, 0 0 0 4px ${v('border-focus')}`,
      },
      '&:disabled, &[aria-disabled="true"]': {
        opacity: '0.6',
        cursor: 'not-allowed',
      },
    },
    '.ori-auth-btn__logo': {
      flex: '0 0 auto',
      width: '1.5rem',
      height: '1.5rem',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    '.ori-auth-btn__logo img, .ori-auth-btn__logo svg': {
      width: '100%',
      height: '100%',
      display: 'block',
    },

    // Variante Rumia : bouton blanc avec bordure teal Rumia + texte primary.
    '.ori-auth-btn--rumia': {
      backgroundColor: v('surface-base'),
      borderColor: '#1a7f7e',
      color: v('text-primary'),
      '&:hover:not(:disabled):not([aria-disabled="true"])': {
        backgroundColor: '#f0f9f9',
      },
      '&:active:not(:disabled):not([aria-disabled="true"])': {
        backgroundColor: '#dff0ef',
      },
    },

    // Variante GOV Connect : charte Ori (bleu marine), pleine couleur.
    '.ori-auth-btn--gov-connect': {
      backgroundColor: v('brand-primary'),
      borderColor: v('brand-primary'),
      color: v('brand-on-primary'),
      '&:hover:not(:disabled):not([aria-disabled="true"])': {
        backgroundColor: v('brand-primary-hover'),
        borderColor: v('brand-primary-hover'),
      },
      '&:active:not(:disabled):not([aria-disabled="true"])': {
        backgroundColor: v('brand-primary-active'),
        borderColor: v('brand-primary-active'),
      },
    },

    // Variante Microsoft : Microsoft Identity Branding Guidelines.
    // Bouton blanc avec bordure #8C8C8C, texte #5E5E5E. Pas de hover
    // appuyé (Microsoft impose un rendu sobre).
    '.ori-auth-btn--microsoft': {
      backgroundColor: '#ffffff',
      borderColor: '#8c8c8c',
      color: '#5e5e5e',
      fontFamily:
        '"Segoe UI", "Segoe UI Web (West European)", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
      '&:hover:not(:disabled):not([aria-disabled="true"])': {
        backgroundColor: '#f5f5f5',
      },
    },

    // ─── SearchBar ─────────────────────────────────────────────────────────
    '.ori-search-bar': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.1'),
      width: '100%',
    },
    '.ori-search-bar__label': {
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      fontWeight: theme('fontWeight.medium'),
      color: v('text-primary'),
    },
    '.ori-search-bar__label--visually-hidden': {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: '0',
    },
    '.ori-search-bar__field': {
      display: 'flex',
      alignItems: 'stretch',
      gap: theme('spacing.2'),
      width: '100%',
      borderBottomWidth: '2px',
      borderBottomStyle: 'solid',
      borderBottomColor: v('brand-primary'),
      transitionProperty: 'border-color',
      transitionDuration: theme('transitionDuration.fast'),
      '&:focus-within': {
        borderBottomColor: v('border-focus'),
      },
    },
    '.ori-search-bar__input': {
      flex: '1 1 auto',
      minWidth: '0',
      paddingInline: theme('spacing.3'),
      paddingBlock: theme('spacing.2'),
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      lineHeight: theme('lineHeight.normal'),
      color: v('text-primary'),
      backgroundColor: 'transparent',
      borderWidth: '0',
      outline: 'none',
      '&::placeholder': { color: v('text-muted') },
      '&::-webkit-search-cancel-button': { cursor: 'pointer' },
      '&:disabled': {
        cursor: 'not-allowed',
        color: v('text-disabled'),
      },
    },
    '.ori-search-bar__button': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme('spacing.2'),
      paddingInline: theme('spacing.4'),
      paddingBlock: theme('spacing.2'),
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      fontWeight: theme('fontWeight.semibold'),
      lineHeight: theme('lineHeight.normal'),
      color: v('brand-on-primary'),
      backgroundColor: v('brand-primary'),
      borderWidth: '0',
      borderRadius: theme('borderRadius.md'),
      cursor: 'pointer',
      transitionProperty: 'background-color, box-shadow',
      transitionDuration: theme('transitionDuration.fast'),
      '&:hover:not(:disabled)': {
        backgroundColor: v('brand-primary-hover'),
      },
      '&:active:not(:disabled)': {
        backgroundColor: v('brand-primary-active'),
      },
      '&:focus-visible': {
        outline: 'none',
        boxShadow: `0 0 0 3px ${v('brand-primary-subtle')}`,
      },
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: '0.6',
      },
    },
    '.ori-search-bar__button-icon': { flex: '0 0 auto' },
    '.ori-search-bar__button-label': { whiteSpace: 'nowrap' },
    '.ori-search-bar--sm .ori-search-bar__input': {
      paddingInline: theme('spacing.2'),
      paddingBlock: theme('spacing.1'),
      fontSize: theme('fontSize.xs'),
    },
    '.ori-search-bar--sm .ori-search-bar__button': {
      paddingInline: theme('spacing.3'),
      paddingBlock: theme('spacing.1'),
      fontSize: theme('fontSize.xs'),
    },

    // ─── PhoneInput ────────────────────────────────────────────────────────
    '.ori-phone-input': {
      display: 'flex',
      alignItems: 'stretch',
      gap: theme('spacing.2'),
      width: '100%',
    },
    '.ori-phone-input__country': {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme('spacing.2'),
      paddingInline: theme('spacing.3'),
      paddingBlock: theme('spacing.2'),
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      fontWeight: theme('fontWeight.medium'),
      color: v('brand-on-primary'),
      backgroundColor: v('brand-primary'),
      borderRadius: theme('borderRadius.md'),
      cursor: 'pointer',
      transitionProperty: 'background-color',
      transitionDuration: theme('transitionDuration.fast'),
      '&:hover:not([class*="--static"])': {
        backgroundColor: v('brand-primary-hover'),
      },
      '&:focus-within': {
        outline: 'none',
        boxShadow: `0 0 0 3px ${v('brand-primary-subtle')}`,
      },
    },
    '.ori-phone-input__country--static': {
      cursor: 'default',
    },
    // Les contenus visibles du pill (drapeau, code, chevron) sont placés
    // au-dessus du <select> overlay en stacking context, pour qu'axe-core
    // calcule correctement le contraste de texte contre le fond brand-primary
    // du parent (et non contre le body blanc qu'il verrait à travers le
    // select opacity:0). On retire les pointer-events pour laisser les
    // clics atteindre le select sous-jacent, qui reste focusable au clavier.
    '.ori-phone-input__flag': {
      flex: '0 0 auto',
      fontSize: theme('fontSize.base'),
      lineHeight: '1',
      position: 'relative',
      zIndex: '1',
      pointerEvents: 'none',
    },
    '.ori-phone-input__dial-code': {
      whiteSpace: 'nowrap',
      position: 'relative',
      zIndex: '1',
      pointerEvents: 'none',
      // Couleur explicite plutôt qu'héritée : axe-core analyse les
      // contrastes au niveau du span de texte. On verrouille la couleur
      // en brand-on-primary (le pill garde son fond brand-primary aussi
      // bien en mode normal qu'en mode `--static` mono-pays). Le mode
      // `--readonly` retire le fond et bascule la couleur ci-dessous.
      color: v('brand-on-primary'),
    },
    '.ori-phone-input__chevron': {
      flex: '0 0 auto',
      position: 'relative',
      zIndex: '1',
      pointerEvents: 'none',
    },
    '.ori-phone-input__select': {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      opacity: '0',
      cursor: 'pointer',
      appearance: 'none',
      // Le select natif reçoit le focus clavier — c'est lui qui pilote le
      // glow `:focus-within` sur le wrapper visible.
      color: 'inherit',
      backgroundColor: 'transparent',
    },
    '.ori-phone-input__number': {
      flex: '1 1 auto',
      minWidth: '0',
      paddingInline: theme('spacing.3'),
      paddingBlock: theme('spacing.2'),
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      lineHeight: theme('lineHeight.normal'),
      color: v('text-primary'),
      backgroundColor: v('surface-base'),
      borderRadius: theme('borderRadius.md'),
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: v('border-default'),
      transitionProperty: 'border-color, box-shadow',
      transitionDuration: theme('transitionDuration.fast'),
      '&::placeholder': { color: v('text-muted') },
      '&:hover:not(:disabled):not(:read-only)': {
        borderColor: v('border-strong'),
      },
      '&:focus-visible, &:focus': {
        outline: 'none',
        borderColor: v('border-focus'),
        boxShadow: `0 0 0 3px ${v('brand-primary-subtle')}`,
      },
      '&:disabled': {
        cursor: 'not-allowed',
        backgroundColor: v('surface-muted'),
        color: v('text-disabled'),
      },
      '&[aria-invalid="true"]': {
        borderColor: v('feedback-danger'),
        '&:focus': {
          boxShadow: `0 0 0 3px ${v('feedback-danger-bg')}`,
        },
      },
    },
    '.ori-phone-input--disabled .ori-phone-input__country': {
      backgroundColor: v('surface-muted'),
      color: v('text-disabled'),
      cursor: 'not-allowed',
    },
    '.ori-phone-input--readonly .ori-phone-input__country': {
      backgroundColor: 'transparent',
      // En mode readonly le country n'a plus son fond brand-primary : on
      // bascule la couleur du texte sur text-primary pour garantir un
      // contraste WCAG AA correct sur fond surface-base.
      color: v('text-primary'),
      paddingInline: '0',
    },
    '.ori-phone-input--readonly .ori-phone-input__dial-code': {
      // Override de la règle générale `.ori-phone-input__dial-code` qui
      // verrouille la couleur en brand-on-primary pour le pill bleu.
      // En readonly, le pill disparaît, on s'aligne sur le texte courant.
      color: v('text-primary'),
    },
    '.ori-phone-input--readonly .ori-phone-input__number': {
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      paddingInline: '0',
    },

    // ─── RichRadio ─────────────────────────────────────────────────────────
    '.ori-rich-radio': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme('spacing.4'),
      paddingInline: theme('spacing.4'),
      paddingBlock: theme('spacing.3'),
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      color: v('text-primary'),
      backgroundColor: v('surface-base'),
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: v('border-default'),
      borderRadius: theme('borderRadius.md'),
      cursor: 'pointer',
      transitionProperty: 'border-color, box-shadow, background-color',
      transitionDuration: theme('transitionDuration.fast'),
      '&:hover:not(.ori-rich-radio--disabled)': {
        borderColor: v('border-strong'),
      },
      '&:focus-within': {
        outline: 'none',
        borderColor: v('border-focus'),
        boxShadow: `0 0 0 3px ${v('brand-primary-subtle')}`,
      },
    },
    '.ori-rich-radio--checked': {
      borderColor: v('brand-primary'),
      // Bordure en 2px sans changer le layout : on absorbe le pixel ajouté
      // via un inset shadow, plus stable que toggler un border-width.
      boxShadow: `inset 0 0 0 1px ${v('brand-primary')}`,
    },
    '.ori-rich-radio--disabled': {
      cursor: 'not-allowed',
      backgroundColor: v('surface-muted'),
      color: v('text-disabled'),
    },
    '.ori-rich-radio--invalid': {
      borderColor: v('feedback-danger'),
    },
    '.ori-rich-radio__control': {
      display: 'flex',
      alignItems: 'flex-start',
      gap: theme('spacing.3'),
      flex: '1 1 auto',
      minWidth: '0',
    },
    '.ori-rich-radio__text': {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.125rem',
      minWidth: '0',
    },
    '.ori-rich-radio__label': {
      fontWeight: theme('fontWeight.medium'),
      lineHeight: theme('lineHeight.snug'),
    },
    '.ori-rich-radio__description': {
      fontSize: theme('fontSize.xs'),
      color: v('text-secondary'),
      lineHeight: theme('lineHeight.normal'),
    },
    '.ori-rich-radio__trailing': {
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      '&:empty': { display: 'none' },
    },
    '.ori-rich-radio-group': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.3'),
    },
    '.ori-rich-radio-group--horizontal': {
      flexDirection: 'row',
      flexWrap: 'wrap',
      '& > .ori-rich-radio': {
        flex: '1 1 16rem',
      },
    },

    // ─── DownloadButton ────────────────────────────────────────────────────
    '.ori-download-button': {
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '0.125rem',
    },
    '.ori-download-button__link': {
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme('spacing.1'),
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.sm'),
      fontWeight: theme('fontWeight.medium'),
      color: v('text-link'),
      textDecorationLine: 'underline',
      textDecorationThickness: '1px',
      textUnderlineOffset: '0.2em',
      borderRadius: theme('borderRadius.sm'),
      transitionProperty: 'color, background-color',
      transitionDuration: theme('transitionDuration.fast'),
      '&:hover': {
        color: v('brand-primary-hover'),
      },
      '&:focus-visible': {
        outline: 'none',
        boxShadow: `0 0 0 3px ${v('brand-primary-subtle')}`,
      },
    },
    '.ori-download-button__label': {
      // Wrapper sémantique du libellé pour permettre des évolutions futures
      // (ex. tronquer en cas de débordement) sans toucher au lien parent.
    },
    '.ori-download-button__icon': {
      flex: '0 0 auto',
    },
    '.ori-download-button__meta': {
      fontFamily: theme('fontFamily.sans'),
      fontSize: theme('fontSize.xs'),
      color: v('text-secondary'),
      lineHeight: theme('lineHeight.normal'),
    },
  });

  addBase({
    '@keyframes ori-fade-in': {
      from: { opacity: '0' },
      to: { opacity: '1' },
    },
    '@keyframes ori-progress-indeterminate': {
      '0%': { backgroundPosition: '-40% 0' },
      '100%': { backgroundPosition: '140% 0' },
    },
    '@keyframes ori-skeleton-shimmer': {
      '0%': { backgroundPosition: '200% 0' },
      '100%': { backgroundPosition: '-200% 0' },
    },
    '@keyframes ori-toast-in': {
      from: { opacity: '0', transform: 'translateX(0.5rem)' },
      to: { opacity: '1', transform: 'translateX(0)' },
    },
    '@keyframes ori-side-menu-in': {
      from: { transform: 'translateX(-100%)' },
      to: { transform: 'translateX(0)' },
    },
    '@keyframes ori-spinner-rotate': {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
  });
}
