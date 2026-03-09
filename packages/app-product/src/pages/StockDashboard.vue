<template>
  <div class="p-6 min-h-screen bg-white">
    <div class="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-100">
      <h1 class="m-0 text-2xl font-semibold text-gray-900">库存看板</h1>
      <el-button @click="handleBack">返回列表</el-button>
    </div>

    <!-- 库存统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      <div class="flex items-center gap-4 p-5 bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg text-white">
        <div class="text-4xl">📦</div>
        <div class="flex-1">
          <div class="text-sm opacity-90 mb-2">总库存</div>
          <div class="text-3xl font-bold">{{ totalStock }}</div>
        </div>
      </div>
      <div class="flex items-center gap-4 p-5 bg-gradient-to-r from-pink-500 to-red-600 rounded-lg text-white">
        <div class="text-4xl">⚠️</div>
        <div class="flex-1">
          <div class="text-sm opacity-90 mb-2">低库存商品</div>
          <div class="text-3xl font-bold">{{ lowStockCount }}</div>
        </div>
      </div>
      <div class="flex items-center gap-4 p-5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg text-white">
        <div class="text-4xl">💰</div>
        <div class="flex-1">
          <div class="text-sm opacity-90 mb-2">库存总值</div>
          <div class="text-3xl font-bold">¥{{ totalValue.toFixed(2) }}</div>
        </div>
      </div>
    </div>

    <!-- 低库存预警列表 -->
    <div class="bg-white rounded-lg p-5 shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="m-0 text-lg text-gray-900">低库存预警（库存 < 100）</h3>
        <el-button size="small" @click="loadProducts">刷新</el-button>
      </div>
      <el-table
        :data="lowStockProducts"
        v-loading="loading"
        border
        class="rounded-lg overflow-hidden"
      >
        <el-table-column prop="code" label="商品编码" width="120" />
        <el-table-column prop="name" label="商品名称" min-width="200" />
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="stock" label="当前库存" width="100">
          <template #default="{ row }">
            <span :class="{'text-red-600 font-bold': row.stock < 50, 'text-orange-600 font-bold': row.stock >= 50 && row.stock < 100}">
              {{ row.stock }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价" width="100">
          <template #default="{ row }">
            ¥{{ row.price.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="库存值" width="100">
          <template #default="{ row }">
            ¥{{ (row.price * row.stock).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              size="small"
              @click="handleAdjustStock(row, 'add')"
            >
              入库
            </el-button>
            <el-button
              link
              type="warning"
              size="small"
              @click="handleAdjustStock(row, 'subtract')"
            >
              出库
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 库存调整对话框 -->
    <el-dialog
      v-model="adjustDialogVisible"
      title="库存调整"
      width="400px"
    >
      <el-form label-width="100px">
        <el-form-item label="商品名称">
          <span>{{ currentProduct?.name }}</span>
        </el-form-item>
        <el-form-item label="当前库存">
          <span>{{ currentProduct?.stock }}</span>
        </el-form-item>
        <el-form-item label="调整数量">
          <el-input-number
            v-model="adjustAmount"
            :min="1"
            :max="adjustType === 'subtract' ? currentProduct?.stock || 0 : 9999"
            :precision="0"
            class="w-full"
          />
        </el-form-item>
        <el-form-item label="调整类型">
          <el-tag :type="adjustType === 'add' ? 'success' : 'warning'" class="font-medium px-3 py-1.5 rounded">
            {{ adjustType === 'add' ? '入库' : '出库' }}
          </el-tag>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="adjustDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmAdjust" :loading="adjustLoading">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { ProductInfo } from '../types';
import { getProductList, adjustStock } from '../api';

const router = useRouter();
const products = ref<ProductInfo[]>([]);
const loading = ref(false);
const adjustDialogVisible = ref(false);
const adjustLoading = ref(false);
const adjustType = ref<'add' | 'subtract'>('add');
const adjustAmount = ref(1);
const currentProduct = ref<ProductInfo | null>(null);

const lowStockProducts = computed(() => {
  return products.value.filter(p => p.stock < 100).sort((a, b) => a.stock - b.stock);
});

const lowStockCount = computed(() => lowStockProducts.value.length);

const totalStock = computed(() => {
  return products.value.reduce((sum, p) => sum + p.stock, 0);
});

const totalValue = computed(() => {
  return products.value.reduce((sum, p) => sum + p.price * p.stock, 0);
});

const loadProducts = async () => {
  loading.value = true;
  try {
    const response = await getProductList({
      page: 1,
      pageSize: 1000,
    });
    products.value = response.list;
  } catch (error) {
    console.error('Failed to load products:', error);
    ElMessage.error('加载商品列表失败');
  } finally {
    loading.value = false;
  }
};

const handleAdjustStock = (product: ProductInfo, type: 'add' | 'subtract') => {
  currentProduct.value = product;
  adjustType.value = type;
  adjustAmount.value = 1;
  adjustDialogVisible.value = true;
};

const handleConfirmAdjust = async () => {
  if (!currentProduct.value) return;
  adjustLoading.value = true;
  try {
    const newStock = adjustType.value === 'add'
      ? currentProduct.value.stock + adjustAmount.value
      : currentProduct.value.stock - adjustAmount.value;
    await adjustStock(currentProduct.value.id, newStock);
    ElMessage.success('库存调整成功');
    adjustDialogVisible.value = false;
    loadProducts();
  } catch (error) {
    console.error('Failed to adjust stock:', error);
    ElMessage.error('库存调整失败');
  } finally {
    adjustLoading.value = false;
  }
};

const handleBack = () => {
  router.push({ path: '/product', query: { view: 'list' } });
};

onMounted(() => {
  loadProducts();
});
</script>

<style scoped>
</style>
