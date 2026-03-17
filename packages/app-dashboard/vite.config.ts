import { defineConfig } from 'vite';
import qiankun from 'vite-plugin-qiankun';
import path from 'path';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    plugins: [
      qiankun('app-dashboard', {
        useDevMode: isDev,
      }),
    ],
    base: '/',
    server: {
      port: 3004,
      cors: true,
      origin: 'http://localhost:3004',
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  };
});
