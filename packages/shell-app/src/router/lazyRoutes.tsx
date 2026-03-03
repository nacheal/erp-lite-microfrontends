import React from 'react';

/**
 * 数据看板页面
 * 用于挂载 app-dashboard 子应用
 * qiankun 会自动根据路由激活规则 /dashboard 加载子应用
 */
export function Dashboard() {
  return (
    <div className="page-dashboard" style={{ height: '100%' }}>
      {/* qiankun 子应用挂载容器 */}
      <div id="subapp-viewport" style={{ height: '100%' }}></div>
    </div>
  );
}

/**
 * 用户管理页面
 * 用于挂载 app-user 子应用
 * qiankun 会自动根据路由激活规则 /user 加载子应用
 */
export function User() {
  return (
    <div className="page-user" style={{ height: '100%' }}>
      {/* qiankun 子应用挂载容器 */}
      <div id="subapp-viewport" style={{ height: '100%' }}></div>
    </div>
  );
}

/**
 * 商品管理页面
 * 用于挂载 app-product 子应用
 * qiankun 会自动根据路由激活规则 /product 加载子应用
 */
export function Product() {
  return (
    <div className="page-product" style={{ height: '100%' }}>
      {/* qiankun 子应用挂载容器 */}
      <div id="subapp-viewport" style={{ height: '100%' }}></div>
    </div>
  );
}

/**
 * 订单管理页面
 * 用于挂载 app-order 子应用
 * qiankun 会自动根据路由激活规则 /order 加载子应用
 */
export function Order() {
  return (
    <div className="page-order" style={{ height: '100%' }}>
      {/* qiankun 子应用挂载容器 */}
      <div id="subapp-viewport" style={{ height: '100%' }}></div>
    </div>
  );
}
