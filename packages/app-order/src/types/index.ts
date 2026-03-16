/**
 * app-order 类型定义
 */

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'completed'
  | 'cancelled';

export interface OrderInfo {
  id: number;
  orderNo: string;
  userId?: number; // 下单用户ID（用于跨应用跳转）
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentTime?: string;
  shipmentTime?: string;
  completedTime?: string;
  createTime: string;
  updateTime: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  productCode: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderListParams {
  page: number;
  pageSize: number;
  keyword?: string;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
}

export interface OrderListResponse {
  list: OrderInfo[];
  total: number;
  page: number;
  pageSize: number;
}
