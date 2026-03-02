# ERP Lite 微前端系统 — Vibe 编程提示词手册

> 按任务列表的 8 个阶段整理，每条提示词对应具体任务编号。
> 使用方式：直接复制对应语句粘贴给 AI，根据实际情况替换 `【】` 中的占位内容。

---

## 阶段一：工程基础搭建

### T-001 ~ T-003 Monorepo 初始化

```
我正在搭建一个微前端项目，使用 pnpm monorepo 管理所有应用。

请帮我完成以下初始化工作：
1. 生成根目录的 pnpm-workspace.yaml，工作区包含 packages/* 和 shared/*
2. 生成根目录的 package.json，包含以下公共脚本：
   - dev:all：并行启动所有子包的 dev 命令
   - build:all：串行构建所有子包
   - lint:all：对所有子包执行 eslint
3. .gitignore 文件，覆盖 Node.js、macOS、IDE 常见忽略项

项目名称：erp-lite
包管理器：pnpm 8.x
```

---

### T-004 TypeScript 基础配置

```
请帮我生成一个 monorepo 根目录的 tsconfig.base.json，
要求：
- target: ES2020
- strict 模式开启
- 支持路径别名 @/* 映射到 src/*
- moduleResolution: bundler
- 不包含任何 include/exclude（由各子包自行继承覆盖）

同时生成一个 packages/shell-app/tsconfig.json 继承示例，
展示如何在子包中 extends 根配置并补充自己的 include 范围。
```

---

### T-005 ~ T-009 代码规范全套配置

```
我的项目是 pnpm monorepo，包含 React 18（TypeScript）和 Vue 3（TypeScript）子应用。

请帮我在根目录配置完整的代码规范工具链，包括：
1. ESLint 8.x 配置文件（.eslintrc.js）
   - 支持 TypeScript
   - 支持 React（react/recommended + react-hooks/recommended）
   - 支持 Vue 3（vue3-essential）
   - 集成 Prettier（关闭 ESLint 格式化规则，交给 Prettier 处理）
2. Prettier 配置（.prettierrc）
   - 单引号、分号、2 空格缩进、尾随逗号 es5
3. Stylelint 配置（.stylelintrc.js）
   - 支持 CSS 和 SCSS
4. husky + lint-staged 配置
   - pre-commit 钩子：只检查暂存文件，运行 eslint --fix 和 prettier --write
5. commitlint 配置（.commitlintrc.js）
   - 遵循 conventional commits 规范

请给出每个文件的完整内容，以及需要安装的所有 devDependencies 命令。
```

---

### T-010 主应用骨架

```
请帮我在 packages/shell-app 目录下搭建主应用骨架，要求：

技术栈：React 18 + TypeScript + Webpack 5 + Ant Design 5.x
功能要求：
- 支持独立运行（npm run dev，端口 3000）
- 配置 webpack-dev-server，支持 History 路由（historyApiFallback: true）
- 配置 CSS Modules 支持
- 配置 @/* 路径别名指向 src/
- 配置生产环境 publicPath 为 https://erp.company.com/
- 入口文件为 src/main.tsx

请给出：
1. package.json（含所有依赖）
2. webpack.config.js（开发 + 生产环境）
3. src/main.tsx 入口文件
4. src/App.tsx 空壳组件
5. tsconfig.json（继承根目录 tsconfig.base.json）
```

---

### T-011 app-user 骨架

```
请帮我在 packages/app-user 目录下搭建子应用骨架，要求：

技术栈：React 18 + TypeScript + Webpack 5 + Ant Design 5.x
特殊要求（微前端子应用）：
- 端口 3001
- webpack output 必须配置：
  - library: 'app-user-[name]'
  - libraryTarget: 'umd'
  - publicPath: 开发环境 http://localhost:3001/，生产环境 https://static.company.com/user/
- devServer 必须开启跨域：headers['Access-Control-Allow-Origin'] = '*'
- 支持独立运行，也支持被 qiankun 加载

请给出：
1. package.json
2. webpack.config.js
3. src/main.tsx（独立运行入口）
4. src/index.ts（微前端入口，导出空的 bootstrap/mount/unmount 占位函数）
5. tsconfig.json
```

---

### T-012 app-product 骨架

```
请帮我在 packages/app-product 目录下搭建 Vue 3 子应用骨架，要求：

技术栈：Vue 3 + TypeScript + Vite 5 + Element Plus 2.x
特殊要求（微前端子应用）：
- 端口 3002
- 安装并配置 vite-plugin-qiankun
- vite.config.ts 开启 server.cors: true
- 配置 @/* 路径别名
- 支持独立运行，也支持被 qiankun 加载

请给出：
1. package.json
2. vite.config.ts
3. src/main.ts（独立运行入口）
4. src/index.ts（微前端入口，Vue 3 版本的 bootstrap/mount/unmount 实现）
5. tsconfig.json
```

---

### T-013 ~ T-014 app-order / app-dashboard 骨架

