// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

import { pa11y, prepareAudit } from 'cypress-audit';
import installLogsPrinter from 'cypress-terminal-report/src/installLogsPrinter';

const VALID_CATEGORIES = new Set(['performance', 'accessibility', 'best-practices', 'seo']);

export default (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
  installLogsPrinter(on);
  on('before:browser:launch', (browser, launchOptions) => {
    prepareAudit(launchOptions);
    if (browser.name === 'chrome' && browser.isHeadless) {
      launchOptions.args.push('--disable-gpu');
      launchOptions.args.push('--no-sandbox');
      launchOptions.args.push('--disable-dev-shm-usage');
      return launchOptions;
    }
  });

  // Allows logging with cy.task('log', 'message') or cy.task('table', object)
  on('task', {
    log(message) {
      console.log(message);
      return null;
    },
    table(message) {
      console.table(message);
      return null;
    },
  });

  on('task', {
    // cypress-audit's built-in lighthouse task connects to Cypress's Chrome tab, which crashes Chrome 147+.
    // We use a dedicated Chrome instance via chrome-launcher instead.
    lighthouse: async ({ url, thresholds }: { url: string; thresholds: Record<string, number> }) => {
      const { launch } = await import('chrome-launcher');
      const lighthouseFn = (
        (await import('lighthouse')) as unknown as {
          default: (
            url: string,
            options?: Record<string, unknown>,
            config?: Record<string, unknown>,
          ) => Promise<import('lighthouse').RunnerResult>;
        }
      ).default;
      const { ReportGenerator } = await import('lighthouse/report/generator/report-generator.js');

      const chrome = await launch({
        chromeFlags: ['--headless=new', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage'],
      });

      try {
        const { lhr } = await lighthouseFn(
          url,
          {
            port: chrome.port,
            onlyCategories: Object.keys(thresholds).filter(k => VALID_CATEGORIES.has(k)),
            disableStorageReset: true,
            formFactor: 'desktop',
            throttlingMethod: 'provided',
            screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
          },
          { extends: 'lighthouse:default' },
        );

        if (!existsSync('target/cypress/')) {
          mkdirSync('target/cypress/', { recursive: true });
        }
        writeFileSync('target/cypress/lhreport.html', ReportGenerator.generateReport(lhr, 'html'));

        const errors: string[] = [];
        const results: string[] = [];
        for (const [key, threshold] of Object.entries(thresholds)) {
          if (!VALID_CATEGORIES.has(key)) continue;
          const score = (lhr.categories[key]?.score ?? 0) * 100;
          if (threshold > score) {
            errors.push(`${key} record is ${score} and is under the ${threshold} threshold`);
          } else {
            results.push(`${key} record is ${score} and threshold was ${threshold}`);
          }
        }
        return { errors, results };
      } finally {
        chrome.kill();
      }
    },
    pa11y: pa11y(),
  });
  return config;
};
