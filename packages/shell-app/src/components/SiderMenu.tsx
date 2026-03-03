import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser, hasPermission } from '../utils/auth';
import styles from './SiderMenu.module.css';

/**
 * 菜单项配置
 */
interface MenuItem {
  key: string;
  label: string;
  path: string;
  icon: string;
  permission?: string; // 需要的权限，如果用户没有该权限则不显示菜单
}

/**
 * 所有菜单项配置
 */
const ALL_MENU_ITEMS: MenuItem[] = [
  {
    key: 'dashboard',
    label: '数据看板',
    path: '/dashboard',
    icon: '📊',
    permission: 'dashboard:view',
  },
  {
    key: 'user',
    label: '用户管理',
    path: '/user',
    icon: '👥',
    permission: 'user:view',
  },
  {
    key: 'product',
    label: '商品管理',
    path: '/product',
    icon: '📦',
    permission: 'product:view',
  },
  {
    key: 'order',
    label: '订单管理',
    path: '/order',
    icon: '📋',
    permission: 'order:view',
  },
];

/**
 * 左侧菜单组件
 * 功能：
 * - 支持收起/展开
 * - 根据当前路由高亮对应菜单项
 * - 根据用户权限过滤菜单项
 * - 菜单折叠状态持久化到 localStorage
 */
interface SiderMenuProps {
  currentPath?: string;
}

const SiderMenu: React.FC<SiderMenuProps> = ({ currentPath: propCurrentPath }) => {
  const [userInfo, setUserInfo] = useState(getCurrentUser());

  // 监听用户信息变化（登录/登出时更新）
  useEffect(() => {
    const handleStorageChange = () => {
      setUserInfo(getCurrentUser());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 菜单折叠状态
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sider-collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  // 保存折叠状态
  useEffect(() => {
    localStorage.setItem('sider-collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  // 根据用户权限过滤菜单项
  const filteredMenuItems = useMemo(() => {
    return ALL_MENU_ITEMS.filter(item => {
      // 如果菜单项没有权限要求，始终显示
      if (!item.permission) {
        return true;
      }
      // 检查用户是否有该权限
      return hasPermission(item.permission);
    });
  }, [userInfo]);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const isMenuActive = (path: string): boolean => {
    return propCurrentPath?.startsWith(path) || false;
  };

  return (
    <aside className={`${styles['layout-sider']} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles['menu-header']}>
        <span className={styles['menu-title']}>ERP Lite</span>
        <button
          className={`${styles['collapse-toggle']} ${collapsed ? styles.collapsed : ''}`}
          onClick={toggleCollapse}
          aria-label={collapsed ? '展开菜单' : '收起菜单'}
        >
          {collapsed ? '⏺' : '⏸'}
        </button>
      </div>

      <nav className={styles['menu-nav']}>
        {filteredMenuItems.map(item => (
          <Link
            key={item.key}
            to={item.path}
            className={`${styles['menu-item']} ${isMenuActive(item.path) ? styles.active : ''}`}
          >
            <span className={styles['menu-icon']}>{item.icon}</span>
            <span className={styles['menu-text']}>{item.label}</span>
          </Link>
        ))}
      </nav>

      {!collapsed && (
        <div className={styles['menu-footer']}>
          <span className={styles['footer-text']}>© 2024 ERP Lite</span>
        </div>
      )}
    </aside>
  );
};

export default SiderMenu;
