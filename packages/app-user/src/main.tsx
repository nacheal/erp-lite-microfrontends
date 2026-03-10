import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

let root: ReactDOM.Root | null = null;

function render(props: any) {
  const { container } = props;
  const target = container ? container : document.getElementById('root');

  if (!target) return;

  root = ReactDOM.createRoot(target);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// qiankun 生命周期函数
export async function bootstrap() {
  console.log('[app-user] bootstrap');
}

export async function mount(props: any) {
  console.log('[app-user] mount', props);
  render(props);
}

export async function unmount() {
  console.log('[app-user] unmount');
  root?.unmount();
  root = null;
}

// 独立运行时
if (!(window as any).__POWERED_BY_QIANKUN__) {
  render({});
}
