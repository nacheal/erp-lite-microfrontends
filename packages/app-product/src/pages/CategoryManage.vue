<template>
  <div class="category-manage">
    <div class="page-header">
      <el-button @click="handleBack">返回列表</el-button>
      <h1>商品分类管理</h1>
    </div>

    <div class="tree-actions">
      <el-button type="primary" @click="handleAdd">新增分类</el-button>
    </div>

    <el-table
      :data="categories"
      row-key="id"
      border
      default-expand-all
      style="width: 100%"
    >
      <el-table-column prop="name" label="分类名称" width="200" />
      <el-table-column prop="code" label="分类编码" width="150" />
      <el-table-column prop="sort" label="排序" width="100" />
      <el-table-column prop="createTime" label="创建时间">
        <template #default="{ row }">
          {{ formatDate(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleAddChild(row)">
            新增子分类
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

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="父分类">
          <el-tree-select
            v-model="form.parentId"
            :data="categoryOptions"
            :props="{ label: 'name', value: 'id', children: 'children' }"
            placeholder="请选择父分类（不选则为顶级分类）"
            check-strictly
            clearable
            :disabled="isEditing"
          />
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入分类编码" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" :max="999" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import type { CategoryInfo } from '../types';
import { getCategoryList, createCategory, updateCategory, deleteCategory } from '../api';

const router = useRouter();
const formRef = ref<FormInstance>();
const categories = ref<CategoryInfo[]>([]);
const dialogVisible = ref(false);
const isEditing = ref(false);
const editId = ref<number | null>(null);
const loading = ref(false);

const form = ref<Partial<CategoryInfo>>({
  name: '',
  code: '',
  parentId: undefined,
  sort: 0,
});

const rules: FormRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入分类编码', trigger: 'blur' }],
};

const categoryOptions = computed(() => {
  // 将分类数据转换为树形选项
  return buildTree(categories.value);
});

const dialogTitle = computed(() => {
  if (isEditing.value) return '编辑分类';
  return '新增分类';
});

const buildTree = (items: CategoryInfo[], parentId: number | null = null): any[] => {
  return items
    .filter(item => item.parentId === parentId)
    .map(item => ({
      ...item,
      children: buildTree(items, item.id),
    }));
};

const loadCategories = async () => {
  try {
    const data = await getCategoryList();
    categories.value = data;
  } catch (error) {
    console.error('Failed to load categories:', error);
    ElMessage.error('加载分类列表失败');
  }
};

const handleAdd = () => {
  form.value = {
    name: '',
    code: '',
    parentId: undefined,
    sort: 0,
  };
  isEditing.value = false;
  editId.value = null;
  dialogVisible.value = true;
};

const handleAddChild = (row: CategoryInfo) => {
  form.value = {
    name: '',
    code: '',
    parentId: row.id,
    sort: 0,
  };
  isEditing.value = false;
  editId.value = null;
  dialogVisible.value = true;
};

const handleEdit = (row: CategoryInfo) => {
  form.value = {
    name: row.name,
    code: row.code,
    parentId: row.parentId,
    sort: row.sort,
  };
  isEditing.value = true;
  editId.value = row.id;
  dialogVisible.value = true;
};

const handleDelete = async (row: CategoryInfo) => {
  // 检查是否有子分类
  const hasChildren = categories.value.some(cat => cat.parentId === row.id);
  if (hasChildren) {
    ElMessage.warning('该分类下存在子分类，请先删除子分类');
    return;
  }

  try {
    await ElMessageBox.confirm('确定要删除该分类吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await deleteCategory(row.id);
    ElMessage.success('删除成功');
    loadCategories();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to delete category:', error);
      ElMessage.error('删除失败');
    }
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    loading.value = true;
    try {
      if (isEditing.value && editId.value) {
        await updateCategory(editId.value, form.value);
        ElMessage.success('更新成功');
      } else {
        await createCategory(form.value);
        ElMessage.success('创建成功');
      }
      dialogVisible.value = false;
      loadCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
      ElMessage.error(isEditing.value ? '更新失败' : '创建失败');
    } finally {
      loading.value = false;
    }
  });
};

const handleBack = () => {
  router.push({ path: '/product', query: { view: 'list' } });
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('zh-CN');
};

onMounted(() => {
  loadCategories();
});
</script>

<style scoped>
.category-manage {
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
.tree-actions {
  margin-bottom: 16px;
}
</style>
