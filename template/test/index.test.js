import assert from 'node:assert';
import {foo} from '../lib/index.js';
// eslint-disable-next-line n/no-unsupported-features/node-builtins
import test from 'node:test';

test('index', () => {
  assert.equal(foo(), 2);
});
