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
        <!-- 权限展示 -->
        <el-table-column type="expand">
          <template scope="scope">
            <el-row type="flex" align="middle"
                    :key="row1.id"
                    :class="['bd-bottom', i1 === 0 && 'bd-top']"
                    v-for="(row1, i1) in scope.row.rightsTree">
              <!-- 顶级权限 -->
              <el-col :span="6">
                <el-tag closable
                        @close="delAssignRights(row1.id, scope.row)"
                        type="danger">{{row1.rights_name}}</el-tag>
                <i class="el-icon-caret-right"/>
              </el-col>
              <!-- 子级权限 -->
              <el-col :span="18">
                <!-- 二级权限 -->
                <el-row type="flex" align="middle"
                        :key="row2.id"
                        :class="[i2 === 0 || 'bd-top']"
                        v-for="(row2, i2) in row1.children">
                  <el-col :span="6">
                    <el-tag closable
                            @close="delAssignRights(row2.id, scope.row)"
                            type="warning">{{row2.rights_name}}</el-tag>
                    <i class="el-icon-caret-right"/>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag v-for="row3 in row2.children"
                            :key="row3.id"
                            closable
                            @close="delAssignRights(row3.id, scope.row)"
                            type="primary">{{row3.rights_name}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"/>
        <!-- 定义列 -->
        <el-table-column
            :min-width="prop === 'handle'?5:3"
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
                       @click="openAssignRights(scope.row)"
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
    <!-- 分配权限 -->
    <el-dialog title="分配权限" width="40%"
               :visible.sync="assignRightsVisible">
      <el-tree :data="treeData"
               ref="tree"
               show-checkbox
               check-strictly
               @check="checkNode"
               @node-click="clickNode"
               default-expand-all
               node-key="id"
               :default-checked-keys="ownRights"
               :props="treeProps"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assignRightsVisible = false">取 消</el-button>
        <el-button type="primary" @click="onAssignRights">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop, Ref} from 'vue-property-decorator';
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import {Form, Popover, TableColumn, Tree} from "element-ui";

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
      console.log(data);
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
      {required: true, message: '角色名称不能为空', trigger: 'blur',
        transform(value: string){return value && value.trim()}},
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

  // 分配权限相关
  assignRightsVisible = false
  // 获取权限 tree
  private async getRightsTree() {
    const res = await this.$api.getRights('tree')
    if (res && res.status === 200) {
      this.treeData = res.data.data
    }
  }
  // tree
  @Ref() readonly tree?: Tree
  treeData: any[] = []
  treeProps = {
    label: 'rights_name',
    children: 'children',
  }
  ownRights: any[] = []
  curRoleId: any = null
  // 打开 dialog
  private openAssignRights(row: any) {
    this.assignRightsVisible = true
    this.curRoleId = row.id
    // 重置为空, 再重新获取
    // this.ownRights = []
    // row.rights.forEach((item: any) => {
    //   // 分配 dialog 中只能删除三级权限, 添加无限制
    //   item.level === 2 && this.ownRights.push(item.id)
    // })
    // 设置默认选中
    // this.tree?.setCheckedKeys(this.ownRights, false)

    // 优化后: 父子节点不关联
    this.ownRights = row.rights.map((item: any) => item.id)
    this.tree?.setCheckedKeys(this.ownRights)
  }
  // 提交分配
  private async onAssignRights() {
    const reqArr = this.combineAssignReq()
    const res = await this.$api.all(reqArr)
    res.includes(undefined) || this.$message.success('分配权限成功')
    await this.getRoleList()
    this.assignRightsVisible = false
  }
  // 整合分配权限的请求
  private combineAssignReq() {
    const ownIds = this.ownRights
    const reqArr: any[] = []
    // 1.获取所有权限 id
    const totalIds = [...this.tree!.getHalfCheckedKeys(), ...this.tree!.getCheckedKeys()]
    // 2.计算新增的 id
    const addIds = totalIds.filter(id => !ownIds.includes(id))
    if (addIds.length) {
      reqArr.push(
          this.$api.addRoleRights({
            role_id: this.curRoleId,
            rights_ids: addIds,
          })
      )
    }
    // 3.计算删除的 id
    const delIds = ownIds.filter(id => !totalIds.includes(id))
    if (addIds.length) {
      reqArr.push(
          this.$api.delRoleRights(this.curRoleId, {
            rights_ids: delIds,
          })
      )
    }
    return reqArr
  }

  // tag 删除
  private delAssignRights(id: number, row: any) {
    this.$confirm('此操作将删除该已有权限, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      const res = await this.$api.delRoleRights(row.id, {
        rights_ids: [id]
      })
      if (res && res.status === 200) {
        // 删除后接口返回最新权限, 防止页面刷新
        row.rights = res.data.data.rights
        row.rightsTree = res.data.data.rightsTree
        this.$message.success('删除分配成功')
      }
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      });
    });

  }
  /*
   * 优化:
   *  - 父节点选中时, 子节点全选; 父节点不选时, 子节点全不选
   *  - 子节点全不选时, 父节点不变
   *  - 点击叶子节点选中
   */
  // 点击叶子节点选中
  private clickNode(data: any, node: any) {
    if (node.isLeaf) {
      node.checked = !node.checked
      this.checkNode(data)
    }
  }
  // 选中当前节点
  private checkNode(data: any) {
    let node = this.tree!.getNode(data);
    this.checkChildNodes(node);
    this.checkParentNodes(node);
  }
  // 选中子节点
  checkChildNodes(node: any){
    if (!node.childNodes.length) return
    for (const child of node.childNodes) {
      child.checked = node.checked
      this.checkChildNodes(child)
    }
  }
  // 选中父节点
  checkParentNodes(node: any){
    const parentNode = node.parent
    if (parentNode) {
      parentNode.indeterminate = true;
      this.checkParentNodes(parentNode)
    }
  }

  /*LC(life-cycle)
    ====================================== */
  async created() {
    await this.getRoleList()
    await this.getRightsTree()
  }
}
</script>

<style scoped lang="scss">
::v-deep.role-container{
  position: relative;

  // 权限展示
  .el-tag{
    margin: 10px;
  }
  .bd-top{
    border-top: 1px solid #ccc;
  }
  .bd-bottom{
    border-bottom: 1px solid #ccc;
  }
}
</style>