```
请依照以下规格，分别生成 app-order 和 app-dashboard 的项目骨架：

app-order：
- 与 app-user 完全相同的技术栈（React 18 + Webpack 5）
- 端口 3003
- publicPath 生产环境为 https://static.company.com/order/
- library name: 'app-order-[name]'

app-dashboard：
- 原生 JavaScript（无框架）+ Vite 5
- 端口 3004
- 不安装任何 UI 框架
- publicPath 生产环境为 https://static.company.com/dashboard/
- 实现原生 JS 版本的 bootstrap/mount/unmount 生命周期
  （mount 时手动创建 DOM，unmount 时清空容器）

各自给出完整的 package.json、构建配置和入口文件。
```

---

### T-015 ~ T-016 共享包

```
请帮我在 shared/ 目录下创建两个共享包：

1. shared/types/index.ts
   定义以下 TypeScript 接口（供所有应用引用，不含任何框架依赖）：
   - GlobalState：包含 user(id/name/token/permissions[])、theme、locale、action(type/payload)
   - UserInfo：用户基本信息
   - MicroAppConfig：子应用注册配置（name/entry/activeRule/props?）
   - Permission：权限码枚举类型（用字符串字面量联合类型）

2. shared/utils/index.ts
   实现以下纯函数工具（不引入任何第三方库）：
   - formatMoney(amount: number, currency?: string): string  // 金额格式化，千分位 + 两位小数
   - formatDate(date: Date | string | number, pattern?: string): string  // 日期格式化
   - formatNumber(num: number): string  // 数字千分位
   - hasPermission(permissions: string[], code: string): boolean  // 权限校验

同时给出各自的 package.json，name 分别为 @erp-lite/types 和 @erp-lite/utils。
```

---

### T-018 Mock Server

```
请帮我搭建一个本地 Mock API 服务，要求：

技术方案：使用 json-server 或 msw（推荐 msw，支持在浏览器端拦截）
端口：4000（json-server 模式）

需要 mock 的接口：
- POST /api/auth/login → 返回 token 和 userInfo
- GET  /api/users → 返回用户列表（分页）
- GET  /api/users/:id → 返回用户详情
- GET  /api/products → 返回商品列表（分页）
- GET  /api/orders → 返回订单列表（分页）
- GET  /api/orders/:id → 返回订单详情
- GET  /api/dashboard/stats → 返回看板核心指标数据
- GET  /api/micro-apps/config → 返回子应用注册配置列表

请给出：
1. mock 数据文件（db.json 或 handlers.ts），包含合理的假数据
2. 启动脚本配置
3. 如何在各子应用中集成 mock（开发环境自动启用，生产环境不打包）
```

---

## 阶段二：主应用开发

### T-019 ~ T-022 整体布局

```
请在 packages/shell-app/src 下实现主应用的整体布局，要求：

UI 框架：Ant Design 5.x（使用 Layout、Menu、Avatar 等组件）
布局结构：
- 顶部固定导航栏（高度 64px）：左侧 Logo + 应用名称，右侧用户头像 + 下拉菜单（退出登录）
- 左侧可折叠菜单（宽度 220px，折叠后 64px）：显示模块图标 + 名称
- 右侧内容区：子应用挂载容器，需有 id="micro-app-container"

菜单项（与路由对应）：
- 数据看板 → /dashboard（DashboardOutlined 图标）
- 用户管理 → /user（UserOutlined 图标）
- 商品管理 → /product（ShopOutlined 图标）
- 订单管理 → /order（OrderedListOutlined 图标）

要求：
- 使用 CSS Modules 管理样式
- 支持菜单收起/展开状态的 localStorage 持久化
- 当前激活菜单项根据 URL 自动高亮

请给出 Layout 组件、Sider 菜单组件、Header 组件的完整代码。
```

---

### T-023 ~ T-025 路由配置

```
请在 packages/shell-app/src 下配置 React Router 6 路由，要求：

路由结构：
- /login → LoginPage（不显示布局）
- / → 重定向到 /dashboard
- /dashboard/* → 子应用挂载点（显示布局）
- /user/* → 子应用挂载点（显示布局）
- /product/* → 子应用挂载点（显示布局）
- /order/* → 子应用挂载点（显示布局）
- * → 404 页面

路由守卫要求：
- 未登录时（localStorage 无 token）访问任意路由，重定向到 /login
- 已登录时访问 /login，重定向到 /dashboard
- 使用 React Router 6 的 loader 或 自定义 RequireAuth 组件实现

请给出：
1. src/router/index.tsx 路由配置
2. src/components/RequireAuth.tsx 路由守卫组件
3. src/pages/NotFound.tsx 404 页面
```

---

### T-026 ~ T-029 登录与鉴权

