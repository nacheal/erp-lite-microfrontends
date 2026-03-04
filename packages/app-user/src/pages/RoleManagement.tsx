import React, { useState, useEffect } from 'react';
import type { RoleInfo } from '../types';
import { getRoleList } from '../services/api';

/**
 * 角色管理页面
 */
export function RoleManagement() {
  const [roles, setRoles] = useState<RoleInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleInfo | null>(null);

  /**
   * 加载角色列表
   */
  const loadRoles = async () => {
    setLoading(true);
    try {
      const data = await getRoleList();
      setRoles(data);
    } catch (error) {
      console.error('Failed to load roles:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 新增角色
   */
  const handleAdd = () => {
    setEditingRole({
      id: 0,
      name: '',
      code: '',
      description: '',
      permissions: [],
      createTime: new Date().toISOString(),
    } as any);
  };

  /**
   * 编辑角色
   */
  const handleEdit = (role: RoleInfo) => {
    setEditingRole({ ...role });
  };

  /**
   * 删除角色
   */
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除该角色吗？')) return;

    try {
      // TODO: 调用删除角色 API
      alert('角色删除成功');
      loadRoles();
    } catch (error) {
      console.error('Failed to delete role:', error);
      alert('删除失败，请重试');
    }
  };

  /**
   * 保存角色
   */
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingRole.name || !editingRole.name.trim()) {
      alert('请输入角色名称');
      return;
    }

    if (!editingRole.code || !editingRole.code.trim()) {
      alert('请输入角色代码');
      return;
    }

    alert('角色保存成功');
    setEditingRole(null);
    loadRoles();
  };

  /**
   * 取消编辑
   */
  const handleCancel = () => {
    setEditingRole(null);
  };

  useEffect(() => {
    loadRoles();
  }, []);

  return (
    <div className="role-management">
      <div className="page-header">
        <h1>角色管理</h1>
        <button className="btn btn-primary" onClick={handleAdd}>
          + 新增角色
        </button>
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>角色名称</th>
              <th>角色代码</th>
              <th>描述</th>
              <th>权限数量</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td>{role.id}</td>
                <td>{role.name}</td>
                <td>{role.code}</td>
                <td>{role.description}</td>
                <td>{role.permissions?.length || 0}</td>
                <td>{new Date(role.createTime).toLocaleString('zh-CN')}</td>
                <td>
                  <button className="btn-link" onClick={() => handleEdit(role)}>
                    编辑
                  </button>
                  <button
                    className="btn-link btn-danger"
                    onClick={() => handleDelete(role.id)}
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingRole && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingRole.id ? '编辑角色' : '新增角色'}</h3>
              <button className="modal-close" onClick={handleCancel}>
                ×
              </button>
            </div>
            <form className="modal-body" onSubmit={handleSave}>
              <div className="form-item">
                <label>角色名称 *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="请输入角色名称"
                  value={editingRole.name || ''}
                  onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                  autoFocus
                  required
                />
              </div>
              <div className="form-item">
                <label>角色代码 *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="请输入角色代码"
                  value={editingRole.code || ''}
                  onChange={(e) => setEditingRole({ ...editingRole, code: e.target.value })}
                  required
                />
              </div>
              <div className="form-item">
                <label>描述</label>
                <textarea
                  className="form-textarea"
                  placeholder="请输入描述"
                  value={editingRole.description || ''}
                  onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  取消
                </button>
                <button type="submit" className="btn btn-primary">
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .role-management {
          padding: 20px;
        }
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .page-header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          color: #333;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
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
        .loading {
          padding: 40px;
          text-align: center;
          color: #999;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
          width: 500px;
          max-width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #f0f0f0;
        }
        .modal-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }
        .modal-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #999;
        }
        .modal-close:hover {
          color: #333;
        }
        .modal-body {
          padding: 20px;
        }
        .form-item {
          margin-bottom: 16px;
        }
        .form-item label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }
        .form-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          font-size: 14px;
        }
        .form-input:focus {
          outline: none;
          border-color: #1890ff;
        }
        .form-textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
        }
        .form-textarea:focus {
          outline: none;
          border-color: #1890ff;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 20px;
        }
        .btn {
          padding: 8px 20px;
          border: 1px solid transparent;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
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
          color: #333;
        }
        .btn-secondary:hover {
          border-color: #1890ff;
          color: #1890ff;
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
      `}</style>
    </div>
  );
}
