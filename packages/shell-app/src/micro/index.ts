/**
 * qiankun 微前端配置
 */

import { registerMicroApps, start, initGlobalState, MicroApp } from 'qiankun';

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
 * 子应用配置列表
 */
const microApps: MicroApp[] = [
  {
    name: 'app-user',
    entry: '//localhost:3001',
    container: '#subapp-user',
    activeRule: (location: Location) => location.pathname.startsWith('/user'),
  },
  {
    name: 'app-product',
    entry: '//localhost:3002',
    container: '#subapp-product',
    activeRule: (location: Location) => location.pathname.startsWith('/product'),
  },
  {
    name: 'app-order',
    entry: '//localhost:3003',
    container: '#subapp-order',
    activeRule: (location: Location) => location.pathname.startsWith('/order'),
  },
  {
    name: 'app-dashboard',
    entry: '//localhost:3004',
    container: '#subapp-dashboard',
    activeRule: (location: Location) => location.pathname.startsWith('/dashboard'),
  },
];

/**
 * 注册所有子应用
 */
export const registerApps = () => {
  registerMicroApps(microApps, {
    beforeLoad: [
      (app) => {
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
      strictStyleIsolation: true, // 严格样式隔离
      experimentalStyleIsolation: false, // 实验性样式隔离
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
