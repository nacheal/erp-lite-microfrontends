import type { MicroAppLifeCycles, MicroAppProps } from '@erp-lite/types';
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import * as echarts from 'echarts';

let container: HTMLElement | null = null;
let styleElement: HTMLStyleElement | null = null;
let pollingTimer: ReturnType<typeof setInterval> | null = null;
let trendChart: echarts.ECharts | null = null;
let rankingChart: echarts.ECharts | null = null;

/**
 * 初始化数据看板
 */
function initDashboard(targetContainer: HTMLElement) {
  console.log('[app-dashboard] Initializing dashboard');

  // 注入样式
  if (!styleElement) {
    styleElement = document.createElement('style');
    document.head.appendChild(styleElement);
  }

  // 设置容器
  container = targetContainer;

  // 渲染 UI
  renderDashboard();
  loadDashboardData();
  startPolling();

  // 添加刷新按钮事件
  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadDashboardData();
    });
  }

  // 添加 resize 事件
  window.addEventListener('resize', handleResize);
}

/**
 * 销毁数据看板
 */
function disposeDashboard() {
  console.log('[app-dashboard] Disposing dashboard');

  // 停止轮询
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }

  // 销毁图表实例
  if (trendChart) {
    trendChart.dispose();
    trendChart = null;
  }
  if (rankingChart) {
    rankingChart.dispose();
    rankingChart = null;
  }

  // 移除样式
  if (styleElement && styleElement.parentNode) {
    styleElement.parentNode.removeChild(styleElement);
    styleElement = null;
  }

  // 移除 resize 事件
  window.removeEventListener('resize', handleResize);

  // 清空容器
  if (container) {
    container.innerHTML = '';
    container = null;
  }
}

/**
 * 处理窗口大小变化
 */
function handleResize() {
  if (trendChart) {
    trendChart.resize();
  }
  if (rankingChart) {
    rankingChart.resize();
  }
}

/**
 * 渲染看板 UI
 */
function renderDashboard() {
  if (!container) {
    console.error('[app-dashboard] container is null, cannot render');
    return;
  }

  container.innerHTML = `
    <style>
      .app-dashboard {
        padding: 20px;
      }
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      .page-header h1 {
        margin: 0;
        font-size: 24px;
        color: #333;
      }
      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }
      .metric-card {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      .metric-icon {
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        border-radius: 12px;
      }
      .metric-icon-gmv {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      .metric-icon-orders {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }
      .metric-icon-users {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }
      .metric-icon-conversion {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }
      .metric-info {
        flex: 1;
      }
      .metric-label {
        font-size: 14px;
        color: #666;
        margin-bottom: 8px;
      }
      .metric-value {
        font-size: 28px;
        font-weight: bold;
        color: #333;
      }
      .metric-trend {
        font-size: 14px;
        margin-top: 4px;
      }
      .trend-up {
        color: #52c41a;
      }
      .trend-down {
        color: #ff4d4f;
      }
      .charts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 20px;
        margin-bottom: 20px;
      }
      .chart-card {
        background: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
      .chart-header h3 {
        margin: 0;
        font-size: 16px;
        color: #333;
      }
      .chart-actions select {
        padding: 6px 12px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        font-size: 14px;
      }
      .chart-container {
        height: 300px;
      }
      .chart-card.chart-full {
        grid-column: 1 / -1;
      }
      .chart-map-container {
        height: 400px;
      }
      .btn {
        padding: 6px 16px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        background: #fff;
        transition: all 0.3s;
      }
      .btn:hover {
        border-color: #1890ff;
        color: #1890ff;
      }
      .province-list {
        padding: 16px;
      }
      .province-list h4 {
        margin: 0 0 16px 0;
        font-size: 16px;
        color: #333;
      }
      .province-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        margin-bottom: 12px;
        background: #fafafa;
        border-radius: 4px;
      }
      .province-name {
        flex: 0 0 100px;
        font-weight: 500;
        color: #333;
      }
      .province-value {
        flex: 0 0 120px;
        text-align: right;
        font-weight: 600;
        color: #1890ff;
      }
      .province-bar {
        flex: 1;
        height: 8px;
        background: linear-gradient(90deg, #1890ff 0%, #40a9ff 100%);
        border-radius: 4px;
        min-width: 10px;
      }
    </style>
    <div class="app-dashboard">
      <div class="page-header">
        <h1>数据看板</h1>
        <button id="refresh-btn" class="btn btn-sm">刷新</button>
      </div>

      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon metric-icon-gmv">¥</div>
          <div class="metric-info">
            <div class="metric-label">GMV</div>
            <div class="metric-value" id="metric-gmv">¥0.00</div>
            <div class="metric-trend trend-up">↑ 12.5%</div>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon metric-icon-orders">📦</div>
          <div class="metric-info">
            <div class="metric-label">订单量</div>
            <div class="metric-value" id="metric-orders">0</div>
            <div class="metric-trend trend-up">↑ 8.3%</div>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon metric-icon-users">👥</div>
          <div class="metric-info">
            <div class="metric-label">用户数</div>
            <div class="metric-value" id="metric-users">0</div>
            <div class="metric-trend trend-up">↑ 5.2%</div>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon metric-icon-conversion">📊</div>
          <div class="metric-info">
            <div class="metric-label">转化率</div>
            <div class="metric-value" id="metric-conversion">0%</div>
            <div class="metric-trend trend-down">↓ 2.1%</div>
          </div>
        </div>
      </div>

      <div class="charts-grid">
        <div class="chart-card">
          <div class="chart-header">
            <h3>销售趋势</h3>
            <div class="chart-actions">
              <select id="trend-period">
                <option value="day">日</option>
                <option value="week">周</option>
                <option value="month" selected>月</option>
              </select>
            </div>
          </div>
          <div id="chart-trend" class="chart-container"></div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <h3>商品销量排行榜</h3>
          </div>
          <div id="chart-ranking" class="chart-container"></div>
        </div>

        <div class="chart-card chart-full">
          <div class="chart-header">
            <h3>省份销售热力图</h3>
          </div>
          <div id="chart-map" class="chart-container chart-map-container"></div>
        </div>
      </div>
    </div>
  `;
}

