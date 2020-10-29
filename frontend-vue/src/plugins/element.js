import Vue from 'vue'
import {
  Button, Icon, Message, Image, Switch, Tooltip,
  Form, FormItem, Input, Checkbox, Select, Option,
  Table, TableColumn, Pagination,
  Tabs, TabPane,
  Container, Header, Main, Aside, Row, Col,
  Menu, Submenu, MenuItem, Breadcrumb, BreadcrumbItem, Card
} from 'element-ui'

Vue.prototype.$message = Message // 消息提示方法绑定给Vue实例

Vue.use(Button)
Vue.use(Icon)
Vue.use(Image)
Vue.use(Switch)
Vue.use(Tooltip)

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(Select)
Vue.use(Option)

Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Pagination)

Vue.use(Table)
Vue.use(TableColumn)

Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Row)
Vue.use(Col)

Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
