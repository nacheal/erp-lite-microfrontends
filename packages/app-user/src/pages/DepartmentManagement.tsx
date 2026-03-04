import React, { useState, useEffect } from 'react';
import type { DepartmentInfo } from '../types';
import { getDepartmentList } from '../services/api';

/**
 * 部门管理页面
 */
export function DepartmentManagement() {
  const [departments, setDepartments] = useState<DepartmentInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentInfo | null>(null);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  /**
   * 加载部门列表
   */
  const loadDepartments = async () => {
    setLoading(true);
    try {
      const data = await getDepartmentList();
      setDepartments(data);
    } catch (error) {
      console.error('Failed to load departments:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 切换展开状态
   */
  const toggleExpand = (id: number) => {
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter((item) => item !== id));
    } else {
      setExpandedIds([...expandedIds, id]);
    }
  };

  /**
   * 新增部门
   */
  const handleAdd = () => {
    setEditingDept({
      id: 0,
      name: '',
      code: '',
      parentId: null,
      sort: 0,
      createTime: new Date().toISOString(),
    } as any);
  };

  /**
   * 编辑部门
   */
  const handleEdit = (dept: DepartmentInfo) => {
    setEditingDept({ ...dept });
  };

  /**
   * 删除部门
   */
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除该部门吗？')) return;

    try {
      // TODO: 调用删除部门 API
      alert('部门删除成功');
      loadDepartments();
    } catch (error) {
      console.error('Failed to delete department:', error);
      alert('删除失败，请重试');
    }
  };

  /**
   * 保存部门
   */
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingDept.name || !editingDept.name.trim()) {
      alert('请输入部门名称');
      return;
    }

    if (!editingDept.code || !editingDept.code.trim()) {
      alert('请输入部门代码');
      return;
    }

    alert('部门保存成功');
    setEditingDept(null);
    loadDepartments();
  };

  /**
   * 取消编辑
   */
  const handleCancel = () => {
    setEditingDept(null);
  };

  /**
   * 渲染树形结构
   */
  const renderTree = (departments: DepartmentInfo[], level = 0) => {
    return departments.map((dept) => {
      const isExpanded = expandedIds.includes(dept.id);
      const hasChildren = dept.children && dept.children.length > 0;

      return (
        <div key={dept.id} className="tree-node" style={{ paddingLeft: `${level * 20}px` }}>
          <div className="tree-content">
            <span className="tree-toggle" onClick={() => hasChildren ? toggleExpand(dept.id) : undefined}>
              {hasChildren && <span className="tree-icon">{isExpanded ? '▼' : '▶'}</span>}
              <span className="tree-label">{dept.name}</span>
            </span>
            <div className="tree-actions">
              <button className="btn-link btn-sm" onClick={() => handleEdit(dept)}>
                编辑
              </button>
              <button className="btn-link btn-danger btn-sm" onClick={() => handleDelete(dept.id)}>
                删除
              </button>
            </div>
          </div>
          {hasChildren && isExpanded && renderTree(dept.children, level + 1)}
        </div>
      );
    });
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  return (
    <div className="department-management">
      <div className="page-header">
        <h1>部门管理</h1>
        <button className="btn btn-primary" onClick={handleAdd}>
          + 新增部门
        </button>
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <div className="tree-container">
          {renderTree(departments)}
        </div>
      )}

      {editingDept && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingDept.id ? '编辑部门' : '新增部门'}</h3>
              <button className="modal-close" onClick={handleCancel}>
                ×
              </button>
            </div>
            <form className="modal-body" onSubmit={handleSave}>
              <div className="form-item">
                <label>部门名称 *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="请输入部门名称"
                  value={editingDept.name || ''}
                  onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                  autoFocus
                  required
                />
              </div>
              <div className="form-item">
                <label>部门代码 *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="请输入部门代码"
                  value={editingDept.code || ''}
                  onChange={(e) => setEditingDept({ ...editingDept, code: e.target.value })}
                  required
                />
              </div>
              <div className="form-item">
                <label>排序</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="请输入排序"
                  value={editingDept.sort || 0}
                  onChange={(e) => setEditingDept({ ...editingDept, sort: parseInt(e.target.value) })}
                  min={0}
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
        .department-management {
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
        .loading {
          padding: 40px;
          text-align: center;
          color: #999;
        }
        .tree-container {
          background: #fff;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }
        .tree-node {
          margin-top: 8px;
        }
        .tree-content {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          border: 1px solid #f0f0f0;
          border-radius: 4px;
          transition: background 0.3s;
        }
        .tree-content:hover {
          background: #fafafa;
        }
        .tree-toggle {
          cursor: pointer;
          color: #666;
          user-select: none;
        }
        .tree-icon {
          display: inline-block;
          width: 16px;
          text-align: center;
        }
        .tree-label {
          font-size: 14px;
          color: #333;
          flex: 1;
        }
        .tree-actions {
          display: flex;
          gap: 8px;
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
        .btn-sm {
          padding: 4px 8px;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}
