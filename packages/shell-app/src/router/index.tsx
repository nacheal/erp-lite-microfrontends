import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import AuthGuard from '../components/AuthGuard';

/**
 * 主应用路由配置
 *
 * 路由说明：
 * - /: 重定向到 dashboard
 * - /login: 登录页面
 * - /dashboard: 数据看板页面
 * - /user: 用户管理页面
 * - /product: 商品管理页面
 * - /order: 订单管理页面
 * - *: 404 页面
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    lazy: () => import('../pages/Login').then(m => ({ Component: m.default })),
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: 'dashboard',
            lazy: () => import('./lazyRoutes').then(m => ({ Component: m.Dashboard })),
          },
          {
            path: 'user',
            lazy: () => import('./lazyRoutes').then(m => ({ Component: m.User })),
          },
          {
            path: 'product',
            lazy: () => import('./lazyRoutes').then(m => ({ Component: m.Product })),
          },
          {
            path: 'order',
            lazy: () => import('./lazyRoutes').then(m => ({ Component: m.Order })),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    lazy: () => import('../pages/NotFound').then(m => ({ Component: m.default })),
  },
]);
