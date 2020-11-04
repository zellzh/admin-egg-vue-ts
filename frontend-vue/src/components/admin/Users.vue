<template>
  <div class="users-container">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card shadow="always">
      <!-- 搜索区域 -->
      <el-row class="search-bar">
        <el-col class="bar-left" :span="18">
          <el-row :gutter="10" type="flex" justify="space-between">
            <el-col :span="4" v-for="(val, prop) in searchSelect" :key="prop">
              <el-select size="small" v-model="queryInfo[prop]" :placeholder="val">
                <el-option v-for="opt of searchOpts[prop]" :key="opt" :label="opt" :value="opt"/>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-input size="small" v-model="queryInfo.key" placeholder="请输入搜索关键字"/>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" size="small" @click="onQuery">查询</el-button>
              <el-button type="primary" size="small" @click="exportUsers">导出结果</el-button>
            </el-col>
          </el-row>
        </el-col>
        <el-col class="bar-right" :span="6">
          <el-button type="primary" size="small" @click="addUserVisible = true">添加用户</el-button>
          <el-button type="primary" size="small" @click="importUsers">导入用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table
          :data="tableData"
          stripe
          border
          style="width: 100%">
        <el-table-column type="index"/>
        <el-table-column
            v-for="(val, prop) in tableField"
            :class-name="prop === 'userHandle'?'user-handle':''"
            :key="prop"
            :prop="prop"
            :label="val">
          <!-- 状态 -->
          <template scope="scope" v-if="prop === 'userState'">
            <el-switch
                v-model="scope.row.state"
                inactive-color="#ff4949"/>
          </template>
          <!-- 操作 -->
          <template scope="scope" v-else-if="prop === 'userHandle'">
            <el-button size="small" type="primary" icon="el-icon-edit"/>
            <el-button size="small" @click.stop="showPop(scope,$event)" type="danger" icon="el-icon-delete"/>
            <el-tooltip content="分配角色" :enterable="false" placement="top">
              <el-button size="small" type="warning" icon="el-icon-setting"/>
            </el-tooltip>
          </template>
          <!-- 其他 -->
          <!-- <template scope="scope" v-else></template>-->
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页区域 -->
    <el-pagination
        background
        :pager-count="5"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.offset"
        :page-sizes="[5, 10, 15, 20, 25]"
        :page-size="queryInfo.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"/>
    <!-- 添加用户 -->
    <el-dialog @open="addUserOnOpen"
               title="添加用户" width="40%"
               :visible.sync="addUserVisible">
      <el-form :model="addUserForm"
               ref="userForm"
               :rules="addUserFormRules"
               label-width="auto"
               size="medium">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"
                    ref="focus"
                    clearable
                    prefix-icon="iconfont icon-user"
                    placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"
                    show-password
                    ref="pwdInput"
                    prefix-icon="iconfont icon-pwd"
                    placeholder="请输入至少6位的密码"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"
                    prefix-icon="iconfont icon-email"
                    placeholder="请输入邮箱"/>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="addUserForm.phone"
                    prefix-icon="iconfont icon-phone"
                    placeholder="请输入手机号"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="onAddUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除用户 -->
    <el-popover
        ref="delPop"
        :append-to-body="false"
        placement="top"
        v-model="delUserVisible">
    <p>确定删除？</p>
    <div style="text-align: right; margin: 0;">
      <el-button size="mini" type="text" @click="delUserVisible = false">取消</el-button>
      <el-button type="primary" size="mini" @click="onDelUser">确定</el-button>
    </div>
    </el-popover>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Ref} from 'vue-property-decorator';
import userReg from "@/assets/userReg";
import {Form, Input, Popover} from "element-ui";

// popperJS 扩展 Popover, 方便自定义
interface Pop extends Popover{
  updatePopper: () => void // 刷新/创建 pop
  referenceElm: Element // 指定绑定的元素
  popperJS?: {
    _reference: Element // 绑定元素
    state: any
    [prop: string]: any
  }
  [prop: string]: any
}

@Component({
  name: 'Users',
  components: {

  },
})
export default class Users extends Vue {
  /*ref
    ====================================== */
  @Ref() readonly userForm?: Form; // 刚进入页面表单未加载
  @Ref() readonly pwdInput?: Input & { [prop: string]: any};
  @Ref() readonly delPop!: Pop;

  /*data
    ====================================== */
  // 搜索选择框
  searchSelect = {
    role: '-角色类型-',
    type: '-账号类型-',
    origin: '-账号来源-',
  }
  // 下拉选项
  searchOpts = {
    role: [ '管理员', '项目经理', '主管', '开发人员' ],
    origin: [ 'local', 'github' ],
    type: [ '用户名', '手机号', '邮箱' ],
  }
  // 查询数据
  queryInfo = {
    role: '',
    type: '',
    origin: '',
    key: '',
    limit: 2,
    offset: 1,
  }
  // 表头
  tableField = {
    username: '用户名',
    email: '邮箱',
    phone: '用户名',
    roleName: '角色',
    userState: '状态',
    userHandle: '操作',
  }
  // 表格数据
  tableData: any[] = []
  // 添加用户的表单数据
  addUserVisible = false
  addUserForm = {
    username: '',
    password: '',
    email: '',
    phone: '',
  }
  // 删除用户
  delUserVisible = false
  delUserData: {[prop:string]: any} = {}


