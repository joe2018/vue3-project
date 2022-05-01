import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../components/login/index.vue'
import Home from '../components/home/index'

const routes = [
  {
    // 重定向
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.fullPath === '/login') {
    if (window.sessionStorage.getItem('token')) {
      next(from.fullPath)
    } else {
      next()
    }
  } else {
    if (window.sessionStorage.getItem('token')) {
      next()
    } else {
      next({
        path: from.fullPath
      })
    }
  }
})
export default router
