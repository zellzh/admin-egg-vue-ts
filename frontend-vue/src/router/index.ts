import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Admin from "@/views/Admin.vue";
import Welcome from '@/components/Welcome.vue'
import Users from "@/components/user/Users.vue";
import Rights from "@/components/competence/Rights.vue";

// 按需加载
const Roles = () => import("@/components/competence/Roles.vue")

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
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

// 初始路由
const initRouter: any[] = [
  '/',
  '/welcome'
]
// 获取用户路由权限
function getRouterUrl(): string[] {
  const local = localStorage.getItem('userInfo')
  if (!local) return []
  const userInfo = JSON.parse(local)
  return userInfo.rights.reduce((arr: any[], item: any) => {
    return item.rights_type === 'router' ? arr.concat(item.rights_path) : arr
  }, initRouter)
}
// 导航守卫, 控制权限
// 注意点: 前端代码面向用户, 都能被篡改, 仅作为体验优化处理; 真正权限控制都在后端实现
router.beforeEach((to, from, next) => {
  // 注册和登录不需要控制
  if (to.path === '/register' || to.path === '/login') {
    return next()
  }

  // 其他界面需要有登录 token 才能访问
  const token = localStorage.getItem('act')

  // 首页跳转处理
  if (to.path === '/') {
    return token ?
      next('/welcome') :
      next('/login')
  }

  // 没有 token
  if (!token) {
    Vue.prototype.$message.warning('请登录后再访问!')
    return next('/login')
  }
  // 有 token 时, 根据权限放行
  const router = getRouterUrl()
  if (router.includes(to.path)) {
    next()
  } else {
    Vue.prototype.$message.error('无权限访问')
    next('/welcome')
  }
})

export default router
