# ERP Lite - 企业级微前端管理系统

> 基于 qiankun 的微前端架构项目，适用于学习微前端核心概念和实践

## 🎉 在线演示

**演示地址**: https://erp-lite-shell.vercel.app/dashboard

**测试账号**:
- 用户名: `admin`
- 密码: `admin123`

**部署地址**:
- 主应用: https://erp-lite-shell.vercel.app
- 用户管理: https://erp-lite-user.vercel.app
- 商品管理: https://erp-lite-product.vercel.app
- 订单管理: https://erp-lite-order.vercel.app
- 数据看板: https://erp-lite-dashboard.vercel.app

## 项目简介

ERP Lite 是一个中型企业级后台管理系统的微前端实现，采用「主应用 + 多子应用」架构。各子应用可以独立开发、独立部署、独立运行，技术栈互不影响。

### 核心特性

- ✅ **微前端架构**: 基于 qiankun 2.x，支持 JS/CSS 沙箱隔离
- ✅ **多技术栈共存**: React 18、Vue 3、原生 JS 混合开发
- ✅ **独立部署**: 每个子应用可独立发布，已部署到 Vercel
- ✅ **共享状态**: qiankun initGlobalState 实现跨应用状态管理
- ✅ **Mock 登录**: API 失败时自动降级到本地验证
- ✅ **代码规范**: ESLint + Prettier + Stylelint + husky
- ✅ **Monorepo**: pnpm workspace 管理多包项目
- ✅ **生产就绪**: 完整的构建配置和环境变量管理

### 应用架构

```
┌────────────────────── 主应用 (Shell App) ──────────────────────┐
│  顶部导航 | 侧边菜单 | 登录鉴权 | 全局状态           │
│                                                              │
│  ┌────────────────── 子应用挂载区 ────────────────────┐  │
│  │                                                       │  │
│  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐ │  │
│  │  │ 用户 │  │ 商品 │  │ 订单 │  │ 数据 │ │  │
│  │  │ 管理 │  │ 管理 │  │ 管理 │  │ 看板 │ │  │
│  │  │React │  │Vue3 │  │React │  │原生JS│ │  │
│  │  └──────┘  └──────┘  └──────┘  └──────┘ │  │
│  └─────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

## 技术栈

| 层级 | 技术 | 版本 | 说明 |
|--------|------|------|------|
| **微前端框架** | qiankun | 2.10.x - 主应用框架 |
| **构建工具** | Webpack 5 | 主应用 & React 子应用 |
| | Vite 5 | Vue 子应用 & Dashboard |
| **包管理器** | pnpm | 8.x - Monorepo 管理 |
| **主应用框架** | React | 18.x |
| **子应用框架** | React / Vue | React 18.x / Vue 3.4.x |
| **路由** | React Router | 6.x (React 应用) |
| | Vue Router | 4.x (Vue 应用) |
| **状态管理** | Zustand | 4.x (React 子应用) |
| | Pinia | 2.x (Vue 子应用) |
| | qiankun GlobalState | 跨应用共享状态 |
| **UI 组件库** | Ant Design | 5.x (React 应用) |
| | Element Plus | 2.x (Vue 应用) |
| **图表库** | ECharts | 5.x (Dashboard) |
| **HTTP 客户端** | Axios | 1.6.x |
| **TypeScript** | TypeScript | 5.3.x |

## 目录结构

```
erp-lite-microfrontends/
├── aiInfo/                      # 项目文档
│   ├── 微前端需求文档.md
│   ├── 技术选型文档.md
│   ├── 任务拆分.md (架构设计)
│   ├── 开发任务列表.md
│   ├── Vibe 编程提示词手册.md
│   └── 项目进度跟踪.md
├── packages/                    # 应用包
│   ├── shell-app/              # 主应用 (端口 3000)
│   │   ├── src/
│   │   │   ├── components/      # 通用组件
│   │   │   ├── pages/           # 页面组件
│   │   │   ├── router/          # 路由配置
│   │   │   ├── micro/           # 微前端相关
│   │   │   └── styles/          # 全局样式
│   │   ├── public/
│   │   └── webpack.config.js
│   ├── app-user/                # 用户管理子应用 (端口 3001)
│   ├── app-product/             # 商品管理子应用 (端口 3002)
│   ├── app-order/               # 订单管理子应用 (端口 3003)
│   └── app-dashboard/           # 数据看板子应用 (端口 3004)
├── shared/                     # 共享包
│   ├── types/                  # TypeScript 类型定义
│   └── utils/                  # 纯函数工具
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── .stylelintrc.js
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── package.json
```

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Git

### 安装依赖

```bash
# 进入项目目录
cd erp-lite-microfrontends

