import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../utils/auth';
import styles from './Header.module.css';

/**
 * 顶部导航栏组件
 * 功能：
 * - 显示应用 Logo 和标题
 * - 显示当前登录用户信息
 * - 提供退出登录功能
 */
const Header: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(getCurrentUser());

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

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className={styles['layout-header']}>
      <div className={styles['header-left']}>
        <div className={styles.logo}>ERP Lite</div>
        <div className={styles.title}>企业级微前端管理系统</div>
      </div>
      <div className={styles['header-right']}>
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
