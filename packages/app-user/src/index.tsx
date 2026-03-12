// src/index.tsx
import './public-path'; // 必须确保这个文件存在，内容见前文
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('here..3')
let root: ReactDOM.Root | null = null;

function render(props: any) {
  const { container } = props;
  const target = container ? container.querySelector('#root') : document.getElementById('root');
  
  if (!target) return;
  
  root = ReactDOM.createRoot(target);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// qiankun 声明周期
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

// 独立运行
if (!(window as any).__POWERED_BY_QIANKUN__) {
  render({});
}