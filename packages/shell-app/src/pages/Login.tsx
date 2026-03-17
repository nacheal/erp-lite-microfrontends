import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../services/api';
import { saveAuthInfo } from '../utils/auth';
import styles from './Login.module.css';

/**
 * 登录表单数据接口
 */
interface LoginFormData {
  username: string;
  password: string;
}

/**
 * 登录页面组件
 * 功能：
 * - 提供用户名和密码输入
 * - 调用登录 API
 * - 登录成功后跳转到首页或之前的页面
 */
const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 获取登录前要访问的路径，如果没有则默认为首页
  const from = (location.state as { from?: string })?.from || '/';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 尝试调用真实 API
      const response = await authApi.login(formData);
      const { token, user } = response.data.data;

      // 保存 token 和用户信息
      saveAuthInfo(token, user);

      // 跳转到登录前要访问的页面或首页
      navigate(from, { replace: true });
    } catch (err) {
      // API 失败时使用 mock 登录
      console.warn('API 请求失败，使用 mock 登录模式', err);

      // 验证测试账号
      if (formData.username === 'admin' && formData.password === 'admin123') {
        // Mock 用户数据
        const mockToken = 'mock-token-' + Date.now();
        const mockUser = {
          id: '1',
          name: '管理员',
          role: 'admin',
          permissions: ['*'],
        };

        // 保存 mock 数据
        saveAuthInfo(mockToken, mockUser);

        // 跳转到登录前要访问的页面或首页
        navigate(from, { replace: true });
      } else {
        setError('用户名或密码错误（测试账号: admin / admin123）');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.loginContainer}>
        <div className={styles.loginHeader}>
          <h1 className={styles.logo}>ERP Lite</h1>
          <p className={styles.subtitle}>企业级微前端管理系统</p>
        </div>

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              用户名
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className={styles.input}
              value={formData.username}
              onChange={handleInputChange}
              placeholder="请输入用户名"
              required
              autoComplete="username"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              密码
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className={styles.input}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="请输入密码"
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <div className={styles.loginFooter}>
          <p className={styles.tip}>测试账号: admin / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
