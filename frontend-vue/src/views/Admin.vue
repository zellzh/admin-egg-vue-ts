<template>
  <el-container class="admin-container">
    <!-- header -->
    <el-header>
      <div class="header-logo" @click="goHome">
        <img src="../assets/img/A_logo.png" alt="">
        <span>后台管理系统</span>
      </div>
      <div class="header-handle">
        <img :src="userInfo.baseUrl + userInfo.avatar" alt="加载失败">
        <span>{{userInfo.username || userInfo.email || userInfo.phone}}</span>
        <el-button size="small" type="warning" @click="logout">退出</el-button>
      </div>
    </el-header>
    <!-- container -->
    <el-container>
      <!-- aside -->
      <el-aside width="auto">
        <!-- 菜单区域 -->
        <el-menu
            ref="menuRef"
            class="aside-menu"
            unique-opened
            router
            :default-active="activePath"
            :collapse-transition="elMenuOpts.isAni"
            :collapse="elMenuOpts.isFold"
            :background-color="elMenuOpts.bgc"
            :text-color="elMenuOpts.tc"
            :active-text-color="elMenuOpts.atc"
            >
          <!-- 折叠按钮 -->
          <div class="trigger-button" @click="triggerCollapse">
            <i :class="elMenuOpts.isFold ? menuIcon.fold : menuIcon.unfold"/>
          </div>
          <!-- 一级菜单 -->
          <el-submenu :index="`${item.id}`"
                      v-for="item in menuTree"
                      :key="item.id">
            <!-- 菜单模板 -->
            <template slot="title">
              <!-- 菜单图标 -->
              <i :class="menuIcon[item.rights_name]"></i>
              <!-- 菜单文本 -->
              <span>{{item.rights_name}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="child.rights_path"
                          v-for="child in item.children">
              <!-- 菜单图标 -->
              <i :class="menuIcon.sub"></i>
              <!-- 菜单文本 -->
              <span>{{child.rights_name}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- main -->
      <el-main>
        <router-view :navi-path="naviChain" @go-home="goHome"/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import {Component, Ref, Vue} from 'vue-property-decorator';
import {Menu} from "element-ui";

Component.registerHooks([
  'beforeRouteEnter',
])

@Component({
  name: 'Admin',
  components: {},
})
export default class Admin extends Vue {
  /*ref
    ====================================== */
  @Ref() readonly menuRef!: Menu

  /*data & computed
    ====================================== */
  // 登录账户信息
  userInfo = JSON.parse(localStorage.getItem('userInfo') || '')
  // 用户菜单列表
  private get menuTree() {
    return this.setMenuTree(this.userInfo.rightsTree)
  }
  // 菜单 tree 处理
  private setMenuTree(rightsTree: any[]) {
    if (!rightsTree) return []
    rightsTree.forEach(item => {
      if (item.level >= 1) {
        delete item.children
      } else {
        this.setMenuTree(item.children)
      }
    })
    return rightsTree
  }
  // 菜单图标
  menuIcon = {
    fold: 'el-icon-s-unfold',
    unfold: 'el-icon-s-fold',
    sub: 'el-icon-menu', // 子菜单
    '用户管理': 'el-icon-setting',
    '权限管理': 'el-icon-collection',
    '商品订单': 'el-icon-s-goods',
    '物流管理': 'el-icon-box',
  }
  // el-menu 配置
  elMenuOpts = {
    isFold: false, // 是否折叠
    isAni: true, // 是否开启折叠动画
    bgc: '#333444', // 背景色
    tc: '#fff', // 文本色
    atc: '#ffd04b', // 选中色
  }
  // 默认选中菜单
  get activePath() {
    return this.$route.path
  }

  // 获取面包屑导航链
  private get naviChain() {
    // 初始导航
    let naviArr: any[] = [{
      id: 0,
      rights_name: '首页',
      rights_path: '/welcome',
    }]
    // 父权限链
    return this.getParentChainArr(this.userInfo.rightsTree, naviArr)
  }
  // 获取父权限链
  private getParentChainArr(data: any[], chainArr: any[]) {
    for (const rights of data) {
      if (rights.rights_path === this.$route.path) {
        chainArr.splice(1, 0, rights)
        return chainArr
      }
      if (rights.children) {
        const chain: any = this.getParentChainArr(rights.children, chainArr);
        if (chain !== undefined) {
          chain.splice(1, 0, rights)
          return chain;
        }
      }
    }
  }

  /*method
   ====================================== */
  // logo 点击
  private goHome() {
    if (this.$route.path === '/welcome') return // 防止重复路由跳转
    this.menuRef.close(this.naviChain.slice(-2)[0].id + '') // 收起父菜单
    this.$router.push('/welcome')
  }

  // 退出
  private async logout() {
    localStorage.removeItem('rft')
    localStorage.removeItem('act')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('actionRights')
    localStorage.removeItem('routerRights')
    await this.$router.push('/login')
  }

  // 左侧菜单水平折叠
  private triggerCollapse() {
    this.elMenuOpts.isFold = !this.elMenuOpts.isFold
  }

  /*LC(life-cycle)
    ====================================== */
  created() {

  }
}
</script>

<style scoped lang="scss">
::v-deep.admin-container {
  min-width: 1100px;
  height: 100%;
  // header
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background: #373d55;

    // 左侧 logo
    & > .header-logo {
      cursor: pointer;
      display: flex;
      align-items: center;
      font-size: 20px;

      & > img {
        width: 50px;
        height: 50px;
        margin-right: 20px;
      }
    }

    // 右侧 handle
    & > .header-handle {
      display: flex;
      align-items: center;

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: contain;
        box-shadow: 0 0 6px #fff;
        background: #fff;
      }

      span {
        padding: 0 15px;
      }
    }
  }

  // aside
  .el-aside {
    background: #333444;
    &>.el-menu{
      border-right: none;

      // 折叠按钮
      &>.trigger-button{
        cursor: pointer;
        line-height: 24px;
        color: #fff;
        text-align: center;
        background: #456;
      }
    }
  }
  // 注: 外层容器 el-aside 宽度为 auto
  // 除了折叠后, 其他都设置为固定宽度, 防止动画 bug
  .el-menu:not(.el-menu--collapse) {
    width: 200px;
  }

  // main
  .el-main {
    background: #e5e5e5;
  }
}
</style>
