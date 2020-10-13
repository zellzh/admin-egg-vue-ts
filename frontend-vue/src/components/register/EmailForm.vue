<template>
  <el-form ref="emailForm" :rules="formRules"
           @keyup.enter.native="onSubmit"
           :model="userInfo" label-width="80px" size="medium">
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="userInfo.email"
                ref="focus"
                prefix-icon="iconfont icon-email"
                placeholder="请输入邮箱"/>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="userInfo.password"
                show-password
                prefix-icon="iconfont icon-pwd"
                placeholder="请输入至少6位的密码"/>
    </el-form-item>
    <el-form-item label="确认密码" prop="rePwd">
      <el-input v-model="userInfo.rePwd"
                show-password
                prefix-icon="iconfont icon-repwd"
                placeholder="请再次输入密码"/>
    </el-form-item>
    <!-- 验证码 -->
    <el-form-item label="验证码" class="reg-captcha" prop="captcha">
      <el-input v-model="userInfo.captcha"
                prefix-icon="iconfont icon-captcha"
                placeholder="请输入验证码">
        <el-button
            @click="sendEmail"
            :disabled="timer.disabled"
            slot="append" type="info" plain>
          {{timer.content}}
        </el-button>
      </el-input>
    </el-form-item>
    <!-- 用户协议 -->
    <el-form-item style="margin-bottom: 6px">
      <el-checkbox v-model="userInfo.checked">
        我已阅读并接受
        <a href="javascript:;">用户协议</a>
        和
        <a href="javascript:;">隐私政策</a>
      </el-checkbox>
    </el-form-item>
    <!-- 注册登录 -->
    <el-form-item size="large">
      <el-button type="primary" :disabled="!userInfo.checked" @click="onSubmit">立即注册</el-button>
      <span class="login-tip">已注册账号?<a style="cursor: pointer" @mousedown.prevent="jumpTo">立即登录</a></span>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator';
import userReg from "../../assets/userReg"
import {Form} from "element-ui";

@Component({
  name: 'EmailForm',
  components: {

  },
})
export default class EmailForm extends Vue {
  /*ref
    ====================================== */
  @Ref() readonly emailForm!: Form
  @Ref() readonly focus!: HTMLInputElement

  /*data
    ====================================== */
  userInfo = {
    email: '',
    password: '',
    rePwd: '',
    captcha: '',
    userType: 'email',
    checked: true,
    url: '../assets/code.png',
  }
  timer = {
    content: '发送验证码',
    totalTime: 60,
    disabled: false
  }

  /*method
    ====================================== */
  // 重置表单
  // resetInfo() {
  //   this.emailForm.resetFields()
  // }

  // 跳转到登录
  private async jumpTo() {
    await this.$router.push('/login')
  }
  // 表单校验
  formRules = {
    email: [
      { required: true, message: '邮箱不能为空', trigger: 'blur' },
      { type: 'email',  message: '邮箱格式不正确', trigger: 'blur' },
      { validator: this.verifyEmail, trigger: 'blur'},
      { validator: this.inquirerUser, trigger: 'blur'}
    ],
    password: [
      { required: true, message: '密码不能为空', trigger: 'blur' },
      { min: 6,  message: '密码至少6位', trigger: 'blur' },
      { pattern: userReg.password, message: '密码必须包含字母和数字', trigger: 'blur', }
    ],
    rePwd: [
      { required: true, message: '两次密码不一致', trigger: 'blur'},
      { validator: this.verifyRePwd, trigger: 'blur'}
    ],
    captcha: [
      { required: true, min: 4, max: 6, message: '验证码格式有误', trigger: 'blur'}
    ]
  }
  // 重复密码校验
  private verifyRePwd(rule: any, value: string, cb: any) {
    if (value !== this.userInfo.password) cb(new Error('两次密码不一致'))
    else cb()
  }
  // 邮箱后缀验证
  private verifyEmail(rule: any, value: string, cb: any) {
    let reg = /^.+(.com|.cn|.edu|.org)$/
    if (!reg.test(value)) cb(new Error('邮箱格式不正确'))
    else cb()
  }
  // 查询用户
  private async inquirerUser(rule: any, value: string, cb: any) {
    try{
      let res = await this.$api.inquirer({email: value})
      if (res.meta.status === 200) cb(new Error('邮箱已经存在'))
      else cb()
    }catch (e) {
      console.error(e.message)
    }
  }
  // 验证码倒计时
  private countDown() {
    this.timer.disabled = true
    this.timer.content = `重新发送(${this.timer.totalTime})` //解决60秒不见了的问题
    let clock = setInterval(() => {
      this.timer.totalTime--
      this.timer.content = `重新发送(${this.timer.totalTime})`
      if (this.timer.totalTime < 0) {     //当倒计时小于0时清除定时器
        clearInterval(clock)
        this.timer.content = '重新发送'
        this.timer.totalTime = 60
        this.timer.disabled = false
      }
    },1000)
  }
  // 发送验证码
  private sendEmail() {
    // 用户名合法时, 才能发送验证码
    this.emailForm.validateField('email', async msg => {
      if (msg) return
      // 发送邮件
      await this.$api.sendEmail({ email: this.userInfo.email })
      this.countDown()
    })
  }
  // 提交注册
  private onSubmit() {
    this.emailForm.validate(async valid => {
      if (!valid) {
        this.$message.error('请完善注册信息')
        return false
      }
      let res = await this.$api.register(this.userInfo)
      console.log(res);
      if (res.meta.status === 200) {
        this.$message.success('注册成功')
        await this.jumpTo()
      } else {
        this.userInfo.captcha = ''
        this.$message.error('注册失败: ' + res.meta.msg)
      }
    })
  }

  /*LC(life-cycle)
    ====================================== */
  mounted() {
    this.focus.focus()
  }
}
</script>

<style scoped lang="scss">

</style>
