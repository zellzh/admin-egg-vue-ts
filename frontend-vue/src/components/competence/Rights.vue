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
                <el-option v-for="(val, key) in rightsOpts"
                           :key="key"
                           :label="val"
                           :value="key"/>
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
          <el-button type="primary" size="small" @click="setAddRights">添加权限</el-button>
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
            :class-name="prop === 'handle'?'table-handle':''"
            :key="val"
            :prop="prop"
            :label="val">
          <!-- 等级 -->
          <template scope="scope" v-if="prop === 'level'">
            <el-tag type="danger" v-if="scope.row.level === 0">一级</el-tag>
            <el-tag v-else-if="scope.row.level === 1">二级</el-tag>
            <el-tag v-else type="success">三级</el-tag>
          </template>
          <!-- 状态 -->
          <template scope="scope" v-else-if="prop === 'state'">
            <el-switch
                v-model="scope.row.rights_state"
                @change="switchState(scope.row)"
                inactive-color="#ff4949"/>
          </template>
          <!-- 操作 -->
          <template scope="scope" v-else-if="prop === 'handle'">
            <el-button size="mini"
                       type="primary"
                       @click="openEdit(scope.row)"
                       icon="el-icon-edit"/>
            <el-button size="mini"
                       type="danger"
                       @click.stop="showPop(scope.row.id,$event)"
                       icon="el-icon-delete"/>
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
    <!-- 添加|编辑权限 -->
    <el-dialog @open="addRightsOnOpen"
               :title="isEditRights ? '编辑权限' : '添加权限'" width="40%"
               :visible.sync="rightsVisible">
      <el-form :model="rightsData"
               ref="addRightsForm"
               :rules="rightsRules"
               label-width="auto"
               size="medium">
        <el-form-item label="权限名称" prop="rights_name">
          <el-input v-model="rightsData.rights_name"
                    ref="focus"
                    :disabled="isEditRights"
                    clearable
                    prefix-icon="iconfont icon-option"
                    placeholder="请输入权限名"/>
        </el-form-item>
        <el-form-item label="权限描述" prop="rights_desc">
          <el-input v-model="rightsData.rights_desc"
                    prefix-icon="iconfont icon-option"
                    placeholder="请输入描述内容"/>
        </el-form-item>
        <el-form-item label="权限类型" prop="rights_type">
          <el-select v-model="rightsData.rights_type"
                     :disabled="isEditRights"
                     @change="typeChangeCb">
            <el-option :label="val"
                       v-for="(val, key) in rightsOpts"
                       :key="key"
                       :value="key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="父级权限" prop="pid">
          <el-select v-model="rightsData.pid"
                     :disabled="!rightsData.level">
            <!-- 初始选项, 优化体验 -->
            <el-option label="请选择"
                       :value="0"
                       v-show="!curRightsParents.length"/>
            <el-option :label="parent.rights_name"
                       v-for="parent in curRightsParents"
                       :key="parent.id"
                       :value="parent.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="权限路径" prop="rights_path">
          <el-input v-model="rightsData.rights_path"
                    :disabled="!rightsData.level"
                    prefix-icon="iconfont icon-option"
                    placeholder="请输入路径"/>
        </el-form-item>
        <el-form-item label="请求方式" prop="rights_method">
          <el-select v-model="rightsData.rights_method"
                     :disabled="rightsData.level !== 2">
            <el-option :label="val"
                       v-for="(val, key) in rightsMethods"
                       :key="key"
                       :value="key"/>
          </el-select>
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
import {Component, Vue, Prop, Ref, Watch} from 'vue-property-decorator';
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import {Form, Popover} from "element-ui";

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
  name: 'Rights',
  components: {
    Breadcrumb
  },
})
export default class Rights extends Vue {
  /*ref & prop
    ====================================== */
  @Ref() readonly addRightsForm?: Form
  @Ref() readonly delPop!: Pop
  @Prop() readonly naviPath!: any[]

  /*data & computed
    ====================================== */
  // 搜索栏数据
  queryInfo = {
    type: '',
    key: '',
    limit: 5,
    offset: 1,
  }
  // 权限类型选项
  rightsOpts = {
    menu: '菜单权限',
    router: '路由权限',
    action: '请求权限',
  }
  // 权限请求方式
  rightsMethods = {
    get: 'GET请求',
    post: 'POST请求',
    put: 'PUT请求',
    delete: 'DELETE请求',
    all: 'ALL请求',
  }

  // 添加 | 编辑权限
  rightsVisible = false
  isEditRights = false
  rightsData: any = {
    rights_name: '',
    rights_type: '',
    rights_desc: '',
    rights_path: '',
    rights_method: '',
    level: null,
    pid: null,
  }
  // 当前权限的父级
  curRightsParents: any[] = []
  // 当前表单数据
  curRightsData: any = {}

  // 删除权限
  delRightsVisible = false
  delRID = 0

  // 表头
  tableField = {
    rights_name: '权限名称',
    rights_desc: '权限描述',
    level: '权限等级',
    rights_path: '路径',
    state: '状态',
    handle: '操作',
  }
  // 表格数据
  tableData: any[] = []
  // 分页
  totalCount = 0

