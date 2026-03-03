import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * API 响应接口
 */
interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

/**
 * 登录请求接口
 */
interface LoginRequest {
  username: string;
  password: string;
}

/**
 * 登录响应数据接口
 */
interface LoginData {
  token: string;
  user: {
    id: string;
    name: string;
    role: string;
    permissions: string[];
  };
}

/**
 * 创建 axios 实例
 */
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:4000/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 从 localStorage 获取 token
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      const { data } = response;

      // 根据 code 判断请求是否成功
      if (data.code === 200 || data.code === 0) {
        return response;
      }

      // 处理业务错误
      return Promise.reject(new Error(data.message || '请求失败'));
    },
    (error) => {
      // 处理 HTTP 错误
      if (error.response) {
        switch (error.response.status) {
          case 401:
            // 未授权，清除 token 并跳转到登录页
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            window.location.href = '/login';
            break;
          case 403:
            console.error('没有权限访问');
            break;
          case 404:
            console.error('请求的资源不存在');
            break;
          case 500:
            console.error('服务器错误');
            break;
          default:
            console.error('请求失败', error.response.data?.message || error.message);
        }
      } else if (error.request) {
        console.error('网络错误，请检查网络连接');
      } else {
        console.error('请求配置错误', error.message);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

/**
 * API 实例
 */
const api = createAxiosInstance();

/**
 * 封装 GET 请求
 */
export const get = <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
  return api.get<ApiResponse<T>>(url, config);
};

/**
 * 封装 POST 请求
 */
export const post = <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
  return api.post<ApiResponse<T>>(url, data, config);
};

/**
 * 封装 PUT 请求
 */
export const put = <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
  return api.put<ApiResponse<T>>(url, data, config);
};

/**
 * 封装 DELETE 请求
 */
export const del = <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
  return api.delete<ApiResponse<T>>(url, config);
};

/**
 * 认证相关 API
 */
export const authApi = {
  /**
   * 登录
   */
  login: (data: LoginRequest): Promise<AxiosResponse<ApiResponse<LoginData>>> => {
    return post<LoginData>('/auth/login', data);
  },

  /**
   * 登出
   */
  logout: (): Promise<AxiosResponse<ApiResponse<void>>> => {
    return post<void>('/auth/logout');
  },

  /**
   * 获取当前用户信息
   */
  getCurrentUser: (): Promise<AxiosResponse<ApiResponse<LoginData['user']>>> => {
    return get<LoginData['user']>('/auth/user');
  },
};

export default api;
