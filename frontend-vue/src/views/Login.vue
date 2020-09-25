<template>
  <div class="login-container" ref="container">
    <!-- 信息 -->
    <div class="register-info">
      <p>缥缈峰修仙服务平台</p>
      <h1>后台管理系统</h1>
    </div>
    <!-- 内容 -->
    <div class="login-box">
      <div class="login-avatar"/>
      <el-form ref="loginForm"
               @keyup.enter.native="onSubmit"
               :rules="userRules"
               :hide-required-asterisk="true"
               :model="userInfo"
               label-width="80px" size="medium">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userInfo.username"
                    ref="focus"
                    prefix-icon="iconfont icon-user"
                    placeholder="邮箱/手机号/用户名"/>
        </el-form-item>
        <el-form-item label="密码" prop="password" >
          <el-input v-model="userInfo.password"
                    show-password
                    prefix-icon="iconfont icon-pwd"
                    placeholder="请输入至少6位的密码"/>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item label="验证码" class="reg-captcha" prop="captcha">
          <el-input v-model="userInfo.captcha"
                    prefix-icon="iconfont icon-captcha"
                    placeholder="请输入验证码">
            <el-image slot="append"
                      @click="updateCode"
                      style="cursor:pointer;"
                      :src="userInfo.url" :fit="'contain'"/>
          </el-input>
        </el-form-item>
        <!-- 登录注册 -->
        <el-form-item size="large" class="login-submit">
          <el-button type="primary"  @click="onSubmit">立即登录</el-button>
          <div class="login-tip">
            未注册账号?
            <a style="cursor: pointer" @mousedown.prevent="toRegister">立即注册</a>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator';
import url from "@/api/url";
import userReg from "../assets/userReg";
import { Form } from 'element-ui'

@Component({
  components: {

  },
})
export default class Login extends Vue {
  /*ref
    ====================================== */
  @Ref() readonly container!: HTMLElement
  @Ref() readonly loginForm!: Form
  @Ref() readonly focus!: HTMLInputElement

  /*data
    ====================================== */
  userInfo = {
    username: '',
    email: '',
    phone: '',
    password: '',
    captcha: '',
    userType: 'normal',
    url: url.baseUrl + url.captcha,
  }
  userRules = {
    username: [
      { required: true, message: '请输入邮箱/手机号/用户名', trigger: 'change' },
    ]
  }

  /*method
    ====================================== */
  // 跳转
  private toRegister() {
    this.$router.push('/register')
  }
  // 更新验证码
  updateCode() {
    this.userInfo.url = `${url.baseUrl}${url.captcha}?t=${Date.now()}`
  }
  // 区分用户类型
  private verifyInfo() {
    const username = this.userInfo.username
    if (userReg.phone.test(username)) { // 手机号
      this.userInfo.phone = username
    } else if (userReg.email.test(username)) { // 邮箱
      this.userInfo.email = username
    }
  }
  // 登录
  private onSubmit() {
    this.verifyInfo()
    this.loginForm.validate( async valid => {
      if (!valid) {
        return false
      }
      let res = await this.$api.login(this.userInfo)
      console.log(res);
      if (res.meta.status === 200) {
        this.$message.success('登录成功')
        // 保存 token
        sessionStorage.setItem('token', res.data.token)
        await this.$router.push('/admin')
      } else {
        this.updateCode()
        this.userInfo.captcha = ''
        this.userInfo.password = ''
        this.$message.error('登录失败: ' + res.meta.msg)
      }
    })
  }
  // 背景更新
  private changeImg() {
    let w = document.documentElement.offsetWidth
    let h = document.documentElement.offsetHeight
    let imgSeed = localStorage.getItem('imgSeed')
    if (!imgSeed || Date.now() >= parseInt(imgSeed, 16) + 24*60*60*1000) {
      imgSeed = Date.now().toString(16)
      localStorage.setItem('imgSeed', imgSeed)
      this.container.style.backgroundImage = `url("https://picsum.photos/seed/${imgSeed}/${w}/${h}")`
    }
    this.container.style.backgroundImage = `url("https://picsum.photos/seed/${imgSeed}/${w}/${h}")`
  }

  /*LC(life-cycle)
    ====================================== */
  mounted() {
    this.changeImg()
    this.updateCode()
    this.focus.focus()
  }
}
</script>
<style scoped lang="scss">
/*容器
  ====================================== */
.login-container{
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
.login-box{
  min-width: 460px;
  //height: 340px;
  padding: 70px 0 10px 0;
  border-radius: 5px;
  position: absolute;
  top: 32%;
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

  .login-avatar{
    width: 100px;
    height: 100px;
    padding: 10px;
    border-radius: 50%;
    background: #fff url("../assets/vue-logo.png") no-repeat center;
    background-size: cover;
    box-shadow: 0 0 10px #ccc;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &>h3{
    margin: 10px 0;
    text-align: center;
    color: #248397;
  }
}

/*element 表单样式
  ====================================== */
::v-deep .el-form{
  padding: 0 30px 0 10px;

  // 提交部分
  .login-submit>.el-form-item__content{
    &:before, &:after{
      display: none;
    }
    display: flex;
    justify-content: space-between;
    .el-button.el-button--primary{
      width: 200px;
      font-size: 1.17em;
    }
    .login-tip{
      font-size: 12px;
    }
  }

  .el-image{
    width: 96px;
    height: 32px;
    vertical-align: bottom;
  }
}

</style>