```
请实现主应用的登录页和鉴权逻辑，要求：

登录页（src/pages/Login/index.tsx）：
- Ant Design Form，包含账号（手机号格式校验）和密码（最少 6 位）
- 提交时调用 POST /api/auth/login
- 登录成功后将 token 存入 sessionStorage，跳转 /dashboard
- 加载状态、错误提示的完整 UI

Token 管理（src/utils/auth.ts）：
- getToken() / setToken(token) / removeToken()
- isTokenExpired()：解析 JWT payload 判断是否过期
- 存储位置：优先内存变量，持久化到 sessionStorage（不用 localStorage，关闭 Tab 即失效）

Axios 请求封装（src/services/request.ts）：
- 请求拦截器：自动注入 Authorization: Bearer <token>
- 响应拦截器：401 自动清空 token 并跳转登录页，其他错误统一 message.error 提示

请给出以上三个文件的完整代码。
```

---

### T-030 ~ T-032 qiankun 全局状态初始化

```
请在主应用中完成 qiankun 的初始化配置，要求：

文件：src/micro/state.ts
使用 qiankun 的 initGlobalState，初始化以下 GlobalState（类型从 @erp-lite/types 引入）：
- user: null（登录后赋值）
- theme: 'light'
- locale: 'zh-CN'
- action: undefined

文件：src/micro/actions.ts
封装全局状态操作方法：
- setUser(user: UserInfo | null)
- setTheme(theme: 'light' | 'dark')
- setLocale(locale: string)
- dispatchAction(type: string, payload: unknown)
- onGlobalStateChange(callback) —— 监听变化

文件：src/micro/index.ts
处理主应用监听到子应用发出的 action：
- action.type === 'LOGOUT' → 调用退出登录逻辑
- action.type === 'NAVIGATE_USER' → history.push('/user/detail/' + payload.userId)
- action.type === 'NAVIGATE_ORDER' → history.push('/order/list?productId=' + payload.productId)
- 处理完后将 action 重置为 undefined

请给出以上三个文件的完整代码。
```

---

### T-033 ~ T-034 权限控制

```
请实现主应用的前端权限控制系统，要求：

文件：src/utils/permission.ts
- hasPermission(code: string): boolean
  从全局状态读取当前用户的 permissions 数组，判断是否包含目标权限码
- hasAnyPermission(codes: string[]): boolean
- hasAllPermission(codes: string[]): boolean

文件：src/components/AuthWrapper.tsx
React 组件，用于包裹需要权限控制的内容：
- props: { code: string; children: ReactNode; fallback?: ReactNode }
- 无权限时显示 fallback（默认不渲染）

菜单权限过滤：
- 菜单配置增加 permissionCode 字段
- 渲染菜单时过滤掉当前用户无权访问的菜单项

权限码约定（示例）：
- user:view / user:edit / user:delete
- product:view / product:edit
- order:view / order:export

请给出完整代码，并说明如何在实际页面中使用 AuthWrapper。
```

---

## 阶段三：子应用接入

### T-035 ~ T-039 app-user 接入主应用

```
请帮我完成 app-user 子应用的 qiankun 接入改造，要求：

第一步：改造 src/index.ts（微前端入口）
实现完整的三个生命周期：
- bootstrap：初始化 i18n 或其他一次性配置
- mount(props)：
  - 从 props 中读取 container（挂载容器）、onGlobalStateChange、setGlobalState、userInfo
  - 创建 React 根节点并渲染 App
  - 监听全局状态变化，同步更新应用内的用户信息
- unmount(props)：
  - 销毁 React 根节点（root.unmount()）
  - 取消全局状态监听

第二步：main.tsx 独立运行入口
检测 window.__POWERED_BY_QIANKUN__，为 false 时直接挂载到 #root

第三步：React Router 配置
BrowserRouter 的 basename 设置为 /user

第四步：主应用注册（shell-app/src/micro/register.ts）
使用 registerMicroApps 注册 app-user：
- name: 'app-user'
- entry: 开发环境 //localhost:3001，生产环境从接口读取
- container: '#micro-app-container'
- activeRule: '/user'
- props: 传入 userInfo 和全局状态操作方法

请给出所有涉及文件的完整代码，以及验证接入成功的 checklist。
```

---

### T-040 ~ T-044 app-product（Vue 3）接入

```
请帮我完成 app-product（Vue 3）子应用的 qiankun 接入改造，要求：

第一步：改造 src/index.ts（使用 vite-plugin-qiankun 的 renderWithQiankun API）
- 使用 renderWithQiankun 包裹 Vue 应用的创建逻辑
- mount 生命周期中：创建 Vue app 实例，挂载到 props.container 指定的容器
- unmount 生命周期中：调用 app.unmount() 销毁实例

第二步：main.ts 独立运行入口
检测 window.__POWERED_BY_QIANKUN__，为 false 时直接 createApp(App).mount('#app')

第三步：Vue Router 配置
createWebHistory 的 base 设置为 /product

第四步：Element Plus 样式隔离配置
使用 namespace: 'prd-ep' 防止与主应用 Ant Design 样式冲突

第五步：在主应用注册 app-product（追加到 register.ts）

请给出所有涉及文件的完整代码。
注意：Vue 3 的 app 实例需要在模块级别保存引用，供 unmount 时调用 unmount()。
```

