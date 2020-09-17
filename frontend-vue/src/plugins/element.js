import Vue from 'vue'
import {
  Button, Icon, Message,
  Form, FormItem, Input, Checkbox,
  Tabs, TabPane,
  Row, Col,
  Image,
} from 'element-ui'

Vue.prototype.$message = Message // 消息提示方法绑定给Vue实例
Vue.use(Button)
Vue.use(Icon)
Vue.use(Image)

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Checkbox)

Vue.use(Tabs)
Vue.use(TabPane)

Vue.use(Row)
Vue.use(Col)
