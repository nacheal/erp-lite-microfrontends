import './public-path';
import React from 'react';
import ReactDOM from 'react-dom/client';
import type { MicroAppLifeCycles, MicroAppProps } from '@erp-lite/types';
import App from './App';
import { QiankunProvider, QiankunProps } from './qiankun';

let root: ReactDOM.Root | null = null;

function render(props: QiankunProps) {
  const { container } = props;
  const target = container ? container.querySelector('#root') : document.getElementById('root');

  if (!target) return;

  // 打印接收到的 props，用于调试
  console.log('[app-order] 接收到的 props:', props);

  root = ReactDOM.createRoot(target);
  root.render(
    <React.StrictMode>
      <QiankunProvider value={props}>
        <App />
      </QiankunProvider>
    </React.StrictMode>
  );
}

// 应用初始化时调用一次
export async function bootstrap() {
  console.log('[app-order] bootstrap');
}

// 每次激活时调用
export async function mount(props: MicroAppProps) {
  console.log('[app-order] mount', props);
  render(props);
}

// 每次失活时调用
export async function unmount(props: MicroAppProps) {
  console.log('[app-order] unmount', props);
  if (root) {
    root.unmount();
    root = null;
  }
}

// 独立运行
if (!(window as any).__POWERED_BY_QIANKUN__) {
  render({});
}

export default {
  bootstrap,
  mount,
  unmount,
} as MicroAppLifeCycles;
