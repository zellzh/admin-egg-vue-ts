<template>
  <div class="role-container">
    <Breadcrumb :navi-path="naviPath"/>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';
import Breadcrumb from "@/components/common/Breadcrumb.vue";

@Component({
  name: 'Roles',
  components: {
    Breadcrumb,
  },
})
export default class Roles extends Vue {
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
::v-deep .role-container{

}
</style>
