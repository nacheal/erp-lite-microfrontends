import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../utils/auth';
import { getGlobalStateActions } from '../utils/globalState';
import styles from './Header.module.css';

/**
 * 顶部导航栏组件
 * 功能：
 * - 显示应用 Logo 和标题
 * - 显示当前登录用户信息
 * - 提供退出登录功能
 * - 提供主题切换功能
 */
const Header: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(getCurrentUser());
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // 监听用户信息变化
  useEffect(() => {
    const handleStorageChange = () => {
      setUserInfo(getCurrentUser());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 监听全局主题状态变化
  useEffect(() => {
    const actions = getGlobalStateActions();
    const unsubscribe = actions.onGlobalStateChange((state: any) => {
      if (state.theme) {
        setTheme(state.theme);
        // 更新 HTML 根元素的 data-theme 属性
        document.documentElement.setAttribute('data-theme', state.theme);
      }
    }, true);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // 切换主题
  const handleToggleTheme = () => {
    const actions = getGlobalStateActions();
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log('[Header] 切换主题:', theme, '->', newTheme);
    actions.setGlobalState({ theme: newTheme });
  };

  return (
    <header className={styles['layout-header']}>
      <div className={styles['header-left']}>
        <div className={styles.logo}>ERP Lite</div>
        <div className={styles.title}>企业级微前端管理系统</div>
      </div>
      <div className={styles['header-right']}>
        <button
          className={styles['theme-btn']}
          onClick={handleToggleTheme}
          title={theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <div className={styles['user-info']}>
          <span className={styles['user-name']}>{userInfo?.name || '游客'}</span>
          <span className={styles['user-role']}>{userInfo?.role || '未登录'}</span>
        </div>
        <button className={styles['logout-btn']} onClick={handleLogout}>
          退出登录
        </button>
      </div>
    </header>
  );
};

export default Header;
