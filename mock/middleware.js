/**
 * Mock Server 自定义中间件
 * 用于处理 json-server 无法直接处理的复杂路由
 */

module.exports = (req, res, next) => {
  // 处理登录请求
  if (req.method === 'POST' && req.path === '/api/auth/login') {
    const { username, password } = req.body;

    // 简单的账号密码验证
    if (username === 'admin' && password === 'admin123') {
      res.json({
        code: 200,
        message: '登录成功',
        data: {
          token: `mock-jwt-token-${Date.now()}`,
          user: {
            id: '1',
            name: 'Admin User',
            role: 'admin',
            permissions: [
              'user:view',
              'user:edit',
              'user:delete',
              'product:view',
              'product:edit',
              'product:delete',
              'order:view',
              'order:export',
              'dashboard:view'
            ]
          }
        }
      });
      return;
    }

    // 登录失败
    res.status(401).json({
      code: 401,
      message: '用户名或密码错误',
      data: null
    });
    return;
  }

  // 处理登出请求
  if (req.method === 'POST' && req.path === '/api/auth/logout') {
    res.json({
      code: 200,
      message: '登出成功',
      data: null
    });
    return;
  }

  // 处理获取用户信息请求
  if (req.method === 'GET' && req.path === '/api/auth/user') {
    const authHeader = req.headers.authorization;

    // 简单的 token 验证
    if (authHeader && authHeader.startsWith('Bearer ')) {
      res.json({
        code: 200,
        message: '获取成功',
        data: {
          id: '1',
          name: 'Admin User',
          role: 'admin',
          permissions: [
            'user:view',
            'user:edit',
            'user:delete',
            'product:view',
            'product:edit',
            'product:delete',
            'order:view',
            'order:export',
            'dashboard:view'
          ]
        }
      });
      return;
    }

    // 未授权
    res.status(401).json({
      code: 401,
      message: '未授权',
      data: null
    });
    return;
  }

  // 处理获取子应用配置请求
  if (req.method === 'GET' && req.path === '/api/micro-apps/config') {
    res.json({
      code: 200,
      message: '获取成功',
      data: [
        {
          name: 'app-user',
          entry: '//localhost:3001',
          activeRule: '/user',
          enabled: true,
          version: '1.0.0'
        },
        {
          name: 'app-product',
          entry: '//localhost:3002',
          activeRule: '/product',
          enabled: true,
          version: '1.0.0'
        },
        {
          name: 'app-order',
          entry: '//localhost:3003',
          activeRule: '/order',
          enabled: true,
          version: '1.0.0'
        },
        {
          name: 'app-dashboard',
          entry: '//localhost:3004',
          activeRule: '/dashboard',
          enabled: true,
          version: '1.0.0'
        }
      ]
    });
    return;
  }

  // 其他请求交给 json-server 处理
  next();
};
