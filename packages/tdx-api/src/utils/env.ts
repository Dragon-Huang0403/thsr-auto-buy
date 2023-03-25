import {config} from 'dotenv';
import {z} from 'zod';

config();

const envSchema = z.object({
  TDX_CLIENT_ID: z.string(),
  TDX_CLIENT_SECRET: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error(
    '❌ Invalid environment variables:',
    JSON.stringify(_env.error.format(), null, 4),
  );
  throw new Error('❌ Invalid environment variables:');
}
export const env = _env.data;
