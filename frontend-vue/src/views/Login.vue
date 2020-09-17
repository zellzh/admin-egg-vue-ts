<template>
  <div class="login-container">
    <p>{{msg}}</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator';

@Component({
  components: {

  },
})
export default class Login extends Vue {
  msg: string = 'Login'

}
</script>
<style scoped lang="scss">
.login-container{
  width: 100%;
  height: 100%;
  background: #2b4b6b no-repeat center;
  background-size: cover;
}
</style>
