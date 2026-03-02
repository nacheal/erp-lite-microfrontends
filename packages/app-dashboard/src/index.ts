import type { MicroAppLifeCycles, MicroAppProps } from '@erp-lite/types';

let container: HTMLElement | null = null;
let pollingTimer: ReturnType<typeof setInterval> | null = null;
let charts: any[] = [];

// 应用初始化时调用一次
export async function bootstrap() {
  console.log('[app-dashboard] bootstrap');
}

// 每次激活时调用
export async function mount(props: MicroAppProps) {
  console.log('[app-dashboard] mount', props);
  container = props.container as HTMLElement;
  renderDashboard();
  startPolling();
}

// 每次失活时调用
export async function unmount(props: MicroAppProps) {
  console.log('[app-dashboard] unmount', props);
  stopPolling();
  disposeCharts();
  if (container) {
    container.innerHTML = '';
    container = null;
  }
}

// 渲染看板
function renderDashboard() {
  if (!container) return;
  container.innerHTML = `
    <div class="app-dashboard">
      <h1>Dashboard</h1>
      <p>数据看板子应用（原生 JS）</p>
    </div>
  `;
}

// 启动数据轮询
function startPolling() {
  pollingTimer = setInterval(() => {
    console.log('[app-dashboard] polling data...');
  }, 60000); // 每 60 秒
}

// 停止数据轮询
function stopPolling() {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
}

// 销毁所有 ECharts 实例
function disposeCharts() {
  charts.forEach(chart => {
    if (chart && typeof chart.dispose === 'function') {
      chart.dispose();
    }
  });
  charts = [];
}

// 独立运行时
if (!(window as any).__POWERED_BY_QIANKUN__) {
  mount({ container: document.getElementById('app') as HTMLElement } as MicroAppProps);
}

export default {
  bootstrap,
  mount,
  unmount,
} as MicroAppLifeCycles;
