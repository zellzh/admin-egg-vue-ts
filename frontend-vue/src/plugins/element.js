import Vue from 'vue'
import {
  Button, Icon, Message, Image,
  Form, FormItem, Input, Checkbox,
  Tabs, TabPane,
  Container, Header, Main, Aside, Row, Col,
  Menu, Submenu, MenuItem,
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

Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Row)
Vue.use(Col)

Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
