/**
 * app-user API 服务
 */

import type { UserInfo, RoleInfo, DepartmentInfo, OperationLog, UserListParams, UserListResponse } from '../types';

const API_BASE_URL = 'http://localhost:4000';

/**
 * 获取用户列表
 */
export async function getUserList(params: UserListParams): Promise<UserListResponse> {
  const query = new URLSearchParams();
  query.append('_page', String(params.page));
  query.append('_limit', String(params.pageSize));
  if (params.keyword) query.append('q', params.keyword);
  if (params.status) query.append('status', params.status);

  const response = await fetch(`${API_BASE_URL}/users?${query.toString()}`);
  const data = await response.json();

  // json-server 返回的格式需要调整
  return {
    list: data,
    total: parseInt(response.headers.get('X-Total-Count') || '0', 10),
    page: params.page,
    pageSize: params.pageSize,
  };
}

/**
 * 获取用户详情
 */
export async function getUserDetail(id: number): Promise<UserInfo> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`);
  return response.json();
}

/**
 * 创建用户
 */
export async function createUser(user: Partial<UserInfo>): Promise<UserInfo> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...user,
      createTime: new Date().toISOString(),
      status: user.status || 'active',
    }),
  });
  return response.json();
}

/**
 * 更新用户
 */
export async function updateUser(id: number, user: Partial<UserInfo>): Promise<UserInfo> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  return response.json();
}

/**
 * 删除用户
 */
export async function deleteUser(id: number): Promise<void> {
  await fetch(`${API_BASE_URL}/users/${id}`, { method: 'DELETE' });
}

/**
 * 获取角色列表
 */
export async function getRoleList(): Promise<RoleInfo[]> {
  const response = await fetch(`${API_BASE_URL}/roles`);
  return response.json();
}

/**
 * 获取部门列表
 */
export async function getDepartmentList(): Promise<DepartmentInfo[]> {
  const response = await fetch(`${API_BASE_URL}/departments`);
  return response.json();
}

/**
 * 获取用户操作日志
 */
export async function getOperationLogs(userId: number): Promise<OperationLog[]> {
  const response = await fetch(`${API_BASE_URL}/operationLogs?userId=${userId}`);
  return response.json();
}
