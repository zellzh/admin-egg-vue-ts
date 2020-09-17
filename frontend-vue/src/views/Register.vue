<template>
  <div class="register-container" ref="registerDiv">
    <!-- 信息 -->
    <div class="register-info">
      <p>缥缈峰修仙服务平台</p>
      <h1>后台管理系统</h1>
    </div>
    <!-- 内容框 -->
    <div class="register-box">
      <h3>——用户注册——</h3>
      <!-- 表单 -->
      <el-tabs tab-position="right" :before-leave="reset">
        <el-tab-pane :label="item" v-for="item in userType" :key="item">
          <NormalForm ref="normalForm" v-if="item === userType.normal"/>
          <EmailForm ref="emailForm" v-else-if="item === userType.email"/>
          <PhoneForm v-else/>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Ref, Vue} from 'vue-property-decorator';
import NormalForm from "@/components/register/NormalForm.vue";
import EmailForm from "@/components/register/EmailForm.vue";
import PhoneForm from "@/components/register/PhoneForm.vue";

@Component({
  name: 'Register',
  components: {
    NormalForm,
    EmailForm,
    PhoneForm
  },
})
export default class Register extends Vue {
  /*ref
    ====================================== */
  @Ref() readonly registerDiv!: HTMLElement
  @Ref() readonly normalForm?: NormalForm[]
  @Ref() readonly emailForm?: EmailForm[]
  @Ref() readonly phoneForm?: PhoneForm[]

  /*data
    ====================================== */
  userType = {
    normal: '普通注册',
    email: '邮箱注册',
    phone: '手机注册'
  }

  /*method
    ====================================== */
  // 重置表单
  private reset(){
    // ref 在 mounted 后渲染, 可能为 undefined, 需要判断使用
    this.normalForm && this.normalForm[0].resetInfo()
    this.emailForm && this.emailForm[0].resetInfo()
    this.phoneForm && this.phoneForm[0].resetInfo()
  }
  // 背景更新
  private changeImg() {
    let w = document.documentElement.offsetWidth
    let h = document.documentElement.offsetHeight
    let imgSeed = localStorage.getItem('imgSeed')
    if (!imgSeed || Date.now() >= parseInt(imgSeed, 16) + 24*60*60*1000) {
      imgSeed = Date.now().toString(16)
      localStorage.setItem('imgSeed', imgSeed)
      this.registerDiv.style.backgroundImage = `url("https://picsum.photos/seed/${imgSeed}/${w}/${h}?blur")`
    }
    this.registerDiv.style.backgroundImage = `url("https://picsum.photos/seed/${imgSeed}/${w}/${h}")`
  }

  /*LC(life-cycle)
    ====================================== */
  mounted() {
    this.changeImg()
  }
}
</script>

<style scoped lang="scss">
/*容器
  ====================================== */
.register-container{
  width: 100%;
  height: 100%;
  background: #248397 no-repeat center;
  background-size: cover;
  position: relative;
  z-index: 0;
}

/*信息
  ====================================== */
.register-info{
  display: inline-block;
  max-width: 300px;
  border-radius: 5px;
  position: absolute;
  left: 10%;
  top: 10%;
  text-align: center;
  color: #248397;
  background: rgb(241, 239, 240);
  perspective: 200px;
  // 阴影
  &:before{
    content: '';
    width: 126%;
    height: 100%;
    position: absolute;
    top: 0;
    left: -13%;
    z-index: -1;
    background: rgba(50, 50, 50, .1);
    box-shadow: inset 0 10px 8px 6px rgba(0, 0, 0, .3);
    transform-origin: center;
    transform: rotate(180deg) translateY(-30px) rotateX(70deg);
  }
  // 背景
  &:after{
    content: '';
    width: 110%;
    height: 110%;
    border-radius: 5px;
    position: absolute;
    top: -5%;
    left: -5%;
    background: rgba(0, 0, 0, .3);
    z-index: -1;
  }

  &>p{
    line-height: 30px;
    padding: 0 10px;
    border-radius: 5px 5px 0 0;
    font-size: 1.17em;
    background: rgb(241, 239, 240);
  }
  &>h1{
    margin: 0;
    padding: 0 10px;
    border-radius: 0 0 5px 5px;
    background: rgb(241, 239, 240);
  }
}

/*内容盒子
  ====================================== */
.register-box{
  min-width: 550px;
  //height: 340px;
  padding-bottom: 10px;
  border-radius: 5px;
  position: absolute;
  top: 30%;
  left: 40%;
  background: rgb(241, 239, 240);
  // 背景
  &:before{
    content: '';
    width: 110%;
    height: 110%;
    border-radius: 5px;
    position: absolute;
    top: -5%;
    left: -5%;
    background: rgba(0, 0, 0, .3);
    z-index: -1;
  }

  &>h3{
    margin: 10px 0;
    text-align: center;
    color: #248397;
  }
}

/*element 表单样式
  ====================================== */
::v-deep .el-tabs {
  color: #aaa69d;
  .el-tabs__item{
    font-size: 1.17em;
    color: #aaa69d;
    &:hover, &.is-active{
      color: #248397;
    }
  }
  .el-form-item{
    padding-right: 10px;
    padding-left: 20px;
    &.reg-captcha{
      .el-input-group__append{
        padding: 0;
      }
    }
    .el-checkbox{
      color: #aaa69d;
    }
    .el-button{
      width: 170px;
      font-size: 1.17em;
    }
    .login-tip{
      margin-left: 20px;
      font-size: 12px;
    }
  }
  .el-image{
    vertical-align: bottom;
  }
}
</style>
