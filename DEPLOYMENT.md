# ERP Lite 微前端系统 - Vercel 部署配置完成

## 已完成的配置

### 1. Vercel 配置文件
已为所有应用创建 `vercel.json` 配置文件：
- ✅ [packages/shell-app/vercel.json](packages/shell-app/vercel.json)
- ✅ [packages/app-user/vercel.json](packages/app-user/vercel.json)
- ✅ [packages/app-product/vercel.json](packages/app-product/vercel.json)
- ✅ [packages/app-order/vercel.json](packages/app-order/vercel.json)
- ✅ [packages/app-dashboard/vercel.json](packages/app-dashboard/vercel.json)

### 2. 构建配置更新

#### Webpack 应用 (shell-app, app-user, app-order)
已更新 `webpack.config.js`，支持动态 publicPath：
```javascript
publicPath: isDev
  ? 'http://localhost:PORT/'
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/`
    : '/'
```

#### Vite 应用 (app-product, app-dashboard)
已更新 `vite.config.ts`，支持动态 base 路径：
```typescript
base: isDev
  ? '/'
  : vercelUrl
    ? `https://${vercelUrl}/`
    : '/'
```

### 3. 环境变量配置
- ✅ 创建 [packages/shell-app/.env.production](packages/shell-app/.env.production)
- ✅ 配置子应用入口地址环境变量
- ✅ shell-app 的 webpack.config.js 已配置 DefinePlugin 支持环境变量

### 4. 项目配置文件
- ✅ 创建 [.npmrc](.npmrc) - 指定 pnpm 版本
- ✅ 创建 [.vercelignore](.vercelignore) - 忽略不必要的文件

### 5. 部署脚本
- ✅ 创建 [scripts/deploy.sh](scripts/deploy.sh) - 自动化部署脚本
- ✅ 创建 [scripts/sync-env.sh](scripts/sync-env.sh) - 环境变量同步脚本

## 部署流程

### 方式一：使用自动化脚本（推荐）

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 运行部署脚本
./scripts/deploy.sh
```

### 方式二：手动部署

#### 步骤 1：部署微应用
```bash
# 部署 app-user
cd packages/app-user
vercel --prod

# 部署 app-product
cd ../app-product
vercel --prod

# 部署 app-order
cd ../app-order
vercel --prod

# 部署 app-dashboard
cd ../app-dashboard
vercel --prod
```

#### 步骤 2：配置主应用环境变量
在 Vercel Dashboard 中为 shell-app 配置环境变量：
- `VITE_APP_USER_ENTRY` = 微应用 URL
- `VITE_APP_PRODUCT_ENTRY` = 微应用 URL
- `VITE_APP_ORDER_ENTRY` = 微应用 URL
- `VITE_APP_DASHBOARD_ENTRY` = 微应用 URL

#### 步骤 3：部署主应用
```bash
cd packages/shell-app
vercel --prod
```

### 方式三：通过 Vercel Dashboard

1. 访问 https://vercel.com/new
2. 选择 GitHub 仓库
3. 为每个应用创建独立的 Vercel 项目
4. 配置项目设置：
   - **Root Directory**: `packages/[app-name]`
   - **Framework Preset**: `Other`
   - **Build Command**: 自动从 vercel.json 读取
   - **Output Directory**: `dist`

## 环境变量配置

### 主应用 (shell-app)
在 Vercel Dashboard 中配置：
```
VITE_APP_USER_ENTRY=https://erp-lite-user.vercel.app
VITE_APP_PRODUCT_ENTRY=https://erp-lite-product.vercel.app
VITE_APP_ORDER_ENTRY=https://erp-lite-order.vercel.app
VITE_APP_DASHBOARD_ENTRY=https://erp-lite-dashboard.vercel.app
VITE_API_BASE_URL=https://api.erp-lite.com
NODE_ENV=production
```

### 微应用
所有微应用配置：
```
NODE_ENV=production
VITE_API_BASE_URL=https://api.erp-lite.com
```

## 验证清单

部署完成后，请验证以下内容：

- [ ] 主应用可访问
- [ ] 所有微应用可正常加载
- [ ] 登录/登出功能正常
- [ ] 路由切换无报错
- [ ] 刷新页面无 404
- [ ] 控制台无 CORS 错误
- [ ] HTTPS 证书有效
- [ ] 跨应用跳转正常
- [ ] 主题切换功能正常

## 常见问题

### 1. 构建失败：pnpm: command not found
确保 `.npmrc` 文件存在并指定了 pnpm 版本。

### 2. 子应用加载失败
检查主应用环境变量中的子应用 URL 是否正确。

### 3. 刷新 404
确保 `vercel.json` 中配置了 `rewrites`。

### 4. 跨域问题
确保所有微应用的 `vercel.json` 中配置了 CORS 头部。

### 5. 环境变量未生效
在 Vercel Dashboard 中重新部署，取消勾选 "Use existing Build Cache"。

## 下一步

1. 在 Vercel 上创建项目并部署
2. 配置自定义域名（可选）
3. 设置 Analytics 监控
4. 配置 CI/CD 自动部署

## 参考文档

详细部署方案请参考：[aiInfo/部署方案.md](aiInfo/部署方案.md)
