import type { MicroAppLifeCycles, MicroAppProps } from '@erp-lite/types';
import { createApp } from 'vue';
import App from './App.vue';
import { renderWithQiankun } from 'vite-plugin-qiankun/dist/helper';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './index.css';

let app: any = null;

const mountApp = (props: MicroAppProps) => {
  app = createApp(App);
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
