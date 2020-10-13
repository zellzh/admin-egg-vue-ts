<template>
  <el-form ref="normalForm" :rules="formRules"
           @keyup.enter.native="onSubmit"
           :model="userInfo" label-width="80px" size="medium">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="userInfo.username"
                ref="focus"
                prefix-icon="iconfont icon-user"
                placeholder="请输入至少6位的用户名"/>
    </el-form-item>
    <el-form-item label="密码" prop="password" >
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
        <el-image slot="append"
                  style="cursor:pointer;"
                  @click="updateCode"
                  :src="api.imgCode" :fit="'contain'"/>
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
import url from '@/api/url'

@Component({
  name: 'NormalForm',
  components: {

  },
})
export default class NormalForm extends Vue {
  /*ref
    ====================================== */
  @Ref() readonly normalForm!: Form
  @Ref() readonly focus!: HTMLInputElement

  /*data
    ====================================== */
  baseURL = process.env.VUE_APP_BASE_API
  api = {
    imgCode: '',
  }
  userInfo = {
    username: '',
    password: '',
    rePwd: '',
    captcha: '',
    userType: 'normal',
    checked: true,
  }

  /*method
    ====================================== */
  // 重置表单
  // resetInfo() {
  //   this.normalForm.resetFields()
  // }

  // 跳转到登录
  private async jumpTo() {
    await this.$router.push('/login')
  }
  // 表单校验
  formRules = {
    username: [
      { required: true, message: '用户名不能为空', trigger: 'blur' },
      { min: 6,  message: '用户名至少6位', trigger: 'blur' },
      { pattern: userReg.username, message: '用户名只能含有字母数字或下划线', trigger: 'blur'},
      { validator: this.inquirerUser, trigger: 'blur'},
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
  // 确认密码
  private verifyRePwd(rule: any, value: string, cb: any) {
    if (value !== this.userInfo.password) cb(new Error('两次密码不一致'))
    else cb()
  }
  // 查询用户
  private async inquirerUser(rule: any, value: string, cb: any) {
    try{
      let res = await this.$api.inquirer({username: value})
      if (res.meta.status === 200) cb(new Error('用户名已经存在'))
      else cb()
    }catch (e) {
      console.error(e.message)
    }
  }
  // 更新验证码: 防止缓存
  private updateCode() {
    this.api.imgCode = `${this.baseURL}${url.captcha}?t=${Date.now()}`
  }
  // 提交注册
  private onSubmit() {
    this.normalForm.validate(async valid => {
      if (!valid) {
        this.$message.error('请完善注册信息')
        return false
      }
      let res = await this.$api.register(this.userInfo)
      if (res.meta.status === 200) {
        this.$message.success('注册成功')
        await this.jumpTo()
      } else {
        this.updateCode()
        this.userInfo.captcha = ''
        this.$message.error('注册失败: ' + res.meta.msg)
      }
    })
  }

  /*LC(life-cycle)
    ====================================== */
  mounted() {
    this.focus.focus()
    this.updateCode()
  }
}
</script>

<style scoped lang="scss">

</style>
