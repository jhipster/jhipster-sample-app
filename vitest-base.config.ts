// Learn more about Vitest configuration options at https://vitest.dev/config/

import { defineConfig } from 'vitest/config';

import { prepareLanguage } from './build-plugins/i18n-esbuild';

const i18nPrefix = '\0i18n/';

export default defineConfig({
  plugins: [
    {
      // Resolve the `i18n/<lang>.json` translation bundles provided by build-plugins/i18n-esbuild.ts at build time.
      name: 'jhipster:i18n',
      resolveId(id) {
        return /^i18n\/[^/]+\.json$/.test(id) ? `${i18nPrefix}${id.slice('i18n/'.length)}` : undefined;
      },
      async load(id) {
        if (id.startsWith(i18nPrefix)) {
          const language = id.slice(i18nPrefix.length, -'.json'.length);
          return `export default ${JSON.stringify(await prepareLanguage(language))};`;
        }
        return undefined;
      },
    },
  ],
  test: {
    coverage: {
      reportsDirectory: 'target/test-results',
    },
  },
});
