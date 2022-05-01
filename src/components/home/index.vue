<template>
    <el-container class="home-container">
      <el-aside width="200px">
        <div class="logo-box">
          <img src="../../assets/logo1.2cbfa964.png" alt=""/>
          <span>供应链电商管理后台</span>
        </div>
        <div>
          <el-menu
            active-text-color="#409eff"
            background-color="#304156"
            class="el-menu-vertical-demo"
            default-active="2"
            text-color="#fff"
            unique-opened="true"
          >
            <el-sub-menu :index="item.id + ''" v-for="item in meunsList" :key="item.id">
              <template #title>
                <el-icon>
                  <component :is="iconObj[item.id]" />
                </el-icon>
                <span>{{ item.authName }}</span>
              </template>
                <el-menu-item :index="subitem.id + ''" v-for="subitem in item.children" :key="subitem.id">
                  <template #title>
                    <el-icon><IconMenu /></el-icon>
                    <span>{{ subitem.authName }}</span>
                  </template>
                </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </div>
      </el-aside>
      <el-container>
        <el-header>
          <el-button type="info" @click="logout">登出</el-button>
        </el-header>
        <el-main>
          内容页面
        </el-main>
      </el-container>
    </el-container>
</template>

<script setup>
import { ref } from 'vue'
import {
  Avatar,
  Checked,
  Goods,
  List,
  PieChart,
  Menu as IconMenu
} from '@element-plus/icons-vue'

import axios from 'axios'

const {
  onBeforeMount
} = require('vue')

const meunsList = ref([])
const iconObj = ref({
  125: Avatar,
  103: Checked,
  101: Goods,
  102: List,
  145: PieChart
})

onBeforeMount(async () => {
  meunsList.value = await getMenuList()
})

const getMenuList = async () => {
  const { data: res } = await axios.get('Menus')
  if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
  return res.data
}

const logout = () => {
  window.sessionStorage.clear()
  window.router.push('/login')
}
</script>

<style lang="less" scoped>
.home-container{
  height: 100%;
}
.el-header{
  background-color: #f1f1f1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.el-aside{
  background-color: #304156;
  .logo-box{
    display: flex;
    align-items: center;
    img{
      padding: 10px;
      height: 30px;
      width: 30px;
    }
    span{
      color: #f1f1f1;
  }}
  .el-menu{
    border-right: none;
  }
}

.el-main{
  background-color: #ffffff;
}
</style>
