<template>
  <div class="users-container">
    <!-- 面包屑 -->
    <Breadcrumb :navi-path="naviPath"/>
    <!-- 卡片区域 -->
    <el-card shadow="always">
      <!-- 搜索区域 -->
      <el-row class="search-bar">
        <el-col class="bar-left" :span="18">
          <el-row :gutter="10" type="flex" justify="space-between">
            <el-col :span="4" v-for="(val, prop) in searchSelect" :key="prop">
              <el-select size="small"
                         clearable
                         v-model="queryInfo[prop]"
                         :placeholder="val">
                <el-option v-for="opt in searchOpts[prop]"
                           :key="opt.label"
                           :label="opt.label"
                           :value="opt.val"/>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-input size="small"
                        v-model="queryInfo.key"
                        clearable
                        @clear="clearCb"
                        placeholder="请输入搜索关键字"/>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" size="small" @click="onQuery">查询</el-button>
              <el-button type="primary" size="small" @click="exportUsers">导出当前结果</el-button>
              <!-- 后端导出数据(a 标签直接下载)
              <a :href='excelPostUrl'>
                <el-button type="primary" size="small" @click="exportUsers">导出结果</el-button>
              </a>
              -->
            </el-col>
          </el-row>
        </el-col>
        <el-col class="bar-right" :span="6">
          <el-button type="primary" size="small" @click="addUserVisible = true">添加用户</el-button>
          <el-upload
              class="excel-uploader"
              :action="excelPostUrl"
              accept=".xls, .xlsx"
              :show-file-list="false"
              :on-success="handleExcelSuccess"
              :on-error="handleExcelError"
              :before-upload="beforeExcelUpload">
            <el-button size="small" type="primary">导入用户</el-button>
          </el-upload>
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
            :class-name="prop === 'userHandle'?'table-handle':''"
            :key="prop"
            :prop="prop"
            :label="val">
          <!-- 状态 -->
          <template scope="scope" v-if="prop === 'userState'">
            <el-switch
                v-model="scope.row.state"
                @change="switchUserState(scope.row)"
                inactive-color="#ff4949"/>
          </template>
          <!-- 操作 -->
          <template scope="scope" v-else-if="prop === 'userHandle'">
            <el-button size="mini"
                       @click="openEdit(scope.row)"
                       type="primary"
                       icon="el-icon-edit"/>
            <el-button size="mini"
                       @click.stop="showPop(scope.row,$event)"
                       type="danger"
                       icon="el-icon-delete"/>
            <el-tooltip content="分配角色" :enterable="false" placement="top">
              <el-button size="mini" type="warning" icon="el-icon-setting"/>
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
        :current-page.sync="queryInfo.offset"
        :page-sizes="[5, 10, 15, 20, 25]"
        :page-size.sync="queryInfo.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"/>
    <!-- 添加用户 -->
    <el-dialog @open="addUserOnOpen"
               title="添加用户" width="40%"
               :visible.sync="addUserVisible">
      <el-form :model="addUserData"
               ref="addUserForm"
               :rules="addUserDataRules"
               label-width="auto"
               size="medium">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserData.username"
                    ref="focus"
                    clearable
                    prefix-icon="iconfont icon-user"
                    placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserData.password"
                    show-password
                    ref="pwdInput"
                    prefix-icon="iconfont icon-pwd"
                    placeholder="请输入至少6位的密码"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserData.email"
                    prefix-icon="iconfont icon-email"
                    placeholder="请输入邮箱"/>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="addUserData.phone"
                    prefix-icon="iconfont icon-phone"
                    placeholder="请输入手机号"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="onAddUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" width="40%"
               @opened="editOpened"
               :visible.sync="editUserVisible">
      <el-form :model="editUserData"
               ref="editUserForm"
               hide-required-asterisk
               :rules="addUserDataRules"
               label-width="auto"
               size="medium">
        <el-form-item label-width="0">
          <el-upload
              class="avatar-uploader"
              :action='avatarPostUrl'
              accept=".jpeg, .png, .jpg"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :on-error="handleAvatarError"
              :before-upload="beforeAvatarUpload">
            <img class="img-fluid" v-if="avatarUrl" :src="avatarUrl" alt="">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserData.username"
                    disabled
                    clearable
                    prefix-icon="iconfont icon-user"
                    placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserData.email"
                    prefix-icon="iconfont icon-email"
                    placeholder="请输入邮箱"/>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="editUserData.phone"
                    prefix-icon="iconfont icon-phone"
                    placeholder="请输入手机号"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="onEditUser">确 定</el-button>
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
import {Component, Ref, Vue, Prop, Watch} from 'vue-property-decorator';
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import userReg from "@/assets/regexp/userReg";
import {Form, Input, Popover} from "element-ui";
import {users, baseUrl} from "@/api/url/index";
// import fileDownload from 'js-file-download'
import xlsx from 'xlsx';
import {saveAs} from 'file-saver';

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
    Breadcrumb
  },
})
export default class Users extends Vue {
  /*ref & prop
    ====================================== */
  @Ref() readonly addUserForm?: Form; // 刚进入页面表单未加载
  @Ref() readonly editUserForm?: Form;
  @Ref() readonly pwdInput?: Input & { [prop: string]: any};
  @Ref() readonly delPop!: Pop;
  @Prop() readonly naviPath!: any[]

