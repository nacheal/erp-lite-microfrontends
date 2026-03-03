import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated as checkIsAuthenticated } from '../utils/auth';
import styles from './AuthGuard.module.css';

/**
 * 认证守卫组件
 * 功能：
 * - 检查用户是否已登录
 * - 未登录时跳转到登录页
 * - 已登录时渲染子路由
 */
const AuthGuard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // 检查认证状态
    const authStatus = checkIsAuthenticated();
    setIsAuthenticated(authStatus);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>加载中...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // 未登录，跳转到登录页，并保存当前路径用于登录后跳转
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // 已登录，渲染子路由
  return <Outlet />;
};

export default AuthGuard;
