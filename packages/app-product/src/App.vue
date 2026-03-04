<template>
  <div class="app-product">
    <ProductList />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import ProductList from './pages/ProductList.vue';

// 监听子应用内部路由变化
let unsubscribe: (() => void) | null = null;

onMounted(() => {
  // 如果需要添加子路由功能，可以在这里实现
  // 目前先只展示商品列表
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
