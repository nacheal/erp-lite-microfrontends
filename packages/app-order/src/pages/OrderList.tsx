import React, { useState, useEffect } from 'react';
import type { OrderInfo, OrderStatus } from '../types';
import { getOrderList, updateOrderStatus, cancelOrder } from '../services/api';

/**
 * 订单列表页
 */
export function OrderList() {
  const [orders, setOrders] = useState<OrderInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<OrderStatus | ''>('');

  /**
   * 加载订单列表
   */
  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await getOrderList({
        page,
        pageSize,
        keyword: keyword || undefined,
        status: status || undefined,
      });
      setOrders(response.list);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 搜索订单
   */
  const handleSearch = () => {
    setPage(1);
    loadOrders();
  };

  /**
   * 重置搜索条件
   */
  const handleReset = () => {
    setKeyword('');
    setStatus('');
    setPage(1);
    loadOrders();
  };

  /**
   * 更新订单状态
   */
  const handleUpdateStatus = async (id: number, newStatus: OrderStatus) => {
    if (!confirm(`确定要更新订单状态为 ${getStatusText(newStatus)} 吗？`)) return;

    try {
      await updateOrderStatus(id, newStatus);
      loadOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  /**
   * 取消订单
   */
  const handleCancel = async (id: number) => {
    if (!confirm('确定要取消该订单吗？')) return;

    try {
      await cancelOrder(id);
      loadOrders();
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
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('zh-CN');
  };

  /**
   * 格式化金额
   */
  const formatAmount = (amount: number) => {
    return `¥${amount.toFixed(2)}`;
  };

  useEffect(() => {
    loadOrders();
  }, [page, pageSize]);

  return (
    <div className="order-list">
      <div className="page-header">
        <h1>订单管理</h1>
      </div>

      {/* 搜索表单 */}
      <div className="search-form">
        <div className="form-item">
          <input
            type="text"
            placeholder="搜索订单号、客户姓名或手机号"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <div className="form-item">
          <select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus | '')}>
            <option value="">全部状态</option>
            <option value="pending">待确认</option>
            <option value="confirmed">已确认</option>
            <option value="shipped">已发货</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleSearch}>
            搜索
          </button>
          <button className="btn btn-secondary" onClick={handleReset}>
            重置
          </button>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="table-actions">
        <button className="btn btn-primary">导出订单</button>
      </div>

      {/* 订单表格 */}
      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>订单号</th>
              <th>客户姓名</th>
              <th>客户手机</th>
              <th>订单金额</th>
              <th>状态</th>
              <th>支付方式</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.orderNo}</td>
                <td>{order.customerName}</td>
                <td>{order.customerPhone}</td>
                <td>{formatAmount(order.totalAmount)}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td>{order.paymentMethod}</td>
                <td>{formatDate(order.createTime)}</td>
                <td>
                  <button className="btn-link" onClick={() => console.log('查看详情', order.id)}>
                    查看
                  </button>
                  {order.status === 'pending' && (
                    <>
                      <button
                        className="btn-link"
                        onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                      >
                        确认
                      </button>
                      <button
                        className="btn-link btn-danger"
                        onClick={() => handleCancel(order.id)}
                      >
                        取消
                      </button>
                    </>
                  )}
                  {order.status === 'confirmed' && (
                    <button
                      className="btn-link"
                      onClick={() => handleUpdateStatus(order.id, 'shipped')}
                    >
                      发货
                    </button>
                  )}
                  {order.status === 'shipped' && (
                    <button
                      className="btn-link"
                      onClick={() => handleUpdateStatus(order.id, 'completed')}
                    >
                      完成
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 分页 */}
      <div className="pagination">
        <span className="pagination-info">
          共 {total} 条记录，当前第 {page} 页
        </span>
        <div className="pagination-buttons">
          <button
            className="btn btn-sm"
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            首页
          </button>
          <button
            className="btn btn-sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            上一页
          </button>
          <button
            className="btn btn-sm"
            onClick={() => setPage((p) => Math.min(Math.ceil(total / pageSize), p + 1))}
            disabled={page >= Math.ceil(total / pageSize)}
          >
            下一页
          </button>
          <button
            className="btn btn-sm"
            onClick={() => setPage(Math.ceil(total / pageSize))}
            disabled={page >= Math.ceil(total / pageSize)}
          >
            末页
          </button>
        </div>
      </div>

      <style>{`
        .order-list {
          padding: 20px;
        }
        .page-header {
          margin-bottom: 20px;
        }
        .page-header h1 {
          margin: 0;
          font-size: 24px;
          color: #333;
        }
        .search-form {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          padding: 20px;
          background: #f5f5f5;
          border-radius: 4px;
        }
        .form-item {
          display: flex;
        }
        .form-item input,
        .form-item select {
          padding: 8px 12px;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          font-size: 14px;
          min-width: 200px;
        }
        .form-actions {
          display: flex;
          gap: 8px;
        }
        .table-actions {
          margin-bottom: 16px;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
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
        .data-table tr:hover {
          background: #fafafa;
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
        .btn {
          padding: 8px 16px;
          border: 1px solid transparent;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          background: #fff;
          transition: all 0.3s;
        }
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .btn-primary {
          background: #1890ff;
          color: #fff;
          border-color: #1890ff;
        }
        .btn-primary:hover:not(:disabled) {
          background: #40a9ff;
          border-color: #40a9ff;
        }
        .btn-secondary {
          border-color: #d9d9d9;
        }
        .btn-secondary:hover:not(:disabled) {
          border-color: #1890ff;
          color: #1890ff;
        }
        .btn-sm {
          padding: 4px 12px;
          font-size: 12px;
        }
        .btn-link {
          background: none;
          border: none;
          color: #1890ff;
          cursor: pointer;
          padding: 4px 8px;
          font-size: 14px;
        }
        .btn-link:hover {
          color: #40a9ff;
          text-decoration: underline;
        }
        .btn-danger {
          color: #ff4d4f;
        }
        .btn-danger:hover {
          color: #ff7875;
        }
        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
        }
        .pagination-info {
          color: #666;
          font-size: 14px;
        }
        .pagination-buttons {
          display: flex;
          gap: 8px;
        }
        .loading {
          padding: 40px;
          text-align: center;
          color: #999;
        }
      `}</style>
    </div>
  );
}
