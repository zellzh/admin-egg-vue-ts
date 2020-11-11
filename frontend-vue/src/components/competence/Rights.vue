<template>
  <div class="rights-container">
    <!-- 面包屑 -->
    <Breadcrumb :navi-path="naviPath"/>
    <!-- 卡片区域 -->
    <el-card shadow="always">
      <!-- 搜索区域 -->
      <el-row class="search-bar">
        <el-col class="bar-left" :span="16">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-select size="small"
                         clearable
                         v-model="queryInfo.type"
                         placeholder="-权限类型-">
                <el-option v-for="opt in rightsOpts"
                           :key="opt.label"
                           :label="opt.label"
                           :value="opt.val"/>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-input size="small"
                        v-model="queryInfo.key"
                        clearable
                        @clear="clearCb"
                        placeholder="请输入搜索关键字"/>
            </el-col>
            <el-col :span="10">
              <el-button type="primary" size="small" @click="onQuery">查询</el-button>
            </el-col>
          </el-row>
        </el-col>
        <el-col class="bar-right" :span="8">
          <el-button type="primary" size="small" @click="addRightsVisible = true">添加权限</el-button>
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
          <!-- 操作 -->
          <template scope="scope" v-if="prop === 'userHandle'">
            <el-button @click="openEdit(scope.row)" size="small" type="primary" icon="el-icon-edit"/>
            <el-button size="small" @click.stop="showPop(scope.row,$event)" type="danger" icon="el-icon-delete"/>
          </template>
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
    <!-- 添加权限 -->
    <el-dialog @open="addRightsOnOpen"
               :title="isEditRights ? '编辑权限' : '添加权限'" width="40%"
               :visible.sync="rightsVisible">
      <el-form :model="rightsData"
               ref="addUserForm"
               label-width="auto"
               size="medium">
        <el-form-item label="权限名称">
          <el-input v-model="rightsData.username"
                    ref="focus"
                    clearable
                    prefix-icon="iconfont icon-user"
                    placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item label="权限类型">
          <el-input v-model="rightsData.password"
                    show-password
                    ref="pwdInput"
                    prefix-icon="iconfont icon-pwd"
                    placeholder="请输入至少6位的密码"/>
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="rightsData.email"
                    prefix-icon="iconfont icon-email"
                    placeholder="请输入邮箱"/>
        </el-form-item>
        <el-form-item label="权限等级">
          <el-input v-model="rightsData.phone"
                    prefix-icon="iconfont icon-phone"
                    placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="权限路径">
          <el-input v-model="rightsData.phone"
                    prefix-icon="iconfont icon-phone"
                    placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="请求方式">
          <el-input v-model="rightsData.phone"
                    prefix-icon="iconfont icon-phone"
                    placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="上级权限">
          <el-input v-model="rightsData.phone"
                    prefix-icon="iconfont icon-phone"
                    placeholder="请输入手机号"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rightsVisible = false">取 消</el-button>
        <el-button type="primary" @click="onRightsHandle">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除权限 -->
    <el-popover
        ref="delPop"
        :append-to-body="false"
        placement="top"
        v-model="delRightsVisible">
      <p>确定删除？</p>
      <div style="text-align: right; margin: 0;">
        <el-button size="mini" type="text" @click="delRightsVisible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="onDelRights">确定</el-button>
      </div>
    </el-popover>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';
import Breadcrumb from "@/components/common/Breadcrumb.vue";

@Component({
  name: 'Rights',
  components: {
    Breadcrumb
  },
})
export default class Rights extends Vue {
  /*ref
    ====================================== */
  @Prop() readonly naviPath!: any[]

  /*data
    ====================================== */
  // 搜索栏数据
  queryInfo = {
    type: '',
    key: '',
    limit: 5,
    offset: 1,
  }
  // 权限类型
  rightsOpts = [
    {label: '菜单权限', val: 'menu'},
    {label: '路由权限', val: 'router'},
    {label: '请求权限', val: 'action'},
  ]

  // 权限框显示
  rightsVisible = false
  // 编辑权限 | 添加权限
  isEditRights = false
  // 添加 | 编辑权限表单
  rightsData: any = {}
  // 删除权限 Pop
  delRightsVisible = false

  // 表头
  tableField = {
    rights_name: '权限名称',
    rights_desc: '权限描述',
    level: '权限等级',
    rights_path: '路径',
    rightsHandle: '操作',
  }
  // 表格数据
  tableData: any[] = []

  // 分页
  totalCount = 0

  /*method
   ====================================== */
  // 获取权限列表
  private async getRightsList() {

  }

  // 搜索栏查询
  private async onQuery() {

  }
  // 清空搜索的回调
  private async clearCb() {

  }

  // 权限打开回调
  private async openEdit() {

  }
  // 添加 | 编辑权限提交处理
  private async onRightsHandle() {

  }
  // 添加权限打开的回调
  private async addRightsOnOpen() {

  }

  // 删除权限显示提示 Pop
  private async showPop() {

  }
  // 删除权限提交
  private async onDelRights() {

  }


  // 分页条数回调
  private async handleSizeChange() {

  }
  // 分页页码回调
  private async handleCurrentChange() {

  }

  /*LC(life-cycle)
    ====================================== */
  async created() {

  }

}
</script>

<style scoped lang="scss">
::v-deep.rights-container{

}
</style>
