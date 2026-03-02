/**
 * ERP Lite Micro-Frontend System - Shared TypeScript Types
 */

/**
 * 权限码枚举类型
 */
export type PermissionCode =
  | 'user:view'
  | 'user:edit'
  | 'user:delete'
  | 'product:view'
  | 'product:edit'
  | 'product:delete'
  | 'order:view'
  | 'order:export';

/**
 * 用户信息
 */
export interface UserInfo {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  phone?: string;
  roles: string[];
}

/**
 * 全局状态
 * 主应用通过 qiankun 的 initGlobalState 管理这些数据
 */
export interface GlobalState {
  /** 当前登录用户信息 */
  user: UserInfo | null;
  /** JWT Token */
  token: string | null;
  /** 用户权限列表 */
  permissions: PermissionCode[];
  /** 主题模式 */
  theme: 'light' | 'dark';
  /** 语言 */
  locale: 'zh-CN' | 'en-US';
  /** 跨应用指令（子应用用于通知主应用执行特定操作） */
  action?: GlobalAction;
}

/**
 * 全局动作/指令
 * 子应用通过设置 action 来通知主应用执行某些操作
 */
export interface GlobalAction {
  type: string;
  payload: unknown;
}

/**
 * 跨应用指令类型
 */
export const ActionType = {
  /** 退出登录 */
  LOGOUT: 'LOGOUT',
  /** 跳转到用户详情 */
  NAVIGATE_USER: 'NAVIGATE_USER',
  /** 跳转到订单列表（带筛选） */
  NAVIGATE_ORDER: 'NAVIGATE_ORDER',
} as const;

/**
 * 子应用注册配置
 * 主应用从配置中心获取此配置来动态注册子应用
 */
export interface MicroAppConfig {
  /** 子应用名称 */
  name: string;
  /** 子应用入口 URL（开发环境或生产环境） */
  entry: string;
  /** 激活规则（路由前缀） */
  activeRule: string | ((location: Location) => boolean);
  /** 是否启用 */
  enabled?: boolean;
  /** 版本号 */
  version?: string;
  /** 传递给子应用的 props */
  props?: Record<string, unknown>;
}

/**
 * 子应用生命周期函数
 * qiankun 要求每个子应用导出这三个生命周期函数
 */
export interface MicroAppLifeCycles {
  /** 应用初始化时调用一次 */
  bootstrap(): Promise<void>;
  /** 每次激活时调用 */
  mount(props: MicroAppProps): Promise<void>;
  /** 每次失活时调用 */
  unmount(props: MicroAppProps): Promise<void>;
}

/**
 * qiankun 传递给子应用的 props
 */
export interface MicroAppProps {
  /** 挂载容器 */
  container: HTMLElement;
  /** 主应用路由实例 */
  history?: unknown;
  /** 全局状态操作方法 */
  onGlobalStateChange?: (callback: OnGlobalStateChangeCallback, fireImmediately?: boolean) => void;
  setGlobalState?: (state: Partial<GlobalState>) => void;
  /** 当前全局状态 */
  [key: string]: unknown;
}

/**
 * 全局状态变化回调
 */
export type OnGlobalStateChangeCallback = (state: GlobalState, prevState: GlobalState) => void;

/**
 * 分页参数
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * 分页响应
 */
export interface PaginationResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * API 响应基础结构
 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

/**
 * 列表查询参数
 */
export interface ListParams extends PaginationParams {
  [key: string]: unknown;
}
