<template>
  <div class="p-6 min-h-screen bg-white">
    <div class="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-100">
      <h1 class="m-0 text-2xl font-semibold text-gray-900">{{ isEdit ? '编辑商品' : '新增商品' }}</h1>
      <el-button @click="handleBack">返回列表</el-button>
    </div>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="max-w-4xl mx-auto p-8 bg-gradient-to-br from-gray-50 to-blue-100 rounded-xl shadow-xl"
    >
      <el-form-item label="商品编码" prop="code">
        <el-input v-model="form.code" placeholder="请输入商品编码" />
      </el-form-item>

      <el-form-item label="商品名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入商品名称" />
      </el-form-item>

      <el-form-item label="商品分类" prop="category">
        <el-select v-model="form.category" placeholder="请选择分类">
          <el-option
            v-for="cat in categories"
            :key="cat.id"
            :label="cat.name"
            :value="cat.code"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="商品价格" prop="price">
        <el-input-number v-model="form.price" :min="0" :precision="2" :step="0.01" class="w-full" />
      </el-form-item>

      <el-form-item label="库存数量" prop="stock">
        <el-input-number v-model="form.stock" :min="0" :precision="0" :step="1" class="w-full" />
      </el-form-item>

      <el-form-item label="商品状态" prop="status">
        <el-radio-group v-model="form.status" class="flex gap-6">
          <el-radio label="active" class="font-medium">上架</el-radio>
          <el-radio label="inactive" class="font-medium">下架</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="商品描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="请输入商品描述"
        />
      </el-form-item>

      <el-form-item label="商品图片">
        <el-upload
          v-model:file-list="fileList"
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          :limit="5"
          class="w-full"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="loading" class="px-8 py-3 font-medium rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
          {{ isEdit ? '更新' : '创建' }}
        </el-button>
        <el-button @click="handleBack" class="px-8 py-3 font-medium rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, type FormInstance, type FormRules, type UploadUserFile } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import type { ProductInfo } from '../types';
import { getProductDetail, createProduct, updateProduct } from '../api';
import { getCategoryList } from '../api';

const route = useRoute();
const router = useRouter();
const formRef = ref<FormInstance>();
const loading = ref(false);
const categories = ref<{ id: number; name: string; code: string }[]>([]);
const fileList = ref<UploadUserFile[]>([]);

const isEdit = computed(() => !!route.query.id);
const productId = computed(() => Number(route.query.id) || 0);

const form = ref<Partial<ProductInfo>>({
  name: '',
  code: '',
  category: '',
  price: 0,
  stock: 0,
  status: 'active',
  description: '',
});

const rules: FormRules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入商品编码', trigger: 'blur' }],
  category: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存数量', trigger: 'blur' }],
};

const loadProduct = async () => {
  if (!productId.value) return;
  try {
    const data = await getProductDetail(productId.value);
    form.value = { ...data };
  } catch (error) {
    console.error('Failed to load product:', error);
    ElMessage.error('加载商品信息失败');
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

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    loading.value = true;
    try {
      if (isEdit.value) {
        await updateProduct(productId.value, form.value);
        ElMessage.success('更新成功');
      } else {
        await createProduct(form.value);
        ElMessage.success('创建成功');
      }
      handleBack();
    } catch (error) {
      console.error('Failed to save product:', error);
      ElMessage.error(isEdit.value ? '更新失败' : '创建失败');
    } finally {
      loading.value = false;
    }
  });
};

const handleBack = () => {
  router.push({ path: '/product', query: { view: 'list' } });
};

onMounted(() => {
  loadCategories();
  if (isEdit.value) {
    loadProduct();
  }
});
</script>

<style scoped>
</style>
