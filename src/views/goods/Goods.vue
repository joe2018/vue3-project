<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input
          v-model="queryInfo.query"
          placeholder="请输入内容"
          :clearable="true"
          style="width: 300px"
          @change="searchChange()"
        >
          <template #prepend>
            <el-button :icon="Search" @click="getGoodsList"/>
          </template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="goAddPage">添加商品</el-button>
      </el-col>
    </el-row>
    <el-table :data="goodsList" border stripe style="width: 100%">
      <el-table-column fixed type="index" label="序号" />
      <el-table-column fixed prop="goods_id" label="商品sku" />
      <el-table-column prop="goods_name" label="商品名称" width="350"/>
      <el-table-column prop="goods_price" label="商品价格（元）" />
      <el-table-column prop="goods_weight" label="商品重量" />
      <el-table-column prop="goods_number" label="商品数量" />
      <el-table-column prop="add_time" label="创建时间" >
        <template v-slot="scope">
          {{ $filters.format(scope.row.add_time) }}
        </template>
      </el-table-column>
      <el-table-column prop="upd_time" label="更新时间" >
        <template v-slot="scope">
          {{ $filters.format(scope.row.upd_time) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template v-slot="scope">
          <!--            编辑-->
          <el-tooltip
            effect="dark"
            content="编辑"
            placement="top"
            :enterable="false"
          >
            <el-button type="primary" size="small" :icon="Edit" @click="showGoodsEditDialog(scope.row.goods_id)">
              编辑
            </el-button>
          </el-tooltip>
          <!--            删除-->
          <el-tooltip
            effect="dark"
            content="删除"
            placement="top"
            :enterable="false"
          >
            <el-button type="danger" size="small" :icon="Delete" @click="deleteGoods(scope.row.goods_id)">删除</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:currentPage="queryInfo.pagenum"
      v-model:page-size="queryInfo.pagesize"
      :page-sizes="[1, 3, 5, 10]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 编辑商品 -->
    <el-dialog v-model="editGoodsDialogVisible" title="编辑商品" @close="editGoodsDialogClosed(editGoodsFormRef)">
      <el-form
        ref="editGoodsFormRef"
        :model="editGoodsForm"
        :rules="setGoodsmRules"
        label-width="150px"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editGoodsForm.goods_name" />
        </el-form-item>
        <el-form-item label="商品价格（元）" prop="goods_price">
          <el-input type="number" v-model="editGoodsForm.goods_price" />
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input type="number" v-model="editGoodsForm.goods_weight" />
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input type="number" v-model="editGoodsForm.goods_number" />
        </el-form-item>
        <!--        按钮区域-->
        <el-form-item>
          <el-button type="primary" @click="editGoodsFormUp(editGoodsFormRef)">提交</el-button>
          <el-button @click="editGoodsDialogVisible = false">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>

</template>

<script setup>
import api from '@/axios/config'
import { ref, reactive, onBeforeMount } from 'vue'
import { inject } from 'vue-demi'
const { Search, Edit, Delete } = require('@element-plus/icons')
const { ElMessage, ElMessageBox } = require('element-plus')

onBeforeMount(() => {
  getGoodsList()
})
const queryInfo = reactive({
  quert: '',
  pagenum: 1,
  pagesize: 10
})

// 获取商品列表
const getGoodsList = async () => {
  const { data: res } = await api.get('goods', { params: queryInfo })
  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
  goodsList.value = res.data.goods
  total.value = res.data.total
}

// 总条数
const total = ref(0)

// 商品列表
const goodsList = ref([])

// 打开商品编辑弹窗
const showGoodsEditDialog = async (id) => {
  const { data: res } = await api.get(`goods/${id}`)
  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
  editGoodsForm.goods_name = res.data.goods_name
  editGoodsForm.goods_number = res.data.goods_number
  editGoodsForm.goods_price = res.data.goods_price
  editGoodsForm.goods_weight = res.data.goods_weight
  editGoodsDialogVisible.value = true
}
// 删除商品
const deleteGoods = (id) => {
  ElMessageBox.confirm(
    '是否删除该商品?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      const { data: res } = await api.delete(`goods/${id}`)
      if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
      ElMessage.success(res.meta.msg)
      getGoodsList()
    })
    .catch(() => {
      getGoodsList()
      ElMessage({
        type: 'info',
        message: '未执行删除操作'
      })
    })
}
// 所在分页
const handleCurrentChange = (newPage) => {
  queryInfo.pagenum = newPage
  getGoodsList()
}
// 分页显示条数
const handleSizeChange = (newSize) => {
  queryInfo.pagesize = newSize
  getGoodsList()
}

// 跳转新增商品页面
const goAddPage = () => {
  window.router.push({ path: 'add' })
  reload()
}

// 查询
const searchChange = () => {
  getGoodsList()
}

// 新增商品字段校验规则
const setGoodsmRules = reactive({
  goods_name: [
    { required: true, message: '商品名不能为空', trigger: 'blur' },
    { min: 2, max: 26, message: '商品名长度在 3 到 26个字符', trigger: 'blur' }
  ],
  goods_price: [
    { required: true, message: '价格不能为空', trigger: 'blur' }
  ],
  goods_weight: [
    { required: true, message: '不能为空', trigger: 'blur' }
  ],
  goods_number: [
    { required: true, message: '不能为空', trigger: 'blur' }
  ]
})

// 商品编辑表单实例
const editGoodsFormRef = ref()

// 商品编辑弹出框实例
const editGoodsDialogVisible = ref()

// 商品编辑表单
const editGoodsForm = reactive({
  goods_name: '',
  goods_price: 0,
  goods_weight: 0,
  goods_number: 0
})

// 商品编辑表单提交
const editGoodsFormUp = (ELform) => {

}

// 编辑商品表单关闭事件
const editGoodsDialogClosed = (ELform) => {
  ELform.resetFields()
}

// 引入页面刷新
const reload = inject('reload')

</script>

<style lang="less" scoped>

</style>
