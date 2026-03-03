/**
 * Token 管理工具
 */
const TOKEN_KEY = 'erp_token';
const USER_INFO_KEY = 'erp_user_info';

/**
 * Token 数据接口
 */
interface TokenData {
  token: string;
  refreshToken?: string;
  expiresAt?: number;
}

/**
 * 用户信息接口
 */
interface UserInfo {
  id: string;
  name: string;
  role: string;
  permissions: string[];
}

/**
 * Token 管理类
 */
class TokenManager {
  /**
   * 保存 token
   */
  setToken(token: string, expiresIn?: number): void {
    const data: TokenData = { token };
    if (expiresIn) {
      data.expiresAt = Date.now() + expiresIn * 1000;
    }
    localStorage.setItem(TOKEN_KEY, JSON.stringify(data));
  }

  /**
   * 获取 token
   */
  getToken(): string | null {
    const tokenData = this.getTokenData();
    return tokenData?.token || null;
  }

  /**
   * 获取完整的 token 数据
   */
  getTokenData(): TokenData | null {
    const tokenStr = localStorage.getItem(TOKEN_KEY);
    if (!tokenStr) {
      return null;
    }

    try {
      const data: TokenData = JSON.parse(tokenStr);

      // 检查是否过期
      if (data.expiresAt && Date.now() > data.expiresAt) {
        this.removeToken();
        return null;
      }

      return data;
    } catch {
      this.removeToken();
      return null;
    }
  }

  /**
   * 移除 token
   */
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  /**
   * 检查 token 是否存在且有效
   */
  isTokenValid(): boolean {
    return !!this.getTokenData();
  }

  /**
   * 保存用户信息
   */
  setUserInfo(userInfo: UserInfo): void {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  }

  /**
   * 获取用户信息
   */
  getUserInfo(): UserInfo | null {
    const userInfoStr = localStorage.getItem(USER_INFO_KEY);
    if (!userInfoStr) {
      return null;
    }

    try {
      return JSON.parse(userInfoStr) as UserInfo;
    } catch {
      this.removeUserInfo();
      return null;
    }
  }

  /**
   * 移除用户信息
   */
  removeUserInfo(): void {
    localStorage.removeItem(USER_INFO_KEY);
  }

  /**
   * 清除所有认证信息
   */
  clearAuth(): void {
    this.removeToken();
    this.removeUserInfo();
  }
}

/**
 * 导出 TokenManager 实例
 */
export const tokenManager = new TokenManager();

/**
 * 导出类型
 */
export type { UserInfo, TokenData };
