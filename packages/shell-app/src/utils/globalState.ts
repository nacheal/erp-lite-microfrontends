import { initGlobalState as qiankunInitGlobalState, MicroAppStateActions } from 'qiankun';
import { UserInfo } from './storage';

/**
 * qiankun 全局状态接口
 */
interface GlobalState {
  /**
   * 当前用户信息
   */
  user: UserInfo | null;

  /**
   * 当前语言
   */
  locale: string;

  /**
   * 主题模式
   */
  theme: 'light' | 'dark';

  /**
   * 菜单折叠状态
   */
  siderCollapsed: boolean;

  /**
   * 全局加载状态
   */
  loading: boolean;

  /**
   * 消息通知
   */
  notifications: {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }[];
}

/**
 * 初始全局状态
 */
const initialState: GlobalState = {
  user: null,
  locale: 'zh-CN',
  theme: 'light',
  siderCollapsed: false,
  loading: false,
  notifications: [],
};

/**
 * 动作类型常量
 */
export enum ActionType {
  // 用户相关
  SET_USER = 'SET_USER',
  CLEAR_USER = 'CLEAR_USER',
  LOGOUT = 'LOGOUT',

  // 导航相关
  NAVIGATE_TO = 'NAVIGATE_TO',

  // 主题相关
  SET_THEME = 'SET_THEME',
  TOGGLE_THEME = 'TOGGLE_THEME',

  // 语言相关
  SET_LOCALE = 'SET_LOCALE',

  // 侧边栏相关
  SET_SIDER_COLLAPSED = 'SET_SIDER_COLLAPSED',
  TOGGLE_SIDER = 'TOGGLE_SIDER',

  // 加载状态相关
  SET_LOADING = 'SET_LOADING',

  // 消息通知相关
  ADD_NOTIFICATION = 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION',
}

/**
 * qiankun 全局状态实例
 */
let actions: MicroAppStateActions | null = null;

/**
 * 初始化全局状态
 * @param state - 初始状态（可选）
 * @returns 状态管理 actions
 */
export const initGlobalState = (state?: Partial<GlobalState>): MicroAppStateActions => {
  if (!actions) {
    actions = qiankunInitGlobalState({
      ...initialState,
      ...state,
    });

    // 监听用户登录/退出，同步到全局状态
    actions.onGlobalStateChange((state, prevState) => {
      console.log('全局状态变化:', state, prevState);
    }, true);
  }

  return actions;
};

/**
 * 获取全局状态管理 actions
 * @returns 状态管理 actions
 */
export const getGlobalStateActions = (): MicroAppStateActions => {
  if (!actions) {
    return initGlobalState();
  }
  return actions;
};

/**
 * 获取当前全局状态
 * @returns 当前状态
 */
export const getGlobalState = (): GlobalState => {
  const { onGlobalStateChange } = getGlobalStateActions();
  let currentState: GlobalState = initialState;

  onGlobalStateChange((state) => {
    currentState = state as GlobalState;
  }, true);

  return currentState;
};

/**
 * 设置用户信息
 * @param user - 用户信息
 */
export const setGlobalUser = (user: UserInfo | null): void => {
  const { setGlobalState } = getGlobalStateActions();
  setGlobalState({ user });
};

/**
 * 清除用户信息（退出登录）
 */
export const clearGlobalUser = (): void => {
  const { setGlobalState } = getGlobalStateActions();
  setGlobalState({ user: null });
};

/**
 * 设置主题
 * @param theme - 主题模式
 */
export const setGlobalTheme = (theme: 'light' | 'dark'): void => {
  const { setGlobalState } = getGlobalStateActions();
  setGlobalState({ theme });
};

/**
 * 切换主题
 */
export const toggleGlobalTheme = (): void => {
  const currentTheme = getGlobalState().theme;
  const { setGlobalState } = getGlobalStateActions();
  setGlobalState({ theme: currentTheme === 'light' ? 'dark' : 'light' });
};

/**
 * 设置侧边栏折叠状态
 * @param collapsed - 是否折叠
 */
export const setSiderCollapsed = (collapsed: boolean): void => {
  const { setGlobalState } = getGlobalStateActions();
  setGlobalState({ siderCollapsed: collapsed });
};

/**
 * 切换侧边栏
 */
export const toggleSider = (): void => {
  const currentCollapsed = getGlobalState().siderCollapsed;
  const { setGlobalState } = getGlobalStateActions();
  setGlobalState({ siderCollapsed: !currentCollapsed });
};

/**
 * 设置加载状态
 * @param loading - 是否加载中
 */
export const setLoading = (loading: boolean): void => {
  const { setGlobalState } = getGlobalStateActions();
  setGlobalState({ loading });
};

/**
 * 添加消息通知
 * @param notification - 通知内容
 */
export const addNotification = (notification: Omit<GlobalState['notifications'][0], 'id'>): void => {
  const notifications = getGlobalState().notifications;
  const { setGlobalState } = getGlobalStateActions();

  const newNotification = {
    ...notification,
    id: `notification-${Date.now()}-${Math.random()}`,
  };

  setGlobalState({
    notifications: [...notifications, newNotification],
  });

  // 自动移除通知
  if (notification.duration !== 0) {
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, notification.duration || 3000);
  }
};

/**
 * 移除消息通知
 * @param id - 通知 ID
 */
export const removeNotification = (id: string): void => {
  const notifications = getGlobalState().notifications;
  const { setGlobalState } = getGlobalStateActions();

  setGlobalState({
    notifications: notifications.filter(n => n.id !== id),
  });
};

/**
 * 导出类型
 */
export type { GlobalState };
