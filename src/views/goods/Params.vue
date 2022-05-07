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
          <el-button type="primary" size="small" :disabled="!showBtn"  >添加参数</el-button>
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

              </template>
            </el-table-column>
            <el-table-column width="70" type="index" label="序号" />
            <el-table-column label="参数名称" prop="attr_name" />
            <el-table-column label="操作"  >
              <template v-slot="scope">
                <el-button type="primary" size="small" :icon="Edit" @click="openEditManyParamsDialog(scope.row.cat_id)">编辑</el-button>
                <el-button type="danger" size="small" :icon="Delete" @click="deleteManyParams(scope.row.cat_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
<!--          <el-pagination-->
<!--            v-model:currentPage="querInfo.pagenum"-->
<!--            v-model:page-size="querInfo.pagesize"-->
<!--            :page-sizes="[5, 15, 30, 100]"-->
<!--            layout="total, sizes, prev, pager, next"-->
<!--            :total="total"-->
<!--            @size-change="handleSizeChange"-->
<!--            @current-change="handleCurrentChange"-->
<!--          />-->
        </el-tab-pane>
<!--        添加静态属性的面板-->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="small" :disabled="!showBtn" >添加属性</el-button>
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

              </template>
            </el-table-column>
            <el-table-column width="70" type="index" label="序号" />
            <el-table-column label="参数名称" prop="attr_name" />
            <el-table-column label="参数值" prop="attr_vals" />
            <el-table-column label="操作"  >
              <template v-slot="scope">
                <el-button type="primary" size="small" :icon="Edit" @click="openOnlyEditParamsDialog(scope.row.cat_id)">编辑</el-button>
                <el-button type="danger" size="small" :icon="Delete" @click="deleteOnlyParams(scope.row.cat_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import api from '@/axios/config'
import { ref, reactive, onBeforeMount } from 'vue'
const { ElMessage, ElMessageBox } = require('element-plus')
// const { Edit, Delete } = require('@element-plus/icons')

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
  getParamsData()
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
      showBtn.value = false
    } else {
      showBtn.value = true
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
  if (activeName.value === 'many') {
    manyTableData.value = res.data
    console.log(manyTableData)
  } else {
    onlyTableData.value = res.data
    console.log(manyTableData)
  }
}

</script>

<style lang="less" scoped>
.el-row{
  margin: 10px 0;
}
</style>
