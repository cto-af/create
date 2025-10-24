import {defineConfig, globalIgnores} from 'eslint/config';
import es6 from '@cto.af/eslint-config/es6.js';
import ts from '@cto.af/eslint-config/ts.js';

export default defineConfig(
  globalIgnores(['test/**']),
  es6,
  ts,
  {
    files: [
      'template/**',
      'test/**',
    ],
    rules: {
      'n/no-missing-import': 'off',
    },
  }
);
