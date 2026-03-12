import React, { useState, useEffect } from 'react';
import { OrderList } from './pages/OrderList';
import { OrderDetail } from './pages/OrderDetail';
import { SalesStats } from './pages/SalesStats';
import { useUserInfo, useQiankunProps } from './qiankun';

/**
 * app-order 主应用
 * 处理子应用内部路由
 */
const App: React.FC = () => {
  const [view, setView] = useState<'list' | 'detail' | 'stats'>('list');
  const { userInfo, token, isAuthenticated } = useUserInfo();
  const qiankunProps = useQiankunProps();

  // 在控制台打印接收到的 props，用于调试
  useEffect(() => {
    console.log('[app-order] Qiankun Props:', qiankunProps);
    console.log('[app-order] 用户信息:', userInfo);
    console.log('[app-order] Token:', token);
    console.log('[app-order] 是否已认证:', isAuthenticated);
  }, [qiankunProps, userInfo, token, isAuthenticated]);

  useEffect(() => {
    // 监听路由变化
    const handleRouteChange = () => {
      const pathname = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');

      if (viewParam === 'stats') {
        setView('stats');
      } else if (pathname.includes('/order/detail') || params.has('id')) {
        setView('detail');
      } else {
        setView('list');
      }
    };

    // 初始路由判断
    handleRouteChange();

    // 监听 popstate 事件（浏览器前进后退）
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <div className="app-order">
      {/* 用户信息显示区域 - 用于验证 props 传递 */}
      {userInfo && (
        <div style={{
          padding: '16px',
          marginBottom: '16px',
          backgroundColor: '#f0f2f5',
          borderRadius: '8px',
          border: '1px solid #d9d9d9'
        }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600 }}>
            当前用户信息（来自主应用 props）
          </h3>
          <div style={{ fontSize: '14px', lineHeight: '24px' }}>
            <p style={{ margin: 0 }}><strong>用户名：</strong>{userInfo.name}</p>
            <p style={{ margin: 0 }}><strong>角色：</strong>{userInfo.role}</p>
            <p style={{ margin: 0 }}><strong>用户ID：</strong>{userInfo.id}</p>
            <p style={{ margin: 0 }}><strong>权限：</strong>{userInfo.permissions?.join(', ') || '无'}</p>
            <p style={{ margin: 0 }}><strong>Token：</strong>{token ? `${token.substring(0, 20)}...` : '无'}</p>
          </div>
        </div>
      )}

      {view === 'list' && <OrderList />}
      {view === 'detail' && <OrderDetail />}
      {view === 'stats' && <SalesStats />}
    </div>
  );
};

export default App;
