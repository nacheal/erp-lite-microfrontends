import React, { useState, useEffect } from 'react';
import type { UserInfo } from '../types';
import { createUser, updateUser, getRoleList, getDepartmentList } from '../services/api';

/**
 * 用户表单页面
 * 支持新增和编辑两种模式
 */
export function UserForm() {
  const [user, setUser] = useState<Partial<UserInfo>>({
    username: '',
    email: '',
    phone: '',
    role: '普通用户',
    department: '销售部',
    status: 'active',
  });
  const [roles, setRoles] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // 获取初始数据
  useEffect(() => {
    const loadInitialData = async () => {
      // 加载角色和部门列表
      const [rolesData, departmentsData] = await Promise.all([
        getRoleList(),
        getDepartmentList(),
      ]);
      setRoles(rolesData);
      setDepartments(departmentsData);

      // 判断是编辑模式
      const params = new URLSearchParams(window.location.search);
      const userId = params.get('id');

      if (userId) {
        setIsEditMode(true);
        setLoading(true);
        try {
          // TODO: 这里需要添加 getUserDetail API
          // const userData = await getUserDetail(parseInt(userId));
          // setUser(userData);
        } catch (error) {
          console.error('Failed to load user detail:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setIsEditMode(false);
      }
    };

    loadInitialData();
  }, []);

  /**
   * 处理表单提交
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 基础验证
    if (!user.username || !user.username.trim()) {
      alert('请输入用户名');
      return;
    }

    if (!user.email || !user.email.trim()) {
      alert('请输入邮箱');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      alert('请输入正确的邮箱格式');
      return;
    }

    if (!user.phone || !user.phone.trim()) {
      alert('请输入手机号');
      return;
    }

    setSaving(true);
    try {
      if (isEditMode) {
        // 编辑模式
        const params = new URLSearchParams(window.location.search);
        const userId = params.get('id');
        // TODO: 调用 updateUser API
        // await updateUser(parseInt(userId), user);
        alert('用户更新成功');
      } else {
        // 新增模式
        // TODO: 调用 createUser API
        // await createUser(user);
        alert('用户创建成功');
      }

      // 返回列表页
      window.history.back();
    } catch (error) {
      console.error('Failed to save user:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  /**
   * 处理取消
   */
  const handleCancel = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="user-form">
        <div className="loading">加载中...</div>
        <style>{`
          .loading {
            padding: 40px;
            text-align: center;
            color: #999;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="user-form">
      <div className="page-header">
        <button className="btn btn-secondary" onClick={handleCancel}>
          ← 返回
        </button>
        <h1>{isEditMode ? '编辑用户' : '新增用户'}</h1>
      </div>

      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-item">
            <label className="form-label">用户名 *</label>
            <input
              type="text"
              className="form-input"
              placeholder="请输入用户名"
              value={user.username || ''}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-item">
            <label className="form-label">邮箱 *</label>
            <input
              type="email"
              className="form-input"
              placeholder="请输入邮箱"
              value={user.email || ''}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-item">
            <label className="form-label">手机号 *</label>
            <input
              type="tel"
              className="form-input"
              placeholder="请输入手机号"
              value={user.phone || ''}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-item">
            <label className="form-label">角色</label>
            <select
              className="form-input"
              value={user.role || ''}
              onChange={(e) => setUser({ ...user, role: e.target.value })}
            >
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-item">
            <label className="form-label">部门</label>
            <select
              className="form-input"
              value={user.department || ''}
              onChange={(e) => setUser({ ...user, department: e.target.value })}
            >
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-item">
            <label className="form-label">状态</label>
            <select
              className="form-input"
              value={user.status || 'active'}
              onChange={(e) => setUser({ ...user, status: e.target.value as any })}
            >
              <option value="active">正常</option>
              <option value="inactive">禁用</option>
              <option value="locked">锁定</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={saving}
          >
            取消
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </form>

      <style>{`
        .user-form {
          padding: 20px;
        }
        .page-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }
        .page-header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          color: #333;
        }
        .form-container {
          max-width: 600px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          padding: 32px;
        }
        .form-row {
          margin-bottom: 20px;
        }
        .form-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-label {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }
        .form-input {
          padding: 10px 12px;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          font-size: 14px;
          transition: all 0.3s;
        }
        .form-input:focus {
          outline: none;
          border-color: #1890ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #f0f0f0;
        }
        .btn {
          padding: 10px 24px;
          border: 1px solid transparent;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn:disabled {
          opacity: 0.6;
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
          color: #333;
        }
        .btn-secondary:hover:not(:disabled) {
          border-color: #1890ff;
          color: #1890ff;
        }
      `}</style>
    </div>
  );
}
