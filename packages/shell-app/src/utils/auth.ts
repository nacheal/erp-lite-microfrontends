import { tokenManager, UserInfo } from './storage';
import { setGlobalUser, clearGlobalUser } from './globalState';

/**
 * 认证相关工具函数
 */

/**
 * 检查用户是否已登录
 */
export const isAuthenticated = (): boolean => {
  return tokenManager.isTokenValid();
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = (): UserInfo | null => {
  return tokenManager.getUserInfo();
};

/**
 * 检查用户是否有指定权限
 * @param permission - 权限标识
 * @returns 是否有权限
 */
export const hasPermission = (permission: string): boolean => {
  const user = getCurrentUser();
  if (!user) {
    return false;
  }

  // 管理员拥有所有权限
  if (user.role === 'admin' || user.role === '系统管理员') {
    return true;
  }

  return user.permissions.includes(permission);
};

/**
 * 检查用户是否有任一权限
 * @param permissions - 权限标识数组
 * @returns 是否有任一权限
 */
export const hasAnyPermission = (permissions: string[]): boolean => {
  return permissions.some(permission => hasPermission(permission));
};

/**
 * 检查用户是否有所有权限
 * @param permissions - 权限标识数组
 * @returns 是否有所有权限
 */
export const hasAllPermissions = (permissions: string[]): boolean => {
  return permissions.every(permission => hasPermission(permission));
};

/**
 * 检查用户是否是管理员
 */
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  if (!user) {
    return false;
  }

  return user.role === 'admin' || user.role === '系统管理员';
};

/**
 * 登出
 */
export const logout = (): void => {
  tokenManager.clearAuth();
  clearGlobalUser();
  // 跳转到登录页
  window.location.href = '/login';
};

/**
 * 保存登录信息
 * @param token - 访问令牌
 * @param user - 用户信息
 * @param expiresIn - 过期时间（秒）
 */
export const saveAuthInfo = (token: string, user: UserInfo, expiresIn?: number): void => {
  tokenManager.setToken(token, expiresIn);
  tokenManager.setUserInfo(user);
  setGlobalUser(user);
}
