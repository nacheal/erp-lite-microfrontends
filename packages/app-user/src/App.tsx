import React, { useState, useEffect } from 'react';
import { UserList } from './pages/UserList';
import { UserDetail } from './pages/UserDetail';
import { UserForm } from './pages/UserForm';
import { RoleManagement } from './pages/RoleManagement';
import { DepartmentManagement } from './pages/DepartmentManagement';

console.log('here..')
/**
 * app-user 主应用
 * 处理子应用内部路由
 */
const App: React.FC = () => {
  const [view, setView] = useState<'list' | 'detail' | 'form' | 'roles' | 'departments'>('list');

  useEffect(() => {
    // 监听路由变化
    const handleRouteChange = () => {
      const pathname = window.location.pathname;
      const params = new URLSearchParams(window.location.search);

      if (pathname.includes('/user/roles')) {
        setView('roles');
      } else if (pathname.includes('/user/departments')) {
        setView('departments');
      } else if (pathname.includes('/user/form')) {
        setView('form');
      } else if (pathname.includes('/user/detail') || params.has('id')) {
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
    <div className="app-user">
      {view === 'list' && <UserList />}
      {view === 'detail' && <UserDetail />}
      {view === 'form' && <UserForm />}
      {view === 'roles' && <RoleManagement />}
      {view === 'departments' && <DepartmentManagement />}
    </div>
  );
};

export default App;
