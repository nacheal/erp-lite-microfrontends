/**
 * qiankun 相关工具和类型定义
 */
import React, { createContext, useContext, ReactNode } from 'react';
import { MicroAppStateActions } from 'qiankun';

/**
 * 主应用传递的 props 接口
 */
export interface QiankunProps {
  /**
   * qiankun 全局状态管理
   */
  globalState?: MicroAppStateActions;

  /**
   * 用户认证 token
   */
  token?: string | null;

  /**
   * 用户信息
   */
  userInfo?: {
    id: string;
    name: string;
    role: string;
    permissions: string[];
  } | null;

  /**
   * Token 管理器
   */
  tokenManager?: any;

  /**
   * 子应用容器
   */
  container?: HTMLElement;
}

/**
 * qiankun Context
 */
const QiankunContext = createContext<QiankunProps>({});

/**
 * Provider 组件
 */
export const QiankunProvider: React.FC<{ value: QiankunProps; children: ReactNode }> = ({
  value,
  children
}) => {
  return <QiankunContext.Provider value={value}>{children}</QiankunContext.Provider>;
};

/**
 * 获取 qiankun props 的 Hook
 */
export const useQiankunProps = (): QiankunProps => {
  return useContext(QiankunContext);
};

/**
 * 获取全局状态的 Hook
 */
export const useGlobalState = () => {
  const { globalState } = useQiankunProps();

  /**
   * 设置全局状态
   */
  const setGlobalState = (state: Record<string, any>) => {
    globalState?.setGlobalState?.(state);
  };

  /**
   * 监听全局状态变化
   */
  const onGlobalStateChange = (
    callback: (state: Record<string, any>, prev: Record<string, any>) => void,
    fireImmediately?: boolean
  ) => {
    return globalState?.onGlobalStateChange?.(callback, fireImmediately);
  };

  return {
    setGlobalState,
    onGlobalStateChange,
    globalState,
  };
};

/**
 * 获取用户信息的 Hook
 */
export const useUserInfo = () => {
  const { userInfo, token } = useQiankunProps();

  return {
    userInfo,
    token,
    isAuthenticated: !!token && !!userInfo,
  };
};
