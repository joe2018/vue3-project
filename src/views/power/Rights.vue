<template>
  <div>
  <el-card>
    <el-table :data="rightsList" border stripe style="width: 100%">
      <el-table-column fixed="" type="index" label="序号" />
      <el-table-column prop="authName" label="权限名称" />
      <el-table-column prop="path" label="路径" />
      <el-table-column prop="level" label="权限等级" >
        <template v-slot="scope">
          <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
          <el-tag v-if="scope.row.level === '1'" type="success">二级权限</el-tag>
          <el-tag v-if="scope.row.level === '2'" type="warning">三级权限</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="pid" label="上级权限" />
    </el-table>
  </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/axios/config'
const { ElMessage } = require('element-plus')

const { onBeforeMount } = require('vue')
const rightsList = ref([])

onBeforeMount(() => {
  getRightsList()
})

const getRightsList = async () => {
  const { data: res } = await api.get('rights/list')
  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
  rightsList.value = res.data
}
</script>

<style scoped>

</style>
