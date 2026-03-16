import React, { useState, useEffect } from 'react';
import type { OrderInfo, OrderStatus } from '../types';
import { getOrderDetail, updateOrderStatus, cancelOrder } from '../services/api';
import { useGlobalState } from '../qiankun';

/**
 * 订单详情页
 */
export function OrderDetail() {
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const { setGlobalState } = useGlobalState();

  // 从 URL 参数获取订单 ID
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('id');

  /**
   * 加载订单详情
   */
  const loadOrderDetail = async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const data = await getOrderDetail(Number(orderId));
      setOrder(data);
    } catch (error) {
      console.error('Failed to load order detail:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 更新订单状态
   */
  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    if (!order || !confirm(`确定要更新订单状态为 ${getStatusText(newStatus)} 吗？`)) return;

    try {
      const updated = await updateOrderStatus(order.id, newStatus);
      setOrder(updated);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  /**
   * 取消订单
   */
  const handleCancel = async () => {
    if (!order || !confirm('确定要取消该订单吗？')) return;

    try {
      const updated = await cancelOrder(order.id);
      setOrder(updated);
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  };

  /**
   * 格式化状态
   */
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: '待确认',
      confirmed: '已确认',
      shipped: '已发货',
      completed: '已完成',
      cancelled: '已取消',
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status: string) => {
    const classMap: Record<string, string> = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      shipped: 'status-shipped',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
    };
    return classMap[status] || '';
  };

  /**
   * 格式化时间
   */
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('zh-CN');
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

  /**
   * 跨应用跳转到用户详情页
   */
  const handleViewUser = () => {
    if (!order?.userId) {
      alert('该订单没有关联用户信息');
      return;
    }
    console.log('[app-order] 触发跨应用跳转到用户详情页，用户ID:', order.userId);
    // 通过全局状态通知主应用跳转
    window.location.href = `/user?id=${order.userId}`;
  };

  useEffect(() => {
    loadOrderDetail();
  }, [orderId]);

  if (loading) {
    return <div className="order-detail loading">加载中...</div>;
  }

  if (!order) {
    return <div className="order-detail">订单不存在</div>;
  }

  // 构建状态流转时间线
  const timeline = [
    { key: 'createTime', label: '创建订单', time: order.createTime, done: true },
    { key: 'paymentTime', label: '已支付', time: order.paymentTime, done: !!order.paymentTime },
    { key: 'shipmentTime', label: '已发货', time: order.shipmentTime, done: !!order.shipmentTime },
    { key: 'completedTime', label: '已完成', time: order.completedTime, done: !!order.completedTime },
  ];

  return (
    <div className="order-detail">
      <div className="page-header">
        <button className="btn btn-secondary" onClick={handleBack}>
          返回列表
        </button>
        <h1>订单详情</h1>
      </div>

      {/* 订单基本信息 */}
      <div className="section">
        <h3>基本信息</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="label">订单号：</span>
            <span className="value">{order.orderNo}</span>
          </div>
          <div className="info-item">
            <span className="label">订单状态：</span>
            <span className={`status-badge ${getStatusClass(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>
          <div className="info-item">
            <span className="label">客户姓名：</span>
            <span className="value">
              {order.customerName}
              {order.userId && (
                <button
                  className="btn-link"
                  onClick={handleViewUser}
                  style={{ marginLeft: '8px' }}
                >
                  查看用户详情 →
                </button>
              )}
            </span>
          </div>
          <div className="info-item">
            <span className="label">客户手机：</span>
            <span className="value">{order.customerPhone}</span>
          </div>
          <div className="info-item">
            <span className="label">客户邮箱：</span>
            <span className="value">{order.customerEmail || '-'}</span>
          </div>
          <div className="info-item">
            <span className="label">收货地址：</span>
            <span className="value">{order.address}</span>
          </div>
          <div className="info-item">
            <span className="label">支付方式：</span>
            <span className="value">{order.paymentMethod}</span>
          </div>
          <div className="info-item">
            <span className="label">订单金额：</span>
            <span className="value highlight">{formatAmount(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* 状态流转 */}
      <div className="section">
        <h3>状态流转</h3>
        <div className="timeline">
          {timeline.map((item, index) => (
            <div key={item.key} className={`timeline-item ${item.done ? 'done' : ''}`}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-label">{item.label}</div>
                <div className="timeline-time">{formatDate(item.time)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 商品明细 */}
      <div className="section">
        <h3>商品明细</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>商品编码</th>
              <th>商品名称</th>
              <th>单价</th>
              <th>数量</th>
              <th>小计</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td>{item.productCode}</td>
                <td>{item.productName}</td>
                <td>{formatAmount(item.price)}</td>
                <td>{item.quantity}</td>
                <td>{formatAmount(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                合计：
              </td>
              <td style={{ fontWeight: 'bold' }}>
                {formatAmount(order.totalAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* 操作按钮 */}
      <div className="section-actions">
        {order.status === 'pending' && (
          <>
            <button
              className="btn btn-primary"
              onClick={() => handleUpdateStatus('confirmed')}
            >
              确认订单
            </button>
            <button className="btn btn-danger" onClick={handleCancel}>
              取消订单
            </button>
          </>
        )}
        {order.status === 'confirmed' && (
          <button
            className="btn btn-primary"
            onClick={() => handleUpdateStatus('shipped')}
          >
            发货
          </button>
        )}
        {order.status === 'shipped' && (
          <button
            className="btn btn-primary"
            onClick={() => handleUpdateStatus('completed')}
          >
            完成订单
          </button>
        )}
      </div>

      <style>{`
        .order-detail {
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
        .section {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .section h3 {
          margin: 0 0 16px 0;
          font-size: 16px;
          color: #333;
          font-weight: 600;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
        }
        .info-item {
          display: flex;
          align-items: flex-start;
        }
        .info-item .label {
          color: #666;
          min-width: 100px;
          flex-shrink: 0;
        }
        .info-item .value {
          color: #333;
          font-weight: 500;
        }
        .info-item .value.highlight {
          color: #ff4d4f;
          font-size: 18px;
          font-weight: 600;
        }
        .timeline {
          display: flex;
          gap: 30px;
        }
        .timeline-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        .timeline-item:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 12px;
          left: 50%;
          width: 100%;
          height: 2px;
          background: #e8e8e8;
        }
        .timeline-item.done:not(:last-child)::after {
          background: #1890ff;
        }
        .timeline-dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #e8e8e8;
          margin-bottom: 8px;
          position: relative;
          z-index: 1;
        }
        .timeline-item.done .timeline-dot {
          background: #1890ff;
        }
        .timeline-content {
          text-align: center;
        }
        .timeline-label {
          font-size: 14px;
          color: #333;
          margin-bottom: 4px;
        }
        .timeline-time {
          font-size: 12px;
          color: #999;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
        }
        .data-table th,
        .data-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #f0f0f0;
        }
        .data-table th {
          background: #fafafa;
          font-weight: 600;
          color: #333;
        }
        .data-table tfoot td {
          background: #fafafa;
          font-weight: 600;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }
        .status-pending {
          background: #fffbe6;
          color: #faad14;
        }
        .status-confirmed {
          background: #e6f7ff;
          color: #1890ff;
        }
        .status-shipped {
          background: #f6ffed;
          color: #52c41a;
        }
        .status-completed {
          background: #f0f0f0;
          color: #666;
        }
        .status-cancelled {
          background: #fff1f0;
          color: #ff4d4f;
        }
        .section-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        .btn {
          padding: 8px 20px;
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
        .btn-danger {
          background: #ff4d4f;
          color: #fff;
          border-color: #ff4d4f;
        }
        .btn-danger:hover {
          background: #ff7875;
          border-color: #ff7875;
        }
        .loading {
          padding: 40px;
          text-align: center;
          color: #999;
        }
        .btn-link {
          background: none;
          border: none;
          color: #1890ff;
          cursor: pointer;
          font-size: 14px;
          padding: 0;
          text-decoration: none;
        }
        .btn-link:hover {
          color: #40a9ff;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
