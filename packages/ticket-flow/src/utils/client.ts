import got from 'got';
import {CookieJar} from 'tough-cookie';

const defaultHeaders = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  Connection: 'keep-alive',
  'Accept-Language': 'zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3',
} as const;

export function createClient() {
  const cookieJar = new CookieJar();
  const client = got.extend({
    cookieJar,
    headers: defaultHeaders,
    followRedirect: true,
    timeout: {
      request: 60_000,
    },
  });
  return client;
}
