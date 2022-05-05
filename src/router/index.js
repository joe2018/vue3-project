import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../components/login/index.vue'
import Home from '../components/home/index'
import Welcome from '../views/welcome.vue'
import Users from '../views/user/users.vue'
import Rights from '../views/power/Rights'
import Roles from '../views/power/Roles'
import Categories from '../views/goods/Cate'

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
    component: Home,
    redirect: '/welcome',
    meta: { title: '首页' },
    children: [
      {
        path: '/welcome',
        component: Welcome,
        meta: { title: '欢迎页' }
      },
      {
        path: '/users',
        component: Users,
        meta: { title: '用户列表' }
      },
      {
        path: '/rights',
        component: Rights,
        meta: { title: '权限列表' }
      },
      {
        path: '/roles',
        component: Roles,
        meta: { title: '角色列表' }
      },
      {
        path: '/categories',
        component: Categories,
        meta: { title: '商品分类' }
      }
    ]
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
