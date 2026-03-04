import type { MicroAppLifeCycles, MicroAppProps } from '@erp-lite/types';

let container: HTMLElement | null = null;
let styleElement: HTMLStyleElement | null = null;
let pollingTimer: ReturnType<typeof setInterval> | null = null;
let charts: any[] = [];

export async function bootstrap() {
  console.log('[app-dashboard] bootstrap');
}

export async function mount(props: MicroAppProps) {
  console.log('[app-dashboard] mount', props);
  container = props.container as HTMLElement;

  if (!styleElement) {
    styleElement = document.createElement('style');
    document.head.appendChild(styleElement);
  }

  renderDashboard();
  startPolling();
}

export async function unmount(props: MicroAppProps) {
  console.log('[app-dashboard] unmount', props);
  stopPolling();
  disposeCharts();

  if (container) {
    container.innerHTML = '';
    container = null;
  }

  if (styleElement && styleElement.parentNode) {
    styleElement.parentNode.removeChild(styleElement);
    styleElement = null;
  }
}

function renderDashboard() {
  if (!container) return;

  container.innerHTML = `
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
      </div>

      <div class="chart-card chart-full">
        <div class="chart-header">
          <h3>省份销售热力图</h3>
        </div>
        <div id="chart-map" class="chart-container chart-map-container"></div>
      </div>
    </div>
  `;

  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadDashboardData();
    });
  }

  loadDashboardData();
}

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

function renderCharts(data: any) {
  const trendContainer = document.getElementById('chart-trend');
  const rankingContainer = document.getElementById('chart-ranking');
  const mapContainer = document.getElementById('chart-map');

  if (trendContainer && data.trend) {
    trendContainer.innerHTML = `
      <div class="simple-chart">
        <div class="chart-title">销售趋势</div>
        <div class="chart-data">
          ${data.trend.map((item: any) => `
            <div class="bar-item">
              <div class="bar" style="height: ${(item.value / Math.max(...data.trend.map((t: any) => t.value))) * 80}%"></div>
              <div class="bar-label">${item.date}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (rankingContainer && data.ranking) {
    rankingContainer.innerHTML = `
      <div class="ranking-list">
        ${data.ranking.map((item: any, index: number) => `
          <div class="ranking-item">
            <span class="ranking-number">${index + 1}</span>
            <span class="ranking-name">${item.name}</span>
            <span class="ranking-value">${item.sales}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (mapContainer && data.provinces) {
    mapContainer.innerHTML = `
      <div class="map-placeholder">
        <p>地图图表功能需要引入 ECharts 中国地图数据</p>
        <p>当前省份销售数据：</p>
        ${data.provinces ? data.provinces.map((p: any) => `
          <div class="province-item">
            <span>${p.name}</span>
            <span>¥${(p.value || 0).toFixed(2)}</span>
          </div>
        `).join('') : '<p>暂无数据</p>'}
      </div>
    `;
  }
}

function startPolling() {
  pollingTimer = setInterval(() => {
    console.log('[app-dashboard] polling data...');
    loadDashboardData();
  }, 60000);
}

function stopPolling() {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
}

function disposeCharts() {
  charts.forEach(chart => {
    if (chart && typeof chart.dispose === 'function') {
      chart.dispose();
    }
  });
  charts = [];
}

if (!(window as any).__POWERED_BY_QIANKUN__) {
  mount({ container: document.getElementById('app') as HTMLElement } as MicroAppProps);
}
