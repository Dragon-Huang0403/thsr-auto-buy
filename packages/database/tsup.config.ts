import {defineConfig} from 'tsup';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  minify: isProduction,
  onSuccess: 'cp prisma/schema.prisma build && cp .env build',
  sourcemap: true,
  outDir: 'build',
});
