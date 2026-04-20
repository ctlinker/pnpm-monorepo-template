import { expect, test } from 'vitest';
import { hello } from '../src/index.js';

test('hello', () => {
  expect(hello()).toBe('world');
});
