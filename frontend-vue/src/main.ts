import Vue from 'vue'
import App from './App.vue'
/*
 * 注意点: 由于封装的 axios-api 中存在循环 import, 需要注意导入顺序
 *  - 以下加载顺序: api/index -> accountApi -> network -> url -> 跳过 accountApi -> userApi(action 为 undefined)
 *  - 如果在 router 后导入: 顺序会从 url -> network -> 跳过 url -> 往下执行(导致 baseUrl 为 undefined)
 *  - 导致的问题就是循环依赖中彼此引用并直接使用的变量必然存在一方会出现 undefined 导致报错
 * 总结: 不建议直接导入所有 API, 会增加初始页面加载时间, 而改为在组件中按需导入, 按需加载
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