  /*method
   ====================================== */
  // 用户数据 CRUD
  private async getUserList() {
    const response = await this.$api.getUsers()
    if (!response) return
    console.log(response.data);
    this.tableData = response.data.data;
  }
  // 显示 pop
  private showPop(scope: any, e: MouseEvent) {
    // pop
    this.delUserData = scope

    // 获取图标元素, 防止 pop 错位
    const target = (e.target as Element).children[0] || e.target
    const pop = this.delPop
    // 更新 pop, 并绑定当前的元素
    pop.updatePopper()
    pop.referenceElm = target;
    this.delUserVisible = true
    // 触发 dom 更新, 获取当前的 popperJS, 并绑定到当前元素
    this.$nextTick(() => {
      pop.popperJS!._reference = target
      pop.popperJS!.state.updateBound()
    });

    // messageBox
    /*let { id, username, email, phone } = data;
    username = username || email || phone;
    this.$messageBox.confirm(`确定删除用户： ${username} ？`, {
      title: '提示',
      type: 'warning',
    }).then(async () => {
      this.$message.success('删除成功')
    })*/
  }
  // 删除用户
  private async onDelUser() {
    const { row, $index } = this.delUserData
    const res = await this.$api.delUser(row.id)
    if (res && res.status === 200) {
      this.$message.success('删除成功')
      this.tableData.splice($index, 1)
      this.delUserVisible = false
    }
  }
  // 添加用户
  private onAddUser() {
    // 数据预校验
    this.userForm!.validate(async valid => {
      if (!valid) {
        this.$message.error('请完善注册信息')
        return false
      }
      let res = await this.$api.addUser(this.addUserForm)
      if (res && res.status === 200) {
        this.tableData.push(res.data.data)
        this.$message.success('添加成功')
        this.addUserVisible = false
      }
    })
  }
  // 添加用户表单验证
  addUserFormRules = {
    username: [
      { required: true, message: '用户名不能为空', trigger: 'blur' },
      { min: 6,  message: '用户名至少6位', trigger: 'blur' },
      { pattern: userReg.username, message: '用户名只能含有字母数字或下划线', trigger: 'blur'},
      { validator: this.inquirer, trigger: 'blur'}
    ],
    password: [
      { required: true, message: '密码不能为空', trigger: 'blur' },
      { min: 6,  message: '密码至少6位', trigger: 'blur' },
      { pattern: userReg.password, message: '密码必须包含字母和数字', trigger: 'blur', }
    ],
    email: [
      { pattern: userReg.email,  message: '邮箱格式不正确', trigger: 'blur' },
    ],
    phone: [
      { pattern: userReg.phone,  message: '手机格式不正确', trigger: 'blur' },
    ],
  }
  // 数据库查询是否存在
  private async inquirer(rule: any, value: string, cb: any) {
    let res = await this.$api.inquirer({[rule.field]: value})
    if (res && res.status === 200 && res.data.meta.code === 200) cb(new Error('用户已经存在'))
    else cb()
  }
  // 添加用户打开事件
  addUserOnOpen() {
    this.userForm?.resetFields() // 重置表单
    this.pwdInput?.showPassword || this.pwdInput?.handlePasswordVisible() // 重置密码隐藏
  }

  private onQuery() {
    console.log(this.queryInfo);
  }
  private importUsers() {

  }
  private exportUsers() {

  }

  // 分页: 显示条数发生改变时
  private handleSizeChange(size: string) {
    console.log(size);
  }
  // 分页: 当前页面发生改变时
  private handleCurrentChange(curPage: string) {
    console.log(curPage);
  }

  /*LC(life-cycle)
    ====================================== */
  async created() {
    await this.getUserList()
    // 点击 dom 关闭 pop
    document.addEventListener('click', e => {
      this.delUserVisible = false
    })
  }
}
</script>

<style scoped lang="scss">
::v-deep.users-container{
  // pop 绝对定位, 父容器相对定位
  position: relative;

  // 面包屑
  .el-breadcrumb{
    i{
      color: #333444;
    }
  }

  // 卡片区域
  .el-card{
    margin-top: 20px;
    // 搜索栏
    .search-bar{
      .bar-left{
        min-width: 700px;
      }
      .bar-right{
        min-width: 200px ;
        text-align: right;
      }
    }

    // 表格
    .el-table{
      margin-top: 20px;
      // 表格宽度
      .user-handle>.cell{
        min-width: 180px;
      }
    }
  }

  // 分页
  .el-pagination{
    margin-top: 20px;
  }

  // 删除 pop
  .el-popover{
    box-shadow: 0 0 5px #bbb !important;
  }
}
</style>
