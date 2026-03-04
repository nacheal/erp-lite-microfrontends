import React, { useState, useEffect } from 'react';
import type { UserInfo } from '../types';
import { getUserList, deleteUser } from '../services/api';

/**
 * 用户列表页
 */
export function UserList() {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');

  /**
   * 加载用户列表
   */
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await getUserList({
        page,
        pageSize,
        keyword,
        status: status || undefined,
      });
      setUsers(response.list);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 搜索用户
   */
  const handleSearch = () => {
    setPage(1);
    loadUsers();
  };

  /**
   * 重置搜索条件
   */
  const handleReset = () => {
    setKeyword('');
    setStatus('');
    setPage(1);
    loadUsers();
  };

  /**
   * 删除用户
   */
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除该用户吗？')) return;

    try {
      await deleteUser(id);
      loadUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  /**
   * 格式化状态
   */
  const formatStatus = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
      active: { text: '正常', className: 'status-active' },
      inactive: { text: '禁用', className: 'status-inactive' },
      locked: { text: '锁定', className: 'status-locked' },
    };
    return statusMap[status] || { text: status, className: '' };
  };

  /**
   * 格式化时间
   */
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('zh-CN');
  };

  useEffect(() => {
    loadUsers();
  }, [page, pageSize]);

  return (
    <div className="user-list">
      <div className="page-header">
        <h1>用户管理</h1>
      </div>

      {/* 搜索表单 */}
      <div className="search-form">
        <div className="form-item">
          <input
            type="text"
            placeholder="搜索用户名、邮箱或手机号"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <div className="form-item">
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">全部状态</option>
            <option value="active">正常</option>
            <option value="inactive">禁用</option>
            <option value="locked">锁定</option>
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
        <button className="btn btn-primary">新增用户</button>
      </div>

      {/* 用户表格 */}
      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>用户名</th>
              <th>邮箱</th>
              <th>手机号</th>
              <th>角色</th>
              <th>部门</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>{user.department}</td>
                <td>
                  <span className={`status-badge ${formatStatus(user.status).className}`}>
                    {formatStatus(user.status).text}
                  </span>
                </td>
                <td>{formatDate(user.createTime)}</td>
                <td>
                  <button className="btn-link" onClick={() => window.history.pushState(null, '', `/user/detail?id=${user.id}`)}>
                    查看
                  </button>
                  <button className="btn-link" onClick={() => window.history.pushState(null, '', `/user/form?id=${user.id}`)}>
                    编辑
                  </button>
                  <button className="btn-link btn-danger" onClick={() => handleDelete(user.id)}>
                    删除
                  </button>
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
        .user-list {
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
        .status-active {
          background: #e6f7ff;
          color: #1890ff;
        }
        .status-inactive {
          background: #fff1f0;
          color: #ff4d4f;
        }
        .status-locked {
          background: #fffbe6;
          color: #faad14;
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
