import {expect, test} from 'vitest';

import {TdxApi} from './tdxApi';

test('getRegularTimeTable', async () => {
  const api = new TdxApi();
  const {data, status, config} = await api.getRegularTimeTable();

  expect(status).toBe(200);

  expect(data).toBeDefined();
  expect(data.length > 0).toBe(true);

  const hasAuthHeader =
    config.headers.Authorization?.toString().includes('Bearer');
  expect(hasAuthHeader).toBe(true);
});

test('getAvailableDates', async () => {
  const api = new TdxApi();
  const {data, status, config} = await api.getAvailableDates();

  expect(status).toBe(200);

  expect(data).toBeDefined();
  expect(data.StartDate).toBeDefined();
  expect(data.EndDate).toBeDefined();

  const hasAuthHeader =
    config.headers.Authorization?.toString().includes('Bearer');
  expect(hasAuthHeader).toBe(true);
});
