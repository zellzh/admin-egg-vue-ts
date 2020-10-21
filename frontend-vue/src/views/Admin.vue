<template>
  <div class="admin-container">
    <el-container>
      <el-header>
        <div class="header-logo">
          <img src="../assets/A_logo.png" alt="">
          <span>后台管理系统</span>
        </div>
        <div class="header-handle">
          <img src="../assets/王道.png" alt="加载失败">
          <span>你的名字</span>
          <el-button type="info" @click="logout">退出</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!-- 菜单区域 -->
          <el-menu
              default-active="2"
              class="aside-menu"
              background-color="#333444"
              text-color="#fff"
              active-text-color="#ffd04b"
              >
            <!-- 一级菜单 -->
            <el-submenu index="1">
              <!-- 菜单模板 -->
              <template slot="title">
                <!-- 菜单图标 -->
                <i class="el-icon-location"></i>
                <!-- 菜单文本 -->
                <span>导航一</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <!-- 菜单模板 -->
              <template slot="title">
                <!-- 菜单图标 -->
                <i class="el-icon-location"></i>
                <!-- 菜单文本 -->
                <span>导航一</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

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
  msg = ''

  /*data
    ====================================== */


  /*method
   ====================================== */
  async getAll() {
    const res = await this.$api.users()
    console.log(res);
  }

  // 退出
  private logout() {
    localStorage.removeItem('rft')
    this.$router.push('/login')
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
}
</script>

<style scoped lang="scss">
.admin-container {
  width: 100%;
  height: 100%;
}

// element
::v-deep .el-container {
  height: 100%;

  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background: #373d55;

    // 左侧 logo
    & > .header-logo {
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

  .el-aside {
    background: #333444;
  }

  .el-main {
    background: #ccc;
  }
}
</style>
