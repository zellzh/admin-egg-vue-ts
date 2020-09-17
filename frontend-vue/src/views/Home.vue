<template>
  <div class="home-container">
    <p>{{msg}}</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {

  },
})
export default class Home extends Vue {
  msg: string = 'hello world!'
}
</script>
<style scoped lang="scss">

</style>