# 安装所有依赖
pnpm install
```

### 启动开发服务器

#### 方式一：启动所有应用（推荐）

```bash
# 在项目根目录执行，并行启动所有应用
pnpm run dev:all
```

#### 方式二：单独启动各应用

```bash
# 启动主应用 (端口 3000)
cd packages/shell-app && pnpm run dev

# 启动用户管理 (端口 3001)
cd packages/app-user && pnpm run dev

# 启动商品管理 (端口 3002)
cd packages/app-product && pnpm run dev

# 启动订单管理 (端口 3003)
cd packages/app-order && pnpm run dev

# 启动数据看板 (端口 3004)
cd packages/app-dashboard && pnpm run dev
```

### 访问应用

#### 本地开发环境

| 应用 | 访问地址 | 说明 |
|------|----------|------|
| 主应用 | http://localhost:3000 | 微前端容器 |
| 用户管理 | http://localhost:3001 | 可独立访问或嵌入主应用 |
| 商品管理 | http://localhost:3002 | 可独立访问或嵌入主应用 |
| 订单管理 | http://localhost:3003 | 可独立访问或嵌入主应用 |
| 数据看板 | http://localhost:3004 | 可独立访问或嵌入主应用 |

#### 生产环境

访问在线演示: https://erp-lite-shell.vercel.app/dashboard

## 部署指南

### Vercel 部署

本项目已配置完整的 Vercel 部署方案，每个应用都有独立的 `vercel.json` 配置文件。

#### 部署步骤

1. **Fork 本仓库到你的 GitHub 账号**

2. **在 Vercel 中导入项目**
   - 访问 [Vercel](https://vercel.com)
   - 点击 "Import Project"
   - 选择你 fork 的仓库

3. **分别部署 5 个应用**
   - Shell App: 根目录选择 `packages/shell-app`
   - App User: 根目录选择 `packages/app-user`
   - App Product: 根目录选择 `packages/app-product`
   - App Order: 根目录选择 `packages/app-order`
   - App Dashboard: 根目录选择 `packages/app-dashboard`

4. **配置环境变量**

在 Shell App 的 Vercel 项目设置中添加环境变量：
```
VITE_APP_USER_ENTRY=https://your-app-user.vercel.app
VITE_APP_PRODUCT_ENTRY=https://your-app-product.vercel.app
VITE_APP_ORDER_ENTRY=https://your-app-order.vercel.app
VITE_APP_DASHBOARD_ENTRY=https://your-app-dashboard.vercel.app
```

详细部署文档请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 开发指南

### 代码规范

```bash
# 检查代码
pnpm run lint:all

# 自动修复问题
pnpm run lint:fix

