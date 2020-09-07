import userSchema from '../validate-schema/userinfo'

export default () => {
  return async (ctx, next) => {
    const user = ctx.request.body
    
    try {
      await userSchema.validateAsync(user, {convert: false}) // 不自动转换类型验证      
      await next()
    } catch (e) {
      console.error('userValidate error: ' + e);
      ctx.body = '验证失败'
    }
  };
}