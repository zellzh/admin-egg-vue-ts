import userinfoSchema from '../schema/userinfo'

export default () => {
  return async (ctx, next) => {
    const user = ctx.request.body
    
    try {
      await userinfoSchema.validateAsync(user, {convert: false}) // convert 不自动转换类型验证      
      await next()
    } catch (e) {
      console.error('userValidate error: ' + e);
      ctx.sendResult(null, 400, '用户信息格式有误')
    }
  };
}