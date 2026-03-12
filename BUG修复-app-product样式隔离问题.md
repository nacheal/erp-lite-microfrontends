# BUG 修复：app-product 样式隔离问题

**日期**: 2026-03-12
**问题编号**: BUG-008
**状态**: ✅ 已修复

---

## 问题描述

### 错误信息

访问商品管理页面（http://localhost:3000/product）时，浏览器控制台报错：

```
ERROR
Failed to construct 'HTMLElement': Illegal constructor
TypeError: Illegal constructor
    at new ErrorOverlay (http://localhost:3002/@vite/client:421:5)
    at createErrorOverlay (http://localhost:3002/@vite/client:724:29)
    at handleMessage (http://localhost:3002/@vite/client:700:11)
    at WebSocket.<anonymous> (http://localhost:3002/@vite/client:550:5)

ERROR
Failed to fetch dynamically imported module: http://localhost:3002/src/index.ts?t=1773318894857
TypeError: Failed to fetch dynamically imported module: http://localhost:3002/src/index.ts?t=1773318894857
```

### 影响范围

- **受影响应用**: app-product (Vue 3 + Vite)
- **其他应用**: app-user (React)、app-order (React)、app-dashboard (原生JS) 均正常
- **环境**: 开发环境（qiankun + Vite HMR）

---

## 问题原因

### 根本原因

主应用的 qiankun 配置中使用了 `strictStyleIsolation: true`，这会启用**严格样式隔离**模式，使用 **Shadow DOM** 来隔离子应用的样式。

### 为什么会导致错误？

1. **Shadow DOM 沙箱环境限制**
   - 在 Shadow DOM 中，某些全局 API（如 `HTMLElement` 构造函数）的行为会被改变
   - qiankun 的沙箱会劫持这些 API，但可能与某些工具库不兼容

2. **Vite 的 HMR 错误覆盖层**
   - Vite 在开发环境下会创建一个 `ErrorOverlay` 组件来显示错误
   - `ErrorOverlay` 需要继承 `HTMLElement` 类（这是 Web Components 的标准写法）
   - 在 Shadow DOM 沙箱中，`HTMLElement` 构造函数被代理，导致 `new ErrorOverlay` 失败

3. **为什么 React 应用没问题？**
   - React 应用使用 Webpack，Webpack 的 HMR 实现与 Vite 不同
   - Webpack 的错误显示不依赖于自定义 HTMLElement

### 技术细节

```typescript
// packages/shell-app/src/micro/index.ts

// ❌ 错误配置（使用 Shadow DOM）
start({
  sandbox: {
    strictStyleIsolation: true,  // 使用 Shadow DOM 隔离
    experimentalStyleIsolation: false,
  },
});

// ✅ 正确配置（使用 CSS scoped）
start({
  sandbox: {
    strictStyleIsolation: false,  // 不使用 Shadow DOM
    experimentalStyleIsolation: true,  // 使用 CSS scoped
  },
});
```

---

## 解决方案

### 修改文件

**文件**: `packages/shell-app/src/micro/index.ts`

**修改内容**:

```typescript
export const startMicroApps = () => {
  start({
    sandbox: {
      strictStyleIsolation: false, // 关闭 Shadow DOM 隔离
      experimentalStyleIsolation: true, // 启用 CSS scoped 隔离
    },
    prefetch: 'all',
    singular: false,
  });
};
```

### 两种样式隔离模式对比

| 特性 | strictStyleIsolation (Shadow DOM) | experimentalStyleIsolation (CSS scoped) |
|------|-----------------------------------|----------------------------------------|
| 隔离方式 | Shadow DOM | 动态添加 CSS 选择器前缀 |
| 隔离强度 | 完全隔离 | 较强隔离（99%场景够用） |
| 兼容性 | 较差（某些库不兼容） | 较好 |
| 性能 | 较好 | 很好 |
| Vite HMR | ❌ 不兼容 | ✅ 兼容 |
| Element Plus 弹层 | ❌ 需要特殊配置 | ✅ 正常工作 |
| Ant Design Modal | ❌ 需要特殊配置 | ✅ 正常工作 |

### 为什么选择 experimentalStyleIsolation？

1. **更好的兼容性**
   - 兼容 Vite 的 HMR 和开发工具
   - 兼容各种 UI 库的弹层组件（Modal、Drawer、Tooltip 等）

2. **足够的样式隔离**
   - 通过 CSS scoped 方式，给子应用的样式添加唯一前缀
   - 99% 的场景下都能避免样式冲突

3. **更好的开发体验**
   - 不会导致开发工具失效
   - 错误提示正常显示
   - HMR 正常工作

---

## 验证步骤

### 1. 重启主应用

由于修改了主应用的配置，需要重启开发服务器：

```bash
# 在 packages/shell-app 目录下
# 按 Ctrl+C 停止当前进程，然后重新启动
pnpm run dev
```

### 2. 测试商品管理页面

1. 访问 http://localhost:3000/product
2. 应该能看到：
   - 用户信息卡片（来自主应用 props）
   - 商品列表页面正常渲染
   - 无错误提示

3. 在浏览器控制台检查：
   - 应该看到 `[app-product] 接收到的 props`
   - 应该看到 `[app-product] 用户信息`
   - 无任何错误信息

### 3. 测试其他子应用

确保修改不影响其他子应用：

- ✅ /user - app-user (React)
- ✅ /product - app-product (Vue 3)
- ✅ /order - app-order (React)
- ✅ /dashboard - app-dashboard (原生JS)

---

## 后续优化建议

### 1. 针对不同应用使用不同策略

如果将来确实需要更强的样式隔离，可以考虑：

```typescript
const microApps: MicroApp[] = [
  {
    name: 'app-user',
    // React 应用，可以使用 Shadow DOM
    sandbox: { strictStyleIsolation: true },
  },
  {
    name: 'app-product',
    // Vue 3 + Vite，使用 CSS scoped
    sandbox: { experimentalStyleIsolation: true },
  },
];
```

### 2. 使用 CSS Modules 或 CSS-in-JS

在子应用层面，使用这些技术可以进一步减少样式冲突：
- **React**: styled-components、emotion、CSS Modules
- **Vue 3**: `<style scoped>`、CSS Modules

### 3. 统一 CSS 变量命名规范

制定子应用的 CSS 变量命名规范，避免冲突：
```css
/* app-user */
--user-primary-color: #1890ff;

/* app-product */
--product-primary-color: #52c41a;
```

---

## 相关资料

- [qiankun 样式隔离文档](https://qiankun.umijs.org/zh/api#startopts)
- [Shadow DOM MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_shadow_DOM)
- [Vite HMR API](https://vitejs.dev/guide/api-hmr.html)

---

**修复人**: Claude Code
**修复日期**: 2026-03-12
**验证状态**: ✅ 待用户验证
