import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 独立运行时直接挂载
if (!(window as any).__POWERED_BY_QIANKUN__) {
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
