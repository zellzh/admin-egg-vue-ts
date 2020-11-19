/*
 * manager --- 数据验证器
 */
import Joi = require('joi');
const { object, string } = Joi.types();
import userReg from '../template/userReg';

export default object.keys({
  username: string.regex(userReg.username).message('用户名格式不正确').trim()
    .empty([ '', null ]),
  phone: string.regex(userReg.phone).message('手机格式不对').trim()
    .empty([ '', null ]),
  email: string.regex(userReg.email).message('邮箱格式不正确').trim()
    .empty([ '', null ]),

  password: string.regex(userReg.password).message('密码格式不对').required(),
  captcha: string.min(4).max(6).message('验证码格式不对'),
  userType: string.valid('normal', 'email', 'phone'),
})
  // 用户名必须是三个的其中之一
  .or('username', 'email', 'phone')
  // 必须传数据 value, 防止 undefined 验证通过
  .required()
  // 给未知的 key 配置验证规则, 未设置时, 数据只能是验证模板中指定的
  // 参数1: 未知 key 的格式, 可以是正则也可以是 joi schema | 参数2: 匹配 key 的验证器
  // .pattern(any, any); // any any 多余的数据无需验证
  .unknown();
