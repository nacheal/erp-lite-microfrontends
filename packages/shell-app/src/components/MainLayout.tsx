import React from 'react';

/**
 * 主应用布局容器组件
 * 包含：顶部导航栏、左侧菜单、子应用挂载区
 */
const MainLayout: React.FC = () => {
  return (
    <div className="main-layout">
      {/* 顶部导航栏 */}
      <header className="layout-header">
        <div className="header-left">
          <div className="logo">ERP Lite</div>
          <div className="title">企业级微前端管理系统</div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">管理员</span>
            <span className="user-role">系统管理员</span>
          </div>
          <button className="logout-btn">退出登录</button>
        </div>
      </header>

      {/* 主要内容区 */}
      <div className="layout-body">
        {/* 左侧菜单 */}
        <aside className="layout-sider">
          <div className="menu-header">菜单</div>
          <nav className="menu-nav">
            <a href="/dashboard" className="menu-item active">
              <span className="menu-icon">📊</span>
              <span className="menu-text">数据看板</span>
            </a>
            <a href="/user" className="menu-item">
              <span className="menu-icon">👥</span>
              <span className="menu-text">用户管理</span>
            </a>
            <a href="/product" className="menu-item">
              <span className="menu-icon">📦</span>
              <span className="menu-text">商品管理</span>
            </a>
            <a href="/order" className="menu-item">
              <span className="menu-icon">📋</span>
              <span className="menu-text">订单管理</span>
            </a>
          </nav>
        </aside>

        {/* 子应用挂载区 */}
        <main className="layout-main">
          <div id="micro-app-container" className="micro-app-container">
            {/* 子应用将在这里渲染 */}
            <div className="placeholder">
              <h2>欢迎使用 ERP Lite</h2>
              <p>请从左侧菜单选择要访问的模块</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
