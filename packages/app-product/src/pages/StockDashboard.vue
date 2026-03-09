<template>
  <div class="stock-dashboard">
    <div class="page-header">
      <el-button @click="handleBack">返回列表</el-button>
      <h1>库存看板</h1>
    </div>

    <!-- 库存统计卡片 -->
    <div class="stock-cards">
      <div class="stock-card stock-card-total">
        <div class="card-icon">📦</div>
        <div class="card-content">
          <div class="card-label">总库存</div>
          <div class="card-value">{{ totalStock }}</div>
        </div>
      </div>
      <div class="stock-card stock-card-low">
        <div class="card-icon">⚠️</div>
        <div class="card-content">
          <div class="card-label">低库存商品</div>
          <div class="card-value">{{ lowStockCount }}</div>
        </div>
      </div>
      <div class="stock-card stock-card-value">
        <div class="card-icon">💰</div>
        <div class="card-content">
          <div class="card-label">库存总值</div>
          <div class="card-value">¥{{ totalValue.toFixed(2) }}</div>
        </div>
      </div>
    </div>

    <!-- 低库存预警列表 -->
    <div class="low-stock-section">
      <div class="section-header">
        <h3>低库存预警（库存 < 100）</h3>
        <el-button size="small" @click="loadProducts">刷新</el-button>
      </div>
      <el-table
        :data="lowStockProducts"
        v-loading="loading"
        border
        style="width: 100%"
      >
        <el-table-column prop="code" label="商品编码" width="120" />
        <el-table-column prop="name" label="商品名称" min-width="200" />
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="stock" label="当前库存" width="100">
          <template #default="{ row }">
            <span :class="{ 'stock-low': row.stock < 50, 'stock-medium': row.stock >= 50 && row.stock < 100 }">
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
          />
        </el-form-item>
        <el-form-item label="调整类型">
          <el-tag :type="adjustType === 'add' ? 'success' : 'warning'">
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
.stock-dashboard {
  padding: 20px;
}
.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 12px;
}
.page-header h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}
.stock-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}
.stock-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
}
.stock-card.stock-card-low {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}
.stock-card.stock-card-value {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}
.card-icon {
  font-size: 40px;
}
.card-content {
  flex: 1;
}
.card-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}
.card-value {
  font-size: 28px;
  font-weight: bold;
}
.low-stock-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.section-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}
.stock-low {
  color: #f56c6c;
  font-weight: bold;
}
.stock-medium {
  color: #e6a23c;
  font-weight: bold;
}
</style>
