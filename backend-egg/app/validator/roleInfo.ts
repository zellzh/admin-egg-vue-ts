/*
 * roles --- 数据验证器
 */
import Joi = require('joi');

const { object, string } = Joi.types();

export default object.keys({
  role_name: string.trim().required(),
  role_desc: string.trim().empty([ null, '' ]),
})
  // 必须传数据 value, 防止 undefined 验证通过
  .required()
  // 自定义的 validate 全局配置
  .prefs({
    allowUnknown: true, // 同等于 unknown
    messages: { // 自定义全局的错误信息, 也可以使用 joi-x-i18n 插件自动转换语言
      'string.empty': '{#key} 不允许为空',
      'any.required': '缺少 {#key} 字段',
    },
  });
