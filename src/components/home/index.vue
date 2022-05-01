<template>
    <el-container class="home-container">
      <el-aside width="200px">
        <div class="logo-box">
          <img src="../../assets/logo1.2cbfa964.png" alt=""/>
          <span>供应链电商管理后台</span>
        </div>
        <div>
          <el-menu
            active-text-color="#ffd04b"
            background-color="#304156"
            class="el-menu-vertical-demo"
            default-active="2"
            text-color="#fff"
          >
            <el-sub-menu index="1" :model="meunsList" v-for="item in meunsList" :key="item.id">
              <template #title>
                <el-icon><location /></el-icon>
                <span>导航一</span>
              </template>
                <el-menu-item index="1-1">
                  <template #title>
                    <el-icon><location /></el-icon>
                    <span>导航</span>
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
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import axios from 'axios'
const {
  onBeforeMount,
} = require('vue')

const meunsList = ref([])

onBeforeMount(() => {
  getMenuList()
})

const getMenuList = async () => {
  const { data: res } = await axios.get('Menus')
  if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
  meunsList = res.data
  console.log(meunsList)
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
}

.el-main{
  background-color: #ffffff;
}
</style>
