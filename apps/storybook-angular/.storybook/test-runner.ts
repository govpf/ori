import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext } from '@storybook/test-runner';
import { injectAxe, checkA11y, configureAxe } from 'axe-playwright';

/**
 * Configuration du Storybook test-runner pour l'audit a11y automatique.
 *
 * Identique au runner React (cf. apps/storybook-react/.storybook/test-runner.ts).
 * Le DS Ori expose les mêmes composants côté React et Angular ; les règles
 * a11y sont les mêmes.
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
      rules: storyContext.parameters?.['a11y']?.config?.rules,
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
