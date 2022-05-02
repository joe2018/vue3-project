<template>
    <el-container class="home-container">
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="logo-box">
          <img src="../../assets/logo1.2cbfa964.png" alt=""/>
          <span>{{isCollapse?'':'电商管理后台'}}</span>
        </div>
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <div>
          <el-menu
            active-text-color="#409eff"
            background-color="#304156"
            class="el-menu-vertical-demo"
            :default-active="defactivePath"
            text-color="#fff"
            :unique-opened="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
          >
            <el-sub-menu :index="item.id + ''" v-for="item in meunsList" :key="item.id">
              <template #title>
                <el-icon>
                  <component :is="iconObj[item.id]" />
                </el-icon>
                <span>{{ item.authName }}</span>
              </template>
                <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id" @click="saveNavstate('/'+subitem.path)">
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
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script setup>
import { ref, shallowRef } from 'vue'
import api from '@/axios/config'
import {
  Avatar,
  Checked,
  Goods,
  List,
  PieChart,
  Menu as IconMenu
} from '@element-plus/icons-vue'

const { ElMessage } = require('element-plus')
const {
  onBeforeMount
} = require('vue')

const meunsList = ref([])
const iconObj = shallowRef({
  125: Avatar,
  103: Checked,
  101: Goods,
  102: List,
  145: PieChart
})
const defactivePath = ref('')
const isCollapse = ref(false)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

onBeforeMount(async () => {
  meunsList.value = await getMenuList()
  defactivePath.value = window.sessionStorage.getItem('activePath')
})

const getMenuList = async () => {
  const { data: res } = await api.get('Menus')
  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
  return res.data
}

const saveNavstate = (activePath) => {
  window.sessionStorage.setItem('activePath', activePath)
  defactivePath.value = activePath
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
      padding: 5px;
      height: 25px;
      width: 25px;
      transform: translate(38%,0%);
    }
    span{
      color: #f1f1f1;
      transform: translate(25%,0%);
  }}
  .el-menu{
    border-right: none;
  }
}

.el-main{
  background-color: #ffffff;
}
.toggle-button{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;

}
</style>
