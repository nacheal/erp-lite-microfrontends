import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import qiankun from 'vite-plugin-qiankun';
import path from 'path';

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue(),
      qiankun('app-product', {
        useDevMode: true,
      }),
    ],
    server: {
      port: 3002,
      cors: true,
      origin: 'http://localhost:3002',
    },
    build: {
      outDir: 'dist',
      lib: {
        entry: './src/index.ts',
        name: 'app-product',
        formats: ['umd'],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  };
});
