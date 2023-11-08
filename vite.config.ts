import { lingui } from '@lingui/vite-plugin';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    // server: {
    //   hmr: false,
    // },
    // vite config
    optimizeDeps: {
      // 👈 optimizedeps
      esbuildOptions: {
        target: 'esnext',
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis',
        },
        supported: {
          bigint: true,
        },
      },
    },

    build: {
      target: ['esnext'], // 👈 build.target
      sourcemap: true, // Source map generation must be turned on
    },
    plugins: [
      react({
        babel: {
          plugins: ['macros'],
        },
      }),
      viteTsconfigPaths(),
      lingui(),
      sentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: 'buffer',
        project: 'nextjs',
      }),
    ],

    define: {
      __APP_ENV__: env.APP_ENV,
    },
  };
});
