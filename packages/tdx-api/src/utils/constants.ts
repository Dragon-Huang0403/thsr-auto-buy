import {env} from './env';

export const baseUrl = 'https://tdx.transportdata.tw/api/basic';

export const refreshAccessToken = {
  url: 'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
  },
  body: {
    grant_type: 'client_credentials',
    client_id: env.TDX_CLIENT_ID,
    client_secret: env.TDX_CLIENT_SECRET,
  },
} as const;
