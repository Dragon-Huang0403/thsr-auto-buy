import {expect, test} from 'vitest';

import {checkTaiwanId} from './checkTaiwanId';
import {getRandomTaiwanId} from './generateTaiwanId';

test('Generate Taiwan Id', async () => {
  const taiwanId = getRandomTaiwanId();
  expect(checkTaiwanId(taiwanId).success).toBe(true);
});
