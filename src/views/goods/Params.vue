<template>
  <div>
    <!-- 卡片视图区域   -->
    <el-card>
      <!-- 警告区域-->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon/>
      <!--选择商品分类区域-->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            :options="parentCateList"
            :props="cascaderProps"
            v-model="selectedKeys"
            @change="parentCateChanged"
          />
        </el-col>
      </el-row>
<!--      tab 页签区域-->
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
<!--        添加动态参数的面板-->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="small" :disabled="!showBtn"  @click="addDialogVisible = true">添加参数</el-button>
<!--          动态参数表格-->
          <el-table
            ref="manyTableref"
            :data="manyTableData"
            row-key="attr_id"
            border
            stripe
            :indent="16"
            size="medium"
            style="width: 100%"
          >
            <el-table-column type="expand" label="# " >
              <template v-slot="scope">
                <!--                循环渲染Tag标签-->
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                >{{ item }}</el-tag>
<!--                输入文本框-->
                <el-input
                  v-if="scope.row.inputVisible"
                  ref="InputRef"
                  v-model="scope.row.inputValue"
                  class="imput-new-tag"
                  @keyup.enter="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                />
<!--                添加按钮-->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column width="70" type="index" label="序号" />
            <el-table-column label="参数名称" prop="attr_name" />
            <el-table-column label="操作"  >
              <template v-slot="scope">
                <el-button type="primary" size="small" :icon="Edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" size="small" :icon="Delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
<!--        添加静态属性的面板-->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="small" :disabled="!showBtn" @click="addDialogVisible = true">添加属性</el-button>
<!--          静态属性表格-->
          <el-table
            ref="onlyTableref"
            :data="onlyTableData"
            row-key="attr_id"
            border
            stripe
            :indent="16"
            size="medium"
            style="width: 100%"
          >
            <el-table-column type="expand" label="# " >
              <template v-slot="scope">
                <!--                循环渲染Tag标签-->
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                >{{ item }}</el-tag>
                <!--                输入文本框-->
                <el-input
                  v-if="scope.row.inputVisible"
                  ref="InputRef"
                  v-model="scope.row.inputValue"
                  class="imput-new-tag"
                  @keyup.enter="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                />
                <!--                添加按钮-->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column width="70" type="index" label="序号" />
            <el-table-column label="参数名称" prop="attr_name" />
            <el-table-column label="参数值" prop="attr_vals" />
            <el-table-column label="操作"  >
              <template v-slot="scope">
                <el-button type="primary" size="small" :icon="Edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" size="small" :icon="Delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
<!--添加对话框-->
    <el-dialog
      v-model="addDialogVisible"
      :title="'添加'+ titleText()"
      width="50%"
      @close="addHandleClose"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="100px"
      >
        <el-form-item :label="titleText()" prop="attr_name">
          <el-input v-model="addForm.attr_name" />
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="addParams(addFormRef)"
        >确定</el-button
        >
      </span>
      </template>
    </el-dialog>
    <!--编辑对话框-->
    <el-dialog
      v-model="editDialogVisible"
      :title="'编辑'+ titleText()"
      width="50%"
      @close="editHandleClose"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="addFormRules"
        label-width="100px"
      >
        <el-form-item :label="titleText()" prop="attr_name">
          <el-input v-model="editForm.attr_name" />
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="editParams(editFormRef)"
        >确定</el-button
        >
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import api from '@/axios/config'
import { ref, reactive, onBeforeMount } from 'vue'
const { ElMessage, ElMessageBox } = require('element-plus')
const { nextTick } = require('vue')
const { Edit, Delete } = require('@element-plus/icons')

// 父级分类的列表
const parentCateList = ref()

// 获取父级分类的数据集
const getParentCateList = async () => {
  const { data: res } = await api.get('categories', { params: { type: 3 } })
  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
  parentCateList.value = res.data
}

// 控制按钮的启用或禁用
const showBtn = ref(false)

// 被激活页签的名称
const activeName = ref('many')

// 启动执行
onBeforeMount(() => {
  getParentCateList()
})

// 页签切换事件
const handleTabsClick = () => {
  if (selectedKeys.value.length > 0) {
    getParamsData()
  }
}
// 指定级联选择器的配置对象
const cascaderProps = reactive({
  value: 'cat_id',
  label: 'cat_name',
  children: 'children',
  expandTrigger: 'hover'
})

// 选中的父级分类的Id数组
const selectedKeys = ref([])

// 选中项发送变化时触发
const parentCateChanged = () => {
  if (selectedKeys.value) {
    if (selectedKeys.value.length < 3) {
      selectedKeys.value = []
      manyTableData.value = []
      onlyTableData.value = []
      showBtn.value = false
    } else {
      showBtn.value = true
      cateId.value = selectedKeys.value[selectedKeys.value.length - 1]
      getParamsData()
    }
  }
}

