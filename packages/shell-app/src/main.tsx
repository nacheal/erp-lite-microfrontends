import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initGlobalState, ActionType } from './utils/globalState';
import { registerApps, startMicroApps } from './micro';
import { logout } from './utils/auth';
import './styles/global.css';

// 初始化 qiankun 全局状态
const actions = initGlobalState();

// 监听全局状态变化，处理子应用发出的 action
actions.onGlobalStateChange((state: any, prevState: any) => {
  console.log('[主应用] 全局状态变化:', state, prevState);

  // 处理退出登录 action
  // 注意：这里监听的是 state.action，而不是 ActionType.LOGOUT
  // 子应用会通过 setGlobalState({ action: 'LOGOUT' }) 来触发
  if (state.action === ActionType.LOGOUT || state.action === 'LOGOUT') {
    console.log('[主应用] 收到退出登录请求，执行登出操作');

    // 执行退出登录逻辑
    logout();

    // 跳转到登录页
    window.location.href = '/login';

    // 清除 action，避免重复触发
    actions.setGlobalState({ action: null });
  }

  // 处理跨应用跳转 action
  if (state.action && state.action.startsWith('NAVIGATE_')) {
    const targetPath = state.payload?.path;
    if (targetPath) {
      console.log('[主应用] 收到跨应用跳转请求:', targetPath);
      window.history.pushState(null, '', targetPath);
      // 清除 action
      actions.setGlobalState({ action: null });
    }
  }
}, true);

// 注册所有子应用
registerApps();

// 启动 qiankun
startMicroApps();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