  /*data
    ====================================== */
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

  // 搜索选择框
  searchSelect = {
    type: '-账号类型-',
    origin: '-账号来源-',
    role: '-角色类型-',
  }
  // 下拉选项
  searchOpts = {
    role: [{label: '管理员', val: '管理员'}, {label: '项目经理', val: '项目经理'}],
    origin: [{label: '本地注册', val: 'local'}, {label: 'Git登录', val: 'github'}],
    type: [{label: '用户名', val: 'username'}, {label: '邮箱', val: 'email'}, {label: '手机号', val: 'phone'}],
  }
  // 查询数据
  queryInfo = {
    role: '',
    type: '',
    origin: '',
    key: '',
    limit: 5,
    offset: 1,
  }
  // 数据总量
  totalCount = 0
  // 导入用户URL
  excelPostUrl = baseUrl + users.excel

  // 添加用户的表单数据
  addUserVisible = false
  addUserData = {
    username: '',
    password: '',
    email: '',
    phone: '',
  }

  // 编辑用户的表单数据
  editUserVisible = false
  editUserData: any = {}
  isEditChange = false
  // 头像上传URL
  avatarPostUrl = baseUrl + users.avatar

  // 删除用户
  delUserVisible = false
  delUserData: any = {}

  /*computed
   ====================================== */
  // 头像回显URL
  private get avatarUrl() {
    return this.editUserData.baseUrl + this.editUserData.avatar
  }

  /*method
   ====================================== */
  // 用户数据 CRUD
  private async getUserList() {
    const response = await this.$api.getUsers(this.queryInfo)
    if (response && response.status === 200) {
      const data = response.data.data
      this.tableData = data.users;
      this.totalCount = data.count;
    }
  }

  // 显示删除 pop
  private showPop(row: any, e: MouseEvent) {
    // pop
    this.delUserData = row

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
    const res = await this.$api.delUser(this.delUserData.id)
    if (res && res.status === 200) {
      await this.getUserList()
      this.$message.success('删除成功')
      this.delUserVisible = false
    }
  }