---

### T-050 ~ T-054 app-dashboard（原生 JS）接入

```
请帮我完成 app-dashboard（原生 JavaScript，无框架）子应用的 qiankun 接入，要求：

src/index.ts 实现三个生命周期：
- bootstrap：无操作，直接 return Promise.resolve()
- mount(props)：
  - 从 props.container 获取挂载容器
  - 手动创建 DOM 结构并插入容器
  - 启动数据轮询（每 60 秒刷新一次）
  - 初始化 ECharts 图表
- unmount(props)：
  - 清空容器 innerHTML
  - 停止轮询（clearInterval）
  - 销毁所有 ECharts 实例（调用 chart.dispose()）

独立运行时（非 qiankun 环境）：
- 直接在 DOMContentLoaded 后执行 mount 逻辑，挂载到 #app

请给出完整的生命周期代码，并特别处理好「子应用卸载时不泄漏定时器」的问题。
```

---

## 阶段四：业务功能开发

### T-056 ~ T-058 用户管理页面

```
请在 app-user 子应用中实现用户管理的核心页面，使用 React 18 + Ant Design 5.x。

1. 用户列表页（src/pages/UserList/index.tsx）
   - Ant Design Table，列：用户名、手机号、角色、状态（启用/禁用 Tag）、创建时间、操作
   - 顶部搜索表单：姓名（模糊搜索）、角色（Select）、状态（Select）、注册日期范围（DatePicker.RangePicker）
   - 分页：pageSize 默认 20，支持切换
   - 操作列：编辑（弹窗）、禁用/启用（二次确认）、删除（二次确认）
   - 表格上方「新增用户」按钮

2. 新增/编辑用户弹窗（src/components/UserFormModal/index.tsx）
   - Ant Design Modal + Form
   - 字段：姓名（必填）、手机号（必填，格式校验）、邮箱（格式校验）、角色（多选 Select）、所属部门（树形 Select）
   - 编辑时回填已有数据
   - 提交时调用新增或更新接口，成功后关闭弹窗刷新列表

3. 用户详情页（src/pages/UserDetail/index.tsx）
   - 基本信息卡片（Descriptions 组件）
   - 操作日志时间线（Timeline 组件，展示最近 20 条）

请给出这三个组件的完整代码，使用 @erp-lite/utils 中的工具函数处理日期格式化。
```

---

### T-063 ~ T-064 商品管理页面

```
请在 app-product 子应用中实现商品管理核心页面，使用 Vue 3 + Element Plus 2.x + Pinia。

1. 商品列表页（src/pages/ProductList.vue）
   - Element Plus ElTable，列：商品图片（缩略图）、商品名、分类、价格、库存、状态、操作
   - 筛选条件：关键词搜索、分类（级联选择器）、状态（单选按钮组）、价格区间（双 Input）
   - 支持多选 + 批量操作（批量上架/下架/删除）
   - 分页组件

2. 商品新增/编辑页（src/pages/ProductEdit.vue）
   - 两栏布局：左侧基本信息表单，右侧图片上传区
   - 字段：商品名（必填）、分类（级联选择）、价格、库存、商品描述（富文本，使用 wangEditor 或 Quill）
   - 图片上传：支持拖拽上传，最多 5 张，预览+删除
   - 表单校验 + 提交

3. Pinia Store（src/stores/product.ts）
   - 管理商品列表、分页、筛选条件状态
   - actions：fetchProducts / createProduct / updateProduct / deleteProduct

请给出完整代码。富文本编辑器推荐使用 wangEditor v5（Vue 3 版本）。
```

---

### T-069 ~ T-072 订单管理页面

```
请在 app-order 子应用中实现订单管理核心页面，使用 React 18 + Ant Design 5.x + Zustand。

1. 订单列表页（src/pages/OrderList/index.tsx）
   - 顶部状态筛选 Tabs：全部 / 待付款 / 待发货 / 已发货 / 已完成 / 已取消
   - 搜索区域：订单号、用户名、下单日期范围
   - 表格列：订单号、用户名、商品数量、实付金额、状态 Tag、下单时间、操作（查看详情）
   - 点击用户名：调用 setGlobalState 触发跨应用跳转到用户详情页

2. 订单详情页（src/pages/OrderDetail/index.tsx）
   - 基本信息区：订单号、下单时间、支付方式
   - 商品明细表格：商品图片+名称、单价、数量、小计
   - 底部汇总：商品总价、运费、优惠、实付
   - 状态流转时间线（Steps 或 Timeline 组件）：下单 → 付款 → 发货 → 收货
   - 操作按钮（根据当前状态显示对应操作）：确认发货 / 取消订单

3. 销售统计页（src/pages/OrderStats/index.tsx）
   - 使用 ECharts 5.x
   - 折线图：近 30 天每日 GMV + 订单量（双 Y 轴）
   - 顶部切换：近 7 天 / 近 30 天 / 近 90 天

4. Zustand Store（src/stores/order.ts）
   - 管理订单列表、当前筛选状态、分页

请给出完整代码，ECharts 图表封装成独立的 React 组件并在 unmount 时调用 dispose()。
```

