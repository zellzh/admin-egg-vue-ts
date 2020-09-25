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
  async beforeRouteEnter (to, from, next) { // 组件内使用导航守卫
    const res = await Vue.prototype.$api.isLogin() // before 不能获取到实例 this
    if (res.meta.status === 400) {
      Vue.prototype.$message.warning('请登录后再访问')
      next('/login')
    }
  }
}
</script>

<style scoped lang="scss">

</style>
