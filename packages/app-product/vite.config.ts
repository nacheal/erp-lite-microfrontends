import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import qiankun from 'vite-plugin-qiankun';
import path from 'path';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    plugins: [
      vue(),
      qiankun('app-product', {
        useDevMode: isDev,
      }),
    ],
    base: '/',
    server: {
      port: 3002,
      cors: true,
      origin: 'http://localhost:3002',
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
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'element-plus'],
    },
  };
});
