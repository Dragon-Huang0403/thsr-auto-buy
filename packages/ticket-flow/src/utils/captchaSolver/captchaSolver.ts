import {Got} from 'got';

import {getEnv} from '../env';
import {capSolver} from './capSolver';
import {twoCaptcha} from './twpCaptcha';

export async function captchaSolver(client: Got, imageUrL: URL) {
  const imageBody = await client.get(imageUrL).buffer();
  const base64Buffer = imageBody.toString('base64');

  const env = getEnv();
  const request = {base64Buffer, apiKey: env.CAPTCHA_KEY};

  let result = '';
  if (env.CAPTCHA_SOLVER === '2captcha') {
    result = await twoCaptcha(request);
  } else {
    result = await capSolver(request);
  }

  return result.toLowerCase();
}