---

### T-075 ~ T-080 数据看板

```
请在 app-dashboard 子应用中实现数据看板，使用原生 JavaScript + ECharts 5.x。
（无 React/Vue 框架，纯手写 DOM + ECharts）

看板布局（src/layout.js）：
- CSS Grid 布局，4 列，响应式
- 区域划分：顶部 4 个指标卡片 → 中间趋势图（宽）+ 排行榜（窄）→ 底部地图

指标卡片（src/components/StatCard.js）：
- 展示：指标名、当前值、环比变化（↑红 ↓绿）、迷你趋势图（sparkline）
- 4 个指标：GMV（万元）、订单量、新增用户数、转化率

趋势图（src/components/TrendChart.js）：
- ECharts 折线图，近 30 天，双 Y 轴（GMV + 订单量）
- 顶部切换按钮：7天 / 30天 / 90天

地图（src/components/MapChart.js）：
- ECharts 地图 + 中国省份 GeoJSON
- 热力色表示各省销售额，Tooltip 显示具体数值

轮询管理（src/polling.js）：
- startPolling(interval, callback)：启动轮询
- stopPolling()：停止并清空所有定时器
- 子应用 unmount 时必须调用 stopPolling()

请给出所有文件的完整代码，注意每个 ECharts 实例需保存引用，unmount 时逐一 dispose()。
```

---

## 阶段五：通信与状态

### T-084 ~ T-086 主应用向子应用传递数据验证

```
我已经完成了主应用的全局状态初始化（initGlobalState）和子应用的 mount 接入。
现在需要验证数据传递是否正确。

请帮我实现以下内容：

1. 在主应用的 registerMicroApps props 中，传入以下数据给所有子应用：
   - userInfo（从全局状态读取）
   - token
   - onGlobalStateChange
   - setGlobalState

2. 在 app-user 的 mount 生命周期中：
   - 读取 props.userInfo，存入 Zustand store
   - 监听 onGlobalStateChange，当 user 字段变化时同步更新 store
   - 在页面右上角用 Avatar + 用户名展示当前登录用户

3. 在 app-user 的 Axios 实例中：
   - 从 store 读取 token，注入请求头
   - 响应拦截器处理 401：调用 props.setGlobalState({ action: { type: 'LOGOUT' } })

请给出涉及文件的完整代码，并说明如何在浏览器中验证数据传递成功。
```

---

### T-089 ~ T-091 跨子应用跳转

```
请实现两个跨子应用跳转场景，使用 qiankun 的 initGlobalState 通信机制。

场景一：订单模块 → 用户详情
在 app-order 的订单列表页，点击用户名时：
1. app-order 调用 setGlobalState({ action: { type: 'NAVIGATE_USER', payload: { userId: 'xxx' } } })
2. 主应用监听到 action，执行 navigate('/user/detail/xxx')
3. app-user 在 UserDetail 页面的 useEffect 中检查 props.action，若为 NAVIGATE_USER 则高亮对应用户（页面滚动到目标行，Row 背景短暂高亮后恢复）
4. 主应用处理完后将 action 重置为 undefined

场景二：商品模块 → 订单列表（预设筛选）
在 app-product 的商品详情，点击「查看关联订单」时：
1. app-product 调用 setGlobalState({ action: { type: 'NAVIGATE_ORDER', payload: { productId: 'xxx' } } })
2. 主应用跳转到 /order/list
3. app-order 的订单列表在 mount 时检查 action，若为 NAVIGATE_ORDER 则预填 productId 筛选条件并自动查询

请给出各应用涉及文件的完整代码，以及防止 action 重复触发的处理逻辑。
```

---

### T-092 ~ T-095 全局主题与国际化同步

```
请实现全局主题切换（light/dark）和语言切换（zh-CN/en-US），
要求所有子应用实时同步，无需刷新页面。

主应用实现：
1. Header 组件添加主题切换按钮（太阳/月亮图标）和语言切换下拉
2. 切换时调用 setGlobalState({ theme: 'dark' }) 或 setGlobalState({ locale: 'en-US' })
3. 主应用同步切换 Ant Design ConfigProvider 的 theme 和 locale
4. 主应用切换 body 上的 data-theme 属性，触发 CSS 变量切换

CSS 变量体系（主应用 global.css）：
[data-theme='light'] { --bg-primary: #ffffff; --text-primary: #000000; ... }
[data-theme='dark']  { --bg-primary: #141414; --text-primary: #ffffff; ... }

子应用同步（以 app-user 为例）：
1. onGlobalStateChange 监听 theme 变化
2. React：切换 Ant Design ConfigProvider 的 theme.algorithm（defaultAlgorithm / darkAlgorithm）
3. 同步切换子应用挂载容器的 data-theme 属性

Vue 子应用（app-product）同步：
1. 监听 theme 变化，切换 Element Plus 的暗色模式（html class 添加/移除 dark）

请给出主应用和各子应用的完整实现代码。
```

