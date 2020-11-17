/*
 * rights --- 数据验证器
 */
import Joi = require('joi');

const { object, string, number } = Joi.types();

// 路径验证
function verifyPath() {
  return string.regex(/(\/\S*)+/).message('{#label} 格式有误');
}

export default object.keys({
  rights_path: string.trim().empty('').when('rights_type', {
    switch: [ // 多个条件验证
      { is: 'router', then: verifyPath().required() },
      { is: 'action', then: verifyPath().required() },
    ],
    otherwise: verifyPath(),
  }),
  rights_method: string.empty('').valid('get', 'post', 'put', 'delete', 'all')
    .when('rights_type', {
      is: 'action',
      then: string.required(),
    }),
  rights_name: string.trim().required(),
  rights_type: string.trim().message('权限类型不能为空字符').required(),
  level: number.valid(0, 1, 2).required(),
  pid: number.required()
    .when('level', {
      is: 0,
      then: 0,
    })
    .messages({ // 自定义当前验证的错误信息
      'any.only': '一级权限的 {#key} 只能是 {#valids}',
    }),
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
/*
  给未知的 key 配置验证规则, 未设置时, 数据只能是验证模板中指定的
  可以使用 pattern | unknown, 对位置 key 设置是否验证
  pattern: 可以给未知 key 设置验证
    参数1: 未知 key 的格式, 可以是正则也可以是 joi schema
    参数2: 匹配 key 的验证器
  unknown: 仅设置是否允许未知 key, 默认是 true
   */
// .pattern(any, any); // any any 多余的数据无需验证
