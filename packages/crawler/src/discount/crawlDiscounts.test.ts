import {expect, test} from 'vitest';

import {crawlDiscounts} from './crawlDiscounts';

test('Crawl Discounts', async () => {
  const discounts = await crawlDiscounts();
  expect(discounts).toBeDefined();

  // Ensure no deduplicate
  const hash = {} as Record<string, boolean>;
  discounts.forEach(discount => {
    const key = `${discount.date}${discount.type}${discount.trainNo}`;
    expect(key in hash).toBe(false);
    hash[key] = true;
  });
});
