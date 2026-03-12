import type { MicroAppLifeCycles, MicroAppProps } from '@erp-lite/types';
import { createApp } from 'vue';
import App from './App.vue';
import { renderWithQiankun } from 'vite-plugin-qiankun/dist/helper';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './index.css';
import { qiankunPropsKey } from './qiankun';
import type { QiankunProps } from './qiankun';

let app: any = null;

const mountApp = (props: QiankunProps) => {
  // 打印接收到的 props，用于调试
  console.log('[app-product] 接收到的 props:', props);

  app = createApp(App);

  // 使用 provide 向下传递 qiankun props
  app.provide(qiankunPropsKey, props);

  app.use(ElementPlus, { namespace: 'prd-ep' });
  app.mount(props.container ? props.container : '#app');
};

const unmountApp = () => {
  if (app) {
    app.unmount();
    app = null;
  }
};

// 使用 qiankun 的 renderWithQiankun 封装
renderWithQiankun({
  bootstrap() {
    console.log('[app-product] bootstrap');
  },
  mount(props) {
    console.log('[app-product] mount', props);
    mountApp(props);
  },
  unmount(props) {
    console.log('[app-product] unmount', props);
    unmountApp();
  },
});

// 独立运行时
if (!(window as any).__POWERED_BY_QIANKUN__) {
  mountApp({ container: document.getElementById('app') as HTMLElement } as MicroAppProps);
}
