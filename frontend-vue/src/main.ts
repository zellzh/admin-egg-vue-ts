import Vue from 'vue'
import api from '@/api' // 按需导入来封装 api 时, 需要先导入, 否则组件的 url 为 undefined
import App from './App.vue'
import router from './router'
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
