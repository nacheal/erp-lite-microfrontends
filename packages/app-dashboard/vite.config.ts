import { defineConfig } from 'vite';
import qiankun from 'vite-plugin-qiankun';
import path from 'path';

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      qiankun('app-dashboard', {
        useDevMode: true,
      }),
    ],
    server: {
      port: 3004,
      cors: true,
      origin: 'http://localhost:3004',
    },
    build: {
      outDir: 'dist',
      lib: {
        entry: './src/index.ts',
        name: 'app-dashboard',
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
