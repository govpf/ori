import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext } from '@storybook/test-runner';
import { injectAxe, checkA11y, configureAxe } from 'axe-playwright';

/**
 * Configuration du Storybook test-runner pour l'audit a11y automatique.
 *
 * Fonctionnement : à chaque rendu de story dans Playwright, axe-core est
 * injecté puis exécuté sur le DOM. La règle est de bloquer la CI sur les
 * violations de niveaux `serious` et `critical` (la baseline RGAA AA
 * d'Ori). Les niveaux `minor` et `moderate` sont remontés en log mais
 * n'échouent pas.
 *
 * Pour exclure ponctuellement une story du test a11y (rare, à justifier
 * en commentaire), ajouter le tag `'skip-a11y'` dans son `meta.tags`.
 */
const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context);

    if (storyContext.tags?.includes('skip-a11y')) {
      return;
    }

    await configureAxe(page, {
      rules: storyContext.parameters?.a11y?.config?.rules,
    });

    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: { html: true },
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
        },
      },
      includedImpacts: ['serious', 'critical'],
    });
  },
};

export default config;
