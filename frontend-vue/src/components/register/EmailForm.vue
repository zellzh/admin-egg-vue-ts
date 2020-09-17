<template>
  <el-form ref="emailForm" :rules="formRules" :model="userInfo" label-width="80px"  size="medium">
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="userInfo.email" prefix-icon="iconfont icon-email" placeholder="请输入至少6位的用户名"/>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="userInfo.password" prefix-icon="iconfont icon-pwd" placeholder="请输入至少6位的密码"/>
    </el-form-item>
    <el-form-item label="确认密码" prop="rePwd">
      <el-input v-model="userInfo.rePwd" prefix-icon="iconfont icon-repwd" placeholder="请再次输入密码"/>
    </el-form-item>
    <!-- 验证码 -->
    <el-form-item label="验证码" class="reg-captcha" prop="captcha">
      <el-input v-model="userInfo.captcha" prefix-icon="iconfont icon-captcha" placeholder="请输入验证码">
        <el-image slot="append"
                  :src="userInfo.url" :fit="'contain'"/>
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
      <span class="login-tip">已有账号?<a href="JavaScript:;">立即登录</a></span>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator';
import userSchema from "@/assets/userSchema"
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

  /*method
    ====================================== */
  // 重置表单
  resetInfo() {
    this.emailForm.resetFields()
  }
  // 表单校验
  formRules = {
    email: [
      { required: true, message: '邮箱不能为空', trigger: 'blur' },
      { type: 'email',  message: '邮箱格式不正确', trigger: 'blur' },
      { validator: this.verifyEmail, trigger: 'blur', }
    ],
    password: [
      { required: true, message: '密码不能为空', trigger: 'blur' },
      { min: 6,  message: '密码至少6位', trigger: 'blur' },
      { pattern: userSchema.password, message: '密码必须包含字母和数字', trigger: 'blur', }
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
  // 提交逻辑
  private onSubmit() {
    this.emailForm.validate(valid => {
      if (valid) {
        this.$message.success('注册成功')
      } else {
        this.$message.error('请完善注册信息')
        return false;
      }
    });
  }
}
</script>

<style scoped lang="scss">

</style>
