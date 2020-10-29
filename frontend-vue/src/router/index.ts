import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Admin from "@/views/Admin.vue";
import Welcome from '@/components/admin/Welcome.vue'
import Users from "@/components/admin/Users.vue";
import Roles from "@/components/admin/Roles.vue";
import Rights from "@/components/admin/Rights.vue";

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
    redirect: '/welcome',
    path: '/admin',
    name: 'Admin',
    component: Admin,
    children: [
      {path: '/welcome', name: 'Welcome', component: Welcome},
      {path: '/users', name: 'Users', component: Users},
      {path: '/roles', name: 'Roles', component: Roles},
      {path: '/rights', name: 'Rights', component: Rights},
    ]
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
  // 注意点: 防止 token 被篡改, 后端也需要权限控制
  const token = localStorage.getItem('rft')
  if (!token) {
    Vue.prototype.$message.warning('无权限访问, 请登录后再尝试!')
    return next('/login')
  }
  next() // 有 token 的其他 url 放行
})

export default router
