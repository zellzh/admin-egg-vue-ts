<template>
  <!-- 面包屑区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item v-for="(navi, index) in naviPath"
                        ref="breadcrumb_item"
                        :key="navi.id"
                        @mouseup.native="changeNavi(index)"
                        :to="navi.rights_path === $route.path ? '' : navi.rights_path">
      {{navi.rights_name}}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts">
import {Component, Vue, Prop, Ref} from 'vue-property-decorator';
import {BreadcrumbItem} from "element-ui";

@Component({
  name: 'Breadcrumb',
  components: {

  },
})
export default class Breadcrumb extends Vue {
  /*ref & prop
    ====================================== */
  @Prop() readonly naviPath!: any[]
  @Ref() readonly breadcrumb_item!: BreadcrumbItem[]

  /*data
    ====================================== */


  /*method & emit
   ====================================== */
  changeNavi(index: number) {
    if (this.breadcrumb_item[index].to === '/welcome') {
      this.$emit('go-home')
    }
  }

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
