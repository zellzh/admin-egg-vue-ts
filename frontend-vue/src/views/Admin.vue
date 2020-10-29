<template>
  <el-container class="admin-container">
    <!-- header -->
    <el-header>
      <div class="header-logo" @click="goHome">
        <img src="../assets/A_logo.png" alt="">
        <span>后台管理系统</span>
      </div>
      <div class="header-handle">
        <img src="../assets/王道.png" alt="加载失败">
        <span>你的名字</span>
        <el-button type="info" @click="logout">退出</el-button>
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
            :default-active="elMenu.activePath"
            :collapse-transition="elMenu.isAni"
            :collapse="elMenu.isFold"
            :background-color="elMenu.bgc"
            :text-color="elMenu.tc"
            :active-text-color="elMenu.atc"
            >
          <div class="trigger-button" @click="triggerCollapse">
            <i :class="elMenu.isFold ? menuIcon.fold : menuIcon.unfold"/>
          </div>
          <!-- 一级菜单 -->
          <el-submenu :index="item.id" v-for="item in
userMenus" :key="item.id">
            <!-- 菜单模板 -->
            <template slot="title">
              <!-- 菜单图标 -->
              <i :class="menuIcon[item.id]"></i>
              <!-- 菜单文本 -->
              <span>{{item.menuName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
                :index="child1.path"
                v-for="child1 in item.children">
              <!-- 菜单图标 -->
              <i :class="menuIcon.sub"></i>
              <!-- 菜单文本 -->
              <span>{{child1.menuName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- main -->
      <el-main>
        <router-view/>
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


  /*data
    ====================================== */
  // 用户菜单列表
  userMenus = [
    {
      id: '1',
      menuName:'用户管理',
      path: '',
      children:[
        {id: '2',menuName:'用户列表',path: '/users'}
      ]
    },
    {
      id: '3',
      menuName:'权限管理',
      path: '',
      children:[
        {id: '4',menuName:'角色列表',path: '/roles'},
        {id: '5',menuName:'权限列表',path: '/rights'}
      ]
    },
  ]
  // 菜单图标
  menuIcon = {
    fold: 'el-icon-s-unfold',
    unfold: 'el-icon-s-fold',
    sub: 'el-icon-menu',
    1: 'el-icon-setting',
    3: 'el-icon-collection',
    2: '',
    4: '',
    5: '',
    6: '',
  }
  // el-menu 配置
  elMenu = {
    isFold: false, // 是否折叠
    isAni: true, // 是否开启折叠动画
    activePath: this.$route.path, // 默认选中菜单
    bgc: '#333444', // 背景色
    tc: '#fff', // 文本色
    atc: '#ffd04b', // 选中色
  }

  /*method
   ====================================== */
  // logo 点击
  private goHome() {
    if (this.$route.path === '/welcome') return // 防止重复路由跳转
    this.menuRef.close('1') // 收起父菜单
    this.$router.push('/welcome')
    this.elMenu.activePath = ''
  }
  // 退出
  private logout() {
    localStorage.removeItem('rft')
    this.$router.push('/login')
  }
  // 左侧菜单水平切换
  private triggerCollapse() {
    this.elMenu.isFold = !this.elMenu.isFold
  }


  /*LC(life-cycle)
    ====================================== */
  // 组件内使用导航守卫: before 防止鉴权界面显示, 影响体验
  /*
  async beforeRouteEnter (to: string, from:string, next:any) {
    // 访问权限接口, 查看是否有权限
    const res = await Vue.prototype.$api.isLogin() // before 不能获取到实例 this
    if (res.meta.status !== 200) {
      return next('/login')
    }
    next()
  }
   */
  created() {

  }
}
</script>

<style scoped lang="scss">
// element
.admin-container {
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
        object-fit: cover;
        box-shadow: 0 0 6px #fff;
        background: #fff;
      }

      span {
        padding: 0 10px;
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
    min-width: 1100px;
    background: #e5e5e5;
  }
}
</style>