---

## 阶段六：样式与主题

### T-096 ~ T-099 CSS 隔离问题排查与修复

```
我的微前端项目使用 qiankun 的 experimentalStyleIsolation，
现在遇到以下样式问题需要排查和修复：

问题一：app-user（Ant Design 5.x）中，Modal 弹窗的蒙层和弹窗本体样式丢失
请给出：
1. 问题根本原因分析
2. 解决方案（ConfigProvider getPopupContainer 配置）
3. 完整的修复代码

问题二：app-product（Element Plus 2.x）中，ElSelect 的下拉菜单样式丢失
请给出：
1. 问题根本原因分析
2. 解决方案（teleported: false 或调整挂载容器）
3. 完整的修复代码

问题三：app-user 和 app-product 同时加载时，某些基础样式（如 button reset）互相覆盖
请给出：
1. 如何定位是哪个子应用的样式造成污染（Chrome DevTools 操作步骤）
2. CSS 命名规范补救方案

最后输出一份「样式隔离踩坑记录」Markdown 文档，记录以上三个问题的现象、原因和解法。
```

---

### T-100 ~ T-104 完整主题系统

```
请帮我建立完整的 CSS 变量主题系统，覆盖主应用和所有子应用。

主应用 src/styles/theme.css：
定义 light / dark 两套 CSS 变量，涵盖：
- 颜色：背景（主/次/卡片）、文字（主/次/禁用）、边框、分割线
- 品牌色：primary / success / warning / error（与 Ant Design token 对齐）
- 阴影：卡片阴影、弹窗阴影
- 圆角：小/中/大
- 间距：xs/sm/md/lg/xl

各子应用接入要求（请给出每个子应用的示例）：
- app-user（React）：组件中使用 var(--primary-color) 替代硬编码颜色
- app-product（Vue）：SCSS 变量引用 CSS 变量：$primary: var(--primary-color)
- app-dashboard（原生 JS）：JS 中通过 getComputedStyle 读取 CSS 变量

Ant Design 主题对齐（shell-app）：
ConfigProvider token 与 CSS 变量同步：
- colorPrimary: 从 CSS 变量读取
- 使用 JS 动态读取 CSS 变量值传给 ConfigProvider

请给出完整的 theme.css 文件和各子应用的接入示例代码。
```

---

## 阶段七：性能优化

### T-106 ~ T-109 Bundle 分析与优化

```
请帮我对 ERP Lite 微前端项目进行 bundle 优化，当前各子应用 bundle 过大。

第一步：分析
请给出在 Webpack 5 项目中安装和使用 webpack-bundle-analyzer 的完整配置，
以及如何解读分析报告中的重复依赖。

第二步：配置 externals（Webpack 版本）
在 shell-app / app-user / app-order 的 webpack.config.js 中配置 externals：
- react → window.React
- react-dom → window.ReactDOM  
- axios → window.axios

同时在 shell-app 的 public/index.html 中添加对应的 CDN script 标签
（使用 unpkg 或 jsDelivr，锁定具体版本号）

第三步：配置 externals（Vite 版本）
在 app-product / app-dashboard 的 vite.config.ts 中使用 vite-plugin-externals 配置：
- vue → window.Vue
- axios → window.axios

第四步：路由级别代码分割
给出 app-order 中使用 React.lazy + Suspense 按路由拆分 chunk 的完整示例。

请给出所有配置文件的修改内容，以及优化前后 bundle 大小的对比验证方法。
```

---

### T-110 ~ T-111 预加载配置

```
请在主应用中配置 qiankun 子应用预加载策略，要求：

1. 在主应用完成首屏渲染后（React useEffect 中），
   按以下优先级调用 prefetchApps：
   - 立即预加载：app-user（使用频率最高）
   - 延迟 2 秒后预加载：app-order
   - 延迟 5 秒后预加载：app-product、app-dashboard

2. 预加载不应阻塞主线程：
   使用 requestIdleCallback（降级到 setTimeout）包裹预加载调用

3. 验证预加载效果：
   给出在 Chrome DevTools Network 面板中验证预加载是否生效的步骤，
   以及如何使用 performance.now() 记录「首次访问子应用的加载耗时」与「预加载后访问的耗时」对比数据

请给出完整的预加载配置代码和验证方法。
```

---

### T-112 ~ T-113 子应用缓存挂载

