import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import Home from "@/views/Home.vue"
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Admin from "@/views/Admin.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// 导航守卫, 控制权限
router.beforeEach((to, from, next) => {
  // 注册和登录不需要控制
  if (to.path === '/register' || to.path === '/login') {
    return next()
  }

  // 其他界面需要有登录 token 才能访问
  // 防止 token 被篡改, 后端也需要权限控制
  const token = localStorage.getItem('rft')
  if (!token) {
    return next('/login')
  }
  next() // 有 token 的其他 url 放行
})

export default router
