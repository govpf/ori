import StyleDictionary from 'style-dictionary';

/**
 * Format personnalisé : preset Tailwind généré à partir des tokens.
 * Produit un objet theme.extend consommable par tailwind-preset.
 */
StyleDictionary.registerFormat({
  name: 'javascript/tailwind-preset',
  format: ({ dictionary }) => {
    const tree = {};

    for (const token of dictionary.allTokens) {
      const path = token.path;
      let cursor = tree;
      for (let i = 0; i < path.length - 1; i += 1) {
        cursor[path[i]] ??= {};
        cursor = cursor[path[i]];
      }
      cursor[path[path.length - 1]] = token.$value ?? token.value;
    }

    const colors = tree.color ?? {};
    const spacing = tree.spacing ?? {};
    const radius = tree.radius ?? {};
    const font = tree.font ?? {};
    const shadow = tree.shadow ?? {};
    const motion = tree.motion ?? {};
    const breakpoint = tree.breakpoint ?? {};

    const flattenColors = (obj, prefix = '') => {
      const out = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          Object.assign(out, flattenColors(value, `${prefix}${key}-`));
        } else {
          out[`${prefix}${key}`] = value;
        }
      }
      return out;
    };

    const flatColors = flattenColors(colors);

    // Filtrer la $description du dict breakpoint si présente
    const screens = Object.fromEntries(
      Object.entries(breakpoint).filter(([k]) => !k.startsWith('$')),
    );

    const preset = {
      theme: {
        // `screens` doit aller dans theme (pas extend) pour remplacer
        // entièrement les breakpoints par défaut de Tailwind par les nôtres.
        screens,
        extend: {
          colors: flatColors,
          spacing,
          borderRadius: radius,
          fontFamily: font.family ?? {},
          fontSize: font.size ?? {},
          fontWeight: font.weight ?? {},
          lineHeight: font.lineHeight ?? {},
          boxShadow: shadow,
          transitionDuration: motion.duration ?? {},
          transitionTimingFunction: motion.easing ?? {},
        },
      },
    };

    return `/**
 * Ori tokens -> preset Tailwind
 * Généré automatiquement depuis packages/tokens/src/*.json
 * NE PAS MODIFIER À LA MAIN.
 */
export default ${JSON.stringify(preset, null, 2)};
`;
  },
});

const sd = new StyleDictionary({
  source: ['src/**/*.json'],
  log: { verbosity: 'verbose' },
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: { outputReferences: true, selector: ':root' },
        },
      ],
    },
    scss: {
      transformGroup: 'scss',
      buildPath: 'build/scss/',
      files: [
        {
          destination: '_tokens.scss',
          format: 'scss/variables',
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'build/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/esm',
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/es6-declarations',
        },
        {
          destination: 'tailwind.js',
          format: 'javascript/tailwind-preset',
        },
      ],
    },
    json: {
      transformGroup: 'js',
      buildPath: 'build/json/',
      files: [
        {
          destination: 'tokens.json',
          format: 'json/flat',
        },
      ],
    },
  },
});

await sd.buildAllPlatforms();
console.log('✓ Tokens générés dans build/');
