import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import qiankun from 'vite-plugin-qiankun';
import path from 'path';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  // 生产环境的子应用完整 URL（用于被主应用加载）
  const prodUrl = process.env.APP_PRODUCT_URL || 'https://erp-lite-product.vercel.app';

  return {
    plugins: [
      vue(),
      qiankun('app-product', {
        useDevMode: isDev,
      }),
    ],
    base: isDev ? '/' : `${prodUrl}/`,
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