  /*method
   ====================================== */
  // 获取权限列表
  private async getRightsList() {
    const res = await this.$api.getRights(this.queryInfo)
    if (res && res.status === 200) {
      const data = res.data.data
      this.tableData = data.rights;
      this.totalCount = data.count;
    }
  }

  // 搜索栏查询
  private async onQuery() {
    this.queryInfo.offset = 1 // 重置页码
    await this.getRightsList()
  }
  // 清空搜索的回调
  private async clearCb() {
    await this.getRightsList()
  }

  // 添加权限
  private setAddRights() {
    this.rightsVisible = true
    this.isEditRights = false
  }
  // 权限类型切换的回调
  private async typeChangeCb(type: string) {
    let level: any;
    switch (type) {
      case 'menu': // 菜单权限, 清空部分字段
        this.rightsData.level = level = 0;
        this.rightsData.pid = 0;
        this.rightsData.rights_path = '';
        this.rightsData.rights_method = '';
        this.curRightsParents = [];
        break;
      case 'router': // 路由权限, 清空部分字段
        this.rightsData.rights_method = '';
        this.rightsData.level = level = 1;
        break;
      case 'action':
        this.rightsData.level = level = 2;
        break;
    }
    await this.setCurParents(level)
  }
  // 查询父级
  private async setCurParents(level: number) {
    level -= 1
    if (level < 0) return
    const res = await this.$api.getParentRights(level)
    if (res && res.status === 200) {
      this.curRightsParents = res.data.data
    }
  }
  // 表单验证
  private rightsRules = {
    rights_name: [
      {required: true, message: '权限名称不能为空', trigger: 'blur', transform(value: string){return value && value.trim()}},
    ],
    rights_desc: [
      {transform(value: string) {return value && value.trim()}}
    ],
    rights_path: [
      {validator: this.verifyPath, trigger: 'blur'}
    ],
    rights_type: [
      {required: true, message: '请选择权限类型', trigger: ['blur', 'focus']}
    ],
    rights_method: [
      {validator: this.verifyMethod, trigger: 'blur'}
    ],
    pid: [
      {validator: this.verifyPid, trigger: 'blur'}
    ],
  }
  // 路径验证
  private verifyPath(rule: any, value:string, cb:any) {
    if (this.rightsData.level && value && !value.trim()) {
      cb('路由或请求权限必须填写路径')
    } else {
      cb()
    }
  }
  // 请求方式验证
  private verifyMethod(rule: any, value:string, cb:any) {
    if (this.rightsData.rights_type === 'action' && !value){
      cb('请求权限必须选择请求方式')
    } else {
      cb()
    }
  }
  // 父级验证
  private verifyPid(rule: any, value:string, cb:any) {
    if (this.rightsData.level && !value) {
      cb('非一级权限, 必须选择父级权限')
    } else {
      cb()
    }
  }

  // 编辑权限
  private async openEdit(row: any) {
    // 显示
    this.rightsVisible = true
    this.isEditRights = true
    this.curRightsData = row
  }
  // 权限表单打开的回调
  private addRightsOnOpen() {
    // 更新 dom 后再重置
    this.$nextTick(async () => {
      this.rightsData.level = null
      delete this.rightsData.id
      this.addRightsForm?.resetFields()
      if (this.isEditRights) {
        // 获取父级
        const level = this.curRightsData.level
        level && await this.setCurParents(level)
        // 复用表单并填充数据
        Object.assign(this.rightsData, this.curRightsData)
      }
    })
  }
  // 权限状态切换
  private async switchState(row: any) {
    const { id, ...rights } = row
    const res = await this.$api.updateRights(id, rights)
    if (res && res.status === 200) {
      this.$message.success('更新状态成功')
    }
  }
  // 添加 | 编辑权限提交处理
  private onRightsHandle() {
    this.addRightsForm!.validate(async valid => {
      if (!valid) {
        this.$message.error('请完善权限信息')
        return false
      }
      const res = this.isEditRights ?
          await this.$api.updateRights(this.rightsData.id, this.rightsData) :
          await this.$api.addRights(this.rightsData)
      if (res && res.status === 200) {
        this.$message.success(this.isEditRights ? '更新成功' : '添加成功')
        await this.getRightsList()
        this.rightsVisible = false
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
    this.delRightsVisible = true
    // 触发 dom 更新, 获取当前的 popperJS, 并绑定到当前元素
    this.$nextTick(() => {
      pop.popperJS!._reference = target
      pop.popperJS!.state.updateBound()
    });
  }
  // 删除用户
  private async onDelRights() {
    const res = await this.$api.delRights(this.delRID)
    if (res && res.status === 200) {
      // 处理删除最后一条空白 table 的 bug
      this.totalCount - 1 === (this.queryInfo.offset - 1) * this.queryInfo.limit
        && this.queryInfo.offset--
      await this.getRightsList()
      this.$message.success('删除成功')
    }
    this.delRightsVisible = false
  }

  // 分页条数回调
  private async handleSizeChange() {
    await this.getRightsList()
  }
  // 分页页码回调
  private async handleCurrentChange() {
    await this.getRightsList()
  }

  /*watcher
   ====================================== */


  /*LC(life-cycle)
    ====================================== */
  async created() {
    await this.getRightsList()
  }

}
</script>

<style scoped lang="scss">
::v-deep.rights-container{
  // 相对定位, 控制 Pop
  position: relative;
}
</style>
