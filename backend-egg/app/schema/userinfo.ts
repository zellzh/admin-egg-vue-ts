import Joi = require('joi');
const { object, string } = Joi.types();
// const UserType = ['normal', 'phone'] // 账户类型

// 用户名正则
const usernameReg = /^[A-Za-z0-9_]{6,}$/;
// 手机正则
const phoneReg = /^1[3-9]\d{9}$/;
// 密码正则, 必须包含字母和数字
const passwordReg = /(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&()]{6,}$/;

export default object.keys({
  username: string.regex(usernameReg).message('用户名格式不正确'),
  phone: string.regex(phoneReg).message('手机格式不对'),
  email: string.email().message('邮箱格式不正确'),

  password: string.regex(passwordReg).message('密码格式不对').required(),
  captcha: string.min(4).max(6).message('验证码格式不对')
    .required(),
  userType: string.valid('normal', 'email', 'phone').required(),
})
  .xor('username', 'email', 'phone') // 用户名必须是三个的其中之一
  .required(); // 必须传 value, 防止 undefined 验证通过