// 参数列表
const manyTableData = ref()

// 属性列表
const onlyTableData = ref()

// 获取参数的列表数据
const getParamsData = async () => {
  // 根据所选分类的id，和当前所处的面板，获取对应的参数
  const { data: res } = await api.get(`categories/${selectedKeys.value[2]}/attributes`, { params: { sel: activeName.value } })
  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
  res.data.forEach(item => {
    item.attr_vals = item.attr_vals
      ? item.attr_vals.split(' ')
      : []
    item.inputVisible = false
    item.inputValue = ''
  })
  if (activeName.value === 'many') {
    manyTableData.value = res.data
  } else {
    onlyTableData.value = res.data
  }
}

// 添加参数的表单数据对象
const addForm = reactive({
  attr_name: ''
})

// 表单验证规则对象
const addFormRules = reactive({
  attr_name: [
    { required: true, message: '参数名不能为空', trigger: 'blur' },
    { min: 2, max: 26, message: '参数名长度在 3 到 26个字符', trigger: 'blur' }
  ]
})

// 对话框显示属性
const addDialogVisible = ref(false)

// 对话框名称
const titleText = () => {
  if (activeName.value === 'many') {
    return '动态参数'
  } else {
    return '静态属性'
  }
}
// 监听添加对话框的关闭事件
const addHandleClose = () => {
  addForm.attr_name = ''
}

// 选择的分类的id
const cateId = ref(0)

// 表单实例
const addFormRef = ref()

// 新增分类属性提交
const addParams = (formEl) => {
  formEl.validate(async (valid, fields) => {
    if (!valid) return
    const { data: res } = await api.post(`categories/${cateId.value}/attributes`, { attr_name: addForm.attr_name, attr_sel: activeName.value })
    if (res.meta.status !== 201) return ElMessage.error(res.meta.msg)
    ElMessage.success(res.meta.msg)
    addDialogVisible.value = false
    getParamsData()
  })
}

// 展示修改对话框
const showEditDialog = async (id) => {
  const { data: res } = await api.get(`categories/${cateId.value}/attributes/${id}`, { params: { attr_sel: activeName.value } })
  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
  editForm.attr_name = res.data.attr_name
  editForm.attr_id = res.data.attr_id
  editDialogVisible.value = true
}

// 编辑对话框显示属性
const editDialogVisible = ref(false)

// 编辑对话框表单实例
const editFormRef = ref()

// 编辑对话框关闭事件
const editHandleClose = () => {
  editFormRef.value.resetFields()
}

// 编辑对话框表单提交
const editParams = (formEl) => {
  formEl.validate(async (valid, fields) => {
    if (!valid) return
    const { data: res } = await api.put(`categories/${cateId.value}/attributes/${editForm.attr_id}`, { attr_name: editForm.attr_name, attr_sel: activeName.value })
    if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
    ElMessage.success(res.meta.msg)
    editDialogVisible.value = false
    getParamsData()
  })
}

// 编辑表单
const editForm = reactive({
  atty_name: '',
  attr_id: 0
})

// 删除属性
const deleteParams = (id) => {
  ElMessageBox.confirm(
    '是否删除该属性?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      const { data: res } = await api.delete(`categories/${cateId.value}/attributes/${id}`)
      if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
      ElMessage.success(res.meta.msg)
      getParamsData()
    })
    .catch(() => {
      getParamsData()
      ElMessage.info('未执行删除操作')
    })
}

// 文本框对象
const InputRef = ref()

// 文本框失去焦点或按下Enter都会触发
const handleInputConfirm = async (row) => {
  if (row.inputValue.trim().length === 0) {
    row.inputValue = ''
    row.inputVisible = false
  } else {
    row.attr_vals.push(row.inputValue.trim())
    row.inputValue = ''
    row.inputVisible = false
    savaAttrvals(row)
  }
}

// 点击按钮展示文本输入框
const showInput = (row) => {
  row.inputVisible = true
  nextTick(() => {
    InputRef.value.input.focus()
  })
}
// 更新参数属性数据
const savaAttrvals = async (row) => {
  const { data: res } = await api.put(`categories/${cateId.value}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ') })
  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
  ElMessage.success(res.meta.msg)
}

// Tag关闭触发
const handleClose = async (index, row) => {
  row.attr_vals.splice(index, 1)
  row.inputValue = ''
  row.inputVisible = false
  savaAttrvals(row)
}
</script>

<style lang="less" scoped>
.el-row{
  margin: 10px 0;
}

.el-tag{
  margin: 5px 10px;
}
.imput-new-tag{
  width: 120px;
  margin: 5px 10px;
}
.button-new-tag{
  margin: 5px 10px;
}
</style>
