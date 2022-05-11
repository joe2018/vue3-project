import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../components/login/index.vue'
import Home from '../components/home/index'
import Welcome from '../views/welcome.vue'
import Users from '../views/user/users.vue'
import Rights from '../views/power/Rights'
import Roles from '../views/power/Roles'
import Categories from '../views/goods/Cate'
import Params from '../views/goods/Params'
import Goods from '../views/goods/Goods'
import Orders from '../views/orders/Orders'
import Reports from '../views/reports/Reports'
import Add from '../views/goods/Add'

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
        name: 'welcome',
        component: Welcome,
        meta: { title: '欢迎页' }
      },
      {
        path: '/users',
        name: 'users',
        component: Users,
        meta: { title: '用户列表' }
      },
      {
        path: '/rights',
        name: 'rights',
        component: Rights,
        meta: { title: '权限列表' }
      },
      {
        path: '/roles',
        name: 'roles',
        component: Roles,
        meta: { title: '角色列表' }
      },
      {
        path: '/categories',
        name: 'categories',
        component: Categories,
        meta: { title: '商品分类' }
      },
      {
        path: '/params',
        name: 'params',
        component: Params,
        meta: { title: '分类参数' }
      },
      {
        path: '/goods',
        name: 'goods',
        component: Goods,
        meta: { title: '商品列表' },
      },
      {
        path: '/add',
        name: 'add',
        component: Add,
        meta: { title: '添加商品' }
      },
      {
        path: '/orders',
        name: 'orders',
        component: Orders,
        meta: { title: '订单列表' }
      },
      {
        path: '/reports',
        name: 'reports',
        component: Reports,
        meta: { title: '数据报表' }
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
