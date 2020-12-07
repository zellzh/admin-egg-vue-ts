import Vue from 'vue'
import App from './App.vue'
/*
 * 注意:
 * 不建议直接导入所有 API, 会增加初始页面加载时间, 而改为在组件中按需导入, 按需加载
 * 还会导致循环依赖
 */
import api from '@/api' // 先从 network 开始加载
import router from './router' // 先充 url 开始加载
import './plugins/element.js'
import 'normalize.css'
import '@/assets/iconfont/iconfont.css'
import '@/assets/css/index.scss'

Vue.prototype.$api = api
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
