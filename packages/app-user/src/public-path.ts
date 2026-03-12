// src/public-path.ts
if ((window as any).__POWERED_BY_QIANKUN__) {
  // 动态设置 webpack 资源加载路径
  // @ts-ignore
  __webpack_public_path__ = (window as any).__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}