  // 添加用户
  private onAddUser() {
    // 数据预校验
    this.addUserForm!.validate(async valid => {
      if (!valid) {
        this.$message.error('请完善用户信息')
        return false
      }
      let res = await this.$api.addUser(this.addUserData)
      if (res && res.status === 200) {
        await this.getUserList()
        this.$message.success('添加成功')
        this.addUserVisible = false
      }
    })
  }
  // 添加用户表单验证
  private addUserDataRules = {
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
  private addUserOnOpen() {
    // 添加用户会改变表格, 等 dom 更新后再重置, 防止bug
    this.$nextTick(() => {
      // 重置表
      this.addUserForm?.resetFields()
      // 重置密码隐藏
      this.pwdInput && (this.pwdInput.passwordVisible = false)
    })
  }

  // 编辑用户打开
  private openEdit(data: any) {
    this.editUserVisible = true
    // 复制数据, 防止修改时表格数据变动
    this.editUserData = Object.assign({}, data)
  }
  // 编辑 dialog 打开后的回调
  private editOpened() {
    // 编辑用户数据初始化
    this.isEditChange = false
  }
  // 编辑用户
  private async onEditUser() {
    const { id, ...user } = this.editUserData
    // 数据未变更则不提交给后端
    if (!this.isEditChange) return this.editUserVisible = false
    const res = await this.$api.updateUser(id, user)
    if (res && res.status === 200) {
      this.$message.success('更新用户成功!')
      const idx = this.tableData.findIndex(item => {
        return item.id === this.editUserData.id
      })
      this.tableData.splice(idx, 1, this.editUserData)
      this.editUserVisible = false
    }
  }
  // 切换状态
  private async switchUserState(row: any) {
    const { id, ...user } = row
    const res = await this.$api.updateUser(id, user)
    if (res && res.status === 200) {
      this.$message.success('更新状态成功!')
    }
  }
  // 头像上传前的回调
  private beforeAvatarUpload(file: any) {
    const fileTypes = ['jpeg', 'png', 'jpg']
    const isAvatar = fileTypes.find(type => {
      return file.type.indexOf(type) !== -1
    })
    const isLt10M = file.size / 1024 / 1024 < 10;

    if (!isAvatar) {
      this.$message.error('上传头像图片只能是 JPG/PNG/JPEG 格式!');
    }
    if (!isLt10M) {
      this.$message.error('上传头像图片大小不能超过 10MB!');
    }
    return isAvatar && isLt10M;
  }
  // 头像上传成功的回调
  private handleAvatarSuccess(res: any) {
    this.editUserData.avatar = res.data.avatarRelPath
  }
  // 头像上传失败的回调
  private handleAvatarError(err: any) {
    const msg = JSON.parse(err).meta.msg
    this.$message.error(msg)
  }

  // 搜索栏
  private async onQuery() {
    this.queryInfo.offset = 1 // 重置页码
    await this.getUserList()
  }
  // 清空搜索栏的回调
  private async clearCb() {
    await this.getUserList()
  }
  // 导出 excel
  private async exportUsers() {
    /*
     * 后端导出文件给前端下载:
     *  - 除了直接使用 a 标签接收后端传来的文件
     *  - 还可以使用前端 blob 接收下载后端传出的 buffer
     * 区别:
     *  - 使用 a 标签, 后端必须在响应头指定文件类型|文件名等信息
     *  - 使用 blob, 则可以自定义, 也使用 js-file-download 库
     */
    // const res = await this.$api.exportUsers()
    // fileDownload(res.data, 'userTest.xlsx')

    /*
     * 前端直接导出文件
     * 可以使用 xlsx 库
     */
    // 1.将对象数据转换为 excel 的数组格式
    const users = this.tableData
    let data: any = [];
    if (users.length) {
      const fieldArr = Object.keys(users[0]);
      data = users.map(item => {
        return fieldArr.map(key => {
          return item[key];
        });
      });
      data.unshift(fieldArr);
    }
    // 1.创建一个新的 workbook
    const wb = xlsx.utils.book_new()
    // 2.根据数据生成一个张 sheet
    const sheet = xlsx.utils.aoa_to_sheet(data)
    // 3.将 sheet 插入到 wb
    xlsx.utils.book_append_sheet(wb, sheet, 'users')
    // 4.保存下载
    // xlsx.writeFile(wb, 'users.xlsx') // 快速下载, 有兼容问题
    const opts = { bookType:'xlsx', bookSST:false, type: 'array' };
    const out = xlsx.write(wb, opts as any);
    saveAs(new Blob([out],{type:"application/octet-stream"}), "users.xlsx");
  }
  // 导入 excel 之前的回调
  private beforeExcelUpload(file: any) {
    const isExcel = file.type.includes('excel') || file.type.includes('spreadsheetml')
    const isLt10M = file.size / 1024 / 1024 < 10;

    if (!isExcel) {
      this.$message.error('导入用户只能是 XLS/XLSX 格式!');
    }
    if (!isLt10M) {
      this.$message.error('导入用户大小不能超过 10MB!');
    }
    return isExcel && isLt10M;
  }
  // 导入 excel 成功的回调
  private handleExcelSuccess() {
    this.getUserList()
    this.$message.success('导入成功')
  }
  // 导入 excel 失败的回调
  private handleExcelError(err: any) {
    const res = JSON.parse(err.message).data
    if (!res) return this.$message.error('导入失败: 导入用户存在重复!')
    const { username, email, phone } = res
    this.$message.error(`导入失败: 用户 ${username||email||phone} 已存在!`)
  }

  // 分页: 显示条数发生改变时
  private handleSizeChange() {
    this.getUserList()
  }
  // 分页: 当前页面发生改变时
  private handleCurrentChange() {
    this.getUserList()
  }

  /*watch
    ====================================== */
  // 观察编辑数据是否改变
  @Watch('editUserData', { deep: true })
  editSubmit(nv: any) {
    if (nv) this.isEditChange = true
  }

  /*LC(life-cycle)
    ====================================== */
  async created() {
    console.log(this.naviPath);
    await this.getUserList()
    // 点击 dom 关闭 pop
    document.addEventListener('click', () => {
      this.delUserVisible = false
    })
  }
}
</script>

<style scoped lang="scss">
::v-deep.users-container{
  // pop 绝对定位, 父容器相对定位
  position: relative;
  // 上传头像
  .avatar-uploader{
    text-align: center;
    .el-upload {
      width: 150px;
      height: 150px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      &:hover{
        border-color: #409EFF;
      }
    }
    .avatar-uploader-icon {
      font-size: 30px;
      color: #8c939d;
      width: 100%;
      height: 100%;
      line-height: 100%;
      text-align: center;
    }
  }
}
</style>
