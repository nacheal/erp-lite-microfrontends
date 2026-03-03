import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

/**
 * 主应用根组件
 * 使用 React Router 6 的 RouterProvider 提供路由功能
 */
const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
