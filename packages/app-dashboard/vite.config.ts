import { defineConfig } from 'vite';
import qiankun from 'vite-plugin-qiankun';
import path from 'path';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  // 生产环境的子应用完整 URL（用于被主应用加载）
  const prodUrl = process.env.APP_DASHBOARD_URL || 'https://erp-lite-dashboard.vercel.app';

  return {
    plugins: [
      qiankun('app-dashboard', {
        useDevMode: isDev,
      }),
    ],
    base: isDev ? '/' : `${prodUrl}/`,
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
