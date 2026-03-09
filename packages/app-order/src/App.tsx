import React, { useState, useEffect } from 'react';
import { OrderList } from './pages/OrderList';
import { OrderDetail } from './pages/OrderDetail';
import { SalesStats } from './pages/SalesStats';

/**
 * app-order 主应用
 * 处理子应用内部路由
 */
const App: React.FC = () => {
  const [view, setView] = useState<'list' | 'detail' | 'stats'>('list');

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
      {view === 'list' && <OrderList />}
      {view === 'detail' && <OrderDetail />}
      {view === 'stats' && <SalesStats />}
    </div>
  );
};

export default App;
