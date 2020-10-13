import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import 'normalize.css'
import '@/assets/iconfont/iconfont.css'
import api from '@/api'

Vue.prototype.$api = api
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