```
目前 qiankun 使用 registerMicroApps 注册子应用，切换路由时子应用会执行 unmount 和重新 mount。
我希望高频子应用（app-user、app-order）切走后不销毁，保留 DOM 和状态。

请帮我将这两个子应用改为使用 loadMicroApp 手动管理模式：

实现方案：
1. 在主应用创建 MicroAppManager（src/micro/manager.ts）：
   - 维护已加载子应用的 Map<name, MicroApp>
   - load(config): 若已加载则显示容器，否则调用 loadMicroApp 加载
   - hide(name): 将子应用容器设为 display:none（不卸载）
   - show(name): 将子应用容器设为 display:block
   - unmount(name): 真正卸载并从 Map 中移除

2. 修改主应用路由监听逻辑：
   - 路由切换时调用 manager.hide(前一个子应用) 和 manager.show(当前子应用)
   - 仅在用户显式退出登录时调用 manager.unmount 全部卸载

3. 注意事项：
   - 每个子应用需要独立的 container div（不能共用 #micro-app-container）
   - 给出如何处理「子应用处于隐藏状态时 ECharts resize 失效」的问题

请给出 manager.ts 的完整代码和路由监听逻辑的修改方案。
```

---

### T-114 ~ T-115 性能数据采集

```
请帮我为微前端项目添加性能数据采集，用于验收阶段评估优化效果。

1. 子应用加载耗时采集（各子应用 src/index.ts）
在 bootstrap / mount / unmount 生命周期的开始和结束添加 performance.mark：
- 'app-user:bootstrap:start' / 'app-user:bootstrap:end'
- 'app-user:mount:start' / 'app-user:mount:end'

2. 主应用汇总统计（shell-app/src/micro/perf.ts）
实现 getPerfReport() 函数：
- 使用 performance.measure 计算各生命周期耗时
- 返回格式化的性能报告对象

3. 控制台面板
实现一个悬浮的开发调试面板（仅开发环境显示）：
- 展示各子应用的加载耗时
- 展示当前内存占用（performance.memory）
- 一键清空 performance entries

4. 生成对比报告
给出一个 Markdown 模板，用于记录以下优化前后对比数据：
- 主应用 FCP
- 各子应用首次激活耗时
- 各子应用切换耗时（已缓存 vs 未缓存）
- 各 bundle 的 gzip 大小

请给出所有代码和报告模板。
```

---

## 阶段八：部署与上线

### T-116 ~ T-117 生产构建配置

```
请帮我完成各子应用的生产环境构建配置，要求：

1. 各应用生产环境 publicPath（在 webpack.config.js / vite.config.ts 中配置）：
   - shell-app: https://erp.company.com/
   - app-user: https://static.company.com/user/
   - app-product: https://static.company.com/product/
   - app-order: https://static.company.com/order/
   - app-dashboard: https://static.company.com/dashboard/

2. 验证资源路径正确性
   给出构建完成后验证 JS / CSS / 图片资源路径的方法：
   - 检查 HTML 中 script 标签的 src
   - 检查 JS chunk 中的动态 import 路径
   - 检查 CSS 中的图片 url() 路径

3. 构建产物目录结构
   给出期望的最终 dist/ 目录结构示例

请给出各应用的完整构建配置修改内容。
```

---

### T-118 ~ T-119 配置中心

```
请帮我实现子应用动态配置中心，替换主应用中硬编码的 registerMicroApps 配置。

后端接口 Mock（mock/micro-apps.json）：
返回以下结构，包含环境区分：
{
  "apps": [
    {
      "name": "app-user",
      "entry": "//static.company.com/user/",
      "activeRule": "/user",
      "enabled": true,
      "version": "1.2.0"
    },
    ...
  ]
}

主应用修改（shell-app/src/micro/register.ts）：
1. 启动时调用 GET /api/micro-apps/config 获取配置
2. 根据返回的配置动态调用 registerMicroApps
3. 加载配置失败时的降级处理（使用硬编码兜底配置）
4. 配置加载完成前显示 Loading 态

类型定义（shared/types/index.ts）：
补充 MicroAppConfig 类型，包含 name/entry/activeRule/enabled/version 字段

请给出完整代码，以及如何通过修改接口返回值来动态启用/禁用某个子应用。
```

---

### T-120 ~ T-121 Nginx 配置

```
请帮我编写 ERP Lite 项目的 Nginx 配置，分为主应用和子应用两部分。

主应用 Nginx（nginx/shell.conf）：
- 域名：erp.company.com
- 静态文件目录：/usr/share/nginx/html/shell
- History 路由 try_files 配置（所有路由回退到 index.html）
- 开启 gzip 压缩（JS / CSS / HTML）
- 静态资源缓存策略：HTML 不缓存，JS/CSS 缓存 1 年（文件名含 hash）

子应用静态资源 Nginx（nginx/static.conf）：
- 域名：static.company.com
- 各子应用路径映射：/user/ → /usr/share/nginx/html/user/
- 关键：必须添加 CORS 响应头（允许 erp.company.com 跨域访问）：
  Access-Control-Allow-Origin: https://erp.company.com
- 开启 gzip
- 长缓存策略

请给出完整的 nginx.conf 配置文件，并说明部署时的文件上传目录结构。
```

