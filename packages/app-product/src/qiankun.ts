/**
 * qiankun 相关工具和类型定义 (Vue 3)
 */
import { inject, computed } from 'vue';
import type { InjectionKey } from 'vue';
import type { MicroAppStateActions } from 'qiankun';

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
 * qiankun props injection key
 */
export const qiankunPropsKey = Symbol('qiankunProps') as InjectionKey<QiankunProps>;

/**
 * 获取 qiankun props 的 composable
 */
export function useQiankunProps(): QiankunProps {
  const props = inject(qiankunPropsKey, {});
  return props;
}

/**
 * 获取全局状态的 composable
 */
export function useGlobalState() {
  const props = useQiankunProps();

  /**
   * 设置全局状态
   */
  const setGlobalState = (state: Record<string, any>) => {
    props.globalState?.setGlobalState?.(state);
  };

  /**
   * 监听全局状态变化
   */
  const onGlobalStateChange = (
    callback: (state: Record<string, any>, prev: Record<string, any>) => void,
    fireImmediately?: boolean
  ) => {
    return props.globalState?.onGlobalStateChange?.(callback, fireImmediately);
  };

  return {
    setGlobalState,
    onGlobalStateChange,
    globalState: computed(() => props.globalState),
  };
}

/**
 * 获取用户信息的 composable
 */
export function useUserInfo() {
  const props = useQiankunProps();

  return {
    userInfo: computed(() => props.userInfo),
    token: computed(() => props.token),
    isAuthenticated: computed(() => !!props.token && !!props.userInfo),
  };
}
