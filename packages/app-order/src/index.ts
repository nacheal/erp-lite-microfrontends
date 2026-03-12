import './public-path';
import type { MicroAppLifeCycles, MicroAppProps } from '@erp-lite/types';

let root: any = null;

// 应用初始化时调用一次
export async function bootstrap() {
  console.log('[app-order] bootstrap');
}

// 每次激活时调用
export async function mount(props: MicroAppProps) {
  console.log('[app-order] mount', props);
  const React = await import('react');
  const { default: App } = await import('./App');
  const { createRoot } = await import('react-dom/client');
  root = createRoot(props.container);
  root.render(React.createElement(App));
}

// 每次失活时调用
export async function unmount(props: MicroAppProps) {
  console.log('[app-order] unmount', props);
  if (root) {
    root.unmount();
    root = null;
  }
}

export default {
  bootstrap,
  mount,
  unmount,
} as MicroAppLifeCycles;
