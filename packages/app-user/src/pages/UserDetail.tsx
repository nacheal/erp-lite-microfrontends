import React, { useState, useEffect } from 'react';
import type { UserInfo, OperationLog } from '../types';
import { getUserDetail, getOperationLogs } from '../services/api';
import { UserList } from './UserList';

/**
 * 用户详情页
 */
export function UserDetail() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [logs, setLogs] = useState<OperationLog[]>([]);
  const [loading, setLoading] = useState(false);

  // 从 URL 获取用户 ID
  const userId = parseInt(new URLSearchParams(window.location.search).get('id') || '0', 10);

  /**
   * 加载用户详情
   */
  const loadUserDetail = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const [userData, logData] = await Promise.all([
        getUserDetail(userId),
        getOperationLogs(userId),
      ]);
      setUser(userData);
      setLogs(logData);
    } catch (error) {
      console.error('Failed to load user detail:', error);
    } finally {
      setLoading(false);
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
    loadUserDetail();
  }, [userId]);

  if (!userId) {
    return <UserList />;
  }

  if (loading) {
    return (
      <div className="user-detail">
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

  if (!user) {
    return (
      <div className="user-detail">
        <div className="empty">用户不存在</div>
        <style>{`
          .empty {
            padding: 40px;
            text-align: center;
            color: #999;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="user-detail">
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => window.history.back()}>
          ← 返回
        </button>
        <h1>用户详情</h1>
      </div>

      {/* 基本信息 */}
      <div className="card">
        <div className="card-header">
          <h2>基本信息</h2>
          <button className="btn btn-primary btn-sm" onClick={() => window.history.pushState(null, '', `/user/form?id=${userId}`)}>编辑</button>
        </div>
        <div className="card-body">
          <div className="info-grid">
            <div className="info-item">
              <label>用户名</label>
              <div className="value">{user.username}</div>
            </div>
            <div className="info-item">
              <label>邮箱</label>
              <div className="value">{user.email}</div>
            </div>
            <div className="info-item">
              <label>手机号</label>
              <div className="value">{user.phone}</div>
            </div>
            <div className="info-item">
              <label>角色</label>
              <div className="value">{user.role}</div>
            </div>
            <div className="info-item">
              <label>部门</label>
              <div className="value">{user.department}</div>
            </div>
            <div className="info-item">
              <label>状态</label>
              <div className="value">
                <span className={`status-badge ${formatStatus(user.status).className}`}>
                  {formatStatus(user.status).text}
                </span>
              </div>
            </div>
            <div className="info-item">
              <label>创建时间</label>
              <div className="value">{formatDate(user.createTime)}</div>
            </div>
            <div className="info-item">
              <label>最后登录</label>
              <div className="value">{formatDate(user.lastLoginTime || '')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 操作日志 */}
      <div className="card">
        <div className="card-header">
          <h2>操作日志</h2>
        </div>
        <div className="card-body">
          {logs.length === 0 ? (
            <div className="empty">暂无操作日志</div>
          ) : (
            <div className="timeline">
              {logs.map((log) => (
                <div key={log.id} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-operation">{log.operation}</div>
                    <div className="timeline-info">
                      <span className="timeline-user">{log.username}</span>
                      <span className="timeline-time">{formatDate(log.createTime)}</span>
                    </div>
                    <div className="timeline-ip">IP: {log.ip}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .user-detail {
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
          color: #333;
        }
        .card {
          margin-bottom: 20px;
          border: 1px solid #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #fafafa;
          border-bottom: 1px solid #f0f0f0;
        }
        .card-header h2 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }
        .card-body {
          padding: 20px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        .info-item label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          color: #666;
        }
        .info-item .value {
          font-size: 16px;
          color: #333;
          font-weight: 500;
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
        .timeline {
          position: relative;
          padding-left: 30px;
        }
        .timeline-item {
          position: relative;
          padding-bottom: 20px;
        }
        .timeline-item:last-child {
          padding-bottom: 0;
        }
        .timeline-dot {
          position: absolute;
          left: -30px;
          top: 6px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #1890ff;
          border: 2px solid #fff;
          box-shadow: 0 0 0 2px #1890ff;
        }
        .timeline-content {
          padding-left: 10px;
        }
        .timeline-operation {
          font-size: 14px;
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
        }
        .timeline-info {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: #666;
        }
        .timeline-ip {
          font-size: 12px;
          color: #999;
        }
        .empty {
          padding: 40px;
          text-align: center;
          color: #999;
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
        }
        .btn-secondary:hover {
          border-color: #1890ff;
          color: #1890ff;
        }
        .btn-sm {
          padding: 4px 12px;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}
