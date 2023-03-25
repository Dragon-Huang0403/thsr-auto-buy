import {z} from 'zod';

/**
 *  https://github.com/tdxmotc/SampleCode
 */
export const accessTokenSchema = z
  .object({
    // 用於存取API服務的token，格式為JWT
    access_token: z.string(),
    // token的有效期限，單位為秒，預設為86400秒(1天)
    expires_in: z.number(),
    // token類型，固定為"Bearer"
    token_type: z.string(),
  })
  .transform(data => ({
    accessToken: data.access_token,
    expiresIn: data.expires_in,
    tokenType: data.token_type,
  }));