# 格式化代码
pnpm run format
```

### 提交代码

```bash
# Git hooks 会自动执行 lint-staged 检查
git add .
git commit -m "feat: 添加新功能"
# 或
git commit -m "fix: 修复 bug"
git push origin main
```

Commit message 格式遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：
- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 重构
- `perf:` 性能优化
- `test:` 测试相关
- `chore:` 构建/工具配置

### 添加新子应用

如需添加新的子应用，请参考以下步骤：

1. 在 `packages/` 下创建新目录
2. 初始化 `package.json` 和构建配置
3. 实现 `bootstrap/mount/unmount` 生命周期
4. 配置跨域和 publicPath
5. 在主应用中注册

## 学习重点

本项目覆盖微前端学习的核心知识点：

1. **微前端框架** - qiankun 基础使用
2. **JS 隔离** - Proxy 沙箱机制
3. **CSS 隔离** - scoped CSS / Shadow DOM
4. **应用通信** - 主子通信、子间通信
5. **路由管理** - 主应用路由 + 子应用路由
6. **状态管理** - 跨应用全局状态
7. **样式隔离** - 组件库样式冲突解决
8. **性能优化** - 预加载、缓存、代码分割
9. **独立部署** - 动态配置、灰度发布

## 文档

详细的开发文档请查看 `aiInfo/` 目录：

| 文档 | 说明 |
|------|------|
| 微前端需求文档.md | 项目需求、验收标准、学习路径 |
| 技术选型文档.md | 技术栈选择原因、版本锁定清单 |
| 任务拆分.md | 系统架构设计、技术选型 |
| 开发任务列表.md | 8 阶段 126 任务详细清单 |
| Vibe 编程提示词手册.md | 每个任务的 AI 辅助提示词 |
| 项目进度跟踪.md | 实时开发进度、已完成任务 |

## 验收标准

完成后项目应能回答以下问题：

1. ❓ 子应用是如何做到 JS 隔离的？`window` 对象污染如何防止？
2. ❓ 如果商品子应用用了 Vue，订单子应用用了 React，它们能共享同一个全局 Store 吗？怎么做？
3. ❓ 子应用 A 修改了 `document.title`，切换到子应用 B 后如何还原？
4. ❓ 如何在不刷新页面的情况下，将子应用从 v1 热更新到 v2？
5. ❓ 主应用崩溃和子应用崩溃的边界如何隔离？

## 项目进度

**当前状态**: ✅ 阶段性完成

**完成进度**: 69% (87/126 任务)

**已完成阶段**:
- ✅ 阶段一: 工程基础搭建 (94%)
- ✅ 阶段二: 主应用开发 (100%)
- ✅ 阶段三: 子应用接入 (100%)
- ✅ 阶段四: 业务功能开发 (100%)
- ✅ 阶段五: 通信与状态 (核心功能完成)
- ✅ 阶段八: 部署与上线 (100%)

详细进度请查看 [项目进度跟踪.md](./aiInfo/项目进度跟踪.md)

## 技术亮点

1. ✅ **完整的 Monorepo 架构** - pnpm workspace 管理多包
2. ✅ **多技术栈共存** - React 18、Vue 3、原生 JS 混合开发
3. ✅ **权限系统设计** - 基于 RBAC 的权限控制，菜单自动过滤
4. ✅ **qiankun 配置完整** - 生命周期钩子、沙箱隔离配置
5. ✅ **响应式布局** - 支持桌面、平板、移动设备
6. ✅ **独立部署能力** - 5 个应用独立部署到 Vercel
7. ✅ **Mock 登录模式** - API 失败时自动降级到本地验证
8. ✅ **跨应用通信** - 主子通信、退出登录、跨应用跳转

## 常见问题

### 端口被占用

```bash
# 查找占用端口的进程
lsof -ti:3000

# 杀掉进程
kill -9 <PID>
```

### 依赖安装失败

```bash
# 清理缓存重新安装
rm -rf node_modules
rm -rf pnpm-lock.yaml
pnpm install
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT

---

**项目状态**: ✅ 阶段性完成 | **在线演示**: https://erp-lite-shell.vercel.app/dashboard | **进度**: 69% (87/126) | 详见 [项目进度跟踪.md](./aiInfo/项目进度跟踪.md)
