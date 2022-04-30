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
            <el-sub-menu index="1">
              <template #title>
                <el-icon><location /></el-icon>
                <span>导航一</span>
              </template>
              <el-menu-item-group title="导航一分组1">
                <el-menu-item index="1-1">子导航1</el-menu-item>
                <el-menu-item index="1-2">子导航2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="Group Two">
                <el-menu-item index="1-3">item three</el-menu-item>
              </el-menu-item-group>
              <el-sub-menu index="1-4">
                <template #title>item four</template>
                <el-menu-item index="1-4-1">item one</el-menu-item>
              </el-sub-menu>
            </el-sub-menu>
            <el-menu-item index="2">
              <el-icon><icon-menu /></el-icon>
              <span>Navigator Two</span>
            </el-menu-item>
            <el-menu-item index="3" disabled>
              <el-icon><document /></el-icon>
              <span>Navigator Three</span>
            </el-menu-item>
            <el-menu-item index="4">
              <el-icon><setting /></el-icon>
              <span>Navigator Four</span>
            </el-menu-item>
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
