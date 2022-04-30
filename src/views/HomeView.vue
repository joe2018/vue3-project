<template>
  <div class="home">
    <el-button type="info" @click="logout">登出</el-button>
  </div>
</template>

<script setup>
import router from '@/router'

const logout = () => {
  window.sessionStorage.clear()
  router.push('/login')
}
</script>
