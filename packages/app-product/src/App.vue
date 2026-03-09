<template>
  <div class="app-product">
    <ProductList v-if="view === 'list'" />
    <ProductEdit v-else-if="view === 'edit'" />
    <CategoryManage v-else-if="view === 'category'" />
    <StockDashboard v-else-if="view === 'stock'" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import ProductList from './pages/ProductList.vue';
import ProductEdit from './pages/ProductEdit.vue';
import CategoryManage from './pages/CategoryManage.vue';
import StockDashboard from './pages/StockDashboard.vue';

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
.app-product {
  width: 100%;
  height: 100%;
}
</style>