---

### T-122 ~ T-123 CI/CD 流水线

```
请为 ERP Lite 的每个子应用编写独立的 GitHub Actions CI/CD 流水线。

以 app-user 为例，生成 .github/workflows/app-user.yml：

触发条件：
- push 到 main 分支，且变更文件路径包含 packages/app-user/**

流水线步骤：
1. Checkout 代码
2. 安装 pnpm
3. 安装依赖（仅安装 app-user 及其依赖）
4. 运行 Lint 检查
5. 运行单元测试
6. 构建生产包（npm run build）
7. 上传产物到 CDN（示例：使用 AWS S3 + CloudFront）
8. 构建完成后发送通知（Slack webhook）

验证独立部署：
给出验证步骤：
- 只修改 app-user 代码并推送
- 确认只有 app-user 的流水线被触发
- 部署完成后，不重新构建主应用，直接验证主应用加载到新版本 app-user

请给出 app-user.yml 的完整内容，其他子应用照此模板修改即可。
```

---

### T-124 灰度发布

```
请帮我实现 app-user 的简单灰度发布方案。

场景：app-user 发布了 v2 版本，需要对 10% 的用户灰度，验证无问题后全量。

实现方案：

1. 部署两个版本：
   - v1：https://static.company.com/user/（当前生产版本）
   - v2：https://static.company.com/user-v2/（灰度版本）

2. 修改配置中心接口（mock/micro-apps.json）：
   返回带灰度规则的配置：
   {
     "name": "app-user",
     "versions": [
       { "entry": "//static.company.com/user/",    "weight": 90 },
       { "entry": "//static.company.com/user-v2/", "weight": 10 }
     ]
   }

3. 主应用灰度分流逻辑（shell-app/src/micro/gray.ts）：
   - 读取当前用户 ID，对其哈希取模
   - 根据权重决定加载哪个版本的 entry
   - 分流结果缓存到 sessionStorage，保证同一用户在一次会话中版本不变

请给出 gray.ts 的完整实现和配置中心接口的修改方案。
```

---

### T-125 ~ T-126 验收与复盘

```
项目开发接近尾声，请帮我整理验收材料。

第一部分：验收问题答案模板
请基于本项目的实现，给出以下 5 个验收问题的标准回答格式（我来填入具体结论）：

Q1: 子应用是如何做到 JS 隔离的？window 对象污染如何防止？
Q2: Vue 子应用和 React 子应用能共享同一个全局 Store 吗？本项目是怎么做的？
Q3: 子应用 A 修改了 document.title，切换到子应用 B 后如何还原？
Q4: 如何在不刷新页面的情况下，将子应用从 v1 热更新到 v2？
Q5: 主应用崩溃和子应用崩溃的边界如何隔离？

第二部分：项目复盘文档模板
生成一份 Markdown 复盘文档模板，包含以下章节：
- 项目概述（技术栈、规模、耗时）
- 做对了的决策（各选型的实际效果）
- 踩过的坑（问题现象 / 根本原因 / 解决方案）
- 性能数据汇总（填入实测数据）
- 微前端适合的场景 vs 不适合的场景（基于本项目经验总结）
- 如果重来一次，会有哪些不同的选择

请给出这两份文档的完整模板。
```

---

## 通用调试提示词

> 遇到问题时，使用以下提示词快速定位。

### 子应用加载失败

```
我的 qiankun 子应用加载失败，请帮我排查。

错误信息：【粘贴控制台错误】
子应用技术栈：【React/Vue】
构建工具：【Webpack/Vite】
当前配置：【粘贴 webpack.config.js 或 vite.config.ts 的关键部分】

请按以下顺序帮我检查：
1. output.libraryTarget 是否为 umd
2. output.publicPath 是否正确
3. devServer CORS 头是否配置
4. 生命周期函数是否正确导出
5. 是否存在多个 React/Vue 实例冲突
```

---

### 样式污染排查

```
我的微前端项目出现了样式污染问题：【描述现象，如「A 子应用的按钮样式影响了 B 子应用」】

项目配置：
- qiankun 样式隔离模式：【experimentalStyleIsolation / strictStyleIsolation】
- 污染方：【应用名称 + 使用的 UI 框架】
- 受影响方：【应用名称】

请帮我：
1. 分析可能的污染原因
2. 给出 Chrome DevTools 定位步骤
3. 给出修复方案代码
```

---

### 跨应用通信不生效

```
我使用 qiankun initGlobalState 实现跨应用通信，但通信没有生效。

通信场景：【描述：从哪个应用到哪个应用，传什么数据】
发送方代码：【粘贴 setGlobalState 调用代码】
接收方代码：【粘贴 onGlobalStateChange 监听代码】
错误现象：【是没有触发回调，还是数据不对】

请帮我排查可能的原因并给出修复方案。
常见问题提示：监听时机、action 重置时机、组件卸载后监听未取消。
```
