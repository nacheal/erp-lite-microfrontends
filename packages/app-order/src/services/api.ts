/**
 * app-order API 服务
 */

import type { OrderInfo, OrderListParams, OrderListResponse } from '../types';

const API_BASE_URL = 'http://localhost:4000';

/**
 * 获取订单列表
 */
export async function getOrderList(params: OrderListParams): Promise<OrderListResponse> {
  const query = new URLSearchParams();
  query.append('_page', String(params.page));
  query.append('_limit', String(params.pageSize));
  if (params.keyword) query.append('q', params.keyword);
  if (params.status) query.append('status', params.status);
  if (params.startDate) query.append('startDate', params.startDate);
  if (params.endDate) query.append('endDate', params.endDate);

  const response = await fetch(`${API_BASE_URL}/orders?${query.toString()}`);
  const data = await response.json();

  return {
    list: data,
    total: parseInt(response.headers.get('X-Total-Count') || '0', 10),
    page: params.page,
    pageSize: params.pageSize,
  };
}

/**
 * 获取订单详情
 */
export async function getOrderDetail(id: number): Promise<OrderInfo> {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`);
  return response.json();
}

/**
 * 更新订单状态
 */
export async function updateOrderStatus(
  id: number,
  status: string
): Promise<OrderInfo> {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, updateTime: new Date().toISOString() }),
  });
  return response.json();
}

/**
 * 取消订单
 */
export async function cancelOrder(id: number): Promise<OrderInfo> {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'cancelled', updateTime: new Date().toISOString() }),
  });
  return response.json();
}

/**
 * 导出订单
 */
export async function exportOrders(params: OrderListParams): Promise<Blob> {
  const query = new URLSearchParams();
  query.append('_page', String(params.page));
  query.append('_limit', String(params.pageSize));
  if (params.keyword) query.append('q', params.keyword);
  if (params.status) query.append('status', params.status);

  const response = await fetch(`${API_BASE_URL}/orders/export?${query.toString()}`);
  return response.blob();
}
