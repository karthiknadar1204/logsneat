import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  target: 'node18',
  sourcemap: false,
  // deps + peerDeps are auto-externalized by tsup, so OTel/openai are not bundled.
});
