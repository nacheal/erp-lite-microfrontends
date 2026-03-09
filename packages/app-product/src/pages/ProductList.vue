<template>
  <div class="p-6 min-h-screen bg-white">
    <div class="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-100">
      <h1 class="m-0 text-2xl font-semibold text-gray-900">商品管理</h1>
    </div>

    <!-- 搜索表单 -->
    <div class="flex flex-wrap gap-4 items-center mb-6 p-5 bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg shadow-lg">
      <el-input
        v-model="keyword"
        placeholder="搜索商品名称或编码"
        @keyup.enter="handleSearch"
        clearable
        class="flex-1 min-w-[200px] max-w-[280px]"
      />
      <el-select v-model="category" placeholder="选择分类" clearable class="flex-1 min-w-[200px] max-w-[280px]">
        <el-option label="全部分类" value="" />
        <el-option
          v-for="cat in categories"
          :key="cat.id"
          :label="cat.name"
          :value="cat.code"
        />
      </el-select>
      <el-select v-model="status" placeholder="选择状态" clearable class="flex-1 min-w-[200px] max-w-[280px]">
        <el-option label="全部状态" value="" />
        <el-option label="上架" value="active" />
        <el-option label="下架" value="inactive" />
      </el-select>
      <div class="flex gap-2 ml-auto">
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex gap-3 mb-4">
      <el-button type="primary" @click="handleAdd" class="px-6 py-3 font-medium rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">新增商品</el-button>
      <el-button @click="handleGoCategory" class="px-6 py-3 font-medium rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">分类管理</el-button>
      <el-button @click="handleGoStock" class="px-6 py-3 font-medium rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">库存看板</el-button>
    </div>

    <!-- 商品表格 -->
    <el-table
      :data="products"
      v-loading="loading"
      border
      class="rounded-lg overflow-hidden shadow-md"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="code" label="商品编码" width="120" />
      <el-table-column prop="name" label="商品名称" min-width="200" />
      <el-table-column prop="category" label="分类" width="120" />
      <el-table-column prop="price" label="价格" width="100">
        <template #default="{ row }">
          ¥{{ row.price.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="库存" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)" class="font-medium px-3 py-1.5 rounded">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleView(row)">
            查看
          </el-button>
          <el-button link type="primary" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button link type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="flex justify-between items-center mt-6 py-4">
      <span class="text-gray-600 text-sm font-medium">共 {{ total }} 条记录，当前第 {{ page }} 页</span>
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="prev, pager, next, sizes, jumper"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        class="flex items-center"
      />
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
</style>
