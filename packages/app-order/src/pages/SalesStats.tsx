import React, { useState, useEffect, useRef } from 'react';
import { getOrderList } from '../services/api';

/**
 * 销售统计页
 */
export function SalesStats() {
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [chartData, setChartData] = useState<{ date: string; value: number; count: number }[]>([]);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalAmount: 0,
    avgAmount: 0,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * 加载统计数据
   */
  const loadStats = async () => {
    setLoading(true);
    try {
      // 获取近 30 天的所有订单
      const response = await getOrderList({ page: 1, pageSize: 1000 });
      const orders = response.list;

      // 按日期分组统计
      const groupedData = groupOrdersByDate(orders, period);

      // 计算汇总数据
      const totalOrders = orders.length;
      const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      const avgAmount = totalOrders > 0 ? totalAmount / totalOrders : 0;

      setChartData(groupedData);
      setSummary({ totalOrders, totalAmount, avgAmount });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 按日期分组订单
   */
  const groupOrdersByDate = (orders: any[], period: 'day' | 'week' | 'month') => {
    const now = new Date();
    const groupMap = new Map<string, { value: number; count: number }>();

    // 根据周期确定数据点数量
    const days = period === 'day' ? 30 : period === 'week' ? 12 : 12;
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - days);

    orders.forEach((order) => {
      const orderDate = new Date(order.createTime);
      if (orderDate < startDate) return;

      let key = '';
      if (period === 'day') {
        key = `${orderDate.getMonth() + 1}/${orderDate.getDate()}`;
      } else if (period === 'week') {
        const weekNum = Math.floor((orderDate.getDate() - 1) / 7) + 1;
        key = `第${weekNum}周`;
      } else {
        key = `${orderDate.getMonth() + 1}月`;
      }

      if (!groupMap.has(key)) {
        groupMap.set(key, { value: 0, count: 0 });
      }
      const group = groupMap.get(key)!;
      group.value += order.totalAmount;
      group.count += 1;
    });

    // 转换为数组并按日期排序
    return Array.from(groupMap.entries()).map(([date, data]) => ({
      date,
      value: data.value,
      count: data.count,
    }));
  };

  /**
   * 绘制折线图
   */
  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas || !chartData.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = canvas.parentElement?.clientWidth || 800;
    const height = canvas.height = 400;
    const padding = { top: 40, right: 40, bottom: 60, left: 80 };

    // 清空画布
    ctx.clearRect(0, 0, width, height);

    // 计算最大值
    const maxValue = Math.max(...chartData.map(d => d.value)) * 1.1;
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // 绘制网格线
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i;
      const value = maxValue - (maxValue / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Y 轴标签
      ctx.fillStyle = '#999';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`¥${(value / 1000).toFixed(1)}k`, padding.left - 10, y + 4);
    }

    // 绘制数据点和折线
    const pointWidth = chartWidth / (chartData.length - 1 || 1);
    const points = chartData.map((d, i) => ({
      x: padding.left + i * pointWidth,
      y: padding.top + chartHeight - (d.value / maxValue) * chartHeight,
      ...d,
    }));

    // 绘制渐变区域
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, 'rgba(24, 144, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(24, 144, 255, 0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding.bottom);
    points.forEach((p, i) => {
      if (i === 0) {
        ctx.lineTo(p.x, p.y);
      } else {
        // 贝塞尔曲线平滑
        const prev = points[i - 1];
        const cp1x = prev.x + (p.x - prev.x) / 2;
        const cp1y = prev.y;
        const cp2x = prev.x + (p.x - prev.x) / 2;
        const cp2y = p.y;
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p.x, p.y);
      }
    });
    ctx.lineTo(points[points.length - 1].x, height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // 绘制折线
    ctx.strokeStyle = '#1890ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    points.forEach((p, i) => {
      if (i === 0) {
        ctx.moveTo(p.x, p.y);
      } else {
        const prev = points[i - 1];
        const cp1x = prev.x + (p.x - prev.x) / 2;
        const cp1y = prev.y;
        const cp2x = prev.x + (p.x - prev.x) / 2;
        const cp2y = p.y;
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p.x, p.y);
      }
    });
    ctx.stroke();

    // 绘制数据点
    points.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.strokeStyle = '#1890ff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // X 轴标签
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    points.forEach((p) => {
      ctx.fillText(p.date, p.x, height - padding.bottom + 20);
    });
  };

  /**
   * 格式化金额
   */
  const formatAmount = (amount: number) => {
    return `¥${amount.toFixed(2)}`;
  };

  /**
   * 返回列表
   */
  const handleBack = () => {
    window.history.pushState(null, '', '/order');
  };

  useEffect(() => {
    loadStats();
  }, [period]);

  useEffect(() => {
    drawChart();
  }, [chartData]);

  useEffect(() => {
    const handleResize = () => {
      drawChart();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [chartData]);

  return (
    <div className="sales-stats">
      <div className="page-header">
        <button className="btn btn-secondary" onClick={handleBack}>
          返回列表
        </button>
        <h1>销售统计</h1>
      </div>

      {/* 统计卡片 */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <div className="card-label">订单总数</div>
            <div className="card-value">{summary.totalOrders}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <div className="card-label">总销售额</div>
            <div className="card-value">{formatAmount(summary.totalAmount)}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <div className="card-label">平均客单价</div>
            <div className="card-value">{formatAmount(summary.avgAmount)}</div>
          </div>
        </div>
      </div>

      {/* 图表控制 */}
      <div className="chart-controls">
        <span>统计周期：</span>
        <button
          className={`btn ${period === 'day' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setPeriod('day')}
        >
          日
        </button>
        <button
          className={`btn ${period === 'week' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setPeriod('week')}
        >
          周
        </button>
        <button
          className={`btn ${period === 'month' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setPeriod('month')}
        >
          月
        </button>
      </div>

      {/* 图表 */}
      <div className="chart-container">
        {loading ? (
          <div className="loading">加载中...</div>
        ) : (
          <canvas ref={canvasRef}></canvas>
        )}
      </div>

      <style>{`
        .sales-stats {
          padding: 20px;
        }
        .page-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          gap: 12px;
        }
        .page-header h1 {
          margin: 0;
          font-size: 24px;
          color: #333;
        }
        .stats-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          color: white;
        }
        .card-icon {
          font-size: 40px;
        }
        .card-content {
          flex: 1;
        }
        .card-label {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 8px;
        }
        .card-value {
          font-size: 28px;
          font-weight: bold;
        }
        .chart-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          padding: 16px;
          background: #f5f5f5;
          border-radius: 4px;
        }
        .chart-controls span {
          color: #666;
          font-size: 14px;
        }
        .chart-container {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .chart-container canvas {
          width: 100%;
          height: 400px;
        }
        .loading {
          text-align: center;
          padding: 40px;
          color: #999;
        }
        .btn {
          padding: 6px 16px;
          border: 1px solid transparent;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          background: #fff;
          transition: all 0.3s;
        }
        .btn-primary {
          background: #1890ff;
          color: #fff;
          border-color: #1890ff;
        }
        .btn-primary:hover {
          background: #40a9ff;
          border-color: #40a9ff;
        }
        .btn-secondary {
          border-color: #d9d9d9;
        }
        .btn-secondary:hover {
          border-color: #1890ff;
          color: #1890ff;
        }
      `}</style>
    </div>
  );
}
