import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

import type { OutputFile, Plugin } from 'esbuild';
import { globSync } from 'tinyglobby';

const require = createRequire(import.meta.url);

const outputFile = (filePath: string, contents: Uint8Array): OutputFile => ({
  path: filePath,
  contents,
  hash: createHash('sha256').update(contents).digest('hex').slice(0, 16),
  get text() {
    return Buffer.from(contents).toString('utf8');
  },
});

const filesFromPackage = (sourceDir: string, glob: string): [string, Uint8Array][] =>
  globSync(glob, { cwd: sourceDir }).map(file => [path.basename(file), readFileSync(path.join(sourceDir, file))]);

export default {
  name: 'define:vars',
  setup(build) {
    build.initialOptions.define ??= {};
    build.initialOptions.define.__VERSION__ = JSON.stringify(process.env.APP_VERSION ?? 'unknown');
    // If this URL is left empty (""), then it will be relative to the current context.
    // If you use an API server, in `prod` mode, you will need to enable CORS
    // (see the `jhipster.cors` common JHipster property in the `application-*.yml` configurations)
    build.initialOptions.define.SERVER_API_URL = "''";

    // Emit the swagger-ui libraries with the build output, next to the swagger-ui/index.html asset.
    // The page itself stays an angular.json asset: the dev server serves html files from the assets only.
    build.onEnd(result => {
      const outdir = build.initialOptions.outdir ?? '';
      const files = [
        ...filesFromPackage(path.join(path.dirname(require.resolve('axios/package.json')), 'dist'), 'axios.min.js'),
        ...filesFromPackage(require('swagger-ui-dist').getAbsoluteFSPath(), '{*.{png,css},swagger-ui-{bundle,standalone-preset}.js}'),
      ];
      for (const [name, contents] of files) {
        result.outputFiles?.push(outputFile(path.join(outdir, 'swagger-ui', name), contents));
      }
    });
  },
} satisfies Plugin;
