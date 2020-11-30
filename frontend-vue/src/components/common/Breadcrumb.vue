<template>
  <!-- 面包屑区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item v-for="navi in naviPath"
                        :key="navi.id"
                        :to="navi.rights_path === $route.path || navi.rights_path">
      {{navi.rights_name}}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';

@Component({
  name: 'Breadcrumb',
  components: {

  },
})
export default class Breadcrumb extends Vue {
  /*ref & prop
    ====================================== */
  @Prop() readonly naviPath!: any[]

  /*data
    ====================================== */


  /*method
   ====================================== */


  /*LC(life-cycle)
    ====================================== */

}
</script>

<style scoped lang="scss">
// 面包屑
::v-deep.el-breadcrumb{
  margin-bottom: 20px;
  .el-breadcrumb__separator{
    color: #333444;
  }
  .el-breadcrumb__item{
    white-space: pre-wrap;
  }
}
</style>