/**
 * 更新指标数据
 */
function updateMetrics(data: any) {
  const gmvElement = document.getElementById('metric-gmv');
  const ordersElement = document.getElementById('metric-orders');
  const usersElement = document.getElementById('metric-users');
  const conversionElement = document.getElementById('metric-conversion');

  if (gmvElement) {
    gmvElement.textContent = '¥' + (data.gmv || 0).toFixed(2);
  }
  if (ordersElement) {
    ordersElement.textContent = data.orders || 0;
  }
  if (usersElement) {
    usersElement.textContent = data.users || 0;
  }
  if (conversionElement) {
    conversionElement.textContent = (data.conversion || 0).toFixed(2) + '%';
  }
}

/**
 * 渲染图表
 */
function renderCharts(data: any) {
  const trendContainer = document.getElementById('chart-trend');
  const rankingContainer = document.getElementById('chart-ranking');
  const mapContainer = document.getElementById('chart-map');

  // 销售趋势折线图
  if (trendContainer && data.trend) {
    if (trendChart) {
      trendChart.dispose();
    }
    trendChart = echarts.init(trendContainer);

    const trendOption = {
      tooltip: {
        trigger: 'axis',
        formatter: '{b}<br/>销售额: ¥{c}'
      },
      xAxis: {
        type: 'category',
        data: data.trend.map((item: any) => item.date)
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => `¥${(value / 1000).toFixed(1)}k`
        }
      },
      series: [{
        data: data.trend.map((item: any) => item.value),
        type: 'line',
        smooth: true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
            { offset: 1, color: 'rgba(24, 144, 255, 0.05)' }
          ])
        },
        itemStyle: {
          color: '#1890ff'
        },
        lineStyle: {
          color: '#1890ff',
          width: 2
        }
      }]
    };

    trendChart.setOption(trendOption);
  }

  // 商品销量排行榜
  if (rankingContainer && data.ranking) {
    if (rankingChart) {
      rankingChart.dispose();
    }
    rankingChart = echarts.init(rankingContainer);

    const rankingOption = {
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: data.ranking.map((item: any) => item.name)
      },
      series: [{
        type: 'bar',
        data: data.ranking.map((item: any) => ({
          value: item.sales,
          itemStyle: {
            color: '#52c41a'
          }
        })),
        label: {
          show: true,
          position: 'right'
        }
      }]
    };

    rankingChart.setOption(rankingOption);
  }

  // 省份销售热力图（简化版，暂不使用地图数据）
  if (mapContainer && data.provinces) {
    mapContainer.innerHTML = `
      <div class="province-list">
        <h4>省份销售分布</h4>
        ${data.provinces.map((p: any) => `
          <div class="province-item">
            <span class="province-name">${p.name}</span>
            <span class="province-value">¥${(p.value || 0).toFixed(2)}</span>
            <div class="province-bar" style="width: ${(p.value / Math.max(...data.provinces.map((item: any) => item.value || 1))) * 100}%"></div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

/**
 * 加载看板数据
 */
async function loadDashboardData() {
  try {
    const response = await fetch('http://localhost:4000/dashboardStats');
    const data = await response.json();

    updateMetrics(data);
    renderCharts(data);
  } catch (error) {
    console.error('[app-dashboard] Failed to load dashboard data:', error);
  }
}

/**
 * 启动数据轮询
 */
function startPolling() {
  pollingTimer = setInterval(() => {
    console.log('[app-dashboard] polling data...');
    loadDashboardData();
  }, 60000);
}

/**
 * 停止数据轮询
 */
function stopPolling() {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
}

/**
 * 使用 renderWithQiankun 包装生命周期钩子
 */
renderWithQiankun({
  bootstrap() {
    console.log('[app-dashboard] bootstrap');
  },

  mount(props: MicroAppProps) {
    console.log('[app-dashboard] mount', props);

    // 优先使用 qiankun 传入的容器
    const targetContainer = props.container as HTMLElement;

    if (targetContainer) {
      // 容器可用，直接初始化
      initDashboard(targetContainer);
    } else {
      // 容器不可用，尝试通过 ID 查找
      console.log('[app-dashboard] Container not provided, searching by ID...');
      const foundContainer = document.getElementById('subapp-dashboard');

      if (foundContainer) {
        // 找到容器，初始化
        initDashboard(foundContainer);
      } else {
        // 未找到容器，记录错误
        console.error('[app-dashboard] Container #subapp-dashboard not found!');
      }
    }
  },

  unmount(props: MicroAppProps) {
    console.log('[app-dashboard] unmount', props);
    // 清理资源
    disposeDashboard();
  },

  update(props: MicroAppProps) {
    console.log('[app-dashboard] update', props);
    // 可以在这里处理主应用传递的数据更新
  },
});

/**
 * 独立运行时直接挂载到 #app
 */
if (!(window as any).__POWERED_BY_QIANKUN__) {
  const standaloneContainer = document.getElementById('app') as HTMLElement;
  if (standaloneContainer) {
    initDashboard(standaloneContainer);
  }
}

/**
 * 默认导出
 */
export const bootstrap = renderWithQiankun.bootstrap;
export const mount = renderWithQiankun.mount;
export const unmount = renderWithQiankun.unmount;
export const update = renderWithQiankun.update;
