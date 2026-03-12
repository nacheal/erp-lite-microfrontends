/**
 * qiankun 微前端配置
 */

import { registerMicroApps, start, initGlobalState, MicroApp } from 'qiankun';
import { getGlobalStateActions } from '../utils/globalState';
import { tokenManager } from '../utils/storage';

/**
 * 微应用配置接口
 */
interface MicroAppConfig {
  name: string;
  entry: string;
  container: string;
  activeRule: string | ((location: Location) => boolean);
}

/**
 * 获取传递给子应用的 props
 * 每次子应用加载时都会调用此函数获取最新的数据
 */
const getProps = () => {
  return {
    // 传递 qiankun 全局状态管理的 actions
    globalState: getGlobalStateActions(),
    // 传递用户认证信息
    token: tokenManager.getToken(),
    userInfo: tokenManager.getUserInfo(),
    // 传递工具函数
    tokenManager,
  };
};

/**
 * 子应用配置列表
 */
const microApps: MicroApp[] = [
  {
    name: 'app-user',
    entry: '//localhost:3001',
    container: '#subapp-user',
    activeRule: (location: Location) => location.pathname.startsWith('/user'),
    props: getProps(),
  },
  {
    name: 'app-product',
    entry: '//localhost:3002',
    container: '#subapp-product',
    activeRule: (location: Location) => location.pathname.startsWith('/product'),
    props: getProps(),
  },
  {
    name: 'app-order',
    entry: '//localhost:3003',
    container: '#subapp-order',
    activeRule: (location: Location) => location.pathname.startsWith('/order'),
    props: getProps(),
  },
  {
    name: 'app-dashboard',
    entry: '//localhost:3004',
    container: '#subapp-dashboard',
    beforeMount: [
      app => {
        console.log('检查容器节点是否存在:', document.querySelector('#subapp-dashboard'));
        return Promise.resolve();
      },
    ],
    activeRule: (location: Location) => location.pathname.startsWith('/dashboard'),
    props: getProps(),
  },
];

/**
 * 注册所有子应用
 */
export const registerApps = () => {
  registerMicroApps(microApps, {
    beforeLoad: [
      (app) => {
        console.log('检查容器节点是否存在:', document.querySelector('#subapp-dashboard'))
        console.log('[qiankun] Loading app...', app.name);
      },
    ],
    beforeMount: [
      (app) => {
        console.log('[qiankun] Mounting app...', app.name);
      },
    ],
    afterMount: [
      (app) => {
        console.log('[qiankun] Mounted app...', app.name);
      },
    ],
    beforeUnmount: [
      (app) => {
        console.log('[qiankun] Unmounting app...', app.name);
      },
    ],
    afterUnmount: [
      (app) => {
        console.log('[qiankun] Unmounted app...', app.name);
      },
    ],
  });
};

/**
 * 启动 qiankun
 */
export const startMicroApps = () => {
  start({
    sandbox: {
      strictStyleIsolation: false, // 严格样式隔离（使用 Shadow DOM，会导致 Vite HMR 错误）
      experimentalStyleIsolation: true, // 实验性样式隔离（使用 CSS scoped，兼容性更好）
    },
    prefetch: 'all', // 预加载所有子应用
    singular: false, // 允许多个子应用同时存在
  });
};

/**
 * 从远程 API 获取子应用配置
 * 用于动态加载子应用配置
 */
export const fetchMicroAppConfigs = async (): Promise<MicroApp[]> => {
  try {
    // 这里可以从 API 获取子应用配置
    // 目前使用静态配置
    return microApps;
  } catch (error) {
    console.error('[qiankun] Failed to fetch micro app configs:', error);
    return microApps;
  }
};

/**
 * 导出子应用配置
 */
export { microApps };
export default {
  registerApps,
  startMicroApps,
  fetchMicroAppConfigs,
};
