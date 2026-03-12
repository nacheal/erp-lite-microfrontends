<template>
  <div class="product-list-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">商品管理</h1>
          <p class="page-subtitle">管理您的商品库存和信息</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" @click="handleAdd">
            <span class="btn-icon">+</span>
            新增商品
          </button>
          <button class="btn btn-secondary" @click="handleGoCategory">分类管理</button>
          <button class="btn btn-secondary" @click="handleGoStock">库存看板</button>
        </div>
      </div>
    </div>

    <div class="page-content">
      <!-- 搜索表单 -->
      <div class="search-card">
        <div class="search-form">
          <div class="form-group">
            <label class="form-label">关键词搜索</label>
            <el-input
              v-model="keyword"
              placeholder="搜索商品名称或编码"
              @keyup.enter="handleSearch"
              clearable
              size="large"
            />
          </div>
          <div class="form-group">
            <label class="form-label">商品分类</label>
            <el-select v-model="category" placeholder="全部分类" clearable size="large" class="form-select">
              <el-option label="全部分类" value="" />
              <el-option
                v-for="cat in categories"
                :key="cat.id"
                :label="cat.name"
                :value="cat.code"
              />
            </el-select>
          </div>
          <div class="form-group">
            <label class="form-label">商品状态</label>
            <el-select v-model="status" placeholder="全部状态" clearable size="large" class="form-select">
              <el-option label="全部状态" value="" />
              <el-option label="上架" value="active" />
              <el-option label="下架" value="inactive" />
            </el-select>
          </div>
          <div class="form-actions">
            <button class="btn btn-search" @click="handleSearch">搜索</button>
            <button class="btn btn-reset" @click="handleReset">重置</button>
          </div>
        </div>
      </div>

      <!-- 商品表格 -->
      <div class="table-card">
        <el-table
          :data="products"
          v-loading="loading"
          stripe
          style="width: 100%"
        >
          <el-table-column prop="id" label="ID" width="80" align="center" />
          <el-table-column prop="code" label="商品编码" width="140" />
          <el-table-column prop="name" label="商品名称" min-width="200" show-overflow-tooltip />
          <el-table-column prop="category" label="分类" width="120" />
          <el-table-column prop="price" label="价格" width="120" align="right">
            <template #default="{ row }">
              <span class="price-text">¥{{ row.price.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="库存" width="100" align="center">
            <template #default="{ row }">
              <span :class="['stock-text', row.stock < 10 ? 'stock-low' : '']">
                {{ row.stock }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180">
            <template #default="{ row }">
              <span class="date-text">{{ formatDate(row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right" align="center">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
                <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
                <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination-card">
        <span class="pagination-info">
          共 <span class="info-highlight">{{ total }}</span> 条记录，
          当前第 <span class="info-highlight">{{ page }}</span> 页
        </span>
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="prev, pager, next, sizes, jumper"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { ProductInfo } from '../types';
import { getProductList, deleteProduct } from '../api';
import { getCategoryList } from '../api';

const products = ref<ProductInfo[]>([]);
const loading = ref(false);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const keyword = ref('');
const category = ref('');
const status = ref('');
const categories = ref<{ id: number; name: string; code: string }[]>([]);

const loadProducts = async () => {
  loading.value = true;
  try {
    const response = await getProductList({
      page: page.value,
      pageSize: pageSize.value,
      keyword: keyword.value || undefined,
      category: category.value || undefined,
      status: status.value || undefined,
    });
    products.value = response.list;
    total.value = response.total;
  } catch (error) {
    console.error('Failed to load products:', error);
    ElMessage.error('加载商品列表失败');
  } finally {
    loading.value = false;
  }
};

const loadCategories = async () => {
  try {
    const data = await getCategoryList();
    categories.value = data;
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
};

const handleSearch = () => {
  page.value = 1;
  loadProducts();
};

const handleReset = () => {
  keyword.value = '';
  category.value = '';
  status.value = '';
  page.value = 1;
  loadProducts();
};

const handleAdd = () => {
  window.history.pushState(null, '', '/product?view=edit');
  // 触发自定义事件通知应用更新
  window.dispatchEvent(new CustomEvent('subapp-navigate', {
    detail: { url: '/product?view=edit' }
  }));
};

const handleView = (row: ProductInfo) => {
  window.history.pushState(null, '', `/product?view=edit&id=${row.id}`);
  window.dispatchEvent(new CustomEvent('subapp-navigate', {
    detail: { url: `/product?view=edit&id=${row.id}` }
  }));
};

const handleEdit = (row: ProductInfo) => {
  window.history.pushState(null, '', `/product?view=edit&id=${row.id}`);
  window.dispatchEvent(new CustomEvent('subapp-navigate', {
    detail: { url: `/product?view=edit&id=${row.id}` }
  }));
};

const handleGoCategory = () => {
  window.history.pushState(null, '', '/product?view=category');
  window.dispatchEvent(new CustomEvent('subapp-navigate', {
    detail: { url: '/product?view=category' }
  }));
};

const handleGoStock = () => {
  window.history.pushState(null, '', '/product?view=stock');
  window.dispatchEvent(new CustomEvent('subapp-navigate', {
    detail: { url: '/product?view=stock' }
  }));
};

const handleDelete = async (row: ProductInfo) => {
  try {
    await ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await deleteProduct(row.id);
    ElMessage.success('删除成功');
    loadProducts();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to delete product:', error);
      ElMessage.error('删除失败');
    }
  }
};

const handlePageChange = (p: number) => {
  page.value = p;
  loadProducts();
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  page.value = 1;
  loadProducts();
};

const getStatusType = (status: string) => {
  const statusMap: Record<string, any> = {
    active: 'success',
    inactive: 'info',
  };
  return statusMap[status] || 'info';
};

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    active: '上架',
    inactive: '下架',
  };
  return statusMap[status] || status;
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('zh-CN');
};

onMounted(() => {
  loadProducts();
  loadCategories();
});
</script>

<style scoped>
/* 容器 */
.product-list-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  padding: 2rem 2.5rem;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.header-text {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

/* 页面内容 */
.page-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 2.5rem;
}

/* 搜索卡片 */
.search-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  margin-bottom: 1.5rem;
  transition: box-shadow 0.3s ease;
}

.search-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.search-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  align-items: end;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  letter-spacing: 0.3px;
}

.form-select {
  width: 100%;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
}

/* 按钮样式 */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-secondary {
  background: #ffffff;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-secondary:hover {
  background: #667eea;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-search {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
}

.btn-search:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 87, 108, 0.5);
}

.btn-reset {
  background: #f3f4f6;
  color: #6b7280;
}

.btn-reset:hover {
  background: #e5e7eb;
  color: #374151;
}

.btn-icon {
  font-size: 1.25rem;
  font-weight: 700;
}

/* 表格卡片 */
.table-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 1.5rem;
  transition: box-shadow 0.3s ease;
}

.table-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

/* 表格内容样式 */
.price-text {
  color: #f59e0b;
  font-weight: 700;
  font-size: 1rem;
}

.stock-text {
  color: #111827;
  font-weight: 600;
}

.stock-low {
  color: #ef4444;
  font-weight: 700;
}

.date-text {
  color: #6b7280;
  font-size: 0.875rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

/* 分页卡片 */
.pagination-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.pagination-info {
  font-size: 0.9rem;
  color: #6b7280;
}

.info-highlight {
  font-weight: 700;
  color: #111827;
  font-size: 1rem;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .search-form {
    grid-template-columns: 1fr;
  }

  .form-actions {
    width: 100%;
  }

  .form-actions .btn {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 1.5rem 1rem;
  }

  .page-content {
    padding: 1.5rem 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .search-card {
    padding: 1.5rem;
  }

  .pagination-card {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
