import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initGlobalState } from './utils/globalState';
import { registerApps, startMicroApps } from './micro';
import './styles/global.css';

// 初始化 qiankun 全局状态
initGlobalState();

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
