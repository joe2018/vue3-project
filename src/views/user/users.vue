<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/' }">二级</el-breadcrumb-item>
      <el-breadcrumb-item>三级</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="10">
        <el-col :span="6"><div class="grid-content bg-purple" />
          <el-input
            v-model="queryInfo.query"
            placeholder="Please input"
            class="input-with-select"
            @change="searchChange()"
            :clearable="true"
          >
            <template #prepend>
              <el-button :icon="Search" @click="getUserList"/>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4"><div class="grid-content bg-purple" />
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="usersList" border stripe style="width: 100%">
        <el-table-column fixed="" type="index" label="序号" />
        <el-table-column prop="username" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="mobile" label="电话" />
        <el-table-column prop="role_name" label="角色" />
        <el-table-column label="状态" >
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"/>
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
            <el-button type="primary" size="small" :icon="Edit" />
            </el-tooltip>
<!--            删除-->
            <el-tooltip
              effect="dark"
              content="删除用户"
              placement="top"
              :enterable="false"
            >
            <el-button type="danger" size="small" :icon="Delete"></el-button>
            </el-tooltip>
<!--            分配角色-->
            <el-tooltip
              effect="dark"
              content="权限分配"
              placement="top"
              :enterable="false"
            >
            <el-button type="warning" size="small" :icon="Setting"></el-button>
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
    </el-card>
  </div>
</template>

<script setup>
import { Search, Edit, Delete, Setting } from '@element-plus/icons'
import { ref, reactive } from 'vue'
import axios from 'axios'
const { ElMessage } = require('element-plus')

const {
  onBeforeMount
} = require('vue')

const usersList = ref([])
const total = ref(0)

const queryInfo = reactive({
  query: '',
  pagenum: 1,
  pagesize: 3
})
onBeforeMount(() => {
  getUserList()
})

const userStateChanged = async (userinfo) => {
  const { data: res } = await axios.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
  if (res.meta.status !== 200) {
    userinfo.mg_state = !userinfo.mg_state
    return ElMessage.error('更新状态失败！')
  }
  ElMessage.success('更新状态成功！')
}

const getUserList = async () => {
  const { data: res } = await axios.get('users', { params: queryInfo })
  if (res.meta.status !== 200) return ElMessage.error('获取用户数据错误！')
  usersList.value = res.data.users
  total.value = res.data.total
}

const handleCurrentChange = (newPage) => {
  queryInfo.pagenum = newPage
  getUserList()
}

const handleSizeChange = (newSize) => {
  queryInfo.pagesize = newSize
  getUserList()
}

const searchChange = () => {
  getUserList()
}

</script>

<style lang="less" scoped>

</style>
