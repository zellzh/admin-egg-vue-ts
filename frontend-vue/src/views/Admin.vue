<template>
  <div class="admin-container">
    admin
    <button @click="getAll">按钮</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
Component.registerHooks([
  'beforeRouteEnter',
])

@Component({
  name: 'Admin',
  components: {

  },
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

</style>
