<template>
<div>
  <el-card>
    <!-- 添加商品分类 -->
    <el-row>
      <el-col>
        <el-button type="primary" @click="showSetCateBtn">添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 分类列表 -->
    <el-table
      ref="catetTab"
      :data="cateList"
      row-key="cat_id"
      border
      :indent="16"
      size="medium"
      style="width: 100%"
    >
      <el-table-column width="70" label="序号" prop="parentIndex">
        <template v-slot="scope">
          <span v-if="scope.row.isIndex">{{scope.row.parentIndex}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cat_name" label="分类名称"  />
      <el-table-column label="是否有效" width="180" >
        <template v-slot="scope">
          <el-icon v-if="scope.row.cat_deleted === false" style="color: red"><CircleClose /></el-icon>
          <el-icon v-else style="color: lightgreen" ><CircleCheck /></el-icon>
        </template>
      </el-table-column>
      <el-table-column label="排序"  >
        <template v-slot="scope">
          <el-tag size="small" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="small" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="small" v-else type="warning">三级</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作"  >
        <template v-slot="scope">
          <el-button type="primary" size="small" :icon="Edit" @click="openEditCateBtn(scope.row.cat_id)">编辑</el-button>
          <el-button type="danger" size="small" :icon="Delete" @click="deleteCate(scope.row.cat_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:currentPage="querInfo.pagenum"
      v-model:page-size="querInfo.pagesize"
      :page-sizes="[5, 15, 30, 100]"
      layout="total, sizes, prev, pager, next"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
  <!-- 添加分类对话框 -->
  <el-dialog v-model="setCateDialogVisible" title="添加分类" @close="setCateDialogClosed" width="30%">
    <el-form
      ref="setCateFormRef"
      :model="addCateForm"
      :rules="setCateFormRules"
      label-width="70px"
    >
      <el-form-item label="分类名" prop="cat_name">
        <el-input v-model="addCateForm.cat_name" />
      </el-form-item>
      <el-form-item label="父级分类">
        <el-cascader
          :options="parentCateList"
          :props="cascaderProps"
          clearable
          v-model="selectedKeys"
          @change="parentCateChanged"

        />
      </el-form-item>
      <!--        按钮区域-->
      <el-form-item>
        <el-button type="primary" @click="setCateFormUpBtn(setCateFormRef)">提交</el-button>
        <el-button @click="setCateDialogVisible = false">关闭</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <!-- 编辑分类对话框 -->
  <el-dialog v-model="editCateDialogVisible" title="编辑分类" @close="editCateDialogClosed" width="30%">
    <el-form
      ref="editCateFormRef"
      :model="editCateForm"
      :rules="setCateFormRules"
      label-width="70px"
    >
      <el-form-item label="分类名" prop="cat_name">
        <el-input v-model="editCateForm.cat_name" />
      </el-form-item>
      <!--        按钮区域-->
      <el-form-item>
        <el-button type="primary" @click="editCateFormUpBtn(editCateFormRef)">提交</el-button>
        <el-button @click="editCateDialogVisible = false">关闭</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</div>
</template>

<script setup>
import api from '@/axios/config'
import { ref, reactive, onBeforeMount } from 'vue'
const { ElMessage, ElMessageBox } = require('element-plus')
const { Edit, Delete } = require('@element-plus/icons')

// 新增分类弹窗对象
const setCateFormRef = ref()

// 编辑分类表单
const editCateForm = reactive({
  cat_id: 0,
  cat_name: ''
})

// 编辑分类表单对象
const editCateFormRef = ref()

// 编辑分类提交
const editCateFormUpBtn = (formEl) => {
  formEl.validate(async (valid, fields) => {
    if (!valid) return
    const { data: res } = await api.put('categories/' + editCateForm.cat_id, { cat_name: editCateForm.cat_name })
    if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
    editCateDialogVisible.value = false
    ElMessage.success(res.meta.msg)
    getCateList()
  })
}

// 新增分类表单
const addCateForm = reactive({
  cat_name: '',
  cat_pid: 0,
  cat_level: 0
})
// 选中的父级分类的Id数组
const selectedKeys = ref([])

// 父级分类的列表
const parentCateList = ref()

// 选中项发送变化时触发
const parentCateChanged = () => {
  if (selectedKeys.value) {
    if (selectedKeys.value.length > 0) {
      addCateForm.cat_pid = selectedKeys.value[selectedKeys.value.length - 1]
      addCateForm.cat_level = selectedKeys.value.length
    }
  } else {
    addCateForm.cat_pid = 0
    addCateForm.cat_level = 0
  }
}

// 特殊字符校验
const checkSpecialKey = (str) => {
  const specialKey = '[/]'
  for (let i = 0; i < str.length; i++) {
    if (specialKey.indexOf(str.substr(i, 1)) !== -1) {
      return false
    }
  }
  return true
}

// 指定级联选择器的配置对象
const cascaderProps = reactive({
  value: 'cat_id',
  label: 'cat_name',
  children: 'children',
  expandTrigger: 'hover',
  checkStrictly: true
})

// 特殊字符校验规则
const validateInput = (rule, value, callback) => {
  if (!checkSpecialKey(value)) {
    callback(ElMessage.error('不能含有特殊字符'))
  } else {
    callback()
  }
}

// 打开分类编辑
const openEditCateBtn = async (id) => {
  const { data: res } = await api.get('categories/' + id)
  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
  editCateForm.cat_name = res.data.cat_name
  editCateForm.cat_id = res.data.cat_id
  editCateDialogVisible.value = true
}

// 分类对话框开关属性
const editCateDialogVisible = ref(false)

// 新增分类提交
const setCateFormUpBtn = async (formEl) => {
  formEl.validate(async (valid, fields) => {
    if (!valid) return
    const { data: res } = await api.post('categories', addCateForm)
    if (res.meta.status !== 201) return ElMessage.error(res.meta.msg)
    ElMessage.success(res.meta.msg)
    setCateDialogVisible.value = false
    getCateList()
  })
}

// 分类校验
const setCateFormRules = reactive({
  cat_name: [
    { required: true, message: '分类名不能为空', trigger: 'blur' },
    { validator: validateInput, trigger: ['blur', 'change'] },
    { min: 2, max: 26, message: '分类名长度在 3 到 26个字符', trigger: 'blur' }
  ]
})

// 新增分类触发值
const setCateDialogVisible = ref(false)

// 分类列表值接收
const cateList = ref([])

// 查询条件
const querInfo = reactive({
  type: 3,
  pagenum: 1,
  pagesize: 5
})

// 总数据量
const total = ref(0)

// 启动执行
onBeforeMount(() => {
  getCateList()
})

// 获取商品分类
const getCateList = async () => {
  const { data: res } = await api.get('/categories', { params: querInfo })
  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
  cateList.value = res.data.result
  cateList.value.forEach((item, index) => {
    item.isIndex = true
    item.parentIndex = index + 1
  })
  total.value = res.data.total
}

// 分页数
const handleCurrentChange = (newPage) => {
  querInfo.pagenum = newPage
  getCateList()
}

// 分页现实条数
const handleSizeChange = (newSize) => {
  querInfo.pagesize = newSize
  getCateList()
}

// 新增分类关闭事件
const setCateDialogClosed = () => {
  addCateForm.cat_id = 0
  addCateForm.cat_level = 0
  addCateForm.cat_name = ''
}

// 编辑分类关闭事件
const editCateDialogClosed = () =>{
  editCateForm.cat_name = ''
  editCateForm.cat_id = 0
}

// 获取父级分类的数据集
const getParentCateList = async () => {
  const { data: res } = await api.get('categories', { params: { type: 2 } })
  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
  parentCateList.value = res.data
}

// 新增分类按钮触发
const showSetCateBtn = async () => {
  getParentCateList()
  setCateDialogVisible.value = true
}

// 删除分类
const deleteCate = (id) => {
  ElMessageBox.confirm(
    '是否删除该分类?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      const { data: res } = await api.delete('categories/' + id)
      if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
      ElMessage.success(res.meta.msg)
      getCateList()
    })
    .catch(() => {
      getCateList()
      ElMessage.info('未执行删除操作')
    })
}

</script>

<style lang="less" scoped>
.el-cascader{
  width: 100%;
}
</style>
