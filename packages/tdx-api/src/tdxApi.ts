import {addSeconds} from 'date-fns';

import {createClient} from './utils/client';
import {refreshAccessToken} from './utils/constants';
import {accessTokenSchema} from './utils/schema';

export class TdxApi {
  private client = createClient();
  private accessTokenExpiredAt = new Date(0);

  async getRegularTimeTable() {
    await this.refreshAccessTokenIfExpired();

    const response = await this.client.get('/v2/Rail/THSR/GeneralTimetable');

    return response;
  }

  async getAvailableDates() {
    await this.refreshAccessTokenIfExpired();
    const response = await this.client.get(
      '/v2/Rail/THSR/DailyTimetable/TrainDates',
    );
    return response;
  }

  private async refreshAccessTokenIfExpired() {
    const now = new Date();
    const isExpired = now > this.accessTokenExpiredAt;
    if (!isExpired) {
      return;
    }

    const {url, body, headers} = refreshAccessToken;
    const {data} = await this.client.post(url, body, {
      headers,
    });

    const result = accessTokenSchema.safeParse(data);
    if (!result.success) {
      throw new Error('Access Token Expired and Refreshing Failed');
    }
    const {expiresIn, tokenType, accessToken} = result.data;

    this.accessTokenExpiredAt = addSeconds(now, expiresIn);
    this.client.defaults.headers.common.Authorization = [
      tokenType,
      accessToken,
    ].join(' ');
  }
}
