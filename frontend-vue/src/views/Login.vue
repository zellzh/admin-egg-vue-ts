<template>
  <div class="login-container" ref="container">
    <!-- 信息 -->
    <div class="register-info">
      <p>普通的修仙平台</p>
      <h1>后台管理系统</h1>
    </div>
    <!-- 内容 -->
    <div class="login-box">
      <!-- 头像 -->
      <div class="login-avatar"/>
      <!-- 表单 -->
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
        <el-form-item label="密码" prop="password">
          <el-input v-model="userInfo.password"
                    show-password
                    prefix-icon="iconfont icon-pwd"
                    placeholder="请输入至少6位的密码"/>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item label="验证码"
                      class="reg-captcha"
                      prop="captcha">
          <el-input v-model="userInfo.captcha"
                    prefix-icon="iconfont icon-captcha"
                    placeholder="请输入验证码">
            <el-image slot="append"
                      @click="updateCode"
                      style="cursor:pointer;"
                      :src="api.imgCode" :fit="'contain'"/>
          </el-input>
        </el-form-item>
        <!-- 登录注册 -->
        <el-form-item size="large" class="login-submit">
          <el-button type="primary" @click="onSubmit">立即登录</el-button>
          <p>
            未注册账号?
            <a style="cursor: pointer" @mousedown.prevent="toRegister">立即注册</a>
          </p>
        </el-form-item>
      </el-form>
      <!-- 第三方登录 -->
      <ul class="oauth">
        <li>第三方登录 |</li>
        <li><a class="iconfont icon-qq" href="JavaScript: void(0)"/></li>
        <li><a class="iconfont icon-weixin" href="JavaScript: void(0)"/></li>
        <li><a class="iconfont icon-weibo" href="JavaScript: void(0)"/></li>
        <li><a class="iconfont icon-github" @click="go2Github" href="JavaScript: void(0)"/></li>
      </ul>

    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Ref} from 'vue-property-decorator';
import { baseUrl, account } from "@/api/url/index";
import userReg from "../assets/regexp/userReg";
import {Form} from 'element-ui'

@Component({
  components: {},
})
export default class Login extends Vue {
  /*ref
    ====================================== */
  @Ref() readonly container!: HTMLElement
  @Ref() readonly loginForm!: Form
  @Ref() readonly focus!: HTMLInputElement

  /*data
    ====================================== */
  // 后端接口
  api = {
    imgCode: '',
    oauthGithub: baseUrl + account.github
  }
  // 用户数据
  userInfo = {
    username: '',
    email: '',
    phone: '',
    password: '',
    captcha: '',
    userType: 'normal',
  }
  userRules = {
    username: [
      {required: true, message: '请输入邮箱/手机号/用户名', trigger: 'change'},
    ]
  }

  /*method
    ====================================== */
  // 跳转注册
  private toRegister() {
    this.$router.push('/register')
  }

