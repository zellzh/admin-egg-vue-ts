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
              <el-select size="small" v-model="searchData[prop]" :placeholder="val">
                <el-option v-for="opt of searchOpts[prop]" :key="opt" :label="opt" :value="opt"/>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-input size="small" v-model="searchData.key" placeholder="请输入搜索关键字"/>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
              <el-button type="primary" size="small" @click="exportUsers">导出结果</el-button>
            </el-col>
          </el-row>
        </el-col>
        <el-col class="bar-right" :span="6">
          <el-button type="primary" size="small" @click="addUser">添加用户</el-button>
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
          <template scope="scope" v-if="prop === 'userState'">
            <el-switch
                v-model="scope.row.userState"
                inactive-color="#ff4949"/>
          </template>
          <template scope="scope" v-else-if="prop === 'userHandle'">
            <el-button size="small" type="primary" icon="el-icon-edit"/>
            <el-button size="small" type="danger" icon="el-icon-delete"/>
            <el-tooltip content="分配角色" :enterable="false" placement="top">
              <el-button size="small" type="warning" icon="el-icon-setting"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页区域 -->
    <el-pagination
        background
        pager-count="5"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paginationData.curPage"
        :page-sizes="paginationData.pageSizes"
        :page-size="paginationData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paginationData.total"/>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

@Component({
  name: 'Users',
  components: {

  },
})
export default class Users extends Vue {
  /*ref
    ====================================== */


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
  searchData = {
    role: '',
    type: '',
    origin: '',
    key: '',
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
  tableData = [
    {
      username:'jonathan',
      email:'97606813@qq.com',
      phone:'17301727164',
      roleName:'超级管理员',
      avatarURL: '',
      userState: true
    },
    {
      username:'it666',
      email:'97606814@qq.com',
      phone:'13554499311',
      roleName:'普通用户',
      avatarURL: '',
      userState: false
    },
    {
      username:'it666',
      email:'97606814@qq.com',
      phone:'13554499311',
      roleName:'普通用户',
      avatarURL: '',
      userState: false
    },
    {
      username:'it666',
      email:'97606814@qq.com',
      phone:'13554499311',
      roleName:'普通用户',
      avatarURL: '',
      userState: false
    },
    {
      username:'it666',
      email:'97606814@qq.com',
      phone:'13554499311',
      roleName:'普通用户',
      avatarURL: '',
      userState: false
    },
    {
      username:'it666',
      email:'97606814@qq.com',
      phone:'13554499311',
      roleName:'普通用户',
      avatarURL: '',
      userState: false
    }
  ]
  // 分页数据
  paginationData = {
    curPage: 1,
    pageSizes: [2, 4, 6, 8, 10],
    pageSize: 2,
    total: this.tableData.length
  }


  /*method
   ====================================== */
  private onSubmit() {
    console.log(this.searchData);
  }
  private addUser() {

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

}
</script>

<style scoped lang="scss">
::v-deep.users-container{
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

      .user-handle>.cell{ // 表格宽度
        min-width: 180px;
      }
    }
  }

  // 分页
  .el-pagination{
    margin-top: 20px;
  }
}
</style>
