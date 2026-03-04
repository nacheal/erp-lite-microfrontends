import type { MicroAppLifeCycles, MicroAppProps } from '@erp-lite/types';
import { createRoot } from 'react-dom/client';
import App from './App';

let root: any = null;

// 应用初始化时调用一次
export async function bootstrap() {
  console.log('[app-user] bootstrap');
}

// 每次激活时调用
export async function mount(props: MicroAppProps) {
  console.log('[app-user] mount', props);
  const container = props.container as HTMLElement;
  root = createRoot(container);
  root.render(<App />);
}

// 每次失活时调用
export async function unmount(props: MicroAppProps) {
  console.log('[app-user] unmount', props);
  if (root) {
    root.unmount();
    root = null;
  }
}

// 独立运行时不导出
export default {
  bootstrap,
  mount,
  unmount,
} as MicroAppLifeCycles;

// 独立运行时
if (!(window as any).__POWERED_BY_QIANKUN__) {
  const container = document.getElementById('root') as HTMLElement;
  if (container) {
    root = createRoot(container);
    root.render(<App />);
  }
}
