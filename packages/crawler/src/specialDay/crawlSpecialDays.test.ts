import {expect, test} from 'vitest';

import {crawlSpecialDays} from './crawlSpecialDays';

test('Crawl Special Days', async () => {
  const specialDays = await crawlSpecialDays();
  expect(specialDays).toBeDefined();

  // Ensure no deduplicate
  (['startDate', 'endDate', 'startBookDay'] as const).forEach(key => {
    const hash = {} as Record<string, boolean>;
    specialDays.forEach(specialDay => {
      const dateString = specialDay[key].toISOString();
      expect(dateString in hash).toBe(false);
      hash[dateString] = true;
    });
  });

  // Ensure startDate is earlier than endDate
  specialDays.forEach(specialDay => {
    const {startDate, endDate} = specialDay;
    expect(endDate > startDate).toBe(true);
  });

  // Ensure startBookDay is Earlier than startDate
  specialDays.forEach(specialDay => {
    const {startDate, startBookDay} = specialDay;
    expect(startDate > startBookDay).toBe(true);
  });
});
