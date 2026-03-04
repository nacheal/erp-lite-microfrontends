/**
 * app-user 类型定义
 */

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  phone: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'locked';
  role: string;
  department: string;
  createTime: string;
  lastLoginTime?: string;
}

export interface RoleInfo {
  id: number;
  name: string;
  code: string;
  description: string;
  permissions: string[];
  createTime: string;
}

export interface DepartmentInfo {
  id: number;
  name: string;
  code: string;
  parentId?: number;
  children?: DepartmentInfo[];
  createTime: string;
}

export interface UserListParams {
  page: number;
  pageSize: number;
  keyword?: string;
  status?: string;
  departmentId?: number;
}

export interface UserListResponse {
  list: UserInfo[];
  total: number;
  page: number;
  pageSize: number;
}

export interface OperationLog {
  id: number;
  userId: number;
  username: string;
  operation: string;
  ip: string;
  createTime: string;
}
