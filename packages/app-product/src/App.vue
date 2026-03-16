<template>
  <div class="w-full h-full">
    <!-- 用户信息显示区域 - 用于验证 props 传递 -->
    <div
      v-if="userInfo"
      style="
        padding: 16px;
        margin-bottom: 16px;
        background-color: #f0f2f5;
        border-radius: 8px;
        border: 1px solid #d9d9d9;
      "
    >
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
        <h3 style="margin: 0; font-size: 16px; font-weight: 600">
          当前用户信息（来自主应用 props）
        </h3>
        <button
          @click="handleLogout"
          style="
            padding: 6px 16px;
            background-color: #ff4d4f;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          "
        >
          退出登录
        </button>
      </div>
      <div style="font-size: 14px; line-height: 24px">
        <p style="margin: 0"><strong>用户名：</strong>{{ userInfo.name }}</p>
        <p style="margin: 0"><strong>角色：</strong>{{ userInfo.role }}</p>
        <p style="margin: 0"><strong>用户ID：</strong>{{ userInfo.id }}</p>
        <p style="margin: 0">
          <strong>权限：</strong>{{ userInfo.permissions?.join(', ') || '无' }}
        </p>
        <p style="margin: 0">
          <strong>Token：</strong>{{ token ? `${token.substring(0, 20)}...` : '无' }}
        </p>
      </div>
    </div>

    <ProductList v-if="view === 'list'" />
    <ProductEdit v-else-if="view === 'edit'" />
    <CategoryManage v-else-if="view === 'category'" />
    <StockDashboard v-else-if="view === 'stock'" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watchEffect } from 'vue';
import ProductList from './pages/ProductList.vue';
import ProductEdit from './pages/ProductEdit.vue';
import CategoryManage from './pages/CategoryManage.vue';
import StockDashboard from './pages/StockDashboard.vue';
import { useUserInfo, useQiankunProps, useGlobalState } from './qiankun';

// 获取用户信息
const { userInfo, token, isAuthenticated } = useUserInfo();
const qiankunProps = useQiankunProps();
const { setGlobalState } = useGlobalState();

// 在控制台打印接收到的 props，用于调试
watchEffect(() => {
  console.log('[app-product] Qiankun Props:', qiankunProps);
  console.log('[app-product] 用户信息:', userInfo.value);
  console.log('[app-product] Token:', token.value);
  console.log('[app-product] 是否已认证:', isAuthenticated.value);
});

// 处理退出登录
const handleLogout = () => {
  console.log('[app-product] 触发退出登录 action');
  // 通过全局状态通知主应用退出登录
  setGlobalState({ action: 'LOGOUT' });
};

const currentQuery = ref(new URLSearchParams(window.location.search));

// 根据查询参数决定显示哪个视图
const view = computed(() => {
  const viewParam = currentQuery.value.get('view') || 'list';
  return viewParam;
});

// 监听子应用内部路由变化
let unsubscribe: (() => void) | null = null;

onMounted(() => {
  // 监听 URL 查询参数变化
  const handleUrlChange = () => {
    currentQuery.value = new URLSearchParams(window.location.search);
  };

  // 监听 popstate 事件（浏览器前进后退）
  window.addEventListener('popstate', handleUrlChange);

  // 如果需要在子应用内部导航，可以监听自定义事件
  const handleNavigate = (event: CustomEvent) => {
    window.history.pushState(null, '', event.detail.url);
    currentQuery.value = new URLSearchParams(window.location.search);
  };

  window.addEventListener('subapp-navigate', handleNavigate as EventListener);

  unsubscribe = () => {
    window.removeEventListener('popstate', handleUrlChange);
    window.removeEventListener('subapp-navigate', handleNavigate as EventListener);
  };
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});
</script>

<style scoped>
</style>
