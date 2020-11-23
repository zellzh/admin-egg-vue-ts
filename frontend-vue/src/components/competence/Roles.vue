<template>
  <div class="role-container">
    <!-- 面包屑 -->
    <Breadcrumb :navi-path="naviPath"/>
    <!-- 卡片区域 -->
    <el-card shadow="always">
      <!-- 搜索区域 -->
      <el-row class="search-bar">
        <el-col class="bar-left">
          <el-button type="primary" size="small" @click="setAddRole">添加角色</el-button>
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
            :min-width="prop === 'handle'?4:3"
            v-for="(val, prop) in tableField"
            :key="val"
            :prop="prop"
            :label="val">
          <!-- 状态 -->
          <template scope="scope" v-if="prop === 'state'">
            <el-switch
                v-model="scope.row.role_state"
                @change="switchState(scope.row)"
                inactive-color="#ff4949"/>
          </template>
          <!-- 操作 -->
          <template scope="scope" v-else-if="prop === 'handle'">
            <el-button size="mini"
                       @click="openEdit(scope.row)"
                       type="primary"
                       icon="el-icon-edit">编辑</el-button>
            <el-button size="mini"
                       @click.stop="showPop(scope.row.id,$event)"
                       type="danger"
                       icon="el-icon-delete">删除</el-button>
            <el-button size="mini"
                       type="warning"
                       icon="el-icon-setting">分配权限</el-button>
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
    <!-- 添加|编辑角色 -->
    <el-dialog @open="addRoleOnOpen"
               :title="isEditRole ? '编辑角色' : '添加角色'" width="40%"
               :visible.sync="roleVisible">
      <el-form :model="roleData"
               ref="addRoleForm"
               :rules="roleRules"
               label-width="auto"
               size="medium">
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="roleData.role_name"
                    ref="focus"
                    clearable
                    prefix-icon="iconfont icon-option"
                    placeholder="请输入角色名"/>
        </el-form-item>
        <el-form-item label="角色描述" prop="role_desc">
          <el-input v-model="roleData.role_desc"
                    prefix-icon="iconfont icon-option"
                    placeholder="请输入描述内容"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleVisible = false">取 消</el-button>
        <el-button type="primary" @click="onRoleHandle">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除角色 -->
    <el-popover
        ref="delPop"
        :append-to-body="false"
        placement="top"
        v-model="delRoleVisible">
      <p>确定删除？</p>
      <div style="text-align: right; margin: 0;">
        <el-button size="mini" type="text" @click="delRoleVisible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="onDelRole">确定</el-button>
      </div>
    </el-popover>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop, Ref} from 'vue-property-decorator';
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import {Form, Popover, TableColumn} from "element-ui";

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
  name: 'Roles',
  components: {
    Breadcrumb,
  },
})
export default class Roles extends Vue {
  /*ref & prop
    ====================================== */
  @Ref() readonly addRoleForm?: Form
  @Ref() readonly delPop!: Pop
  @Ref() readonly tableColumn!: TableColumn
  @Prop() readonly naviPath!: any[]

  /*data
    ====================================== */
  // 添加 | 编辑角色
  roleVisible = false
  isEditRole = false
  roleData: any = {
    role_name: '',
    role_desc: '',
  }
  // 当前表单数据
  curRoleData: any = {}

  // 删除角色
  delRoleVisible = false
  delRID = 0

  // 表头
  tableField = {
    role_name: '角色名称',
    role_desc: '角色描述',
    state: '状态',
    handle: '操作',
  }
  // 表格数据
  tableData: any[] = []
  // 分页
  totalCount = 0
  queryInfo = {
    limit: 5,
    offset: 1,
  }


  /*method
   ====================================== */
  // 获取角色列表
  private async getRoleList() {
    const res = await this.$api.getRoles(this.queryInfo)
    if (res && res.status === 200) {
      const data = res.data.data
      this.tableData = data.role;
      this.totalCount = data.count;
    }
  }

  // 添加角色
  private setAddRole() {
    this.roleVisible = true
    this.isEditRole = false
  }

  // 表单验证
  private roleRules = {
    role_name: [
      {required: true, message: '角色名称不能为空', trigger: 'blur', transform(value: string){return value && value.trim()}},
    ],
    role_desc: [
      {transform(value: string) {return value && value.trim()}}
    ],
  }

  // 编辑角色
  private async openEdit(row: any) {
    // 显示
    this.roleVisible = true
    this.isEditRole = true
    this.curRoleData = row
  }
  // 角色表单打开的回调
  private async addRoleOnOpen() {
    // 更新 dom 后再重置
    this.$nextTick(() => {
      delete this.roleData.id
      this.addRoleForm?.resetFields()
      if (this.isEditRole) {
        // 复用表单并填充数据
        this.roleData = Object.assign(this.roleData, this.curRoleData)
      }
    })
  }
  // 角色状态切换
  private async switchState(row: any) {
    const { id, ...role } = row
    const res = await this.$api.updateRole(id, role)
    if (res && res.status === 200) {
      this.$message.success('更新状态成功')
    }
  }
  // 添加 | 编辑角色提交处理
  private onRoleHandle() {
    this.addRoleForm!.validate(async valid => {
      if (!valid) {
        this.$message.error('请完善角色信息')
        return false
      }
      console.log(this.roleData);
      const res = this.isEditRole ?
          await this.$api.updateRole(this.roleData.id, this.roleData) :
          await this.$api.addRole(this.roleData)
      if (res && res.status === 200) {
        this.$message.success(this.isEditRole ? '更新成功' : '添加成功')
        await this.getRoleList()
        this.roleVisible = false
      }
    })
  }

  // 显示删除 pop
  private showPop(id: number, e: MouseEvent) {
    // pop
    this.delRID = id

    // 获取图标元素, 防止 pop 错位
    const target = (e.target as Element).children[0] || e.target
    const pop = this.delPop
    // 更新 pop, 并绑定当前的元素
    pop.updatePopper()
    pop.referenceElm = target;
    this.delRoleVisible = true
    // 触发 dom 更新, 获取当前的 popperJS, 并绑定到当前元素
    this.$nextTick(() => {
      pop.popperJS!._reference = target
      pop.popperJS!.state.updateBound()
    });
  }
  // 删除用户
  private async onDelRole() {
    const res = await this.$api.delRole(this.delRID)
    if (res && res.status === 200) {
      // 处理删除最后一条空白 table 的 bug
      this.totalCount - 1 === (this.queryInfo.offset - 1) * this.queryInfo.limit
      && this.queryInfo.offset--
      await this.getRoleList()
      this.$message.success('删除成功')
    }
    this.delRoleVisible = false
  }

  // 分页条数回调
  private async handleSizeChange() {
    await this.getRoleList()
  }
  // 分页页码回调
  private async handleCurrentChange() {
    await this.getRoleList()
  }

  /*LC(life-cycle)
    ====================================== */
  async created() {
    await this.getRoleList()
  }
}
</script>

<style scoped lang="scss">
::v-deep .role-container{
  position: relative;
}
</style>
