import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import SiderMenu from './SiderMenu';
import styles from './MainLayout.module.css';

/**
 * 主应用布局容器组件
 * 包含：顶部导航栏、左侧菜单、子应用挂载区
 */
const MainLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className={styles['main-layout']}>
      {/* 顶部导航栏 */}
      <Header />

      {/* 主要内容区 */}
      <div className={styles['layout-body']}>
        {/* 左侧菜单 */}
        <SiderMenu currentPath={location.pathname} />

        {/* 子应用挂载区 - 使用 Outlet 渲染子路由 */}
        <main className={styles['layout-main']}>
          <div id="micro-app-container" className={styles['micro-app-container']}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
