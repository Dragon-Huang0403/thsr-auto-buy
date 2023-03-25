import {expect, test} from 'vitest';

import {checkTaiwanId} from './checkTaiwanId';

test('Check Taiwan Id', async () => {
  const id = 'A123456789';
  expect(checkTaiwanId(id).success).toBe(true);
  const id2 = 'A11111111';
  expect(checkTaiwanId(id2).success).toBe(false);
});