  // 更新验证码
  updateCode() {
    this.api.imgCode = `${baseUrl + account.imgCode}?t=${Date.now()}`
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

  // 登录请求
  private onSubmit() {
    this.verifyInfo()
    this.loginForm.validate(async valid => {
      if (!valid) {
        return false
      }
      let response = await this.$api.login(this.userInfo)
      if (response?.status === 200) {
        // 保存相关用户数据
        this.saveUserInfo(response.data.data)
        this.$message.success('登录成功');
        await this.$router.push('/admin');
      }
    })
  }
  // 保存用户数据
  private saveUserInfo(data: any) {
    // 保存 token
    localStorage.setItem('act', data.access_token)
    localStorage.setItem('rft', data.refresh_token)
    localStorage.setItem('userInfo', JSON.stringify(data))
    // 分配保存权限信息
    this.saveDispatchRights(data.rights)
  }
  // 分配保存权限信息
  private saveDispatchRights(data: any) {
    // 保存用户路由权限
    const initRouter = [ // 初始路由权限
      '/',
      '/welcome',
    ]
    const routerRights = data.reduce((arr: any[], item: any) => {
      return item.rights_type === 'router' ? arr.concat(item.rights_path) : arr
    }, initRouter)
    localStorage.setItem('routerRights', JSON.stringify(routerRights))

    // 保存用户请求权限
    const actionRights = data.reduce((arr: any[], item: any) => {
      return item.rights_type === 'action' ? arr.concat({
        url: item.rights_path,
        method: item.rights_method,
      }) : arr
    }, [])
    localStorage.setItem('actionRights', JSON.stringify(actionRights))
  }

  // 第三方登录
  private async go2Github() {
    const subWin = this.openNewWindow();
    if (!subWin) return
    // subWin.document.title = 'Github登录'
    // 监听打开窗口的数据, 使用 addEven 时注意解绑事件
    onmessage = async ev => {
      // 是后台 api 传来的数据时, 保存 token
      if (ev.origin === baseUrl) {
        // 保存数据
        this.saveUserInfo(ev.data)
        this.$message.success('登录成功');
        await this.$router.push('/admin')
      }
    }
  }
  // 打开新页面并发送第三方请求
  private openNewWindow() {
    const width = 500, height = 500;
    //获得窗口的垂直位置
    const iTop = (window.screen.availHeight- height) / 2;
    //获得窗口的水平位置
    const iLeft = (window.screen.availWidth - width) / 2;
    // 配置
    const windowStyle = `
      height=${height},
      width=${width},
      top=${iTop},
      left=${iLeft},
      status=no,
      toolbar=no,
      menubar=no,
      location=no,
      resizable=no,
      scrollbars=0,
      titlebar=no`
    return window.open(this.api.oauthGithub, 'Oauth Login', windowStyle)
  }

  // 背景更新
  private changeImg() {
    let w = document.documentElement.offsetWidth
    let h = document.documentElement.offsetHeight
    let imgSeed = localStorage.getItem('imgSeed')
    if (!imgSeed || Date.now() >= parseInt(imgSeed, 16) + 24 * 60 * 60 * 1000) {
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
.login-container {
  width: 100%;
  height: 100%;
  background: #248397 no-repeat center;
  background-size: cover;
  position: relative;
  z-index: 0;
}

/*信息
  ====================================== */
.register-info {
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
  &:before {
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
  &:after {
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

  & > p {
    line-height: 30px;
    padding: 0 10px;
    border-radius: 5px 5px 0 0;
    font-size: 1.17em;
    background: rgb(241, 239, 240);
  }

  & > h1 {
    margin: 0;
    padding: 0 10px;
    border-radius: 0 0 5px 5px;
    background: rgb(241, 239, 240);
  }
}

/*内容盒子
  ====================================== */
.login-box {
  min-width: 480px;
  //height: 340px;
  padding: 70px 30px 10px 10px;
  border-radius: 5px;
  position: absolute;
  top: 32%;
  left: 40%;
  background: rgb(241, 239, 240);
  // 背景
  &:before {
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

  // 头像
  .login-avatar {
    width: 100px;
    height: 100px;
    padding: 10px;
    border-radius: 50%;
    background: #fff url("../assets/img/vue-logo.png") no-repeat center;
    background-size: cover;
    box-shadow: 0 0 10px #ccc;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  // 第三方登录
  .oauth{
    display: flex;
    justify-content: flex-end;
    & > li {
      padding: 0 6px;
      line-height: 25px;
      color: #248397;
      a {
        font-size: 26px;
        &.icon-qq:hover{ color: skyblue}
        &.icon-weixin:hover{ color: green}
        &.icon-weibo:hover{ color: red}
        &.icon-github:hover{ color: black}
      }
    }
  }
}

/*element 表单样式
  ====================================== */
::v-deep.el-form {
  // 提交部分
  .login-submit {
    margin-bottom: 10px;
    // item 内容
    & > .el-form-item__content {
      display: flex;
      justify-content: space-between;

      .el-button.el-button--primary {
        width: 200px;
        font-size: 1.17em;
      }

      &:before, &:after {
        display: none;
      }
    }
  }
  // 验证码部分
  .el-image {
    width: 96px;
    height: 32px;
  }
}
</style>
