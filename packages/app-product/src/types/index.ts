/**
 * app-product 类型定义
 */

export interface ProductInfo {
  id: number;
  name: string;
  code: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  description?: string;
  images?: string[];
  createTime: string;
  updateTime: string;
}

export interface CategoryInfo {
  id: number;
  name: string;
  code: string;
  parentId?: number;
  sort: number;
  children?: CategoryInfo[];
  createTime: string;
}

export interface ProductListParams {
  page: number;
  pageSize: number;
  keyword?: string;
  category?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductListResponse {
  list: ProductInfo[];
  total: number;
  page: number;
  pageSize: number;
}
