/**
 * app-product API 服务
 */

import type { ProductInfo, CategoryInfo, ProductListParams, ProductListResponse } from '../types';

const API_BASE_URL = 'http://localhost:4000';

/**
 * 获取商品列表
 */
export async function getProductList(params: ProductListParams): Promise<ProductListResponse> {
  const query = new URLSearchParams();
  query.append('_page', String(params.page));
  query.append('_limit', String(params.pageSize));
  if (params.keyword) query.append('q', params.keyword);
  if (params.category) query.append('category', params.category);
  if (params.status) query.append('status', params.status);

  const response = await fetch(`${API_BASE_URL}/products?${query.toString()}`);
  const data = await response.json();

  return {
    list: data,
    total: parseInt(response.headers.get('X-Total-Count') || '0', 10),
    page: params.page,
    pageSize: params.pageSize,
  };
}

/**
 * 获取商品详情
 */
export async function getProductDetail(id: number): Promise<ProductInfo> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  return response.json();
}

/**
 * 创建商品
 */
export async function createProduct(product: Partial<ProductInfo>): Promise<ProductInfo> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...product,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
      status: product.status || 'active',
    }),
  });
  return response.json();
}

/**
 * 更新商品
 */
export async function updateProduct(id: number, product: Partial<ProductInfo>): Promise<ProductInfo> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...product,
      updateTime: new Date().toISOString(),
    }),
  });
  return response.json();
}

/**
 * 删除商品
 */
export async function deleteProduct(id: number): Promise<void> {
  await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' });
}

/**
 * 获取分类列表
 */
export async function getCategoryList(): Promise<CategoryInfo[]> {
  const response = await fetch(`${API_BASE_URL}/categories`);
  return response.json();
}

/**
 * 创建分类
 */
export async function createCategory(category: Partial<CategoryInfo>): Promise<CategoryInfo> {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...category,
      createTime: new Date().toISOString(),
    }),
  });
  return response.json();
}

/**
 * 更新分类
 */
export async function updateCategory(id: number, category: Partial<CategoryInfo>): Promise<CategoryInfo> {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  });
  return response.json();
}

/**
 * 删除分类
 */
export async function deleteCategory(id: number): Promise<void> {
  await fetch(`${API_BASE_URL}/categories/${id}`, { method: 'DELETE' });
}

/**
 * 调整库存
 */
export async function adjustStock(productId: number, adjustment: number): Promise<ProductInfo> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stock: adjustment }),
  });
  return response.json();
}
